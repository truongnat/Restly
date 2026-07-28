#!/usr/bin/env bash
# Active-session helper for the agent lifecycle. Gives every skill/provider ONE
# deterministic answer to "which session am I in?" and "what is the real
# progress?" — so artifacts are never written to a cache/temp path and progress
# is never hand-guessed.
#
# Kit vs Work:
#   .agents/       installer kit (skills, tools, settings, policy)
#   .agent-work/   feature work (sessions + memory), nested git (when git available)
#
# The active session is recorded in .agent-work/sessions/.current (one line: the
# repo-relative session dir). Read-only except `set`/`new`/`archive`, which touch
# that pointer and the session dir.
#
# Usage (run from the repo root, or any subdir — walks up to find .agents or
# .agent-work):
#   session.sh help                 Show commands + related tools
#   session.sh doctor               Check Work layout / gitignore / tools
#   session.sh current              Print the active session dir (exit 1 if unset)
#   session.sh set <dir|slug>       Point .current at an existing session dir
#   session.sh new <slug>           Create .agent-work/sessions/Task-N-<slug>, set current, commit
#   session.sh status [dir]         Compute real task progress from <dir>/TASKS.md
#   session.sh work-root            Print .agent-work path (creates + ensures git)
#   session.sh commit [message]     Milestone commit of dirty Work tree (or WORK_COMMIT=clean)
#   session.sh archive [slug|current]  Move session → sessions/_archive/, commit
#
# `status` prints a summary, a COMPLETE flag, and a corrected mermaid pie to
# paste into TASKS.md. COMPLETE=yes only when every card is done/skipped with
# nothing blocked or in any other state (e.g. in_progress, review). Never
# report 100%/done while COMPLETE=no. Do not maintain a separate OVERVIEW.md —
# TASKS.md + this command are the status source of truth.
#
# Work commit protocol: agents MUST run `commit` after writing/changing Work
# artifacts (lifecycle skill end). See AGENT_WORK.md → Work commit protocol.
set -eu

find_root() {
  d="$(pwd)"
  while [ "$d" != "/" ]; do
    if [ -d "$d/.agents" ] || [ -d "$d/.agent-work" ]; then
      printf '%s\n' "$d"
      return 0
    fi
    d="$(dirname "$d")"
  done
  pwd
}

ROOT="$(find_root)"
WORK_DIR="$ROOT/.agent-work"
SESS_DIR="$WORK_DIR/sessions"
ARCH_DIR="$SESS_DIR/_archive"
MEM_DIR="$WORK_DIR/memory"
POINTER="$SESS_DIR/.current"

die() { printf '%s\n' "$*" >&2; exit 1; }

work_git() {
  git -C "$WORK_DIR" -c user.email="agent-work@localhost" -c user.name="agent-work" "$@"
}

work_dirty() {
  [ -d "$WORK_DIR/.git" ] || return 1
  # Untracked or modified?
  [ -n "$(git -C "$WORK_DIR" status --porcelain 2>/dev/null || true)" ]
}

# Ensure Work tree exists. Init a nested git repo once so session+memory history
# stays out of the product root git and can be branched/diffed cheaply.
ensure_work() {
  mkdir -p "$SESS_DIR" "$MEM_DIR"
  if [ ! -d "$WORK_DIR/.git" ]; then
    if command -v git >/dev/null 2>&1; then
      git -C "$WORK_DIR" init -q
      # Keep nested repo self-contained; ignore OS junk only.
      if [ ! -f "$WORK_DIR/.gitignore" ]; then
        printf '%s\n' '.DS_Store' 'Thumbs.db' '*.tmp' > "$WORK_DIR/.gitignore"
      fi
      # Seed README so first commit has structure (optional, quiet).
      if [ ! -f "$WORK_DIR/README.md" ]; then
        cat > "$WORK_DIR/README.md" <<'EOF'
# Agent work (sessions + memory)

This directory is the **Work** layer for Simple Skills:

- `sessions/` — per-task artifacts (fixed templates)
- `sessions/_archive/` — closed tasks (after `session.sh archive`)
- `memory/` — durable lessons (vital few) across tasks

It is intentionally separate from `.agents/` (the installer **Kit**: skills,
tools, settings, policy). Version this tree with its own git via
`session.sh commit` / `archive`; keep the product root git focused on source.
EOF
      fi
      git -C "$WORK_DIR" add -A
      work_git commit -q -m "chore: initialize agent-work" 2>/dev/null || true
    fi
  fi
}

