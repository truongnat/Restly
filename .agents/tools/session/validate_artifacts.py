#!/usr/bin/env python3
"""Validate session lifecycle artifacts against docs/config/artifact-schemas.json.

Usage (from repo root or any subdir):
  python tools/session/validate_artifacts.py
  python tools/session/validate_artifacts.py --session .agent-work/sessions/Task-1-demo
  python .agents/tools/session/validate_artifacts.py   # after install

Only artifacts that exist are checked. Missing optional artifacts are skipped.
Fails if a present artifact is missing a required heading (Markdown ## or HTML h2).
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path


def find_agents_root(start: Path) -> Path:
    cur = start.resolve()
    for candidate in [cur, *cur.parents]:
        if (candidate / ".agents").is_dir() or (candidate / ".agent-work").is_dir():
            return candidate
        if (candidate / "docs" / "config" / "artifact-schemas.json").is_file():
            return candidate
        if (candidate / "docs" / "AGENTS.md").is_file():
            return candidate
    return start.resolve()


def load_schema(root: Path) -> dict:
    candidates = [
        root / ".agents" / "tools" / "session" / "artifact-schemas.json",
        root / "docs" / "config" / "artifact-schemas.json",
        Path(__file__).resolve().parent / "artifact-schemas.json",
    ]
    for path in candidates:
        if path.is_file():
            return json.loads(path.read_text(encoding="utf-8"))
    raise SystemExit("artifact-schemas.json not found")


def resolve_session(root: Path, explicit: str | None) -> Path:
    if explicit:
        path = Path(explicit)
        if not path.is_absolute():
            path = root / path
        if not path.is_dir():
            raise SystemExit(f"Session dir not found: {path}")
        return path
    pointer = root / ".agent-work" / "sessions" / ".current"
    if not pointer.is_file():
        raise SystemExit(
            "No active session (.agent-work/sessions/.current). "
            "Pass --session or run session.sh new/set first."
        )
    rel = pointer.read_text(encoding="utf-8").splitlines()[0].strip()
    path = root / rel
    if not path.is_dir():
        raise SystemExit(f"Active session missing: {rel}")
    return path


def resolve_artifact_file(session: Path, basename: str) -> Path | None:
    for ext in (".md", ".html"):
        path = session / f"{basename}{ext}"
        if path.is_file():
            return path
    return None


def headings(text: str, suffix: str) -> list[str]:
    if suffix == ".html":
        found = re.findall(
            r"<h2[^>]*>\s*(.*?)\s*</h2>",
            text,
            flags=re.I | re.S,
        )
        cleaned: list[str] = []
        for raw in found:
            plain = re.sub(r"<[^>]+>", "", raw)
            plain = re.sub(r"\s+", " ", plain).strip()
            cleaned.append(plain)
        return cleaned
    return [
        m.group(1).strip()
        for m in re.finditer(r"^##\s+(.+?)\s*$", text, flags=re.M)
    ]


def heading_matches(required: str, present: list[str]) -> bool:
    req = required.casefold()
    for heading in present:
        h = heading.casefold()
        if h == req or h.startswith(req + " ") or h.startswith(req + " ("):
            return True
        # Allow "Executive summary — …" style suffixes; prefer plain titles.
        if req in h:
            return True
    return False


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--session", help="Session dir (default: .current)")
    parser.add_argument(
        "--root",
        type=Path,
        default=None,
        help="Repo / project root (default: walk up from cwd)",
    )
    args = parser.parse_args()
    root = args.root.resolve() if args.root else find_agents_root(Path.cwd())
    schema = load_schema(root)
    session = resolve_session(root, args.session)
    errors: list[str] = []
    checked = 0

    for basename, rules in (schema.get("artifacts") or {}).items():
        path = resolve_artifact_file(session, basename)
        if path is None:
            continue
        checked += 1
        text = path.read_text(encoding="utf-8")
        present = headings(text, path.suffix.lower())
        for required in rules.get("required_headings") or []:
            if not heading_matches(required, present):
                errors.append(f"{path.name}: missing required heading '{required}'")

    if checked == 0:
        print(f"SESSION_ARTIFACTS_EMPTY session={session}")
        return 0
    if errors:
        print("SESSION_ARTIFACTS_FAILED")
        print(f"session={session}")
        for err in errors:
            print(f"- {err}")
        return 1
    print(f"SESSION_ARTIFACTS_OK session={session} checked={checked}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
