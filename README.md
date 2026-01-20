# pastecn

Create shareable shadcn/ui registry URLs. Paste your code, get a registry URL compatible with shadcn CLI.

![hero](app/opengraph-image.jpg)

## Overview

**pastecn** converts code snippets into shadcn registry-compatible JSON endpoints. You paste code, specify the type (component, hook, lib, or file), and get a URL that works directly with `shadcn CLI`.

## pastebin + shadcn = pastecn

1. Paste your code in the editor
2. Select the type: component, hook, lib, or file
3. Set the target filename/path
4. Click Create to generate the registry URL

### Installing a snippet

After creating the snippet, you can install it using the namespace:

```sh
npx shadcn@latest add @pastecn/{id}
```

Or using the full URL:

```sh
npx shadcn@latest add https://pastecn.com/r/{id}
```

## Contributing

Contributions welcome. Open an issue,  submit a pull requests, share your idea!

## License

Licensed under the [MIT License](LICENSE.md)
