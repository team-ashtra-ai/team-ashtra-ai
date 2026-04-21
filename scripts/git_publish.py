#!/usr/bin/env python3

import os
import subprocess
import sys


def run_git(*args, capture_output=False):
    return subprocess.run(
        ["git", *args],
        check=True,
        text=True,
        capture_output=capture_output,
    )


def main():
    branch = run_git("rev-parse", "--abbrev-ref", "HEAD", capture_output=True).stdout.strip()
    publish_branch = os.environ.get("PUBLISH_BRANCH", "main")

    if branch == "HEAD":
        print("Cannot publish from a detached HEAD.", file=sys.stderr)
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

    run_git("fetch", "origin", publish_branch)

    is_fast_forward = subprocess.run(
        ["git", "merge-base", "--is-ancestor", f"origin/{publish_branch}", "HEAD"],
        check=False,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        text=True,
    ).returncode == 0

    if not is_fast_forward:
        print(
            f"Refusing to publish: HEAD does not fast-forward origin/{publish_branch}. "
            f"Rebase or merge origin/{publish_branch} first.",
            file=sys.stderr,
        )
        return 1

    run_git("push", "origin", f"HEAD:{publish_branch}")

    has_upstream = subprocess.run(
        ["git", "rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}"],
        check=False,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        text=True,
    ).returncode == 0

    if has_upstream:
        run_git("push")
    else:
        run_git("push", "-u", "origin", branch)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
