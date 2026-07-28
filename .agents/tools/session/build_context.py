#!/usr/bin/env python3
"""Build CONTEXT.md and/or CONTEXT_PACK.md for handoff / sub-agent dispatch.

Usage:
  python tools/session/build_context.py
  python tools/session/build_context.py --skill execution
  python tools/session/build_context.py --skill planning --pack --check
  python tools/session/build_context.py --rules-only

--pack writes CONTEXT_PACK.md (Rules-first envelope for workers).
--check fails if Rules (mandatory) block is missing or incomplete.
Legacy default still writes CONTEXT.md for same-runtime execution handoff.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

SOURCES = (
    "DISCUSSION.md",
    "QUICK.md",
    "BUSINESS_ANALYSIS.md",
    "BASIC_DESIGN.md",
    "DETAIL_DESIGN.md",
    "PLAN.md",
    "TASKS.md",
    "INVESTIGATE.md",
    "RESEARCH.md",
    "REVIEW.md",
    "SYNC.md",
)

SKILL_HEADINGS: dict[str, tuple[str, ...]] = {
    "default": (
        "executive summary",
        "developer overview",
        "goal",
        "recommendation",
        "handoff",
        "approach",
        "definition of done",
        "problem statement",
        "scope",
        "keywords",
    ),
    "planning": (
        "executive summary",
        "developer overview",
        "goal",
        "recommendation",
        "approach",
        "definition of done",
        "handoff",
    ),
    "execution": (
        "executive summary",
        "developer overview",
        "goal",
        "approach",
        "definition of done",
        "handoff",
    ),
    "investigate": (
        "executive summary",
        "developer overview",
        "question",
        "recommendation",
        "doc reality check",
        "keywords",
    ),
    "review": (
        "executive summary",
        "developer overview",
        "recommendation",
        "handoff",
    ),
    "brainstorming": (
        "executive summary",
        "developer overview",
        "goal",
        "recommendation",
        "keywords",
        "spec quality review",
    ),
    "basic-design": (
        "executive summary",
        "developer overview",
        "goal",
        "doc reality check",
        "handoff",
    ),
    "detail-design": (
        "executive summary",
        "developer overview",
        "goal",
        "doc reality check",
        "handoff",
    ),
    "research": (
        "executive summary",
        "developer overview",
        "question",
        "recommendation",
        "keywords",
    ),
}

OUTPUT_HINTS: dict[str, str] = {
    "planning": "Write/update `PLAN{ext}` + `TASKS{ext}` in the active session only.",
    "execution": "Implement in-repo per TASK card; update `EXECUTION{ext}` + TASKS progress.",
    "investigate": "Write/update `INVESTIGATE{ext}` in the active session only.",
    "review": "Write/update `REVIEW{ext}` in the active session only.",
    "brainstorming": "Write/update `DISCUSSION{ext}` in the active session only.",
    "basic-design": "Write/update `BASIC_DESIGN{ext}` in the active session only.",
    "detail-design": "Write/update `DETAIL_DESIGN{ext}` in the active session only.",
    "research": "Write/update `RESEARCH{ext}` in the active session only.",
    "specify": "Write one mode artifact (PRD/ROADMAP/DISCOVER/URD/BRD/PRD_EPIC/SPEC_SRS) in the active session only.",
    "biz-model": "Write/update `MODEL{ext}` in the active session only.",
    "story-spec": "Write one of USECASE/USER_STORIES/AC in the active session only.",
    "gap-analysis": "Write/update `GAP{ext}` in the active session only.",
    "user-flow": "Write/update `USER_FLOW{ext}` in the active session only.",
    "api-ba": "Write/update `API_BA{ext}` in the active session only.",
    "ba-test": "Write TEST_CHECKLIST and/or TESTCASES in the active session only.",
    "reverse-doc": "Write REVERSE_DOC + SPEC_SRS in the active session only.",
    "ux-wireframe": "Write WIREFRAME.md (+ optional HTML) or FIGMA_BRIEF in the active session only.",
    "ba-dashboard": "Write/update `DASHBOARD{ext}` in the active session only.",
    "ba-kg": "Write/update `KG{ext}` in the active session only.",
    "ba-handoff": "Write meet/userguide/export/preview/overview artifact in the active session only.",
    "ba-integrate": "Write Jira/Confluence integrate plan in the active session only (no tokens).",
    "default": "Write only the session artifacts named in Mission / Output contract.",
}

RULES_NEEDLES = (
    "## Rules (mandatory)",
    "## Language",
    "## Work layout",
    "## Confirm-first",
    "## Safety",
    "## Output contract",
    "Ask method",
    ".agent-work/",
)

SETTINGS_KEYS = (
    ("language", "en"),
    ("rules.branch.mode", "checkout"),
    ("rules.reports.output_format", "markdown"),
    ("rules.code.comments.prose_language", "repo-default"),
    ("rules.docs.location", ".agents/wiki"),
)


def find_root(start: Path) -> Path:
    cur = start.resolve()
    for candidate in [cur, *cur.parents]:
        if (candidate / ".agents").is_dir() or (candidate / ".agent-work").is_dir():
            return candidate
        if (candidate / "docs" / "config" / "artifact-schemas.json").is_file():
            return candidate
        if (candidate / "docs" / "AGENTS.md").is_file():
            return candidate
    return start.resolve()


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
        raise SystemExit("No active session. Pass --session or run session.sh new/set.")
    rel = pointer.read_text(encoding="utf-8").splitlines()[0].strip()
    path = root / rel
    if not path.is_dir():
        raise SystemExit(f"Active session missing: {rel}")
    return path


def settings_path(root: Path) -> Path | None:
    for rel in (".agents/settings.yaml", "docs/config/settings.yaml"):
        path = root / rel
        if path.is_file():
            return path
    return None


def _yaml_simple_get(text: str, dotted: str, default: str) -> str:
    """Read a nested scalar from lean settings.yaml without a YAML dependency."""
    parts = dotted.split(".")
    lines = text.splitlines()
    if len(parts) == 1:
        key = parts[0]
        for line in lines:
            if line.startswith((" ", "\t")) or line.lstrip().startswith("#"):
                continue
            if ":" not in line:
                continue
            k, _, rest = line.partition(":")
            if k.strip() == key:
                val = rest.strip().strip("\"'")
                return val if val else default
        return default

    # Walk nested mapping by indentation (expects parts like rules.branch.mode).
    want = list(parts)
    idx = 0
    parent_indent = -1
    for line in lines:
        raw = line.rstrip()
        if not raw.strip() or raw.lstrip().startswith("#"):
            continue
        indent = len(raw) - len(raw.lstrip(" "))
        if indent < parent_indent and idx > 0:
            # Left the current parent block without finding the leaf.
            return default
        if ":" not in raw:
            continue
        key, _, rest = raw.lstrip().partition(":")
        key = key.strip()
        rest = rest.strip().strip("\"'")
        if idx < len(want) and key == want[idx]:
            if idx == len(want) - 1:
                return rest if rest else default
            # Enter child block
            parent_indent = indent
            idx += 1
            continue
        if idx > 0 and indent <= parent_indent and key != want[idx]:
            # Sibling at/above parent — stop if we already entered this level
            if indent < parent_indent or (indent == parent_indent and idx > 0):
                # Only reset when we've left the branch entirely
                if indent < parent_indent:
                    return default
    return default


def read_settings_knobs(root: Path) -> dict[str, str]:
    path = settings_path(root)
    text = path.read_text(encoding="utf-8") if path else ""
    return {key: _yaml_simple_get(text, key, default) for key, default in SETTINGS_KEYS}


def skill_md_path(root: Path, skill: str) -> Path | None:
    for rel in (
        f".agents/skills/{skill}/SKILL.md",
        f"skills/{skill}/SKILL.md",
    ):
        path = root / rel
        if path.is_file():
            return path
    return None


def extract_skill_contract(root: Path, skill: str, limit: int = 80) -> str:
    path = skill_md_path(root, skill)
    if path is None:
        return f"_(no SKILL.md for `{skill}` — stay on main or pass skill contract in Mission)_"
    text = path.read_text(encoding="utf-8")
    m = re.search(
        r"^## Contract \(mandatory\)\s*\n(.*?)(?=^## |\Z)",
        text,
        flags=re.M | re.S,
    )
    if not m:
        return f"_(SKILL.md for `{skill}` has no Contract section)_"
    body = m.group(0).strip()
    # Prefer relative path for worker instructions
    try:
        rel = path.relative_to(root)
    except ValueError:
        rel = path
    lines = body.splitlines()
    if len(lines) > limit:
        body = "\n".join(lines[:limit]) + "\n\n…(truncated)"
    steps = path.parent / "steps"
    step_note = ""
    if steps.is_dir():
        step_files = sorted(p.name for p in steps.glob("step-*.md"))
        if step_files:
            step_note = (
                f"\n\nObey step order under `{rel.parent}/steps/` "
                f"({', '.join(step_files)}). Do not skip the Step ledger."
            )
    return f"Skill contract source: `{rel}`\n\n{body}{step_note}"


def extract_dev_contexts(text: str, limit_cards: int = 8, limit_lines: int = 120) -> str:
    """Pull ### T-… cards that include #### Dev context for execution workers."""
    cards: list[str] = []
    parts = re.split(r"(?=^###\s+T-)", text, flags=re.M)
    for part in parts:
        if not re.match(r"^###\s+T-", part):
            continue
        if "#### Dev context" not in part and "#### Dev Context" not in part:
            continue
        cards.append(part.strip())
        if len(cards) >= limit_cards:
            break
    if not cards:
        return ""
    out = "\n\n".join(cards)
    lines = out.splitlines()
    if len(lines) > limit_lines:
        out = "\n".join(lines[:limit_lines]) + "\n\n…(truncated)"
    return out


