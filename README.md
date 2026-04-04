# hvt-docs

Documentation site for HVT (hvts.app).

## Development

```bash
npm install
npm run dev
```

## Environment variables

```bash
VITE_API_SCHEMA_URL=/schema.yaml
```

Copy `.env.example` to `.env` only if you need to override the default local value.

## Vercel deployment

This repo is ready to deploy from the repo root.

Use these settings in Vercel:

- Root Directory: leave empty
- Framework Preset: Vite
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`

`vercel.json` already defines the SPA rewrite and the `schema.yaml` content type, so direct visits to `/introduction`, `/quickstart`, `/guides/sdk`, and `/api` should resolve correctly after deploy.

## Netlify deployment

`netlify.toml` and `public/_redirects` are already configured for SPA routing.

## Refresh the schema

From the Django app root, regenerate the static OpenAPI file with:

```bash
python manage.py spectacular --file ../hvt-docs/public/schema.yaml
```
