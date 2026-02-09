import { getConfig } from '../utils/config'

interface CreateSnippetInput {
  name: string
  type: 'file' | 'component' | 'hook' | 'lib'
  files: Array<{ path: string; content: string }>
  expiresIn?: '1h' | '24h' | '7d' | '30d' | 'never'
}

interface CreateSnippetResult {
  id: string
  url: string
  registryUrl: string
}

export async function createSnippet(
  input: CreateSnippetInput
): Promise<CreateSnippetResult> {
  const config = getConfig()
  const response = await fetch(`${config.baseUrl}/api/v1/snippets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    const error = (await response.json().catch(() => ({}))) as {
      message?: string
    }
    throw new Error(
      error.message || `Failed to create snippet (${response.status})`
    )
  }

  return response.json() as Promise<CreateSnippetResult>
}
