# Frontend CI/CD Setup

## What this workflow does
- CI: Runs `npm ci` and `npm run build` on every `push` and `pull_request`.
- CD: Triggers Netlify deployment on `main` branch pushes after CI succeeds.

## Required GitHub Secret
- `NETLIFY_BUILD_HOOK_URL`
  - Format: `https://api.netlify.com/build_hooks/...`

## How to create NETLIFY_BUILD_HOOK_URL
1. Netlify > your site > `Site configuration`.
2. `Build & deploy` > `Build hooks`.
3. Click `Add build hook`.
4. Copy the generated URL.

## How to add Secret in GitHub
1. GitHub repo > `Settings`.
2. `Secrets and variables` > `Actions`.
3. `New repository secret`.
4. Name: `NETLIFY_BUILD_HOOK_URL`.
5. Value: copied Netlify build hook URL.

## Recommended
- Protect `main` branch and require `Build Check` status before merge.