# Commit dirty Work tree. Prints WORK_COMMIT=<sha>|clean|skipped.
# Args: optional commit message (default: chore(work): checkpoint).
cmd_commit() {
  ensure_work
  if [ ! -d "$WORK_DIR/.git" ]; then
    printf 'WORK_COMMIT=skipped (no nested git)\n'
    return 0
  fi
  msg="${1:-chore(work): checkpoint}"
  if ! work_dirty; then
    sha="$(git -C "$WORK_DIR" rev-parse --short HEAD 2>/dev/null || true)"
    printf 'WORK_COMMIT=clean'
    [ -n "$sha" ] && printf ' HEAD=%s' "$sha"
    printf '\n'
    return 0
  fi
  git -C "$WORK_DIR" add -A
  if work_git commit -q -m "$msg"; then
    sha="$(git -C "$WORK_DIR" rev-parse --short HEAD)"
    printf 'WORK_COMMIT=%s\n' "$sha"
  else
    printf 'WORK_COMMIT=failed\n' >&2
    return 1
  fi
}

cmd_work_root() {
  ensure_work
  printf '%s\n' ".agent-work"
}

cmd_current() {
  ensure_work
  [ -f "$POINTER" ] || die "No active session. A lifecycle skill must run 'session.sh set/new' first (or create .agent-work/sessions/<Task-N-slug>/ and point .current at it)."
  rel="$(head -n1 "$POINTER" | tr -d '\r\n')"
  [ -n "$rel" ] || die "Active-session pointer is empty: $POINTER"
  # Migrate legacy pointers written under .agents/sessions/…
  case "$rel" in
    .agents/sessions/*)
      base="$(basename "$rel")"
      if [ -d "$SESS_DIR/$base" ]; then
        rel=".agent-work/sessions/$base"
        printf '%s\n' "$rel" > "$POINTER"
      elif [ -d "$ROOT/$rel" ]; then
        die "Legacy session path '$rel' found. Move it to .agent-work/sessions/$base then re-run."
      fi
      ;;
  esac
  [ -d "$ROOT/$rel" ] || die "Active session '$rel' recorded in .current does not exist. Re-set it with 'session.sh set <dir>'."
  printf '%s\n' "$rel"
}

cmd_set() {
  ensure_work
  [ "$#" -ge 1 ] || die "Usage: session.sh set <dir|slug>"
  arg="$1"; base="$(basename "$arg")"
  # Allow active sessions/ or _archive/
  if [ -d "$SESS_DIR/$base" ]; then
    target_rel=".agent-work/sessions/$base"
  elif [ -d "$ARCH_DIR/$base" ]; then
    target_rel=".agent-work/sessions/_archive/$base"
  else
    die "Session dir does not exist: .agent-work/sessions/$base (use 'session.sh new <slug>' to create it)."
  fi
  printf '%s\n' "$target_rel" > "$POINTER"
  printf '%s\n' "$target_rel"
}

next_task_n() {
  n=1
  for d in "$SESS_DIR"/Task-*/ "$ARCH_DIR"/Task-*/; do
    [ -d "$d" ] || continue
    num="$(basename "$d" | sed -n 's/^Task-\([0-9]\{1,\}\)-.*/\1/p')"
    [ -n "$num" ] && [ "$num" -ge "$n" ] && n=$((num + 1))
  done
  printf '%s\n' "$n"
}

cmd_new() {
  ensure_work
  [ "$#" -ge 1 ] || die "Usage: session.sh new <slug>"
  slug="$(printf '%s' "$1" | tr ' /' '--' | tr -cd 'A-Za-z0-9._-')"
  n="$(next_task_n)"
  name="Task-${n}-${slug}"
  mkdir -p "$SESS_DIR/$name"
  printf '%s\n' ".agent-work/sessions/$name" > "$POINTER"
  # Milestone commit so the new session is in nested-git history immediately.
  cmd_commit "chore(session): create ${name}" >/dev/null || true
  printf '%s\n' ".agent-work/sessions/$name"
}

