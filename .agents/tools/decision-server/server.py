#!/usr/bin/env python3
"""Local HTML decision server: serve pages, receive events, log choices.

Stdlib only. Intended for visual decision aids under .agent-work/sessions/.
Presentation: Tailwind CDN + one enterprise theme (tailwind-theme.js + styles.css).
"""

from __future__ import annotations

import argparse
import json
import mimetypes
import os
import re
import sys
import threading
import webbrowser
from datetime import datetime, timezone
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.parse import parse_qs, urlparse


CLIENT_JS_NAME = "client.js"
ANIMATE_JS_NAME = "animate.js"
STYLES_CSS_NAME = "styles.css"
TAILWIND_THEME_JS = "tailwind-theme.js"
TAILWIND_CDN = "https://cdn.tailwindcss.com"
ANIME_CDN = "https://cdn.jsdelivr.net/npm/animejs@3.2.2/lib/anime.min.js"
MAX_BODY_BYTES = 64 * 1024


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def append_jsonl(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(payload, ensure_ascii=False, sort_keys=True) + "\n")


def read_jsonl_tail(path: Path, limit: int = 50) -> list[dict[str, Any]]:
    if not path.is_file():
        return []
    lines = path.read_text(encoding="utf-8").splitlines()
    items: list[dict[str, Any]] = []
    for line in lines[-limit:]:
        line = line.strip()
        if not line:
            continue
        try:
            items.append(json.loads(line))
        except json.JSONDecodeError:
            items.append({"raw": line, "parse_error": True})
    return items


