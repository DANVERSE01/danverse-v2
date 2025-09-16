### Vercel Deployment Steps

1) Create project
- Go to Vercel dashboard and create a new project from the Git repository.

2) Environment variables (Project → Settings → Environment Variables)
- Copy from `env/.env.production.example` into Vercel envs.
- Ensure `NODE_VERSION=20` (Vercel sets automatically if functions runtime is node20.x).

3) Framework preset
- Next.js. Root: repository root.

4) Build & output
- Build Command: `next build`
- Install Command: auto
- Output: default

5) API runtime
- `vercel.json` sets Node 20 (`nodejs20.x`) for all `api/**`.

6) Preview Mode
- If `SUPABASE_URL` or `SUPABASE_SERVICE_ROLE` or `SMTP_URL` are missing, the app runs in Preview Mode; DB calls are no-op but endpoints respond.

7) Deploy
- Click Deploy.
- After deployment, set custom domain and alias to production.