def rules_template_path(root: Path) -> Path:
    here = Path(__file__).resolve().parent
    for p in (
        root / ".agents" / "tools" / "session" / "RULES_BUNDLE.template.md",
        root / "tools" / "session" / "RULES_BUNDLE.template.md",
        here / "RULES_BUNDLE.template.md",
    ):
        if p.is_file():
            return p
    raise SystemExit("RULES_BUNDLE.template.md not found under tools/session/")


def load_rules_bundle(root: Path) -> str:
    text = rules_template_path(root).read_text(encoding="utf-8").strip()
    # Normalize title for pack heading
    if text.startswith("# Rules bundle"):
        body = text.split("\n", 1)[1].lstrip() if "\n" in text else ""
        return "## Rules (mandatory)\n\n" + body
    if text.startswith("## Rules"):
        return text
    return "## Rules (mandatory)\n\n" + text


def check_rules_block(text: str) -> list[str]:
    missing = [n for n in RULES_NEEDLES if n not in text]
    return missing


def extract_sections(text: str, headings: tuple[str, ...], limit: int = 80) -> str:
    lines = text.splitlines()
    want = {h.casefold() for h in headings}
    chunks: list[str] = []
    i = 0
    while i < len(lines):
        m = re.match(r"^##\s+(.+?)\s*$", lines[i])
        if not m:
            i += 1
            continue
        title = m.group(1).strip()
        key = title.casefold()
        matched = any(key == w or key.startswith(w) for w in want)
        i += 1
        body: list[str] = []
        while i < len(lines) and not re.match(r"^##\s+", lines[i]):
            body.append(lines[i])
            i += 1
        if matched:
            trimmed = "\n".join(body).strip()
            if trimmed:
                chunks.append(f"### {title}\n\n{trimmed}")
    out = "\n\n".join(chunks)
    out_lines = out.splitlines()
    if len(out_lines) > limit:
        out = "\n".join(out_lines[:limit]) + "\n\n…(truncated)"
    return out


