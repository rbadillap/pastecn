# Changelog

All notable changes to pastecn will be documented in this file.

---

## [Unreleased]

---

## 2026-02-09 — VS Code Extension

Share code snippets directly from your editor.

### Features

- **Share Selection** — Select code and share with `Cmd+Alt+S` (Mac) or `Ctrl+Alt+S` (Windows/Linux)
- **Share File** — Share the entire active file
- **Open Snippet** — Open a snippet by ID or URL directly from VS Code
- **Context Menu** — Right-click to share selected code
- **Expiration Options** — Choose expiration time when sharing

### Compatibility

- VS Code
- Cursor
- VSCodium
- Windsurf
- Any VS Code fork

### Installation

Available on [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=pastecn.pastecn) and [Open VSX](https://open-vsx.org/extension/pastecn/pastecn).

---

## 2026-02-06 — Link Expiration

Set automatic expiration times for snippets.

### Features

- **Flexible TTL** — Choose from 1 hour, 24 hours, 7 days, 30 days, or never expire
- **Automatic Cleanup** — Expired snippets become inaccessible automatically
- **Expiration Visibility** — Countdown timer displayed on snippet preview page
- **Combine with Password** — Works seamlessly with password protection

### Technical Details

- Expiration enforced at read time
- ISO 8601 timestamps stored in snippet metadata
- Returns 404 Not Found for expired snippets

---

## 2025-01-27 — AI SDK Tools

AI SDK tools for creating and reading pastecn snippets programmatically.

### Features

- **createSnippet** — Create snippets from AI agents with support for multiple files, types, and password protection
- **getSnippet** — Retrieve snippet content by ID, including password-protected snippets

### Installation

```bash
npx shadcn@latest add @pastecn/ai-sdk
```

### Use Cases

- Coding assistants
- Component generators
- Code review bots
- Automated workflows

---

## 2025-01-23 — Password Protection

Optional password protection for code snippets with native shadcn CLI authentication support.

### Features

- **Auto-Generated Passwords** — Secure 16-character passwords created automatically
- **Web Access** — Inline password unlock in the browser
- **CLI Integration** — Compatible with shadcn CLI registry authentication
- **Rate Limiting** — 5 attempts per 15 minutes per IP via Vercel Firewall

### Security

- Bcrypt hashing (cost factor 10)
- httpOnly cookies for session management
- Configurable session duration (default: 24 hours)
- No plaintext passwords stored or logged

### CLI Configuration

```json
{
  "registries": {
    "@pastecn": {
      "url": "https://pastecn.com/r/{name}.json",
      "headers": {
        "Authorization": "Bearer ${PASTE_PASSWORD}"
      }
    }
  }
}
```

---

## 2025-01-20 — Multi-file Blocks

Support for `registry:block` type to share complex multi-file components.

### Features

- **Multiple Files** — Package components, hooks, utilities, and types together
- **Single URL** — One registry URL for the entire block
- **CLI Compatible** — Install all files with one `shadcn add` command

### Use Cases

- Authentication forms with validation hooks
- Data tables with filters and pagination
- Dashboard widgets with data fetching
- Form builders with validation schemas

---

## 2025-01-15 — Initial Release

Create shareable shadcn/ui registry URLs.

### Features

- **Instant Registry URLs** — Convert any code into shadcn-compatible endpoints
- **Multiple Types** — Support for component, hook, lib, and file types
- **Zero Config** — No auth, no signup, just paste and share
- **Immutable URLs** — Once created, snippets never change
- **Namespace Shorthand** — Install with `@pastecn/{id}`
