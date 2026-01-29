# Deploying Memorial Bridge on Render.com

The repo root is **MemorialBridge_Vibed**. Application code lives under **memorialbridge/**; Render uses `render.yaml` at repo root with `rootDir: memorialbridge/backend` and `rootDir: memorialbridge/frontend`.

---

## Running both main and v2 at the same time

- **main** branch: Already deployed (existing production URL). Do not connect this branch to the v2 Blueprint.
- **memorialbridge-v2** branch: Uses `render.yaml` with **v2-prefixed** names (`memorialbridge-v2-api`, `memorialbridge-v2-web`, `memorialbridge-v2-db`) so it deploys as a **separate** stack with its own URLs. No conflict with the main deployment.

**Steps to have both live:**

1. Keep your existing Render services for **main** as they are (unchanged).
2. Push this code to branch **memorialbridge-v2**.
3. In Render: **New > Blueprint**, connect the **same** repo, and set **Branch** to **memorialbridge-v2**.
4. Render will create new resources: `memorialbridge-v2-api`, `memorialbridge-v2-web`, `memorialbridge-v2-db` with URLs like:
   - `https://memorialbridge-v2-api.onrender.com`
   - `https://memorialbridge-v2-web.onrender.com`

Result: production stays on main’s URL; v2 is available on the v2 URLs (e.g. for internal or staging use).

---

## One-time setup (v2 Blueprint)

1. **Connect the repo (v2 only)**
   - In [Render Dashboard](https://dashboard.render.com), use **New > Blueprint**.
   - Select your repo and set **Branch** to **memorialbridge-v2** so Render uses the `render.yaml` from that branch.

2. **Environment variables to set in Render (v2 services)**

   **Backend (memorialbridge-v2-api)**
   - **CORS_ORIGINS** (required): v2 frontend URL, e.g. `https://memorialbridge-v2-web.onrender.com`. Multiple origins comma-separated if needed.
   - **SECRET_KEY**: Optional if `generateValue: true` is used in the blueprint.

   **Frontend (memorialbridge-v2-web)**
   - **VITE_API_BASE_URL** (required): v2 backend API base, e.g. `https://memorialbridge-v2-api.onrender.com/api/v1`. Set in the Static Site’s **Environment** (build-time).

3. **Database**
   - The blueprint creates **memorialbridge-v2-db** (separate from main’s DB) and injects **DATABASE_URL** into the backend. The app converts `postgresql://` to `postgresql+asyncpg://` when needed.

## Blueprint layout (`render.yaml` at repo root, branch memorialbridge-v2)

| Service               | Type     | rootDir               | Build / publish                          |
|-----------------------|----------|------------------------|------------------------------------------|
| memorialbridge-v2-db  | Postgres | —                      | —                                        |
| memorialbridge-v2-api | Web (Python) | memorialbridge/backend  | `pip install -r requirements.txt`; start with `$PORT` |
| memorialbridge-v2-web | Static   | memorialbridge/frontend | `npm ci && npm run build`; publish `dist` |

- Backend start: migrations then `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
- Frontend: SPA rewrites so `/*` → `/index.html`.

## After first deploy (v2)

1. Set **CORS_ORIGINS** on **memorialbridge-v2-api** to `https://memorialbridge-v2-web.onrender.com` (or your v2 frontend URL).
2. Set **VITE_API_BASE_URL** on **memorialbridge-v2-web** to `https://memorialbridge-v2-api.onrender.com/api/v1` and **redeploy** the static site so the build uses it.
3. **SPA routing**: In the Render Dashboard, open **memorialbridge-v2-web** → **Redirects/Rewrites** and add a **Rewrite** rule: Source `/*`, Destination `/index.html`. (Blueprint YAML does not support the `rewrites` field; configure this in the Dashboard.)

## Local vs Render

- **Local**: `docker-compose` and existing Dockerfiles are unchanged.
- **Render**: Repo-root `render.yaml` on branch **memorialbridge-v2** defines the v2 stack with distinct names and URLs; main deployment is independent.
