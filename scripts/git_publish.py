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

    run_git("add", "-A", "--", ".", ":(exclude)screenshots")
    run_git("commit", "--allow-empty", "-m", timestamp)

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
