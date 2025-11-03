# Deploying HackMatch to Vercel

This file contains step-by-step instructions to deploy the backend and frontend to Vercel safely.

IMPORTANT: Do NOT commit your `.env` file or any secrets to GitHub. Use Vercel's Environment Variables to store secrets like `MONGODB_URI` and `JWT_SECRET`.

1) Prepare repository (already done locally):
   - Ensure `.env` contains local secrets only and is listed in `.gitignore` (this repo already ignores `.env`).
   - Make sure code is pushed to GitHub: `git push origin main`

2) Create a Vercel account and connect GitHub:
   - Go to https://vercel.com and sign up / log in.
   - Connect your GitHub account and allow Vercel access to this repository.

3) Deploy the backend (serverless Node):
   - In Vercel dashboard click **New Project → Import Git Repository** and select this repo.
   - For **Root Directory** leave it blank (repository root).
   - Vercel will use the top-level `vercel.json` which routes `/api/*` to `server.js`.
   - In Project Settings → Environment Variables add the following for each environment you want (Preview & Production):
     - `MONGODB_URI` = <your MongoDB Atlas connection string>
     - `JWT_SECRET` = <your jwt secret>
     - (optional) `NODE_ENV` = `production`
   - Deploy. After successful deployment you'll get a backend URL like `https://your-backend.vercel.app`.

4) Deploy the frontend (static):
   - In Vercel dashboard click **New Project → Import Git Repository** and select this repo again.
   - Set **Root Directory** to `frontend`.
   - Vercel will use `frontend/vercel.json` for static serving.
   - Add Environment Variable `API_URL` = `https://<your-backend>.vercel.app/api` so the frontend knows where to call the API.
   - Deploy. You will get a frontend URL (e.g., `https://your-frontend.vercel.app`).

5) CLI alternative (optional):
   - Install Vercel CLI and login:
     ```powershell
     npm i -g vercel
     vercel login
     ```
   - From the repo root deploy backend:
     ```powershell
     cd d:\hackn
     vercel --prod
     ```
   - From the frontend folder deploy frontend:
     ```powershell
     cd d:\hackn\frontend
     vercel --prod
     ```
   - Note: Use the Vercel dashboard to add environment variables (recommended). The CLI also supports `vercel env add` but it's interactive and will still require your secrets.

6) Verify:
   - Backend health: `GET https://<your-backend>.vercel.app/api/health`
   - Frontend: Visit the frontend URL — it should call the backend at `API_URL`.

7) Rollback / redeploy:
   - Use the Vercel dashboard to redeploy a previous successful deployment or trigger a new deployment from a branch.

Notes and tips
 - We updated `config/db.js` to cache the Mongoose connection for serverless environments — good for Vercel.
 - Keep secrets only in Vercel Environment Variables. Do not put them in repo files.
 - If you expect heavy DB connection usage, consider using a long-running host (Render) for the backend instead of serverless functions.

If you want, I can try to run the `vercel` CLI here to perform a deployment — but you'll need to authenticate interactively. Otherwise, follow the dashboard steps above and tell me when it's deployed so I can help verify.
