# pastecn

Create shareable shadcn/ui registry URLs. Paste your code, get a registry URL compatible with shadcn CLI.

**Live:** [pastecn.vercel.app](https://pastecn.vercel.app)

## Overview

**pastecn** converts code snippets into shadcn registry-compatible JSON endpoints. You paste code, specify the type (component, hook, lib, or file), and get a URL that works directly with `shadcn CLI`.

## pastebin + shadcn = pastecn

1. Paste your code in the editor
2. Select the type: component, hook, lib, or file
3. Set the target filename/path
4. Click Create to generate the registry URL

### Installing a snippet

```sh
npx shadcn@latest add https://pastecn.vercel.app/r/{id}
```

## Contributing

Contributions welcome. Open an issue,  submit a pull requests, share your idea!

## License

Licensed under the [MIT License](LICENSE.md)