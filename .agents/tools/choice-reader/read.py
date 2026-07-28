#!/usr/bin/env python3
"""Read the latest user choice from decision-server JSONL logs."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any


CHOICES_FILE = "choices.jsonl"


def latest_choices_file(sessions_dir: Path) -> Path | None:
    candidates = [
        path
        for path in sessions_dir.glob("*/decision-logs/choices.jsonl")
        if path.is_file()
    ]
    return max(candidates, key=lambda path: path.stat().st_mtime, default=None)


def resolve_choices_file(
    session: Path | None,
    log_dir: Path | None,
    sessions_dir: Path,
) -> Path:
    if log_dir is not None:
        return log_dir.expanduser().resolve() / CHOICES_FILE

    if session is not None:
        path = session.expanduser().resolve()
        if path.is_file():
            return path
        return path / "decision-logs" / CHOICES_FILE

    latest = latest_choices_file(sessions_dir.expanduser().resolve())
    if latest is None:
        raise FileNotFoundError(
            f"no {CHOICES_FILE} found under {sessions_dir}/<session>/decision-logs"
        )
    return latest


def read_choices(path: Path) -> tuple[list[dict[str, Any]], int]:
    records: list[dict[str, Any]] = []
    invalid = 0
    for line in path.read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue
        try:
            value = json.loads(line)
        except json.JSONDecodeError:
            invalid += 1
            continue
        if isinstance(value, dict):
            records.append(value)
        else:
            invalid += 1
    return records, invalid


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Read user choices logged by the local decision server."
    )
    parser.add_argument(
        "session",
        nargs="?",
        type=Path,
        help="Session directory or choices.jsonl path. Defaults to the latest session log.",
    )
    parser.add_argument(
        "--log-dir",
        type=Path,
        help="Directory containing choices.jsonl.",
    )
    parser.add_argument(
        "--sessions-dir",
        type=Path,
        default=Path(".agent-work/sessions"),
        help="Session parent used for automatic discovery (default: .agent-work/sessions).",
    )
    parser.add_argument("--issue-id", help="Return choices for one issue only.")
    parser.add_argument(
        "--all",
        action="store_true",
        help="Return multiple matching choices instead of only the latest.",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=50,
        help="Maximum records returned with --all (default: 50).",
    )
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    if args.session is not None and args.log_dir is not None:
        raise SystemExit("use either SESSION or --log-dir, not both")
    if args.limit < 1:
        raise SystemExit("--limit must be at least 1")

    try:
        path = resolve_choices_file(args.session, args.log_dir, args.sessions_dir)
        records, invalid = read_choices(path)
    except (FileNotFoundError, OSError) as exc:
        print(f"choice-reader: {exc}", file=sys.stderr)
        return 1

    if args.issue_id:
        records = [record for record in records if record.get("issue_id") == args.issue_id]
    if not records:
        suffix = f" for issue {args.issue_id}" if args.issue_id else ""
        print(f"choice-reader: no choices found{suffix} in {path}", file=sys.stderr)
        return 1

    if invalid:
        print(
            f"choice-reader: ignored {invalid} invalid JSONL record(s) in {path}",
            file=sys.stderr,
        )

    result: Any = records[-args.limit :] if args.all else records[-1]
    print(json.dumps(result, ensure_ascii=False, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
