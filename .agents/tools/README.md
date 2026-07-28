# Agent tools

Each local tool has its own folder. Installers copy this tree to
`.agents/tools/`.

| Tool | Purpose |
|---|---|
| [`choice-reader/`](./choice-reader/) | Read the latest matching user choice from decision JSONL logs. |
| [`decision-server/`](./decision-server/) | Serve visual decision HTML with shared styles, receive browser events, and log user choices. |
| [`session-serve/`](./session-serve/) | Find the latest visual-decision session and launch the decision server. |
| [`video-keyframes/`](./video-keyframes/) | Sample video recordings into timestamped image evidence for agent analysis. |
