# AGENTS.md

This is a personal knowledge base published as a static website at [datag.is-a.dev/kbase](https://datag.is-a.dev/kbase/) using [Quartz 4](https://quartz.jzhao.xyz/) on GitHub Pages.

## Architecture

Content lives as Markdown files in the repository root and subdirectories. On push to `main`, GitHub Actions clones Quartz v4.5, copies the customization files from `.github/quartz/` into it, then builds the site using the repo root as the content directory.

Quartz customizations:
- `.github/quartz/quartz.config.ts` — site config (title, theme, plugins, ignored paths); RSS feed, sitemap and the Latex plugin are disabled, and `cdnCaching: false` self-hosts the webfonts (fetched at build time) so the site never talks to third parties at runtime
- `.github/quartz/quartz.layout.ts` — page layout and component placement; the footer links the operator (`mailto:`) and the privacy policy (`#de`/`#en` on datag.is-a.dev)
- `.github/quartz/quartz/components/Head.tsx` — copy of the Quartz v4.5.2 `Head` component with the `cdnjs.cloudflare.com` preconnect removed; re-diff against upstream on Quartz upgrades
- `.github/quartz/quartz/components/PasswordGate.tsx` — client-side password gate (rendered via `prescript.js` before the body parses). The password is only stored as a SHA-256 hash in `scripts/passwordGate.inline.ts`. To rotate it, run `printf '%s' '<passwort>' | sha256sum | awk '{print $1}'` and replace `GATE_HASH`. Note: deterrence, not real access control.

The files `.github/`, `.obsidian/`, and `README.md` are excluded from the Quartz build via `ignorePatterns` in `quartz.config.ts`.

## Content Conventions

- Every content file must have a `title` frontmatter field.
- Pages with `draft: true` in frontmatter are excluded from the published site (`Plugin.RemoveDrafts()`).
- Links between notes use Obsidian shortest-path resolution — omit the `.md` extension and full path (e.g., `[Python](dev/python)` or `[Python](python)`).
- Subdirectory index pages are named `index.md` (see `electronics/` for an example).
- The site locale is `de-DE`; date formatting reflects this.

### Content style

- The documented recipes are generally very brief. Most of the time it's only a self-describing header and a code snippet. Bigger code snippets have short inline comments on their own. In some cases there's a very short description as text and in rare cases there are external links.
- The tone is informal – it's my personal knowledge base that is primarily for myself.

## Build

The build runs only via GitHub Actions (no local Quartz install in the repo). To test locally, clone Quartz v4.5.2 separately, copy `.github/quartz/*` into it, then run:

```shell
npx quartz build -d /path/to/this/repo
```

## Local testing

Quartz is not installed in this repo, so a local run needs a separate clone — exactly what GitHub Actions does. Requirements: Node >= 22 and network access (the build fetches the webfonts from Google once, see `cdnCaching: false` above).

```shell
# 1. Clone Quartz v4.5.2 outside the repo (e.g. /tmp/quartz)
git clone https://github.com/jackyzha0/quartz.git /tmp/quartz
cd /tmp/quartz
git checkout v4.5.2
npm install

# 2. Copy the customizations over the upstream files
cp -r /path/to/kbase/.github/quartz/* .

# 3. Build with the repo root as content directory
npx quartz build -d /path/to/kbase
# output lands in ./public

# 4. Serve the result and open http://localhost:8137/
cd public
python3 -m http.server 8137
```

Testing notes:

- The site is password-gated. To see the locked state, use a fresh context (private window or browser devtools "new incognito context"), because after one successful unlock the site stays unlocked in that browser via `localStorage` — a second tab is immediately unlocked as well. The 🔒 button at the bottom right re-locks the site without clearing the stored flag.
- Check the Network tab before unlocking: a locked load must only touch first-party hosts. By design there are no requests to Google, cdnjs, jsdelivr, etc. Since `baseUrl` is `datag.is-a.dev/kbase`, the font URLs baked into `index.css` point to `https://datag.is-a.dev/kbase/static/fonts/…`; during local preview the browser therefore fetches the (self-hosted) fonts from the live domain — expected, not a third-party leak.
- For iterative editing, `npx quartz build --serve -d /path/to/kbase` serves with auto-rebuild at http://localhost:8080.
