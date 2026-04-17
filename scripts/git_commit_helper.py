#!/usr/bin/env python3

import argparse
import datetime as dt
import subprocess
import sys


def run(cmd: list[str]) -> None:
    completed = subprocess.run(cmd)
    if completed.returncode != 0:
        sys.exit(completed.returncode)


def capture(cmd: list[str]) -> str:
    completed = subprocess.run(cmd, check=True, capture_output=True, text=True)
    return completed.stdout.strip()


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Stage changes and create a timestamped git commit."
    )
    parser.add_argument(
        "-m",
        "--message",
        help="Optional custom commit message. Defaults to a timestamped message.",
    )
    parser.add_argument(
        "--prefix",
        default="Checkpoint",
        help="Prefix for the auto-generated commit message.",
    )
    parser.add_argument(
        "--allow-empty",
        action="store_true",
        help="Allow creating an empty commit.",
    )
    parser.add_argument(
        "--no-add",
        action="store_true",
        help="Skip `git add -A` and commit only what is already staged.",
    )
    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()

    if not args.no_add:
        run(["git", "add", "-A"])

    now = dt.datetime.now().astimezone()
    timestamp = now.strftime("%Y-%m-%d %H:%M:%S %Z")
    message = args.message or f"{args.prefix} {timestamp}"

    has_staged_changes = subprocess.run(
        ["git", "diff", "--cached", "--quiet"]
    ).returncode == 1

    if not has_staged_changes and not args.allow_empty:
        print("No staged changes to commit. Use --allow-empty to create an empty commit.")
        sys.exit(1)

    commit_cmd = ["git", "commit", "-m", message]
    if args.allow_empty:
        commit_cmd.append("--allow-empty")

    run(commit_cmd)

    commit_hash = capture(["git", "rev-parse", "--short", "HEAD"])
    print(f"Created commit {commit_hash}: {message}")


if __name__ == "__main__":
    main()
