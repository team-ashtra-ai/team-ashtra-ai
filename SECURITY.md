# Security Policy

## Supported Versions

This project is still in active setup, so security fixes are applied on the latest working code rather than on long-lived release branches.

## Reporting A Vulnerability

Please do not open public GitHub issues for security problems.

Report vulnerabilities privately to `team.ashtra.ai@gmail.com` and include:

- a clear description of the issue
- steps to reproduce it
- any affected routes, files, or configuration
- screenshots or proof of concept if relevant

We will review the report, confirm severity, and work on a fix as quickly as possible.

## Secrets And Local Config

- Keep production secrets out of the repo.
- Use local env files such as `apps/web/.env.local` for API keys and credentials.
- Rotate any credential immediately if it has been exposed unintentionally.
