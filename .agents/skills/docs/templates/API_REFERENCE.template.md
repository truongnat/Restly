# API Reference — <System>

> Contract-level reference for every public surface (HTTP/RPC/events/CLI/SDK).
> **If an OpenAPI/AsyncAPI/GraphQL/proto spec exists, derive from it and link
> it** (the spec is the source of truth — do not hand-transcribe divergently).
> Otherwise derive from route/handler code. Cite the source per operation; mark
> `Gap`/`Unknown` — never invent an endpoint or field.

- **Spec:** _(path to openapi.yaml / asyncapi / .proto / schema, or `none`)_
- **Base URL / entry:** _(…)_ · **Auth:** _(scheme)_ · **Version:** _(…)_ · **Last-synced:** `<commit>`

## Conventions
_(Auth header, error envelope, pagination, versioning, content types, rate limits.)_

## Operations

### `<METHOD> /path`  (or `service.Method` / `cli command`)
- **Purpose:** _(one line)_
- **Auth / scopes:** _(…)_
- **Request:**

| Param | In | Type | Required | Notes |
|---|---|---|---|---|
| _(…)_ | path/query/body/header | _(…)_ | yes/no | _(…)_ |

- **Responses:**

| Status | Body / shape | Meaning |
|---|---|---|
| 200 | _(…)_ | _(…)_ |
| 4xx/5xx | _(error code)_ | _(…)_ |

- **Example:** _(request/response snippet)_
- **Source:** _(handler path / schema file)_

_(Repeat per operation. Group by resource/service.)_
