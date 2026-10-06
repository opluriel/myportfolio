# React + TypeScript + Vite

## Backend

The portfolio uses Vercel Serverless Functions in `api/`, Supabase Postgres for published projects and private contact messages, Zod for request validation, and Resend for contact notifications. The browser only calls the same-origin `/api/projects` and `/api/contact` routes. The Supabase service-role key is server-only.

### Environment variables

Copy `.env.example` to `.env.local` for local development. Set the following values in `.env.local` and in **Vercel → Project → Settings → Environment Variables** for Preview and Production:

| Variable | Where to get it / what to set |
| --- | --- |
| `SUPABASE_URL` | Supabase project URL from **Project Settings → API** |
| `SUPABASE_ANON_KEY` | Supabase anon/publishable key; used only to verify admin JWTs |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service-role/secret key; server-side only, never prefix it with `VITE_` |
| `ADMIN_USER_IDS` | Comma-separated Supabase Auth user UUIDs allowed to manage projects |
| `RESEND_API_KEY` | Create an API key in the Resend dashboard |
| `EMAIL_FROM` | A sender address on a domain verified in Resend, e.g. `Portfolio <contact@your-domain.example>` |
| `CONTACT_TO_EMAIL` | Destination for contact notifications (currently `adamadevmail@gmail.com`) |
| `RATE_LIMIT_SECRET` | A private random value of at least 32 characters; generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `CORS_ORIGINS` | Comma-separated origins without trailing slashes; currently `https://myportfolio-livid-iota.vercel.app,http://localhost:5173` |

Do not commit `.env.local` or place server credentials in Vite variables. `.env.example` contains placeholders for secrets.

### Supabase setup

1. Create a Supabase project and copy its URL and API keys into the environment variables above.
2. In **SQL Editor**, run `supabase/migrations/001_projects.sql` followed by `supabase/migrations/002_messages.sql`. The first migration seeds the four currently featured projects. Both tables have RLS enabled; only published projects have a public read policy. Messages and rate-limit data have no public policies.
3. Create your admin user with Supabase Auth, then copy that user's UUID into `ADMIN_USER_IDS`. Project write routes verify the bearer JWT with Supabase Auth and compare the verified user ID against this server-side allowlist.
4. Create a Resend account, verify a sending domain, and set `EMAIL_FROM` to an address on that verified domain. Set `CONTACT_TO_EMAIL` to the inbox where you want notifications.

### Local development and deployment

Install dependencies with `npm install`, copy `.env.example` to `.env.local`, and fill in the actual values. Link the repository to Vercel (`npm install --global vercel`, then `vercel link`) and run the full app locally with:

```sh
npx vercel dev
```

Use `npm run dev` only for frontend-only work; Vite does not run the `/api` serverless functions. Deploy by importing the repository into Vercel, setting the environment variables for each environment, and deploying the `develop`/feature preview or approved production branch. Vercel reads `vercel.json` for the security headers.

### API and security notes

- `POST /api/contact` validates a strict payload, caps the request body, rejects unknown fields, checks a honeypot, limits each IP to five requests per hour using an atomic Postgres function, sanitizes stored and emailed content, stores the message, and sends a Resend notification.
- `GET /api/projects` and `GET /api/projects/:id` expose only published projects and the fields used by the portfolio. `POST`, `PUT`, and `DELETE` project routes require a verified admin JWT.
- CORS is restricted to `CORS_ORIGINS`; production security headers are configured in `vercel.json`.
- Run `npm run build`, `npm run lint`, and `npm test` to validate the app, API types, lint rules, and security-sensitive helpers.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.
You can also try [the experimental native React Compiler support in plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md#rust-react-compiler) by using `compiler: true` in the plugin options instead of using the Babel plugin.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
