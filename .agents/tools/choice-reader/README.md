# Choice reader

Read choices written by `decision-server` without manually parsing JSONL.
Python standard library only.

```bash
# Latest choice from the most recently updated session log
python .agents/tools/choice-reader/read.py

# Latest choice for one issue
python .agents/tools/choice-reader/read.py \
  .agent-work/sessions/Task-1-example \
  --issue-id ISS-001

# Last 10 choices from an explicit log directory
python .agents/tools/choice-reader/read.py \
  --log-dir .agent-work/sessions/Task-1-example/decision-logs \
  --all \
  --limit 10
```

Output is JSON. The command exits with status `1` when no matching choice is
available.
