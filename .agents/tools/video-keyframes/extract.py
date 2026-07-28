#!/usr/bin/env python3
"""Extract periodically sampled video frames for agent visual analysis."""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


MANIFEST_NAME = "manifest.json"
REPORT_NAME = "KEYFRAMES.md"


def require_binary(name: str) -> str:
    path = shutil.which(name)
    if path is None:
        raise RuntimeError(
            f"{name} is required but was not found on PATH; install FFmpeg first"
        )
    return path


def probe_video(ffprobe: str, source: Path) -> dict[str, Any]:
    command = [
        ffprobe,
        "-v",
        "error",
        "-select_streams",
        "v:0",
        "-show_entries",
        "format=duration:stream=width,height,avg_frame_rate,codec_name",
        "-of",
        "json",
        str(source),
    ]
    result = subprocess.run(command, capture_output=True, text=True, check=True)
    data = json.loads(result.stdout)
    stream = (data.get("streams") or [{}])[0]
    video_format = data.get("format") or {}
    duration = video_format.get("duration")
    return {
        "duration_seconds": float(duration) if duration is not None else None,
        "width": stream.get("width"),
        "height": stream.get("height"),
        "frame_rate": stream.get("avg_frame_rate"),
        "codec": stream.get("codec_name"),
    }


def prepare_output(output_dir: Path, overwrite: bool) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    existing = list(output_dir.iterdir())
    if existing and not overwrite:
        raise FileExistsError(
            f"output directory is not empty: {output_dir}; use --overwrite"
        )
    if overwrite:
        for pattern in ("frame-*.jpg", "frame-*.png"):
            for path in output_dir.glob(pattern):
                path.unlink()
        for name in (MANIFEST_NAME, REPORT_NAME):
            path = output_dir / name
            if path.is_file():
                path.unlink()


def build_ffmpeg_command(
    ffmpeg: str,
    source: Path,
    output_pattern: Path,
    interval: float,
    max_frames: int,
    width: int,
    start: float,
    end: float | None,
    overwrite: bool,
) -> list[str]:
    command = [ffmpeg, "-hide_banner", "-loglevel", "error"]
    command.append("-y" if overwrite else "-n")
    if start > 0:
        command.extend(["-ss", str(start)])
    command.extend(["-i", str(source)])
    if end is not None:
        command.extend(["-t", str(end - start)])
    filters = [f"fps=1/{interval}"]
    if width > 0:
        filters.append(f"scale=min({width}\\,iw):-2")
    command.extend(
        [
            "-vf",
            ",".join(filters),
            "-frames:v",
            str(max_frames),
            "-q:v",
            "2",
            str(output_pattern),
        ]
    )
    return command


def write_artifacts(
    source: Path,
    output_dir: Path,
    frames: list[Path],
    interval: float,
    start: float,
    metadata: dict[str, Any],
) -> None:
    entries = [
        {
            "index": index,
            "file": frame.name,
            "sampled_at_seconds": round(start + (index - 1) * interval, 3),
        }
        for index, frame in enumerate(frames, start=1)
    ]
    manifest = {
        "source": str(source),
        "generated_at": datetime.now(timezone.utc).replace(microsecond=0).isoformat(),
        "sampling": {
            "interval_seconds": interval,
            "start_seconds": start,
            "frame_count": len(entries),
        },
        "video": metadata,
        "frames": entries,
    }
    (output_dir / MANIFEST_NAME).write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )

    rows = [
        "# Video keyframes",
        "",
        f"- Source: `{source}`",
        f"- Interval: {interval:g} seconds",
        f"- Frames: {len(entries)}",
        "",
        "| # | Approx. time | Frame |",
        "|---:|---:|---|",
    ]
    rows.extend(
        f"| {entry['index']} | {entry['sampled_at_seconds']:.3f}s | "
        f"[`{entry['file']}`](./{entry['file']}) |"
        for entry in entries
    )
    rows.extend(
        [
            "",
            "> Sampling can miss brief transitions between frames. Treat timestamps as",
            "> approximate and inspect the source clip when exact timing matters.",
            "",
        ]
    )
    (output_dir / REPORT_NAME).write_text("\n".join(rows), encoding="utf-8")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Sample video frames at a fixed interval for visual analysis."
    )
    parser.add_argument("video", type=Path, help="Input video supported by FFmpeg.")
    parser.add_argument(
        "--output-dir",
        type=Path,
        help="Output directory (default: <video-stem>-keyframes beside the video).",
    )
    parser.add_argument(
        "--interval",
        type=float,
        default=5.0,
        help="Seconds between sampled frames (default: 5).",
    )
    parser.add_argument(
        "--max-frames",
        type=int,
        default=60,
        help="Maximum number of frames to extract (default: 60).",
    )
    parser.add_argument(
        "--width",
        type=int,
        default=1280,
        help="Maximum output width; 0 keeps source width (default: 1280).",
    )
    parser.add_argument("--start", type=float, default=0.0, help="Start time in seconds.")
    parser.add_argument("--end", type=float, help="End time in seconds.")
    parser.add_argument(
        "--format",
        choices=("jpg", "png"),
        default="jpg",
        help="Output image format (default: jpg).",
    )
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Replace previously generated keyframe artifacts in the output directory.",
    )
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    source = args.video.expanduser().resolve()
    output_dir = (
        args.output_dir.expanduser().resolve()
        if args.output_dir
        else source.with_name(f"{source.stem}-keyframes")
    )

    if not source.is_file():
        print(f"video-keyframes: input is not a file: {source}", file=sys.stderr)
        return 1
    if args.interval <= 0 or args.max_frames < 1 or args.width < 0:
        print(
            "video-keyframes: interval must be > 0, max-frames >= 1, width >= 0",
            file=sys.stderr,
        )
        return 1
    if args.start < 0 or (args.end is not None and args.end <= args.start):
        print(
            "video-keyframes: start must be >= 0 and end must be greater than start",
            file=sys.stderr,
        )
        return 1

    try:
        ffmpeg = require_binary("ffmpeg")
        ffprobe = require_binary("ffprobe")
        prepare_output(output_dir, args.overwrite)
        metadata = probe_video(ffprobe, source)
        output_pattern = output_dir / f"frame-%04d.{args.format}"
        command = build_ffmpeg_command(
            ffmpeg=ffmpeg,
            source=source,
            output_pattern=output_pattern,
            interval=args.interval,
            max_frames=args.max_frames,
            width=args.width,
            start=args.start,
            end=args.end,
            overwrite=args.overwrite,
        )
        subprocess.run(command, check=True)
    except (
        FileExistsError,
        OSError,
        RuntimeError,
        subprocess.CalledProcessError,
        json.JSONDecodeError,
    ) as exc:
        print(f"video-keyframes: {exc}", file=sys.stderr)
        return 1

    frames = sorted(output_dir.glob(f"frame-*.{args.format}"))
    if not frames:
        print("video-keyframes: FFmpeg produced no frames", file=sys.stderr)
        return 1
    write_artifacts(source, output_dir, frames, args.interval, args.start, metadata)
    print(output_dir / REPORT_NAME)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
