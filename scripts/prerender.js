import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const distSsrDir = path.resolve(rootDir, 'dist-ssr');

const templatePath = path.resolve(distDir, 'index.html');
if (!fs.existsSync(templatePath)) {
  console.error('[PRERENDER ERROR] dist/index.html not found. Run "vite build" first.');
  process.exit(1);
}

const template = fs.readFileSync(templatePath, 'utf-8');
const entryServerPath = path.resolve(distSsrDir, 'entry-server.js');
if (!fs.existsSync(entryServerPath)) {
  console.error('[PRERENDER ERROR] dist-ssr/entry-server.js not found. Run "vite build --ssr" first.');
  process.exit(1);
}

const { render, prerenderRoutes } = await import(`file://${entryServerPath}`);

console.log(`[PRERENDER] Starting prerender for ${prerenderRoutes.length} routes...`);

for (const url of prerenderRoutes) {
  try {
    const { html: appHtml, helmet } = render(url);
    let rendered = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

    if (helmet) {
      const helmetTitle = helmet.title?.toString() || '';
      const helmetMeta = helmet.meta?.toString() || '';
      const helmetLink = helmet.link?.toString() || '';
      const helmetScript = helmet.script?.toString() || '';

      if (helmetTitle) {
        rendered = rendered.replace(/<title>.*?<\/title>/i, helmetTitle);
      }
      const helmetTags = [helmetMeta, helmetLink, helmetScript].filter(Boolean).join('\n    ');
      if (helmetTags) {
        rendered = rendered.replace('</head>', `    ${helmetTags}\n  </head>`);
      }
    }

    const slug = url.replace(/^\//, '');
    const relativePath = url === '/' ? 'index.html' : `${slug}/index.html`;
    const targetPath = path.resolve(distDir, relativePath);

    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, rendered, 'utf-8');

    // Also write clean .html file for Vercel/Netlify cleanUrls (e.g. dist/introduction.html)
    if (url !== '/') {
      const cleanHtmlPath = path.resolve(distDir, `${slug}.html`);
      fs.mkdirSync(path.dirname(cleanHtmlPath), { recursive: true });
      fs.writeFileSync(cleanHtmlPath, rendered, 'utf-8');
    }
    console.log(`  ✓ ${url} -> dist/${relativePath} & dist/${slug}.html`);
  } catch (err) {
    console.warn(`  ⚠ Failed to prerender ${url}:`, err.message);
  }
}

console.log('[PRERENDER] Complete!');
