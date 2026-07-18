# Telar Frontend

Telar is an administrative web application for garment manufacturers. It
manages employees, customers, clothes, quotations, and production orders.

The app is a static Next.js frontend. Business operations call an external API
directly, while authentication uses Amazon Cognito from the browser.

## Requirements

- Node.js 20+ (Node.js 22 recommended)
- pnpm

## Local Development

```bash
pnpm install
cp .env.example .env.local
```

Configure `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_AWS_COGNITO_REGION=us-east-1
NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID=your_cognito_client_id
NEXT_PUBLIC_AWS_COGNITO_ENDPOINT=http://localhost:9229
ASSETS_HOSTNAME=
```

`NEXT_PUBLIC_AWS_COGNITO_ENDPOINT` is optional. Set it only when using a local
Cognito-compatible service; omit it to use the regional AWS Cognito endpoint.

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3002](http://localhost:3002).

## Commands

```bash
pnpm test
pnpm exec tsc --noEmit
pnpm run lint
pnpm run build
```

## Static Deployment

`pnpm run build` generates the static site in `out/`. Upload the contents of
that directory to static hosting such as S3 + CloudFront.

Test the exported site locally with:

```bash
pnpx serve@latest out
```