class DecisionHandler(BaseHTTPRequestHandler):
    server_version = "SimpleSkillsDecisionServer/0.2"

    @property
    def root(self) -> Path:
        return self.server.root  # type: ignore[attr-defined]

    @property
    def log_dir(self) -> Path:
        return self.server.log_dir  # type: ignore[attr-defined]

    @property
    def client_js(self) -> Path:
        return self.server.client_js  # type: ignore[attr-defined]

    @property
    def styles_css(self) -> Path:
        return self.server.styles_css  # type: ignore[attr-defined]

    @property
    def tailwind_theme_js(self) -> Path:
        return self.server.tailwind_theme_js  # type: ignore[attr-defined]

    @property
    def animate_js(self) -> Path:
        return self.server.animate_js  # type: ignore[attr-defined]

    @property
    def default_file(self) -> str | None:
        return self.server.default_file  # type: ignore[attr-defined]

    def log_message(self, fmt: str, *args: Any) -> None:
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))

    def _send(self, status: int, body: bytes, content_type: str) -> None:
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(body)

    def _send_json(self, status: int, payload: dict[str, Any]) -> None:
        raw = json.dumps(payload, ensure_ascii=False, indent=2).encode("utf-8")
        self._send(status, raw, "application/json; charset=utf-8")

    def _read_json_body(self) -> dict[str, Any] | None:
        length = int(self.headers.get("Content-Length", "0") or "0")
        if length <= 0:
            return {}
        if length > MAX_BODY_BYTES:
            self._send_json(
                HTTPStatus.REQUEST_ENTITY_TOO_LARGE,
                {"ok": False, "error": "body too large"},
            )
            return None
        raw = self.rfile.read(length)
        try:
            data = json.loads(raw.decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError):
            self._send_json(HTTPStatus.BAD_REQUEST, {"ok": False, "error": "invalid json"})
            return None
        if not isinstance(data, dict):
            self._send_json(HTTPStatus.BAD_REQUEST, {"ok": False, "error": "json object required"})
            return None
        return data

    def _inject_assets(self, text: str) -> str:
        snippets: list[str] = []
        if TAILWIND_CDN not in text:
            snippets.append(f'<script src="{TAILWIND_CDN}"></script>')
        if TAILWIND_THEME_JS not in text:
            snippets.append(f'<script src="/{TAILWIND_THEME_JS}"></script>')
        if STYLES_CSS_NAME not in text:
            snippets.append(f'<link rel="stylesheet" href="/{STYLES_CSS_NAME}">')
        if snippets:
            block = "\n".join(snippets) + "\n"
            if "</head>" in text:
                text = text.replace("</head>", block + "</head>", 1)
            else:
                text = block + text

        body_scripts: list[str] = []
        if ANIME_CDN not in text and "anime.min.js" not in text:
            body_scripts.append(f'<script src="{ANIME_CDN}"></script>')
        if ANIMATE_JS_NAME not in text:
            body_scripts.append(f'<script src="/{ANIMATE_JS_NAME}" defer></script>')
        if CLIENT_JS_NAME not in text:
            body_scripts.append(f'<script src="/{CLIENT_JS_NAME}" defer></script>')
        if body_scripts:
            block = "\n" + "\n".join(body_scripts) + "\n"
            if "</body>" in text:
                text = text.replace("</body>", block + "</body>", 1)
            else:
                text += block

        if 'data-ss-theme="' not in text and "data-ss-theme='" not in text:
            if "<html" in text:
                text = text.replace("<html", '<html data-ss-theme="enterprise"', 1)
            elif "<HTML" in text:
                text = text.replace("<HTML", '<HTML data-ss-theme="enterprise"', 1)
        else:
            text = re.sub(
                r'data-ss-theme=(["\'])[^"\']*\1',
                'data-ss-theme="enterprise"',
                text,
                count=1,
            )
        return text

    def do_OPTIONS(self) -> None:  # noqa: N802
        self._send(HTTPStatus.NO_CONTENT, b"", "text/plain")

    def do_GET(self) -> None:  # noqa: N802
        parsed = urlparse(self.path)
        path = parsed.path

        if path in {"/api/health", "/health"}:
            self._send_json(
                HTTPStatus.OK,
                {
                    "ok": True,
                    "root": str(self.root),
                    "log_dir": str(self.log_dir),
                    "theme": "enterprise",
                    "time": utc_now(),
                },
            )
            return

        if path == "/api/choices":
            query = parse_qs(parsed.query)
            limit = int((query.get("limit") or ["50"])[0])
            self._send_json(
                HTTPStatus.OK,
                {
                    "ok": True,
                    "choices": read_jsonl_tail(self.log_dir / "choices.jsonl", limit),
                },
            )
            return

        if path == "/api/events":
            query = parse_qs(parsed.query)
            limit = int((query.get("limit") or ["50"])[0])
            self._send_json(
                HTTPStatus.OK,
                {
                    "ok": True,
                    "events": read_jsonl_tail(self.log_dir / "events.jsonl", limit),
                },
            )
            return

        if path in {"/" + CLIENT_JS_NAME, "/static/" + CLIENT_JS_NAME}:
            body = self.client_js.read_bytes()
            self._send(HTTPStatus.OK, body, "application/javascript; charset=utf-8")
            return

        if path in {"/" + ANIMATE_JS_NAME, "/static/" + ANIMATE_JS_NAME}:
            body = self.animate_js.read_bytes()
            self._send(HTTPStatus.OK, body, "application/javascript; charset=utf-8")
            return

        if path in {"/" + STYLES_CSS_NAME, "/static/" + STYLES_CSS_NAME}:
            body = self.styles_css.read_bytes()
            self._send(HTTPStatus.OK, body, "text/css; charset=utf-8")
            return

        if path in {"/" + TAILWIND_THEME_JS, "/static/" + TAILWIND_THEME_JS}:
            body = self.tailwind_theme_js.read_bytes()
            self._send(HTTPStatus.OK, body, "application/javascript; charset=utf-8")
            return

        rel = path.lstrip("/")
        if not rel:
            if self.default_file:
                rel = self.default_file
            else:
                index = self.root / "index.html"
                rel = "index.html" if index.is_file() else ""

        if not rel:
            listing = sorted(p.name for p in self.root.iterdir() if p.is_file())
            html = "<!doctype html><title>decision server</title><h1>Files</h1><ul>"
            html += "".join(f'<li><a href="/{name}">{name}</a></li>' for name in listing)
            html += f'<li><a href="/{STYLES_CSS_NAME}">{STYLES_CSS_NAME}</a></li>'
            html += f'<li><a href="/{TAILWIND_THEME_JS}">{TAILWIND_THEME_JS}</a></li>'
            html += f'<li><a href="/{ANIMATE_JS_NAME}">{ANIMATE_JS_NAME}</a></li>'
            html += f'<li><a href="/{CLIENT_JS_NAME}">{CLIENT_JS_NAME}</a></li></ul>'
            self._send(HTTPStatus.OK, html.encode("utf-8"), "text/html; charset=utf-8")
            return

        target = (self.root / rel).resolve()
        try:
            target.relative_to(self.root.resolve())
        except ValueError:
            self._send_json(HTTPStatus.FORBIDDEN, {"ok": False, "error": "path escapes root"})
            return
        if not target.is_file():
            self._send_json(HTTPStatus.NOT_FOUND, {"ok": False, "error": "not found"})
            return

        data = target.read_bytes()
        content_type = mimetypes.guess_type(str(target))[0] or "application/octet-stream"
        if target.suffix.lower() in {".html", ".htm"}:
            content_type = "text/html; charset=utf-8"
            text = self._inject_assets(data.decode("utf-8", errors="replace"))
            data = text.encode("utf-8")
        self._send(HTTPStatus.OK, data, content_type)

    def do_POST(self) -> None:  # noqa: N802
        parsed = urlparse(self.path)
        path = parsed.path
        body = self._read_json_body()
        if body is None:
            return

        if path == "/api/event":
            record = {
                "received_at": utc_now(),
                "kind": "event",
                "type": body.get("type") or "unknown",
                "issue_id": body.get("issue_id"),
                "session": body.get("session"),
                "payload": body.get("payload") or body,
                "client": {
                    "user_agent": self.headers.get("User-Agent"),
                    "remote": self.client_address[0],
                },
            }
            append_jsonl(self.log_dir / "events.jsonl", record)
            self._send_json(HTTPStatus.OK, {"ok": True, "logged": "events.jsonl"})
            return

        if path == "/api/choice":
            choice = body.get("choice")
            issue_id = body.get("issue_id")
            if not choice or not issue_id:
                self._send_json(
                    HTTPStatus.BAD_REQUEST,
                    {"ok": False, "error": "issue_id and choice are required"},
                )
                return
            record = {
                "received_at": utc_now(),
                "kind": "choice",
                "issue_id": issue_id,
                "choice": choice,
                "note": body.get("note") or "",
                "session": body.get("session"),
                "meta": body.get("meta") or {},
                "client": {
                    "user_agent": self.headers.get("User-Agent"),
                    "remote": self.client_address[0],
                },
            }
            append_jsonl(self.log_dir / "choices.jsonl", record)
            append_jsonl(
                self.log_dir / "events.jsonl",
                {**record, "kind": "event", "type": "choice"},
            )
            self._send_json(HTTPStatus.OK, {"ok": True, "logged": "choices.jsonl", "record": record})
            return

        self._send_json(HTTPStatus.NOT_FOUND, {"ok": False, "error": "unknown endpoint"})


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Serve decision HTML and log user choices/events to JSONL."
    )
    parser.add_argument(
        "--root",
        type=Path,
        default=Path.cwd(),
        help="Directory of HTML/assets to serve (default: cwd).",
    )
    parser.add_argument(
        "--file",
        default=None,
        help="Default HTML file relative to --root when opening /.",
    )
    parser.add_argument(
        "--log-dir",
        type=Path,
        default=None,
        help="Directory for events.jsonl and choices.jsonl (default: <root>/decision-logs).",
    )
    parser.add_argument("--host", default="127.0.0.1", help="Bind host (default: 127.0.0.1).")
    parser.add_argument("--port", type=int, default=8765, help="Bind port (default: 8765).")
    parser.add_argument(
        "--open",
        action="store_true",
        help="Open the default page in a browser after start.",
    )
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    root = args.root.expanduser().resolve()
    if not root.is_dir():
        raise SystemExit(f"root is not a directory: {root}")

    tools_dir = Path(__file__).resolve().parent
    client_js = tools_dir / CLIENT_JS_NAME
    animate_js = tools_dir / ANIMATE_JS_NAME
    styles_css = tools_dir / STYLES_CSS_NAME
    tailwind_theme_js = tools_dir / TAILWIND_THEME_JS
    if not client_js.is_file():
        raise SystemExit(f"missing client script: {client_js}")
    if not animate_js.is_file():
        raise SystemExit(f"missing animate script: {animate_js}")
    if not styles_css.is_file():
        raise SystemExit(f"missing stylesheet: {styles_css}")
    if not tailwind_theme_js.is_file():
        raise SystemExit(f"missing Tailwind theme: {tailwind_theme_js}")

    log_dir = (args.log_dir or (root / "decision-logs")).expanduser().resolve()
    log_dir.mkdir(parents=True, exist_ok=True)

    default_file = args.file
    if default_file:
        candidate = (root / default_file).resolve()
        try:
            candidate.relative_to(root)
        except ValueError as exc:
            raise SystemExit("--file must stay under --root") from exc
        if not candidate.is_file():
            raise SystemExit(f"--file not found: {candidate}")

    server = ThreadingHTTPServer((args.host, args.port), DecisionHandler)
    server.root = root
    server.log_dir = log_dir
    server.client_js = client_js
    server.animate_js = animate_js
    server.styles_css = styles_css
    server.tailwind_theme_js = tailwind_theme_js
    server.default_file = default_file

    url_path = f"/{default_file}" if default_file else "/"
    url = f"http://{args.host}:{args.port}{url_path}"
    print(f"Serving {root}")
    print(f"Logs    {log_dir}")
    print("Theme   enterprise (Tailwind CDN)")
    print(f"Open    {url}")
    print('POST /api/choice  {"issue_id","choice","note?"}')
    print('POST /api/event   {"type","issue_id?","payload?"}')
    print("GET  /api/choices")
    print("Ctrl+C to stop.")

    if args.open:
        threading.Timer(0.4, lambda: webbrowser.open(url)).start()

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    os.environ.setdefault("NO_PROXY", "127.0.0.1,localhost")
    raise SystemExit(main())
