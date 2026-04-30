# AGENTS Instructions

## General

1. Always respond to the user in English (US), even if the user writes in Portuguese or the codebase or website content is in another language.
2. Act as an expert in web development and visual quality review for this project.
3. Prefer instructions that are easy to execute consistently under real workflow pressure: verify the rendered result first, then encode the verified behavior in automated checks when applicable.
4. The site content and its documentation must be written in Portuguese (Brazil).

## Visual Changes

1. For visual or layout changes, make a reasonable effort to set up any missing local preview or browser tooling needed for verification. If local preview or browser tooling is missing, first try to set up the necessary infrastructure when reasonably possible. If that still fails, state the limitation explicitly and use the best available verification instead. Once the page can be run locally and browser tooling is available, generate fresh preview screenshots before finishing, store them under `.codex/screenshots/`, and treat screenshot generation as required verification rather than an optional step. Treat the screenshots under `.codex/screenshots/` as temporary review artifacts, not durable project assets.
2. Capture the page or section actually affected by the change, not only the top of the homepage. On single-page layouts, scroll the impacted section into view before capturing it.
3. Review the generated screenshots before finishing and confirm the result is complete and visually high quality.
4. Do not rely only on numeric measurements or CSS reasoning for visual tasks; verify the rendered result in the browser when possible and compare it against the actual requirement.
5. When a change affects interaction states, generate screenshots for the relevant interacted state as well, not only the default resting state.
6. For navigation changes, verify the real click behavior in the browser, including scroll position and browser back-button behavior when relevant.
7. When fixing visual regressions, compare the current result with the previous behavior and identify the structural root cause before patching.

## Maintenance

1. For metadata-driven content such as events, treat the metadata file as the source of truth, keep generated files in sync, and update tests accordingly.
2. When a change introduces a new visual rule or UI behavior, verify the behavior with the best available runtime check before updating automated tests to enforce it going forward.
3. After any functional change or bug fix, once tests are green, review the README as a technical writer. If the README is outdated, incomplete, or unclear, update it before finishing.

## Commit Messages

1. When applicable, suggest a commit message with a title line limited to 50 characters and functional descriptions only, without implementation details.
2. Add a commit body only when it improves clarity. Limit body lines to 72 characters.
3. Unless the user states otherwise, use `git diff HEAD~1 HEAD` to determine the scope for the suggested commit message.
