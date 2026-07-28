# Third-Party Skills

The skills below are vendored from skills.sh sources. They were selected from
established maintainers, checked for a redistribution-friendly license, and
imported only when Gen Agent Trust Hub and Socket reported Safe / 0 alerts.
Skills with Snyk High Risk (for example `secrets-management`) were excluded.

| Category | Skills | Source | Revision | License |
|---|---|---|---|---|
| Web frontend | `web-component-design`, `accessibility-compliance` | [wshobson/agents](https://github.com/wshobson/agents) | `b6af3711058190e4b5c5274b9758498fe626ec5a` | MIT |
| Design system | `design-system-patterns`, `visual-design-foundations` | [wshobson/agents](https://github.com/wshobson/agents) | `b6af3711058190e4b5c5274b9758498fe626ec5a` | MIT |
| Frontend taste | `design-taste-frontend`, `minimalist-ui`, `high-end-visual-design`, `industrial-brutalist-ui`, `redesign-existing-projects` | [leonxlnx/taste-skill](https://github.com/leonxlnx/taste-skill) | vendored MIT copy | MIT |
| Frontend taste (Anthropic) | `frontend-design` | [anthropics/skills](https://github.com/anthropics/skills) | `2235be7c60b551f5de82ade908fd3816455afcda` | Apache-2.0 |
| Apps | `expo-native-ui`, `expo-data-fetching` | [expo/skills](https://github.com/expo/skills) | `8d72763f53c4fe11ed3ae0441b921bda821d2a74` | MIT |
| Backend / API | `nodejs-backend-patterns`, `api-design-principles` | [wshobson/agents](https://github.com/wshobson/agents) | `b6af3711058190e4b5c5274b9758498fe626ec5a` | MIT |
| Database | `postgresql-table-design`, `sql-optimization-patterns`, `database-migration` | [wshobson/agents](https://github.com/wshobson/agents) | `b6af3711058190e4b5c5274b9758498fe626ec5a` | MIT |
| Networking | `microservices-patterns`, `hybrid-cloud-networking` | [wshobson/agents](https://github.com/wshobson/agents) | `b6af3711058190e4b5c5274b9758498fe626ec5a` | MIT |
| Architecture | `architecture-patterns`, `architecture-decision-records` | [wshobson/agents](https://github.com/wshobson/agents) | `b6af3711058190e4b5c5274b9758498fe626ec5a` | MIT |
| Security | `sast-configuration`, `auth-implementation-patterns`, `stride-analysis-patterns` | [wshobson/agents](https://github.com/wshobson/agents) | `b6af3711058190e4b5c5274b9758498fe626ec5a` | MIT |
| Testing | `javascript-testing-patterns`, `e2e-testing-patterns` | [wshobson/agents](https://github.com/wshobson/agents) | `b6af3711058190e4b5c5274b9758498fe626ec5a` | MIT |
| DevOps / CI | `deployment-pipeline-design`, `github-actions-templates` | [wshobson/agents](https://github.com/wshobson/agents) | `b6af3711058190e4b5c5274b9758498fe626ec5a` | MIT |
| Observability / debug | `distributed-tracing`, `debugging-strategies` | [wshobson/agents](https://github.com/wshobson/agents) | `b6af3711058190e4b5c5274b9758498fe626ec5a` | MIT |

### Upstream metadata exception (Expo)

`expo-native-ui` and `expo-data-fetching` keep their upstream
`agents/openai.yaml` files. That metadata is **optional host tooling only**.
They remain third-party skills: no first-party `Contract (mandatory)`, not listed
in `docs/config/first-party-skills.json`, and not validated as report/office skills.
Do not treat the presence of `openai.yaml` as a first-party signal.

Office document skills (`xlsx`, `docx`, `pptx`, `pdf`) are first-party Python
skills in this repository (MIT). Anthropic document skills were intentionally
not vendored: their license does not permit retaining or redistributing copies
outside Anthropic services.

## MIT License — wshobson/agents

Copyright (c) 2024 Seth Hobson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## MIT License — Expo

Copyright (c) 2025-present 650 Industries, Inc. (aka Expo)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
