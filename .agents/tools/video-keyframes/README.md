# Video keyframes

Sample a video at a fixed interval so an agent can inspect selected frames as
ordinary images. The tool writes:

- `frame-0001.jpg`, `frame-0002.jpg`, ...
- `manifest.json` with source metadata and approximate timestamps
- `KEYFRAMES.md` as a compact evidence index

## Requirement

`ffmpeg` and `ffprobe` must be available on `PATH`. No Python package or
`node_modules` installation is required.

## Usage

```bash
# Sample every five seconds (default)
python .agents/tools/video-keyframes/extract.py evidence/bug.webm

# Sample every two seconds into an explicit evidence directory
python .agents/tools/video-keyframes/extract.py evidence/bug.webm \
  --interval 2 \
  --max-frames 40 \
  --output-dir .agent-work/sessions/Task-1-example/video-evidence
```

After extraction, read `KEYFRAMES.md`, `manifest.json`, and only the frames
needed for the investigation or test evidence.

Sampling can miss brief transitions and does not analyze audio. Use the source
video when exact timing or continuous motion matters.
