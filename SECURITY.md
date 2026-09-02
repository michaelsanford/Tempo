# Security Policy

## Supported Versions

Only the **latest commit on `main` (HEAD / latest)** of Tempo receives security fixes and updates. Historic releases or older builds are not supported or patched.

| Version       | Supported              |
| ------------- | ---------------------- |
| HEAD / latest | :white_check_mark: Yes |
| Historic      | :x: No                 |

## Reporting a Vulnerability

Please **do not** open public GitHub issues for security vulnerabilities.

Instead, please submit reports confidentially via [GitHub Security Advisories](https://github.com/michaelsanford/Tempo/security/advisories/new).

Please include:

- A description of the issue and potential security impact.
- Clear steps to reproduce or a proof-of-concept.
- The environment (browser, OS, device, commit SHA).

## Response & Scope

- **Scope**: Covers the client-side SvelteKit application and PWA assets in this repository. Tempo runs entirely in the user's web browser without external data collection or backend user accounts.
- **Timeline**: Security reports will be acknowledged on a best-effort basis.

## Bug Bounty

There is **no bug bounty program**. Tempo is a personal, non-commercial open-source project maintained without financial compensation.

## Credit

Reporters of validated vulnerabilities will be **publicly credited by name (or GitHub handle)** in release notes and security advisory notices, unless anonymity is explicitly requested.
