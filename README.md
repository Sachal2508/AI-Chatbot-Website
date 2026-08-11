# AI Chatbot API — NestJS + Groq + Resend + Swagger + Sentry

Built for **AI Automation Internship 2026 Program** (DaFi Labs × EmpRadar.ai) — Session 3 task.
Deadline: **Saturday, August 15, 2026**

## Stack
- **NestJS** — backend framework, modular structure (`chat/`, `email/`, `common/`)
- **Groq** (`groq-sdk`, OpenAI-compatible) — free-tier, fast LLM inference (Llama 3.3 70B by default)
- **Resend** — transactional email (test emails + AI-generated conversation summaries)
- **Swagger** — interactive API docs at `/docs`
- **Sentry** — global exception filter reports every 500-level error automatically

## Folder structure
```
src/
  chat/           # POST /api/chat
    dto/
    chat.controller.ts
    chat.service.ts
    chat.module.ts
  email/          # POST /api/email/test, POST /api/email/summary
    dto/
    email.controller.ts
    email.service.ts
    email.module.ts
  common/
    filters/sentry-exception.filter.ts   # global error handler -> Sentry
  app.controller.ts   # /health, /debug-sentry
  app.module.ts
  main.ts             # bootstrap: Sentry.init, Swagger, ValidationPipe
```

## 1. Setup

```bash
npm install
cp .env.example .env
```

Fill in `.env`:

| Variable | Where to get it |
|---|---|
| `GROQ_API_KEY` | Get free API key at https://console.groq.com/keys |
| `RESEND_API_KEY` | Get free API key at https://resend.com/api-keys |
| `RESEND_FROM_EMAIL` | Use `onboarding@resend.dev` (or your verified domain) |
| `SENTRY_DSN` | Create a free Node/Express project at https://sentry.io → copy DSN |

## 2. Run

```bash
npm run start:dev
```

- API: http://localhost:3000
- Swagger docs: **http://localhost:3000/docs**
- Health check: http://localhost:3000/health

## 3. Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/debug-sentry` | Throws a test error on purpose — use this to record your Sentry demo |
| POST | `/api/chat` | `{ "message": "hi", "history": [] }` → AI reply from Groq |
| POST | `/api/email/test` | `{ "to": "you@example.com" }` → sends a test email via Resend |
| POST | `/api/email/summary` | `{ "to": "...", "conversation": [{role, content}, ...] }` → AI-summarizes the chat and emails it |

Test everything either through Swagger UI (`/docs` → "Try it out") or Postman.

## 4. Demoing Sentry (for your recording)
1. Start the app.
2. Hit `GET /debug-sentry` (browser, curl, or Swagger).
3. Open your Sentry dashboard → the error + full stack trace appears within seconds.
   That's your live "out-of-credits / crashed API" demo moment.

## 5. Deploying (for your "Live/Deployed Application" deliverable)
Easiest free option for a NestJS app:
- **Render.com** (free web service tier): connect your GitHub repo, set build command
  `npm install && npm run build`, start command `npm run start:prod`, add your env vars
  in the dashboard.
- Alternative: **Railway.app** (also has a free/low-cost tier, auto-detects Nest).

Either way: push this repo to GitHub first, then connect it in Render/Railway, add the
same 4 env vars from `.env.example`, deploy, and your Swagger docs will be live at
`https://your-app.onrender.com/docs`.

## 6. Submission checklist (per task requirements)
- [ ] GitHub repo pushed (public or shared with reviewers)
- [ ] Live/deployed API URL (Render/Railway)
- [ ] Swagger docs URL (`<deployed-url>/docs`)
- [ ] Demo recording showing: chatbot reply, Swagger "Try it out", an email arriving via
      Resend, and a live error captured in Sentry
- [ ] LinkedIn post: what you built, tech used (NestJS, Groq, Resend, Swagger, Sentry),
      what you learned — tag DaFi Labs × EmpRadar.ai