def project_digest(root: Path, limit: int = 40) -> str:
    for rel in (".agents/PRJ_REFERENCE.md", "docs/PRJ_REFERENCE.md"):
        path = root / rel
        if not path.is_file():
            continue
        text = path.read_text(encoding="utf-8")
        block = extract_sections(
            text,
            (
                "executive summary",
                "technology stack",
                "key constraints",
                "verified commands",
                "agent clis",
            ),
            limit,
        )
        return block or f"_(see {rel})_"
    return "_(no PRJ_REFERENCE.md — run init / detect_agents)_"


def build_legacy_context(session: Path, skill: str) -> str:
    headings = SKILL_HEADINGS.get(skill, SKILL_HEADINGS["default"])
    parts = [
        "# CONTEXT (compact handoff pack)",
        "",
        "> Auto-built for execution. Prefer this + active TASK card Dev context.",
        "> Do not invent beyond Sources. Regenerate: "
        "`python .agents/tools/session/build_context.py`",
        f"> skill={skill}",
        "",
    ]
    found = 0
    for name in SOURCES:
        path = session / name
        if not path.is_file():
            continue
        found += 1
        text = path.read_text(encoding="utf-8")
        parts.append(f"## From {name}")
        parts.append("")
        if name == "TASKS.md":
            inv = extract_sections(text, ("Work inventory", "Execution order"), 40)
            parts.append(inv or "_(see TASKS.md)_")
            dev = extract_dev_contexts(text)
            if dev:
                parts.extend(["", "### Dev context (from TASK cards)", "", dev])
        else:
            block = extract_sections(text, headings, 60)
            parts.append(block or "_(see source file)_")
        parts.append("")
    if found == 0:
        return ""
    return "\n".join(parts).rstrip() + "\n"


