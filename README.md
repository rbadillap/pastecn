# pastecn

**pastebin + shadcn = pastecn**

Create shareable shadcn/ui registry URLs. Paste your code, get a URL that works directly with `npx shadcn@latest add`.

![hero](app/opengraph-image.jpg)

## Features

- **Instant Registry URLs** - Convert any code into shadcn-compatible endpoints
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

## Contributing

Contributions welcome. Open an issue,  submit a pull requests, share your idea!

## License

Licensed under the [MIT License](LICENSE.md)
