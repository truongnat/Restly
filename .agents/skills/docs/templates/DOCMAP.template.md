# Docmap

> The manifest that makes `sync` incremental. Maps each wiki unit (page /
> section / sheet, depending on format) to the source paths it documents, so a
> `git diff` tells the skill exactly what to refresh. Do not hand-wave — a unit
> with no sources cannot be synced.

- **Format:** `markdown` | `html` | `docx` | `xlsx`
- **Last-synced commit:** `<short-sha>`

| Wiki unit | Kind | Source paths / globs |
|---|---|---|
| `Home` | page | _(root manifests, README)_ |
| `architecture` | page/section/sheet | _(entry points, config)_ |
| `workspaces/<name>` | page/section/sheet-row | _(apps/<name>/**)_ |
| _(…)_ | | |

<!-- "Kind" reflects the output format: markdown/html = page; docx = section;
xlsx = sheet or sheet-row. Keep one row per addressable unit. -->
