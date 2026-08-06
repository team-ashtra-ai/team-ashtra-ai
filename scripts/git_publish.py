#!/usr/bin/env python3
"""Commit all project changes (including an empty checkpoint) and push them."""

from __future__ import annotations

from datetime import datetime
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]


def git(*args: str, capture: bool = False) -> subprocess.CompletedProcess[str]:
    return subprocess.run(["git", *args], cwd=ROOT, text=True, capture_output=capture, check=True)


def main() -> int:
    try:
        branch = git("branch", "--show-current", capture=True).stdout.strip()
        if not branch:
            raise RuntimeError("Cannot publish from a detached HEAD")
        timestamp = datetime.now().astimezone().strftime("%Y-%m-%d %H:%M:%S %Z")
        git("add", "-A")
        git("commit", "--allow-empty", "-m", f"Site update — {timestamp}")
        upstream = subprocess.run(["git", "rev-parse", "--verify", "@{u}"], cwd=ROOT, capture_output=True).returncode == 0
        git("push", *( () if upstream else ("-u", "origin", branch) ))
        print(f"Published {branch}: Site update — {timestamp}")
        return 0
    except (subprocess.CalledProcessError, RuntimeError) as error:
        print(f"Publish failed: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
