#!/usr/bin/env bash
# Project-candidate surfacer for the init skill.
#
# PURPOSE: guarantee the agent SEES every plausible project root in the repo,
# pruned of noise — so enumeration can never be shortcut through a workspace
# config (pnpm-workspace.yaml, turbo.json, …) that lists only some ecosystems.
#
# IT DOES NOT CLASSIFY STACKS. Classification is the agent's job, so ANY
# ecosystem is covered — nothing here is limited to a hardcoded stack list.
# The "markers" below are only best-effort HINTS to help the agent; a directory
# is still surfaced when it has no recognized marker (shown as "-"), and the
# agent must open and classify it. Do not treat this list as exhaustive.
#
# Read-only: filesystem sweep only. Never executes project code or reads secrets.
#
# Output: one row per candidate — RELATIVE_DIR<TAB>MARKER_HINTS  ("-" = none).
# Usage: bash scan_workspaces.sh [ROOT]   (ROOT defaults to the current dir)
set -eu

ROOT="${1:-$(pwd)}"
cd "$ROOT"

# Noise: build/cache output, native platform host folders that mobile toolchains
# generate, generated code, and the .agents skill-install dir. "web" is NOT
# pruned — it is a common real app name (apps/web).
PRUNE_DIRS='node_modules .git dist build out .next .nuxt .svelte-kit .turbo
.dart_tool .gradle target vendor .venv venv __pycache__ .idea .vscode coverage
Pods .terraform .expo .cache tmp .pnpm-store .agents
ios android macos windows linux ephemeral generated .symlinks .plugin_symlinks'

# Parent directories whose immediate children are treated as project candidates
# EVEN WITHOUT a recognized marker — this is what catches unknown ecosystems.
# Kept to established monorepo container conventions (Turborepo/Nx/pnpm/Lerna).
# A depth cap (below) keeps deep source folders like src/services/* from being
# mistaken for projects, since real containers sit near the repo root.
CONTAINERS='apps packages services libs'

# Best-effort manifest HINTS (not a classifier, not exhaustive). Broad on
# purpose; the agent, not this list, decides the stack.
MARKERS='package.json pubspec.yaml Cargo.toml go.mod go.work pom.xml
build.gradle build.gradle.kts settings.gradle settings.gradle.kts
pyproject.toml requirements.txt setup.py setup.cfg Pipfile composer.json
Gemfile *.gemspec Package.swift *.csproj *.fsproj *.vbproj mix.exs rebar.config
deno.json deno.jsonc build.sbt build.zig deps.edn project.clj shard.yml
dune-project *.cabal stack.yaml CMakeLists.txt meson.build BUILD.bazel elm.json
flake.nix'

prune_expr=""; for d in $PRUNE_DIRS; do prune_expr="$prune_expr -name $d -o"; done
prune_expr="${prune_expr% -o}"
marker_expr=""; for m in $MARKERS; do marker_expr="$marker_expr -name $m -o"; done
marker_expr="${marker_expr% -o}"

tmp="$(mktemp)"; trap 'rm -f "$tmp"' EXIT

# 1) Any directory that directly contains a marker file.
# shellcheck disable=SC2086
find . \( $prune_expr \) -prune -o -type f \( $marker_expr \) -print 2>/dev/null \
  | while IFS= read -r f; do d="$(dirname "$f")"; printf '%s\n' "${d#./}"; done >> "$tmp"

# 2) Immediate subdirectories of container dirs — surfaced even with no marker,
#    so a project in an ecosystem this script does not know is never dropped.
# shellcheck disable=SC2086
find . \( $prune_expr \) -prune -o -type d -print 2>/dev/null \
  | while IFS= read -r d; do
      rel="${d#./}"
      # Depth cap: candidate must be within 3 path segments (e.g. apps/mobile or
      # group/packages/pkg) so deep source dirs named like a container are skipped.
      case "$rel" in */*/*/*) continue ;; esac
      parent="$(basename "$(dirname "$rel")")"
      case " $CONTAINERS " in *" $parent "*) printf '%s\n' "$rel" ;; esac
    done >> "$tmp"

# 3) Repo root.
printf '.\n' >> "$tmp"

# Annotate each unique candidate with the marker files present at its top level.
LC_ALL=C sort -u "$tmp" | while IFS= read -r d; do
  if [ "$d" = "." ]; then disp="(root)"; real="."; else disp="$d"; real="$d"; fi
  hints=""
  for m in $MARKERS; do
    for hit in "$real"/$m; do
      [ -e "$hit" ] && hints="$hints,$(basename "$hit")"
    done
  done
  hints="${hints#,}"; [ -z "$hints" ] && hints="-"
  printf '%s\t%s\n' "$disp" "$hints"
done
