# Copilot Instructions

This is a personal knowledge base published as a static website at [datag.is-a.dev/kbase](https://datag.is-a.dev/kbase/) using [Quartz 4](https://quartz.jzhao.xyz/) on GitHub Pages.

## Architecture

Content lives as Markdown files in the repository root and subdirectories. On push to `main`, GitHub Actions clones Quartz v4.5, copies the customization files from `.github/quartz/` into it, then builds the site using the repo root as the content directory.

Quartz customizations:
- `.github/quartz/quartz.config.ts` — site config (title, theme, plugins, ignored paths)
- `.github/quartz/quartz.layout.ts` — page layout and component placement

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
