# hvt-docs

Documentation site for HVT (hvts.app)

## Development

```bash
npm run dev
```

## Environment variables

```bash
VITE_API_SCHEMA_URL=/schema.yaml
```

## Deploy

Deploy to Vercel or Netlify and point `docs.hvts.app` to the deployment.

## Refresh the schema

From the Django app root, regenerate the static OpenAPI file with:

```bash
python manage.py spectacular --file hvt-docs/public/schema.yaml
```
