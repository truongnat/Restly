#!/usr/bin/env python3
"""Lint session artifacts for readable quality (beyond heading schemas).

Usage:
  python tools/session/lint_artifacts.py
  python tools/session/lint_artifacts.py --session .agent-work/sessions/Task-1-x
  python .agents/tools/session/lint_artifacts.py
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path


FILLER = re.compile(
    r"\b("
    r"leverage|holistic|synerg(?:y|ies)|ensure consistency|"
    r"optimize the flow|align(?:ing)? stakeholders|"
    r"as an AI|I will now analyze|this section (?:covers|discusses)"
    r")\b",
    re.I,
)
TODO_LEFT = re.compile(r"_\(TODO|_(\.\.\.|short title|name)_\)|_\(TODO", re.I)
SOURCE = re.compile(r"\[Source:\s*[^\]]+\]|No specific guidance found", re.I)

# Translated template headings (must stay English for shared form).
VI_HEADING = re.compile(
    r"^#{1,3}\s+("
    r"Tóm tắt(?:\s+điều hành)?|"
    r"Tổng quan(?:\s+developer|\s+lập trình)?|"
    r"Mục tiêu|"
    r"Bối cảnh|"
    r"Kiểm tra thực tế(?:\s+tài liệu)?|"
    r"Câu hỏi(?:\s+đang mở)?|"
    r"Bàn giao|"
    r"Giả định|"
    r"Kiến trúc|"
    r"Thành phần|"
    r"Luồng(?:\s+người dùng)?|"
    r"Sở hữu dữ liệu|"
    r"Chất lượng đặc tả|"
    r"Phạm vi|"
    r"Khuyến nghị"
    r")\b",
    re.I | re.M,
)
VI_CHAR = re.compile(
    r"[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡ"
    r"ùúụủũưừứựửữỳýỵỷỹđ"
    r"ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ"
    r"ÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]"
)


def read_language(root: Path) -> str:
    settings = root / ".agents" / "settings.yaml"
    if not settings.is_file():
        settings = root / "docs" / "config" / "settings.yaml"
    if not settings.is_file():
        return "en"
    for line in settings.read_text(encoding="utf-8").splitlines():
        s = line.strip()
        if s.startswith("#") or not s.startswith("language:"):
            continue
        val = s.split(":", 1)[1].strip().strip("\"'")
        return val.lower() if val else "en"
    return "en"


def strip_fences(text: str) -> str:
    return re.sub(r"```.*?```", "", text, flags=re.S)


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


def path_is_quick(session: Path) -> bool:
    for name in ("DISCUSSION.md", "PLAN.md", "QUICK.md", "SYNC.md"):
        p = session / name
        if not p.is_file():
            continue
        text = p.read_text(encoding="utf-8")
        if re.search(r"\|\s*Path\s*\|\s*`?Quick`?", text, re.I):
            return True
        if re.search(r"Path:\s*Quick\b", text, re.I):
            return True
    return False


def lint_file(
    path: Path,
    errors: list[str],
    warnings: list[str],
    *,
    language: str = "en",
) -> None:
    text = path.read_text(encoding="utf-8")
    rel = path.name
    if TODO_LEFT.search(text):
        errors.append(f"{rel}: leftover template TODO / placeholder")
    for m in FILLER.finditer(text):
        warnings.append(f"{rel}: filler phrase '{m.group(0)}'")
    for m in VI_HEADING.finditer(text):
        errors.append(
            f"{rel}: heading must stay English (shared form), not '{m.group(1)}' "
            f"— translate prose only (language={language})"
        )
    if language == "vi":
        body = strip_fences(text)
        # Ignore heading lines for prose-language signal.
        prose = "\n".join(
            ln for ln in body.splitlines() if not ln.lstrip().startswith("#")
        )
        letters = sum(1 for ch in prose if ch.isalpha())
        vi_hits = len(VI_CHAR.findall(prose))
        if letters >= 120 and vi_hits < 8:
            warnings.append(
                f"{rel}: language=vi but little Vietnamese prose "
                f"(vi_chars={vi_hits}) — avoid English-only body"
            )
    if path.name == "TASKS.md":
        cards = list(re.finditer(r"^###\s+T-\d+", text, re.M))
        if cards and "#### Dev context" not in text:
            errors.append(f"{rel}: task cards require #### Dev context")
        elif cards:
            # Each card region should cite Source or explicit none
            parts = re.split(r"(?=^###\s+T-\d+)", text, flags=re.M)
            for part in parts:
                if not re.match(r"^###\s+T-\d+", part):
                    continue
                title = part.splitlines()[0]
                if "#### Dev context" not in part:
                    errors.append(f"{rel}: {title}: missing #### Dev context")
                elif not SOURCE.search(part):
                    errors.append(
                        f"{rel}: {title}: Dev context needs [Source: …] or "
                        "'No specific guidance found.'"
                    )
    if path.name in {"BUSINESS_ANALYSIS.md", "BASIC_DESIGN.md", "DETAIL_DESIGN.md"}:
        # checked at session level for Quick
        pass
    # Soft: huge files
    lines = text.count("\n") + 1
    if lines > 400 and path.name.endswith(".md"):
        warnings.append(f"{rel}: very long ({lines} lines) — consider cutting")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--session", help="Session dir (default: .current)")
    parser.add_argument("--root", type=Path, default=None)
    parser.add_argument("--strict", action="store_true", help="Treat warnings as errors")
    args = parser.parse_args()
    root = args.root.resolve() if args.root else find_root(Path.cwd())
    session = resolve_session(root, args.session)
    language = read_language(root)
    errors: list[str] = []
    warnings: list[str] = []

    quick = path_is_quick(session)
    if quick:
        for banned in (
            "BUSINESS_ANALYSIS.md",
            "BASIC_DESIGN.md",
            "DETAIL_DESIGN.md",
        ):
            if (session / banned).is_file():
                errors.append(
                    f"Path=Quick forbids {banned} — use Lite/Full or delete and use quick-fix"
                )

    for path in sorted(session.glob("*.md")):
        if path.name.startswith("."):
            continue
        lint_file(path, errors, warnings, language=language)

    if not list(session.glob("*.md")):
        print(f"SESSION_LINT_EMPTY session={session}")
        return 0

    if warnings and not args.strict:
        print("SESSION_LINT_WARNINGS")
        for w in warnings:
            print(f"- {w}")
    if errors or (args.strict and warnings):
        print("SESSION_LINT_FAILED")
        print(f"session={session}")
        for err in errors:
            print(f"- {err}")
        if args.strict:
            for w in warnings:
                print(f"- {w}")
        return 1
    print(f"SESSION_LINT_OK session={session}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