cmd_archive() {
  ensure_work
  rel=""
  if [ "$#" -ge 1 ] && [ -n "${1:-}" ]; then
    arg="$1"
    base="$(basename "$arg")"
    if [ -d "$SESS_DIR/$base" ] && [ "$base" != "_archive" ]; then
      rel=".agent-work/sessions/$base"
    elif [ -d "$ARCH_DIR/$base" ]; then
      die "Session already archived: .agent-work/sessions/_archive/$base"
    else
      die "Session dir does not exist: .agent-work/sessions/$base"
    fi
  else
    rel="$(cmd_current)"
  fi
  base="$(basename "$rel")"
  case "$rel" in
    */_archive/*) die "Session already archived: $rel" ;;
  esac
  src="$ROOT/$rel"
  [ -d "$src" ] || die "Session path missing: $rel"
  mkdir -p "$ARCH_DIR"
  dest="$ARCH_DIR/$base"
  [ ! -e "$dest" ] || die "Archive target already exists: .agent-work/sessions/_archive/$base"
  mv "$src" "$dest"
  # Clear pointer if it pointed at the archived session.
  if [ -f "$POINTER" ]; then
    cur="$(head -n1 "$POINTER" | tr -d '\r\n')"
    if [ "$cur" = "$rel" ] || [ "$(basename "$cur")" = "$base" ]; then
      rm -f "$POINTER"
    fi
  fi
  cmd_commit "chore(archive): ${base}" >/dev/null || true
  printf '%s\n' ".agent-work/sessions/_archive/$base"
}

cmd_status() {
  ensure_work
  rel="${1:-}"
  [ -n "$rel" ] || rel="$(cmd_current)"
  tasks="$ROOT/$rel/TASKS.md"
  [ -f "$tasks" ] || die "No TASKS.md in $rel — nothing to measure."

  # Parse the Progress board: rows like "| [ ] | T-001 | title | todo |".
  # Status is the last table cell; Done is the [ ]/[x] checkbox.
  awk -F'|' '
    /^[[:space:]]*\|[[:space:]]*\[[ xX]\][[:space:]]*\|/ {
      done_cell=$2; status=$(NF-1)
      gsub(/[[:space:]]/,"",done_cell)
      gsub(/^[[:space:]]+|[[:space:]]+$/,"",status)
      status=tolower(status)
      total++
      c[status]++
    }
    END{
      todo=c["todo"]+0; ip=c["in_progress"]+0; dn=c["done"]+0
      bl=c["blocked"]+0; sk=c["skipped"]+0
      other=total-todo-ip-dn-bl-sk
      pct=(total>0)?int(dn*100/total):0
      complete=(total>0 && (dn+sk)==total && bl==0 && other==0)?"yes":"no"
      printf "SESSION_TASKS_TOTAL: %d\n", total
      printf "done:%d in_progress:%d todo:%d blocked:%d skipped:%d other:%d\n", dn,ip,todo,bl,sk,other
      printf "PERCENT_DONE: %d%%\n", pct
      printf "COMPLETE: %s\n", complete
      if (checked!=dn) printf "WARNING: %d Done-checkboxes [x] but %d status=done rows — reconcile TASKS.md.\n", checked, dn
      if (other>0) printf "WARNING: %d card(s) in a non-terminal state (e.g. in_progress/review) — cannot be done.\n", other
      print  "--- paste into TASKS.md Progress board ---"
      print  "```mermaid"
      print  "pie title Task status"
      printf "  \"done\" : %d\n", dn
      printf "  \"in_progress\" : %d\n", ip
      printf "  \"todo\" : %d\n", todo
      printf "  \"blocked\" : %d\n", bl
      if (sk>0)    printf "  \"skipped\" : %d\n", sk
      if (other>0) printf "  \"other\" : %d\n", other
      print  "```"
    }
  ' "$tasks"
}

cmd_help() {
  cat <<'EOF'
Simple Skills — session helper

  session.sh help                      This text
  session.sh doctor                    Check Work layout + pointer + tools
  session.sh work-root                 Ensure .agent-work (+ nested git)
  session.sh new <slug>                Create Task-N-<slug>, set current, commit
  session.sh set <dir|slug>            Point .current at an existing session
  session.sh current                   Print active session path
  session.sh status [dir]              Progress from TASKS.md (source of truth)
  session.sh commit [message]          Milestone commit dirty Work (or clean)
  session.sh archive [slug|current]    Move session → sessions/_archive/, commit

Work commit protocol (see AGENT_WORK.md):
  After writing/changing session or memory artifacts, run:
    bash .agents/tools/session/session.sh commit 'docs(<skill>): <why>'
  On successful done (no defect loop): archive the session.

Related (from repo / host root):
  python .agents/tools/session/validate_artifacts.py
  python .agents/tools/session/lint_artifacts.py
  python .agents/tools/session/build_context.py [--skill X] [--pack --check]
  python .agents/tools/session/detect_agents.py [--write]
  python .agents/tools/session/delegate_worker.py --skill X --cli Y --dry-run

Docs: .agents/START_HERE.md · .agents/WHAT_NEXT.md · .agents/MIGRATION.md
EOF
}

cmd_doctor() {
  ensure_work
  printf 'DOCTOR root=%s\n' "$ROOT"
  printf 'work=%s\n' "$WORK_DIR"
  if [ -d "$WORK_DIR/.git" ]; then
    printf 'nested_git=yes\n'
    if work_dirty; then
      printf 'work_dirty=yes — run: session.sh commit '\''docs(…): …'\''\n'
    else
      printf 'work_dirty=no\n'
    fi
    sha="$(git -C "$WORK_DIR" rev-parse --short HEAD 2>/dev/null || true)"
    if [ -n "$sha" ]; then
      subj="$(git -C "$WORK_DIR" log -1 --pretty=%s 2>/dev/null || true)"
      printf 'last_commit=%s %s\n' "$sha" "$subj"
    else
      printf 'last_commit=(none)\n'
    fi
  else
    printf 'nested_git=no (run work-root / new to init)\n'
    printf 'work_dirty=n/a\n'
    printf 'last_commit=n/a\n'
  fi
  if [ -f "$POINTER" ]; then
    rel="$(head -n1 "$POINTER" | tr -d '\r\n')"
    printf 'current=%s\n' "$rel"
    if [ -d "$ROOT/$rel" ]; then
      printf 'current_exists=yes\n'
    else
      printf 'current_exists=NO\n'
    fi
  else
    printf 'current=(unset)\n'
  fi
  gi="$ROOT/.gitignore"
  if [ -f "$gi" ] && grep -Fqx -- '.agent-work/' "$gi"; then
    printf 'gitignore_agent_work=yes\n'
  else
    printf 'gitignore_agent_work=MISSING — product git may track Work\n'
  fi
  for f in START_HERE.md WHAT_NEXT.md SKILL_PREAMBLE.md AGENT_POLICY.md AGENT_WORK.md; do
    if [ -f "$ROOT/.agents/$f" ] || [ -f "$ROOT/docs/$f" ]; then
      printf 'doc_%s=yes\n' "$f"
    else
      printf 'doc_%s=missing\n' "$f"
    fi
  done
  for t in validate_artifacts.py lint_artifacts.py build_context.py; do
    if [ -f "$ROOT/.agents/tools/session/$t" ] || [ -f "$ROOT/tools/session/$t" ]; then
      printf 'tool_%s=yes\n' "$t"
    else
      printf 'tool_%s=missing\n' "$t"
    fi
  done
  printf 'DOCTOR_DONE\n'
}

sub="${1:-}"; shift || true
case "$sub" in
  help|"" )  cmd_help "$@" ;;
  doctor)    cmd_doctor "$@" ;;
  current)   cmd_current "$@" ;;
  set)       cmd_set "$@" ;;
  new)       cmd_new "$@" ;;
  status)    cmd_status "$@" ;;
  work-root) cmd_work_root "$@" ;;
  commit)    cmd_commit "$@" ;;
  archive)   cmd_archive "$@" ;;
  *) die "Usage: session.sh {help|doctor|current|set <dir>|new <slug>|status [dir]|work-root|commit [msg]|archive [slug]}" ;;
esac
