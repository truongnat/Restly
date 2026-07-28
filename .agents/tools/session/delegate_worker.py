#!/usr/bin/env python3
"""Thin sub-agent dispatch helper (Phase 2 scaffold).

Enforces Rules gate before any worker spawn. Applies
`rules.agents.routing.<skill>` + fallback when `--cli` is omitted or `auto`.
Real CLI adapters are stubs: prints a ready command template or refuses.
Main brain remains authoritative.

Usage:
  python tools/session/delegate_worker.py --skill planning --cli auto --dry-run
  python tools/session/delegate_worker.py --skill execution --cli opencode --check-only
"""

from __future__ import annotations

import argparse
import re
import shutil
import sys
from pathlib import Path

SESSION_DIR = Path(__file__).resolve().parent
if str(SESSION_DIR) not in sys.path:
    sys.path.insert(0, str(SESSION_DIR))

from build_context import (  # noqa: E402
    build_pack,
    check_rules_block,
    find_root,
    resolve_session,
    settings_path,
)

SUPPORTED = ("claude", "codex", "opencode", "cursor", "main")


def ensure_pack(root: Path, session: Path, skill: str, mission: str) -> Path:
    pack_text = build_pack(root, session, skill, mission)
    missing = check_rules_block(pack_text)
    if missing:
        raise SystemExit(
            "DELEGATE_REFUSED reason=rules_incomplete missing=" + ",".join(missing)
        )
    out = session / "CONTEXT_PACK.md"
    out.write_text(pack_text, encoding="utf-8")
    return out


def _parse_agents_routing(text: str) -> tuple[str, dict[str, list[str]]]:
    """Parse lean settings rules.agents.fallback + routing without PyYAML."""
    fallback = "main"
    routing: dict[str, list[str]] = {}
    lines = text.splitlines()
    in_rules = False
    in_agents = False
    in_routing = False
    rules_indent = -1
    agents_indent = -1
    routing_indent = -1
    for line in lines:
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        indent = len(line) - len(line.lstrip(" "))
        key, _, rest = line.lstrip().partition(":")
        key = key.strip()
        rest = rest.strip().strip("\"'")

        if not in_rules and key == "rules" and not rest and indent == 0:
            in_rules = True
            rules_indent = indent
            in_agents = False
            in_routing = False
            continue
        if in_rules and indent <= rules_indent and key != "rules":
            in_rules = False
            in_agents = False
            in_routing = False

        if in_rules and key == "agents" and not rest:
            in_agents = True
            agents_indent = indent
            in_routing = False
            continue
        if in_agents and indent <= agents_indent and key != "agents":
            in_agents = False
            in_routing = False
        if not in_agents:
            continue

        if key == "fallback" and rest:
            fallback = rest.lower()
            continue
        if key == "routing" and not rest:
            in_routing = True
            routing_indent = indent
            continue
        if in_routing and indent <= routing_indent and key != "routing":
            in_routing = False
        if in_routing and indent > routing_indent:
            skill = key
            ids = re.findall(r"[A-Za-z0-9_-]+", rest)
            if ids:
                routing[skill] = [x.lower() for x in ids]
    return fallback, routing


def read_routing(root: Path) -> tuple[str, dict[str, list[str]]]:
    path = settings_path(root)
    if path is None:
        return "main", {}
    return _parse_agents_routing(path.read_text(encoding="utf-8"))


def preferred_role_from_skill(root: Path, skill: str) -> str | None:
    for rel in (f".agents/skills/{skill}/SKILL.md", f"skills/{skill}/SKILL.md"):
        path = root / rel
        if not path.is_file():
            continue
        text = path.read_text(encoding="utf-8")
        m = re.search(
            r"\|\s*preferred_role\s*\|\s*`?([^|`]+)`?",
            text,
            flags=re.I,
        )
        if m:
            return m.group(1).strip().split()[0].lower()
    return None


def resolve_cli(root: Path, skill: str, requested: str) -> tuple[str, str]:
    """Return (cli_id, reason). requested may be auto/empty."""
    fallback, routing = read_routing(root)
    req = (requested or "auto").strip().lower()
    role = preferred_role_from_skill(root, skill)
    role_note = f" preferred_role={role}" if role else ""

    if req and req not in ("auto", "route"):
        return req, f"explicit_cli={req}{role_note}"

    chain = routing.get(skill) or []
    if chain:
        chosen = chain[0]
        return chosen, f"routing[{skill}]={chain} → {chosen}{role_note}"

    fb = fallback if fallback in SUPPORTED else "main"
    return fb, f"fallback={fb} (no rules.agents.routing.{skill}){role_note}"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=None)
    parser.add_argument("--session", default=None)
    parser.add_argument("--skill", required=True)
    parser.add_argument(
        "--cli",
        default="auto",
        help="Target worker id, or auto/route to apply rules.agents.routing",
    )
    parser.add_argument("--mission", default="")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Build pack + print invoke template; do not spawn",
    )
    parser.add_argument(
        "--check-only",
        action="store_true",
        help="Only validate/build pack with Rules gate",
    )
    parser.add_argument(
        "--force-cli",
        action="store_true",
        help="Allow --cli outside routing list (still must be SUPPORTED)",
    )
    args = parser.parse_args()
    root = args.root.resolve() if args.root else find_root(Path.cwd())
    session = resolve_session(root, args.session)
    skill = args.skill.strip()

    cli, route_reason = resolve_cli(root, skill, args.cli)
    print(f"DELEGATE_ROUTE {route_reason} cli={cli}")

    if cli not in SUPPORTED:
        print(f"DELEGATE_REFUSED reason=unsupported_cli cli={cli}", file=sys.stderr)
        return 1

    # When user picked an explicit CLI, warn if it is not on the routing list.
    fallback, routing = read_routing(root)
    chain = routing.get(skill) or []
    req = (args.cli or "auto").strip().lower()
    if (
        req not in ("auto", "route", "")
        and chain
        and cli not in chain
        and not args.force_cli
    ):
        print(
            "DELEGATE_REFUSED reason=cli_not_in_routing "
            f"cli={cli} routing={chain} (pass --force-cli to override)",
            file=sys.stderr,
        )
        return 1

    try:
        pack_path = ensure_pack(root, session, skill, args.mission)
    except SystemExit as exc:
        print(str(exc), file=sys.stderr)
        return 1

    print(f"DELEGATE_PACK_OK path={pack_path}")

    if args.check_only or cli == "main":
        print("DELEGATE_FALLBACK_MAIN reason=check_only_or_cli_main")
        return 0

    binary = shutil.which(cli)
    if cli == "cursor" and not binary:
        binary = shutil.which("cursor-agent")
    if not binary:
        print(f"DELEGATE_REFUSED reason=cli_missing cli={cli} → fallback {fallback}")
        return 2

    rel_pack = pack_path.relative_to(root) if pack_path.is_relative_to(root) else pack_path
    template = (
        f"# Suggested invoke (human/main must approve)\n"
        f"# Attach CONTEXT_PACK and require Rules obedience.\n"
        f"# Route: {route_reason}\n"
        f"{binary}  # open session with pack:\n"
        f"#   {rel_pack}\n"
        f"# After worker returns: validate_artifacts.py && lint_artifacts.py && "
        f"session.sh commit 'docs({skill}): worker {cli}'\n"
    )
    print("DELEGATE_READY")
    print(template)
    if args.dry_run:
        return 0

    print(
        "DELEGATE_SPAWN_SKIPPED reason=adapters_are_manual_approve_only "
        "(use --dry-run; main merges results)",
        file=sys.stderr,
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
