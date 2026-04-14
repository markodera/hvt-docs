# Contributing

## Development Setup

1. Install Node.js 20+ and npm 10+.
2. Run `npm install`.
3. Copy `.env.example` to `.env` only if you need to override local defaults.
4. Start the site with `npm run dev`.

## Before Opening a Pull Request

1. Run `npm run lint`.
2. Run `npm run build`.
3. Update `public/schema.yaml` if your change depends on backend API contract changes.
4. Keep changes focused. Split unrelated cleanup into separate pull requests.

## Content and UI Changes

- Match the existing docs structure unless there is a clear navigation problem to solve.
- Prefer concise language, concrete examples, and real endpoint names over marketing copy.
- If you change screenshots, branding assets, or navigation behavior, mention that clearly in the pull request summary.

## Schema Updates

From the Django app root, refresh the static schema with:

```bash
python manage.py spectacular --file ../hvt-docs/public/schema.yaml
```

Review the generated diff before committing it. The API reference page reads directly from that file.

## Pull Request Expectations

- Explain the problem being solved.
- Describe any user-facing navigation or content changes.
- List the verification steps you ran.
- Include screenshots for visible UI changes when they help review.
