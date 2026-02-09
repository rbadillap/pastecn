import * as vscode from 'vscode'
import * as path from 'path'
import { createSnippet } from '../api/client'
import { getConfig } from '../utils/config'

export async function shareSelection() {
  const editor = vscode.window.activeTextEditor
  if (!editor) return

  const selection = editor.selection
  const content = editor.document.getText(selection)
  if (!content) {
    vscode.window.showWarningMessage('No text selected')
    return
  }

  await share(content, editor.document.fileName, editor.document.languageId)
}

export async function shareFile() {
  const editor = vscode.window.activeTextEditor
  if (!editor) return

  const content = editor.document.getText()
  await share(content, editor.document.fileName, editor.document.languageId)
}

interface ExpirationOption {
  label: string
  value: '1h' | '24h' | '7d' | '30d' | 'never'
}

async function share(content: string, filePath: string, languageId: string) {
  const config = getConfig()
  const fileName = path.basename(filePath)

  const expirationOptions: ExpirationOption[] = [
    { label: 'Never expire', value: 'never' },
    { label: '1 hour', value: '1h' },
    { label: '24 hours', value: '24h' },
    { label: '7 days', value: '7d' },
    { label: '30 days', value: '30d' },
  ]

  const expiration = await vscode.window.showQuickPick(expirationOptions, {
    placeHolder: 'Select expiration time',
  })
  if (!expiration) return

  try {
    const result = await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Creating snippet...',
      },
      async () =>
        createSnippet({
          name: fileName,
          type: 'file',
          files: [{ path: fileName, content }],
          expiresIn: expiration.value,
        })
    )

    await vscode.env.clipboard.writeText(result.url)

    const action = await vscode.window.showInformationMessage(
      'Snippet created! URL copied to clipboard.',
      'Open in Browser'
    )
    if (action === 'Open in Browser') {
      vscode.env.openExternal(vscode.Uri.parse(result.url))
    }
  } catch (error) {
    vscode.window.showErrorMessage(
      `Failed: ${error instanceof Error ? error.message : error}`
    )
  }
}
