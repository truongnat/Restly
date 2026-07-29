# Response Contract

Status: Accepted  
Contract version: `1`

The response contract gives browser and future native transports one stable payload. Version `1`
contains the HTTP status, normalized headers, text body, timing phases, and exact byte counts.

## Missing-value policy

Every timing and size metric is required in the version `1` object. An adapter writes `null` when its
runtime cannot observe a metric reliably. It must not substitute `0`, estimate a value, or copy a
different metric. A numeric zero is valid only when the adapter actually measured zero.

This policy lets consumers distinguish “instantaneous” from “unknown” without inspecting the
adapter type.

## Core fields

| Field | Type | Meaning |
| --- | --- | --- |
| `version` | `1` | Response contract discriminator. |
| `status` | integer `0..599` | HTTP status. `0` identifies a synthetic cancellation or transport error result. |
| `statusText` | string | HTTP reason phrase or Restly transport state. |
| `headers` | `Record<string, string>` | Response headers normalized by the adapter. |
| `body` | string | Fully consumed, decoded response body used by the current UI. |

## Timing definitions

All timing values use milliseconds and may contain fractional values.

| Field | Start | End | Excludes |
| --- | --- | --- | --- |
| `dnsMs` | DNS lookup start | Address resolved | TCP and TLS |
| `connectMs` | TCP connection start | TCP connection established | DNS and TLS |
| `tlsMs` | TLS handshake start | Secure session established | DNS and TCP |
| `ttfbMs` | Request dispatch | Response headers become available | Body download |
| `downloadMs` | Response headers available | Body fully consumed | DNS, connect, TLS, server wait |
| `totalMs` | Request dispatch | Body fully consumed or transport terminates | None |

Connection reuse may make DNS, connect, and TLS phases unobservable. The adapter reports `null`
rather than zero in that case.

## Size definitions

Every byte count is a non-negative integer. Headers and protocol framing are excluded unless stated
otherwise.

| Field | Meaning |
| --- | --- |
| `encodedBodyBytes` | Response entity-body bytes after content encoding and before content decoding. Transfer framing is excluded. |
| `decodedBodyBytes` | UTF-8 byte length of the decoded text exposed in `body`. It is not JavaScript string length. |
| `downloadedBytes` | Total bytes received from the transport for the response, including response headers and protocol framing when the native transport exposes them. |

`Content-Length` is not used as a browser measurement. It can be hidden by CORS, can describe a
content-encoded representation, and does not cover chunked or framed transport overhead.

## Browser/native parity

| Metric | Browser `fetch` | In-process mock | Future native transport |
| --- | --- | --- | --- |
| Status, headers, body | Supported | Supported | Required |
| DNS | `null` | `null` | Report when observable |
| Connect | `null` | `null` | Report when observable |
| TLS | `null` | `null` | Report when observable |
| TTFB | Request start to `fetch` response resolution | `null` | Required when observable |
| Download | Response resolution to `response.text()` completion | `null` | Required when observable |
| Total | Supported | Simulated route/client duration | Required |
| Encoded body bytes | `null` | Exact UTF-8 bytes | Report when observable |
| Decoded body bytes | Exact UTF-8 bytes | Exact UTF-8 bytes | Required for text bodies |
| Downloaded bytes | `null` | `null` | Report when transport exposes wire accounting |

The native adapter is outside IT0-93. It must emit contract-valid version `1` values when
implemented; unsupported or connection-reused phases remain `null`.

## Synthetic responses

Cancellation and network errors keep `status: 0`. Their `body` is generated locally, so
`decodedBodyBytes` is exact while `encodedBodyBytes` and `downloadedBytes` remain `null`.
`totalMs` records time until cancellation or failure. Other timing phases remain `null` unless the
adapter observed them independently.