def build_pack(root: Path, session: Path, skill: str, mission: str) -> str:
    rules = load_rules_bundle(root)
    headings = SKILL_HEADINGS.get(skill, SKILL_HEADINGS["default"])
    knobs = read_settings_knobs(root)
    fmt = knobs.get("rules.reports.output_format", "markdown").lower()
    ext = ".html" if fmt == "html" else ".md"
    hint_tmpl = OUTPUT_HINTS.get(skill, OUTPUT_HINTS["default"])
    hint = hint_tmpl.format(ext=ext)
    rel_session = str(session.relative_to(root)) if session.is_relative_to(root) else str(session)
    contract = extract_skill_contract(root, skill)

    parts: list[str] = [
        "# CONTEXT_PACK (sub-agent envelope)",
        "",
        "> Built for worker CLIs. Obey **Rules (mandatory)** verbatim.",
        "> Main must refuse dispatch if `--check` fails. Sources only — do not invent.",
        f"> skill={skill} session={rel_session}",
        "",
        rules,
        "",
        "## Mission",
        "",
        mission.strip()
        or f"Run skill `{skill}` for session `{rel_session}`. Return artifacts per Output contract.",
        "",
        "## Settings (resolved)",
        "",
        f"- `language` (thread/report prose): `{knobs['language']}`",
        f"- `rules.code.comments.prose_language`: `{knobs['rules.code.comments.prose_language']}`",
        f"- `rules.branch.mode`: `{knobs['rules.branch.mode']}` "
        "(checkout → create/use work branch before code edits; direct → stay on base)",
        f"- `rules.reports.output_format`: `{knobs['rules.reports.output_format']}` "
        f"(lifecycle reports use `{ext}`)",
        f"- `rules.docs.location`: `{knobs['rules.docs.location']}` (wiki only; not session reports)",
        "",
        "## Skill contract",
        "",
        contract,
        "",
        "## Constraints",
        "",
        "- Path scale: honor Quick/Lite/Full in Developer overview when present.",
        "- cwd: repository root (product). Lifecycle artifacts only under the active session.",
        "- Do not modify `.agents/skills` or kit policy files.",
        "- If Blocking: stop and Ask-back to main (see Ask-back protocol).",
        "- Obey Settings (resolved) and Skill contract above; do not invent omitted policy.",
        "",
        "## Project digest",
        "",
        project_digest(root),
        "",
        "## Decision so far",
        "",
    ]

    decision_bits: list[str] = []
    for name in SOURCES:
        path = session / name
        if not path.is_file():
            continue
        text = path.read_text(encoding="utf-8")
        if name == "TASKS.md":
            continue
        block = extract_sections(text, headings, 50)
        if block:
            decision_bits.append(f"### From {name}\n\n{block}")
    parts.append("\n\n".join(decision_bits) if decision_bits else "_(none yet)_")
    parts.append("")

    tasks = session / "TASKS.md"
    if tasks.is_file():
        tasks_text = tasks.read_text(encoding="utf-8")
        parts.extend(
            [
                "## Task scope",
                "",
                extract_sections(
                    tasks_text,
                    ("Work inventory", "Execution order"),
                    50,
                )
                or "_(see TASKS.md)_",
                "",
            ]
        )
        if skill in ("execution", "default", "review"):
            dev = extract_dev_contexts(tasks_text)
            parts.extend(
                [
                    "## Dev context (TASK cards)",
                    "",
                    dev
                    or "_(no #### Dev context blocks found — return to planning; do not invent)_",
                    "",
                ]
            )

    parts.extend(
        [
            "## Output contract",
            "",
            hint,
            f"- Session dir: `{rel_session}`",
            f"- Report extension from settings: `{ext}` "
            f"(rules.reports.output_format={knobs['rules.reports.output_format']})",
            f"- Thread/report prose: `{knobs['language']}` "
            "(headings / template keys stay English).",
            f"- Code comments/docstrings: `{knobs['rules.code.comments.prose_language']}` "
            "(not settings.language).",
            f"- Branch before code edits: `rules.branch.mode={knobs['rules.branch.mode']}`.",
            "",
            "## Ask-back protocol",
            "",
            "If Blocking clarity is missing, do **not** guess. Return to main:",
            "",
            "| Ask method | Question | Why blocking |",
            "|---|---|---|",
            "| confirm / choice / fact / table / diagram / html | _(one question)_ | _(one line)_ |",
            "",
            "Status for the skill: `blocked` until main confirms.",
            "",
        ]
    )
    return "\n".join(parts).rstrip() + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--session", help="Session dir (default: .current)")
    parser.add_argument("--root", type=Path, default=None)
    parser.add_argument(
        "--skill",
        default="default",
        help="Skill id for section selection / output hints (e.g. planning, execution)",
    )
    parser.add_argument(
        "--pack",
        action="store_true",
        help="Write CONTEXT_PACK.md (Rules-first worker envelope)",
    )
    parser.add_argument(
        "--check",
        action="store_true",
        help="Validate Rules (mandatory) in pack text; exit 1 if incomplete",
    )
    parser.add_argument(
        "--rules-only",
        action="store_true",
        help="Print Rules bundle to stdout and exit",
    )
    parser.add_argument("--mission", default="", help="Override Mission paragraph")
    args = parser.parse_args()
    root = args.root.resolve() if args.root else find_root(Path.cwd())
    skill = args.skill.strip() or "default"

    if args.rules_only:
        print(load_rules_bundle(root))
        return 0

    session = resolve_session(root, args.session)

    if args.pack or args.check:
        pack = build_pack(root, session, skill, args.mission)
        missing = check_rules_block(pack)
        if missing:
            print("CONTEXT_PACK_RULES_FAIL missing=" + ",".join(missing), file=sys.stderr)
            if args.check:
                return 1
        if args.pack:
            out = session / "CONTEXT_PACK.md"
            out.write_text(pack, encoding="utf-8")
            print(f"CONTEXT_PACK_OK path={out}")
        if args.check and not missing:
            print("CONTEXT_PACK_CHECK_OK")
        if args.check and missing:
            return 1
        if args.pack or args.check:
            # Also refresh legacy CONTEXT when packing for convenience
            legacy = build_legacy_context(session, skill)
            if legacy:
                (session / "CONTEXT.md").write_text(legacy, encoding="utf-8")
            return 0

    legacy = build_legacy_context(session, skill)
    if not legacy:
        print("CONTEXT_BUILD_EMPTY", file=sys.stderr)
        return 1
    out = session / "CONTEXT.md"
    out.write_text(legacy, encoding="utf-8")
    print(f"CONTEXT_OK path={out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
