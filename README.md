# ResumeFilter

ResumeFilter is an AI-assisted interview preparation platform. Users submit a resume PDF, job description, and optional self-description to receive a match score, interview questions, skill-gap analysis, and a preparation plan.

## Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios
- Backend: Node.js, Express, Mongoose
- Database: MongoDB Atlas
- AI: Google Gemini
- Authentication: JWT in an HTTP-only cookie
- Deployment: Vercel (frontend) and Render (backend)

## Project Layout

```text
Backend/    Express API and MongoDB connection
Frontend/   Vite single-page application
```

## Run Locally

Requirements: Node.js 20.19+ or 22.12+, npm, a MongoDB connection string, and a Gemini API key.

1. Install dependencies in both workspaces:

   ```bash
   npm install --prefix Backend
   npm install --prefix Frontend
   ```

2. Copy `Backend/.env.example` to `Backend/.env` and fill in `MONGO_URI`, `JWT_SECRET`, and `GOOGLE_GENAI_API_KEY`. Keep `PORT=3000` for local development.

3. Start the API in one terminal:

   ```bash
   npm --prefix Backend run dev
   ```

4. Copy `Frontend/.env.example` to `Frontend/.env`, then start the frontend in another terminal:

   ```bash
   npm --prefix Frontend run dev
   ```

Open `http://localhost:5173`. The API health endpoint is `http://localhost:3000/api/health`.

## Deploy In About 10 Minutes

This repository is a monorepo. Deploy each subfolder as its own project from the same GitHub repository. Never commit `.env` files, API keys, or production secrets.

### A. Push to GitHub

From the repository root, create a GitHub repository, then push the current branch:

```bash
git status
git add Backend Frontend README.md package.json package-lock.json
git commit -m "Prepare ResumeFilter for deployment"
git push -u origin main
```

Use your actual branch name if it is not `main`. Confirm `Backend/.env` and `Frontend/.env` are ignored and are not in the commit.

### B. Deploy the Backend to Render

1. In Render, select **New + → Web Service**, connect the GitHub repository, and select the branch.
2. Set **Root Directory** to `Backend`.
3. Set **Build Command** to `npm install`.
4. Set **Start Command** to `npm start` (runs `node server.js`).
5. Add these environment variables under the service's Environment settings:

   | Key                    | Value                                                                  |
   | ---------------------- | ---------------------------------------------------------------------- |
   | `NODE_ENV`             | `production`                                                           |
   | `MONGO_URI`            | Your MongoDB Atlas connection string                                   |
   | `JWT_SECRET`           | A unique, long random secret                                           |
   | `GOOGLE_GENAI_API_KEY` | Your Gemini API key                                                    |
   | `GEMINI_MODEL`         | `gemini-3.8-flash`                                                     |
   | `CORS_ORIGIN`          | `http://localhost:5173` initially; add the Vercel URL after deployment |

   Render supplies `PORT` automatically. The server listens on `process.env.PORT || 5000`; do not hard-code a Render port.

6. Deploy. Copy the service URL, for example `https://resumefilter-api.onrender.com`, and verify `https://<render-service>.onrender.com/api/health` returns `{"status":"ok",...}`.

MongoDB Atlas must allow connections from Render. For a quick setup, configure the Atlas network access list appropriately and use a dedicated database user with a strong password. Avoid leaving broad IP access enabled longer than necessary.

### C. Deploy the Frontend to Vercel

1. In Vercel, choose **Add New → Project** and import the same GitHub repository.
2. Set **Root Directory** to `Frontend` and framework preset to **Vite**.
3. Set **Build Command** to `npm run build` and **Output Directory** to `dist` (Vercel usually detects these automatically).
4. Add this environment variable, replacing the example with the Render service URL and omitting a trailing slash:

   | Key                 | Value                                   |
   | ------------------- | --------------------------------------- |
   | `VITE_API_BASE_URL` | `https://resumefilter-api.onrender.com` |

5. Click **Deploy**. `Frontend/vercel.json` sends client-side routes back to `index.html`, so refreshing `/login`, `/planner`, or an interview URL does not produce a Vercel 404.
6. Copy the deployed Vercel origin, such as `https://resumefilter.vercel.app`. In Render, update `CORS_ORIGIN` to include both the local and production origins, separated by a comma:

   ```text
   http://localhost:5173,https://resumefilter.vercel.app
   ```

   Do not include paths or trailing slashes. Save the Render environment change and let it redeploy.

## Production Configuration

- The frontend reads `VITE_API_BASE_URL`; if unset, it uses `http://localhost:3000` for local development. Vite environment values are embedded at build time, so redeploy Vercel after changing this value.
- The backend reads comma-separated origins from `CORS_ORIGIN` and enables credentialed requests. The browser Axios client sets `withCredentials: true`.
- Production authentication cookies use `SameSite=None; Secure` because Vercel and Render are separate HTTPS sites. Some browsers/privacy settings block third-party cookies. For the most reliable production authentication, use frontend and API custom domains under the same site (for example, `app.example.com` and `api.example.com`) and test in the browsers your users need to support.
- Resume uploads are limited to PDF files up to 5 MB.
- Puppeteer PDF generation uses the included `@sparticuz/chromium` package when `NODE_ENV=production`.

## Post-Deploy Checks

1. **API and CORS:** Open `/api/health` on Render. From the Vercel site, register or log in and confirm requests to the Render API succeed with credentials; the Render `CORS_ORIGIN` must exactly include the Vercel origin.
2. **JWT session:** Log in, refresh the page, navigate to `/planner`, then log out. Confirm the session persists after refresh and logout returns to the public landing page. Test cookie behavior in target browsers.
3. **PDF upload:** Submit a valid PDF smaller than 5 MB and confirm the report is created. A non-PDF should be rejected; a file over 5 MB should return HTTP 413.

## Useful Commands

```bash
npm --prefix Backend run dev
npm --prefix Frontend run dev
npm --prefix Frontend run build
npm --prefix Frontend run lint
```

## API Routes

| Method | Route                                          | Purpose                      |
| ------ | ---------------------------------------------- | ---------------------------- |
| `POST` | `/api/auth/register`                           | Create an account            |
| `POST` | `/api/auth/login`                              | Log in                       |
| `GET`  | `/api/auth/get-me`                             | Get the current user         |
| `GET`  | `/api/auth/logout`                             | Log out and revoke the token |
| `POST` | `/api/interview/`                              | Generate an interview report |
| `GET`  | `/api/interview/`                              | List the user's reports      |
| `GET`  | `/api/interview/report/:interviewId`           | Get one report               |
| `POST` | `/api/interview/resume/pdf/:interviewReportId` | Generate a resume PDF        |
