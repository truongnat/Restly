# Session serve

Find a visual decision session and launch the shared `decision-server`. Python
standard library only.

```bash
# Find the most recently updated VISUAL_DECISION.html and open it
python .agents/tools/session-serve/serve.py

# Select a session by directory name
python .agents/tools/session-serve/serve.py Task-1-example

# Serve without opening a browser
python .agents/tools/session-serve/serve.py \
  .agent-work/sessions/Task-1-example \
  --no-open
```

By default, logs are written to `<session>/decision-logs/`.
