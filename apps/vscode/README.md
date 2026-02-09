# pastecn

Turn any code into shareable shadcn registry URLs. Paste code, get a URL, share it instantly.

## Features

- **Share Selection** — Share selected code with a keyboard shortcut
- **Share File** — Share the entire active file
- **Open Snippet** — Open a snippet by ID or URL
- **Context Menu** — Right-click to share selected code
- **Expiration Options** — Choose from 1h, 24h, 7d, 30d, or never

## Commands

| Command | Description |
|---------|-------------|
| `pastecn: Share Selection` | Share the selected code |
| `pastecn: Share File` | Share the entire file |
| `pastecn: Open Snippet` | Open a snippet by ID or URL |

## Keyboard Shortcuts

| Shortcut | Command |
|----------|---------|
| `Cmd+Alt+S` (Mac) | Share Selection |
| `Ctrl+Alt+S` (Windows/Linux) | Share Selection |

## Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `pastecn.baseUrl` | `https://pastecn.com` | Base URL for pastecn instance |
| `pastecn.defaultExpiration` | `never` | Default expiration (1h, 24h, 7d, 30d, never) |

## Self-Hosted

```json
{
  "pastecn.baseUrl": "https://your-instance.com"
}
```

## Development

```bash
pnpm dev        # Watch mode
pnpm build      # Build extension
pnpm package    # Create .vsix
```

## License

MIT
