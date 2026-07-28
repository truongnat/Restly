# Decision server

Serve a visual decision HTML page, receive browser events, and append user
choices to JSONL logs. Presentation uses **Tailwind CDN** plus one enterprise
theme (`tailwind-theme.js` + `styles.css`). See `docs/conventions/DESIGN_SYSTEM.md`.

```bash
# From a project that already installed simple-skills:
python .agents/tools/decision-server/server.py \
  --root .agent-work/sessions/Task-1-example \
  --file VISUAL_DECISION.html \
  --log-dir .agent-work/sessions/Task-1-example/decision-logs \
  --port 8765 \
  --open
```

## Dual load mode

- **Static open:** HTML must already contain Tailwind CDN + anime.js CDN tags
  so layout works without this server (editor preview / `file://`).
- **Server mode:** serves the page, local theme helpers (`/styles.css`,
  `/tailwind-theme.js`, `/animate.js`, `/client.js`), and records choices.
  The server injects missing CDN/local tags as a safety net only — agents
  must write the CDN tags into the HTML.

Buttons with `data-choice` post to `/api/choice`. Theme follows Claude
frontend-design + OpenAI Apps SDK UI (system fonts, minimal cards).

Stdlib only. No pip install required. Binds to `127.0.0.1` by default.
Requires network for Tailwind CDN and anime.js when viewing pages.
