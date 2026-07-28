# Brief HF-08-opencode — ContentToolbar layout for action strip

Owner: **opencode** · Model: `opencode/deepseek-v4-flash-free`  
Repo: `/root/Restly`

## Problem

`ContentToolbar` hiện chỉ còn spacer + env — không đủ chỗ cho dải method/URL/Send. Cần layout header thân thiện tool (Insomnia/Bruno style).

## Owned paths (only these)

- `src/features/shell/ui/ContentToolbar.tsx`
- Optionally `src/shared/styles/index.css` **only** if `--spacing-toolbar` must grow (e.g. 48→56) for the strip — document why.

## Do

1. Make `start` slot grow (`flex-1 min-w-0`) so a URL bar can sit in the header comfortably.
2. Layout: `[ start (flex-1) ] [ end ] [ env ]` — no empty spacer stealing space from `start`.
3. Allow toolbar height to fit controls (`h-auto min-h-(--spacing-toolbar)` + `py-2`) if needed so Input/Select don’t clip.
4. Optional UI stub (no logic): **Save** ghost button in `end` default when `showSave` prop true — Workspace can pass later; default false for History.
5. History/Environments must still look fine with title in `start`.
6. `npm run fmt && npm run lint && npm run build`.

## Don’t

- Don’t create RequestUrlBar or edit RequestWorkspace / WorkspacePage (agy owns those).
- Don’t reintroduce Sync/Settings icons unless asked.
- Don’t pixel-match Stitch.

## AC

- ContentToolbar can host a full URL action strip without crushing env dropdown.
- Other pages using `start`/`end` slots still work.
- Build green.

Report briefly in Vietnamese when done.
