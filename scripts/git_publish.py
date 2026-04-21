#!/usr/bin/env python3

import os
import subprocess
import sys

PUBLISH_BRANCH = "main"


def run_git(*args, capture_output=False):
    return subprocess.run(
        ["git", *args],
        check=True,
        text=True,
        capture_output=capture_output,
    )


def main():
    branch = run_git("rev-parse", "--abbrev-ref", "HEAD", capture_output=True).stdout.strip()

    if branch == "HEAD":
        print("Cannot publish from a detached HEAD.", file=sys.stderr)
        return 1

    if branch != PUBLISH_BRANCH:
        print(
            f"Publish must be run from the {PUBLISH_BRANCH} branch. "
            f"Current branch: {branch}.",
            file=sys.stderr,
        )
        return 1

    tz = os.environ.get("TZ", "America/Sao_Paulo")
    timestamp = subprocess.run(
        ["date", "+%Y-%m-%d %H:%M:%S %Z"],
        check=True,
        text=True,
        capture_output=True,
        env={**os.environ, "TZ": tz},
    ).stdout.strip()

    run_git("add", "-A")
    run_git("commit", "--allow-empty", "-m", timestamp)

    run_git("fetch", "origin", PUBLISH_BRANCH)

    is_fast_forward = subprocess.run(
        ["git", "merge-base", "--is-ancestor", f"origin/{PUBLISH_BRANCH}", "HEAD"],
        check=False,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        text=True,
    ).returncode == 0

    if not is_fast_forward:
        print(
            f"Refusing to publish: HEAD does not fast-forward origin/{PUBLISH_BRANCH}. "
            f"Rebase or merge origin/{PUBLISH_BRANCH} first.",
            file=sys.stderr,
        )
        return 1

    run_git("push", "-u", "origin", PUBLISH_BRANCH)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
