# HVT Docs

Documentation site for [HVT](https://hvts.app), built with React and Vite and published at [docs.hvts.app](https://docs.hvts.app/).

## Stack

- React 18
- Vite 5
- React Router
- Static OpenAPI schema served from `public/schema.yaml`

## Getting Started

Prerequisites:

- Node.js 20+
- npm 10+

Install dependencies and start the local dev server:

```bash
npm install
npm run dev
```

## Available Scripts

- `npm run dev` starts the Vite dev server.
- `npm run lint` runs ESLint across the repo.
- `npm run build` creates a production build in `dist/`.
- `npm run preview` serves the production build locally.

## Environment Variables

All environment variables are optional. Copy `.env.example` to `.env` only if you need local overrides.

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_SCHEMA_URL` | `/schema.yaml` | Path or URL for the OpenAPI schema used by the API reference. |
| `VITE_API_URL` | `https://hvts.app` | Base URL shown in SDK examples. |
| `VITE_HVT_API_KEY` | unset | Example API key shown in SDK examples. |

## Refreshing the API Schema

Regenerate the static OpenAPI file from the Django backend:

```bash
python manage.py spectacular --file ../hvt-docs/public/schema.yaml
```

Commit the updated `public/schema.yaml` whenever backend contract changes should ship with the docs site.

## Deployment

### Vercel

Use these settings from the repository root:

- Root Directory: leave empty
- Framework Preset: Vite
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`

`vercel.json` already includes SPA rewrites plus the `schema.yaml` content-type header.

### Netlify

`netlify.toml` and `public/_redirects` already handle SPA routing and static publishing from `dist/`.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the local workflow, PR expectations, and schema update guidance.

## Open-Source Release Note

This repo now has contribution, issue, PR, and CI scaffolding in place. Before making the repository public, add a project license so downstream users have explicit permission to use and contribute to the code.
License: [GNU Affero General Public License v3.0 only](LICENSE).