# Bot-a-thon Demo Guide

## What to Show

LegalIntel AI is now an autonomous legal investigation agent rather than a chat UI.

1. Upload a legal PDF in the frontend.
2. The backend extracts text and activates a multi-agent workflow.
3. OpenAI or fallback agents analyze the document.
4. Apify collects public-source evidence when `APIFY_API_TOKEN` is configured.
5. Zynd-compatible metadata is exposed at `/.well-known/agent.json` and `/webhook/sync`.
6. Superplane workflow blueprint is available in `.superplane/legalintel-agent-workflow.yaml`.

## Required Keys

Backend `.env`:

```env
LLM_PROVIDER=gemini
GEMINI_API_KEY=your-gemini-key
GEMINI_MODEL=gemini-2.5-flash
APIFY_API_TOKEN=apify_api_your-token
ZYND_AGENT_URL=https://your-public-backend-url
```

The app still runs without these keys using deterministic fallbacks, so the demo does not break.

## Integration URLs

- Backend health: `GET /health`
- Zynd agent card: `GET /.well-known/agent.json`
- Zynd sync webhook: `POST /webhook/sync`
- Upload PDF: `POST /api/upload`
- Run agents: `POST /api/analyze/{file_id}`
- Integration status: `GET /api/integrations/status`
- Superplane preview: `GET /api/superplane/workflow`

## Zynd Deployment

The `zynd-agent/` folder is a small deployable Zynd agent wrapper. Use:

```bash
cd zynd-agent
zynd agent run --port 5000
```

Or upload `zynd-agent/` plus the generated keypair to `deployer.zynd.ai`.

## Superplane Story

Use `.superplane/legalintel-agent-workflow.yaml` as the canvas blueprint:

- Manual submission trigger
- Upload document HTTP request
- Run agent analysis HTTP request
- Risk gate branch
- Human review or report generation
- Auditable message-chain keys for risk score, Apify mode, and Zynd agent identity
