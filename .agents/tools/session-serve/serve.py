#!/usr/bin/env python3
"""Find a visual decision session and launch the shared decision server."""

from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path


DEFAULT_FILE = "VISUAL_DECISION.html"


def latest_session(sessions_dir: Path, filename: str) -> Path | None:
    candidates = [
        path.parent
        for path in sessions_dir.glob(f"*/{filename}")
        if path.is_file()
    ]
    return max(
        candidates,
        key=lambda session: (session / filename).stat().st_mtime,
        default=None,
    )


def resolve_session(
    value: Path | None,
    sessions_dir: Path,
    filename: str,
) -> tuple[Path, str]:
    sessions_dir = sessions_dir.expanduser().resolve()
    if value is None:
        session = latest_session(sessions_dir, filename)
        if session is None:
            raise FileNotFoundError(
                f"no {filename} found under {sessions_dir}/<session>"
            )
        return session, filename

    candidate = value.expanduser()
    if not candidate.exists() and len(candidate.parts) == 1:
        candidate = sessions_dir / candidate
    candidate = candidate.resolve()

    if candidate.is_file():
        return candidate.parent, candidate.name
    if not candidate.is_dir():
        raise FileNotFoundError(f"session does not exist: {candidate}")
    page = candidate / filename
    if not page.is_file():
        raise FileNotFoundError(f"{filename} not found in session: {candidate}")
    return candidate, filename


def decision_server_path() -> Path:
    return Path(__file__).resolve().parents[1] / "decision-server" / "server.py"


def build_command(
    server: Path,
    session: Path,
    filename: str,
    host: str,
    port: int,
    log_dir: Path | None,
    open_browser: bool,
) -> list[str]:
    destination = (log_dir or (session / "decision-logs")).expanduser().resolve()
    command = [
        sys.executable,
        str(server),
        "--root",
        str(session),
        "--file",
        filename,
        "--log-dir",
        str(destination),
        "--host",
        host,
        "--port",
        str(port),
    ]
    if open_browser:
        command.append("--open")
    return command


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Serve a session's visual decision page with minimal path typing."
    )
    parser.add_argument(
        "session",
        nargs="?",
        type=Path,
        help="Session directory, session name, or HTML file. Defaults to latest.",
    )
    parser.add_argument(
        "--sessions-dir",
        type=Path,
        default=Path(".agent-work/sessions"),
        help="Session parent used for lookup (default: .agent-work/sessions).",
    )
    parser.add_argument(
        "--file",
        default=DEFAULT_FILE,
        help=f"Decision filename inside a session (default: {DEFAULT_FILE}).",
    )
    parser.add_argument("--log-dir", type=Path, help="Override decision log directory.")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8765)
    parser.add_argument(
        "--no-open",
        action="store_true",
        help="Do not open the page in the default browser.",
    )
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    try:
        session, filename = resolve_session(
            args.session, args.sessions_dir, args.file
        )
    except (FileNotFoundError, OSError) as exc:
        print(f"session-serve: {exc}", file=sys.stderr)
        return 1

    server = decision_server_path()
    if not server.is_file():
        print(f"session-serve: decision server not found: {server}", file=sys.stderr)
        return 1

    command = build_command(
        server=server,
        session=session,
        filename=filename,
        host=args.host,
        port=args.port,
        log_dir=args.log_dir,
        open_browser=not args.no_open,
    )
    print(f"Session  {session}", flush=True)
    try:
        return subprocess.call(command)
    except KeyboardInterrupt:
        return 130


if __name__ == "__main__":
    raise SystemExit(main())
