import os
import subprocess
import sys


def run_git(*args, capture_output=False, check=True):
    return subprocess.run(
        ["git", *args],
        check=check,
        text=True,
        capture_output=capture_output,
    )


def git_output(*args):
    return run_git(*args, capture_output=True).stdout.strip()


def main():
    try:
        repository_root = git_output("rev-parse", "--show-toplevel")
    except subprocess.CalledProcessError:
        print("This command must be run inside a Git repository.", file=sys.stderr)
        return 1

    os.chdir(repository_root)
    branch = git_output("rev-parse", "--abbrev-ref", "HEAD")

    if branch == "HEAD":
        print("Cannot publish from a detached HEAD.", file=sys.stderr)
        return 1

    upstream = run_git(
        "rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}", capture_output=True, check=False
    )
    if upstream.returncode == 0:
        remote, remote_branch = upstream.stdout.strip().split("/", 1)
    else:
        remote, remote_branch = "origin", branch

    # Incorporate remote-only commits before staging local work.  --ff-only
    # prevents this helper from silently creating merge commits or resolving
    # conflicts on the caller's behalf.
    run_git("fetch", remote, remote_branch)
    run_git("merge", "--ff-only", f"{remote}/{remote_branch}")

    tz = os.environ.get("TZ", "America/Sao_Paulo")
    timestamp = subprocess.run(
        ["date", "+%Y-%m-%d %H:%M:%S %Z"],
        check=True,
        text=True,
        capture_output=True,
        env={**os.environ, "TZ": tz},
    ).stdout.strip()

    run_git("add", "-A", "--", ".", ":(exclude)screenshots/**")
    run_git("commit", "--allow-empty", "-m", timestamp)

    run_git("push", "-u", remote, f"HEAD:{remote_branch}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
