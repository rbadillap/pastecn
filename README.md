# pastecn

![hero](app/opengraph-image.jpg)

**pastebin + shadcn = pastecn**

Create shareable shadcn/ui registry URLs. Paste your code, get a URL that works directly with `npx shadcn@latest add`.

<p align="center">
  <a href="https://pastecn.com/docs/api">API</a> ‎｜
  <a href="https://pastecn.com/blog">Blog</a> ｜
  <a href="https://pastecn.com/use-cases/shadcn-registry-urls">Use Cases</a>
</p>

## Features

- **Instant Registry URLs** - Convert any code into shadcn-compatible endpoints
- **Password Protection** - Optional password protection for private code sharing
- **Multi-file Support** - Create blocks with multiple files (components + hooks + libs)
- **Auto-save Drafts** - localStorage persistence keeps your work safe across page refreshes
- **Multiple Types** - Support for components, hooks, libs, and arbitrary files
- **Zero Config** - No auth, no signup, just paste and share
- **Immutable URLs** - Once created, snippets never change (perfect for sharing)

## Quick Start

1. Paste your code at [pastecn.com](https://pastecn.com)
2. Select type (component/hook/lib/file) and set filename
3. Click "Create Snippet" to get your registry URL

### Install a snippet

```sh
# Using namespace (shorter)
npx shadcn@latest add @pastecn/{id}

# Using full URL
npx shadcn@latest add https://pastecn.com/r/{id}
```

**Learn more:**
- [Password-Protected Snippets](https://pastecn.com/blog/password-protected-snippets) - Share code with selective access
- [Understanding Registry Blocks](https://pastecn.com/blog/understanding-shadcn-registry-blocks) - Multi-file components explained

## Self-Hosting

Want to run your own instance? See [docs/VERCEL.md](docs/VERCEL.md) for deployment instructions.

## Contributing

Contributions welcome. Open an issue,  submit a pull requests, share your idea!

## License

Licensed under the [MIT License](LICENSE.md)
