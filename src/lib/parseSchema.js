import yaml from 'js-yaml';

const HTTP_METHODS = new Set(['get', 'post', 'put', 'patch', 'delete', 'options', 'head']);
const TAG_ORDER = ['Auth', 'API Keys', 'Users', 'Organizations', 'Projects', 'Webhooks', 'Audit Logs'];

function getRefName(ref) {
  return typeof ref === 'string' ? ref.split('/').pop() ?? null : null;
}

function normalizeTag(tag) {
  const value = String(tag || 'General').trim();
  const lowered = value.toLowerCase();
  const map = {
    auth: 'Auth',
    'api keys': 'API Keys',
    apikeys: 'API Keys',
    users: 'Users',
    organizations: 'Organizations',
    organisation: 'Organizations',
    organisations: 'Organizations',
    projects: 'Projects',
    webhooks: 'Webhooks',
    'audit logs': 'Audit Logs',
    auditlogs: 'Audit Logs',
  };

  if (map[lowered]) {
    return map[lowered];
  }

  return value
    .replace(/[-_]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function mergeObjects(base = {}, incoming = {}) {
  return {
    ...base,
    ...incoming,
    properties: {
      ...(base.properties || {}),
      ...(incoming.properties || {}),
    },
    required: Array.from(new Set([...(base.required || []), ...(incoming.required || [])])),
  };
}

function resolveSchema(schema, schemas, seen = new Set()) {
  if (!schema || typeof schema !== 'object') {
    return schema || {};
  }

  if (schema.$ref) {
    const refName = getRefName(schema.$ref);

    if (!refName || seen.has(refName)) {
      return { type: 'object' };
    }

    seen.add(refName);
    return resolveSchema(schemas[refName], schemas, seen);
  }

  if (schema.allOf) {
    return schema.allOf.reduce((accumulator, item) => mergeObjects(accumulator, resolveSchema(item, schemas, new Set(seen))), {});
  }

  if (schema.oneOf?.length) {
    return resolveSchema(schema.oneOf[0], schemas, seen);
  }

  if (schema.anyOf?.length) {
    return resolveSchema(schema.anyOf[0], schemas, seen);
  }

  return schema;
}

function schemaType(schema, schemas) {
  const resolved = resolveSchema(schema, schemas);

  if (resolved.enum?.length) {
    return resolved.enum.map(String).join(' | ');
  }

  if (resolved.type === 'array') {
    return `${schemaType(resolved.items, schemas)}[]`;
  }

  if (resolved.type) {
    return resolved.format ? `${resolved.type} (${resolved.format})` : resolved.type;
  }

  return getRefName(schema?.$ref) || 'object';
}

function schemaExample(schema, schemas, depth = 0) {
  if (!schema || depth > 3) {
    return undefined;
  }

  const resolved = resolveSchema(schema, schemas);

  if (resolved.example !== undefined) {
    return resolved.example;
  }

  if (resolved.default !== undefined) {
    return resolved.default;
  }

  if (resolved.enum?.length) {
    return resolved.enum[0];
  }

  switch (resolved.type) {
    case 'object': {
      const entries = Object.entries(resolved.properties || {});
      const result = {};

      entries.forEach(([key, value]) => {
        const example = schemaExample(value, schemas, depth + 1);
        if (example !== undefined) {
          result[key] = example;
        }
      });

      return Object.keys(result).length ? result : undefined;
    }
    case 'array': {
      const example = schemaExample(resolved.items, schemas, depth + 1);
      return example === undefined ? [] : [example];
    }
    case 'string': {
      if (resolved.format === 'email') return 'user@example.com';
      if (resolved.format === 'uuid') return '00000000-0000-4000-8000-000000000000';
      if (resolved.format === 'date-time') return '2026-01-01T00:00:00Z';
      if (resolved.format === 'uri') return 'https://app.example.com/callback';
      return 'string';
    }
    case 'integer':
    case 'number':
      return 0;
    case 'boolean':
      return true;
    default:
      return undefined;
  }
}

function pickMedia(content) {
  if (!content || typeof content !== 'object') {
    return null;
  }

  return content['application/json']
    ? ['application/json', content['application/json']]
    : Object.entries(content)[0] || null;
}

function formatExample(example) {
  if (example === undefined) {
    return null;
  }

  return typeof example === 'string' ? example : JSON.stringify(example, null, 2);
}

function formatSecurity(security) {
  if (!Array.isArray(security) || security.length === 0) {
    return ['Public'];
  }

  const labels = new Set();

  security.forEach((item) => {
    const keys = Object.keys(item || {});
    if (keys.length === 0) {
      labels.add('Public');
    }
    keys.forEach((key) => {
      if (key === 'APIKeyAuth') labels.add('X-API-Key');
      else if (key === 'BearerAuth') labels.add('Bearer token');
      else if (key === 'jwtCookieAuth') labels.add('Cookie session');
      else labels.add(key);
    });
  });

  return Array.from(labels);
}

function parseOperation(path, method, operation, schemas) {
  const media = pickMedia(operation.requestBody?.content);
  const requestSchema = media ? media[1].schema : null;
  const requestExample = formatExample(schemaExample(requestSchema, schemas));

  const responses = Object.entries(operation.responses || {}).map(([status, response]) => {
    const responseMedia = pickMedia(response.content);
    const responseSchema = responseMedia ? responseMedia[1].schema : null;

    return {
      status,
      description: response.description || '',
      contentType: responseMedia?.[0] || null,
      schemaName: getRefName(responseSchema?.$ref) || schemaType(responseSchema, schemas),
      example: formatExample(schemaExample(responseSchema, schemas)),
    };
  });

  return {
    method: method.toUpperCase(),
    path,
    summary: operation.summary || path,
    description: operation.description || '',
    operationId: operation.operationId,
    anchor: `#operation/${operation.operationId}`,
    parameters: (operation.parameters || []).map((parameter) => ({
      name: parameter.name,
      location: parameter.in,
      required: Boolean(parameter.required),
      description: parameter.description || '',
      type: schemaType(parameter.schema, schemas),
    })),
    requestBody: requestSchema
      ? {
          required: Boolean(operation.requestBody?.required),
          contentType: media?.[0] || null,
          schemaName: getRefName(requestSchema?.$ref) || schemaType(requestSchema, schemas),
          example: requestExample,
        }
      : null,
    responses,
    security: formatSecurity(operation.security),
  };
}

async function loadSchema(schemaUrl) {
  const response = await fetch(schemaUrl);

  if (!response.ok) {
    throw new Error(`Failed to load schema: ${response.status}`);
  }

  const text = await response.text();
  return yaml.load(text);
}

function collectDocument(schema) {
  const schemas = schema?.components?.schemas || {};
  const grouped = new Map();

  Object.entries(schema?.paths || {}).forEach(([path, methods]) => {
    Object.entries(methods || {}).forEach(([method, operation]) => {
      if (!HTTP_METHODS.has(method) || !operation || typeof operation !== 'object' || !operation.operationId) {
        return;
      }

      const tag = normalizeTag(operation.tags?.[0] || 'General');
      const parsed = parseOperation(path, method, operation, schemas);

      if (!grouped.has(tag)) {
        grouped.set(tag, []);
      }

      grouped.get(tag).push(parsed);
    });
  });

  const tags = Array.from(grouped.entries())
    .map(([name, operations]) => ({ name, operations }))
    .sort((a, b) => {
      const ai = TAG_ORDER.indexOf(a.name);
      const bi = TAG_ORDER.indexOf(b.name);
      if (ai === -1 && bi === -1) return a.name.localeCompare(b.name);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });

  return {
    title: schema?.info?.title || 'HVT API Reference',
    description: schema?.info?.description || '',
    tags,
  };
}

export async function parseSchema(schemaUrl) {
  const schema = await loadSchema(schemaUrl);
  const document = collectDocument(schema);

  return document.tags.reduce((accumulator, tag) => {
    accumulator[tag.name] = tag.operations.map((operation) => ({
      method: operation.method,
      path: operation.path,
      summary: operation.summary,
      operationId: operation.operationId,
      anchor: operation.anchor,
    }));
    return accumulator;
  }, {});
}

export async function parseSchemaDocument(schemaUrl) {
  const schema = await loadSchema(schemaUrl);
  return collectDocument(schema);
}
