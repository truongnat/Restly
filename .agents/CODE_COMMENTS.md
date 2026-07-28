# Code Comment Convention (standard)

The project standard for **how code is commented** — so code is understandable,
commented consistently, and its flow is explicit. Applied by `execution` when
writing code and checked by `review`/`review-pr`.

Defaults live in `.agents/AGENT_POLICY.md` (Built-in defaults → Code comments).
Optional overrides may appear under `rules.code.comments` in settings; omit them
unless the project needs a different profile.

> **Consistency first:** if the repo already uses a comment style, follow it.
> `init` records the project's actual convention in `PRJ_REFERENCE.md`; this
> file is the default when the repo has none.

## Comment prose language (separate from thread language)

Source-code comments and docstrings use
`rules.code.comments.prose_language`, **not** `settings.language`.

| Value | Behavior |
| --- | --- |
| `repo-default` (default) | Follow `PRJ_REFERENCE.md` / existing repo comment language; if unclear, prefer **English** |
| `en` | Force English comment/docstring prose |
| `vi` | Force Vietnamese comment/docstring prose |

Thread chat, reports, and session artifacts still follow `settings.language`.
Do not copy the conversation language into comments just because the thread is
`vi` (or vice versa).

Copy-paste examples for `.agents/settings.yaml`:

```yaml
# Force English comments even when language: vi
rules:
  code:
    comments:
      prose_language: en

# Force Vietnamese comments
rules:
  code:
    comments:
      prose_language: vi
```

## Principles

1. **Why, not what.** Comment intent, rationale, constraints, and trade-offs —
   the successor’s Q2 (Design for handoff —
   `.agents/thinking/design-for-handoff.md`). Never restate what the code
   already says; do not narrate obvious code.
2. **Self-documenting code first.** Prefer clear names/structure; add a comment
   where the code cannot make intent obvious on its own.
3. **Explain the flow.** Non-obvious or multi-stage logic gets a short
   high-level flow so a reader follows it without reverse-engineering.
4. **Public surface is documented.** Every exported/public symbol gets a
   doc comment in the language's standard format.
5. **No comment rot.** Change the comment when you change the code; a stale
   comment is worse than none. `review` flags contradictions.
6. **No noise.** No commented-out code, no line-by-line narration, no redundant
   restatement of types the signature already gives.

## When a comment is REQUIRED

- **Public/exported symbol** → a doc comment (purpose, params, returns, errors).
- **Non-obvious flow / algorithm** → a numbered flow block (see below).
- **Business rule / invariant** → state the rule and cite its source (`Trace:` §/AC/ticket).
- **Security boundary** → a `SECURITY:` note (what is trusted, what is checked).
- **Workaround / non-obvious constraint / perf trade-off** → the *why* + a link.

## When to AVOID a comment

- Restating code (`i++ // increment i`), obvious getters/setters.
- Narrating each line; redundant type info already in the signature.
- Commented-out code (delete it; git remembers).

## Doc-comment format per language (public symbols)

| Language | Standard | Doc-comment shape |
|---|---|---|
| TypeScript / JavaScript | **TSDoc / JSDoc** | `/** … @param @returns @throws */` |
| Python | **PEP 257 docstring** (Google or NumPy style) | `"""Summary. Args/Returns/Raises."""` |
| Java | **Javadoc** | `/** … @param @return @throws */` |
| Go | **GoDoc** | `// FuncName does …` (sentence starts with the symbol name) |
| Rust | **rustdoc** | `/// …` with `# Examples` / `# Errors` / `# Panics` |
| C# | **XML doc** | `/// <summary> … </summary> <param> <returns>` |
| Kotlin | **KDoc** | `/** … @param @return */` |
| PHP | **PHPDoc** | `/** … @param @return @throws */` |
| C / C++ | **Doxygen** | `/** @brief … @param @return */` |
| Ruby | **YARD** | `# @param [Type] … @return [Type]` |

Configure a per-language override in `rules.code.comments.language_style`
(e.g. `python: numpy`).

## Flow documentation (fixes "code has no flow")

For a function/method whose logic is not obvious at a glance:

1. **Header flow block** — a short numbered outline of the steps at the top of
   the function.
2. **Inline step markers** — `// Step N: …` (or language equivalent) at the
   start of each stage, matching the header outline.
3. **Trace** — for business flows, link the design/AC the flow implements.

```ts
/**
 * Reserve stock for an order.
 *
 * Flow:
 *   1. Lock the order rows (avoid double reservation under concurrency).
 *   2. Check availability against committed + reserved.
 *   3. Reserve or fail with InsufficientStock.
 * Trace: DETAIL_DESIGN §4.2 (reservation), AC-014.
 */
async function reserveStock(orderId: string): Promise<Reservation> {
  // Step 1: lock rows for this order
  // Step 2: compute available = onHand - reserved
  // Step 3: reserve, or throw InsufficientStock
}
```

## Standard markers

`TODO(owner): …` · `FIXME(owner): …` · `NOTE: …` · `HACK: … (why + link)` ·
`SECURITY: …` · `PERF: …`. Keep an owner/context so a marker is actionable, not
a mystery. `review` may reject unexplained `HACK`/`FIXME`.

## WRONG vs CORRECT

```txt
// WRONG — narrates the obvious
total = price * qty // multiply price by qty

// CORRECT — explains the why
// Prices are stored in minor units (cents); keep integer math to avoid FP drift.
total = price * qty
```

## Enforcement

- `execution` applies this standard while writing/modifying code.
- `review` / `review-pr` check: public symbols documented, non-obvious flow
  explained, business rules/security noted, markers owned, and **no stale
  comment contradicting the code**.
