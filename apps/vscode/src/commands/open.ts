import * as vscode from 'vscode'
import { getConfig } from '../utils/config'

export async function openSnippet() {
  const input = await vscode.window.showInputBox({
    prompt: 'Enter snippet ID or URL',
    placeHolder: 'xK9mN2pL or https://pastecn.com/p/xK9mN2pL',
  })
  if (!input) return

  const config = getConfig()
  const id = input.includes('/') ? input.split('/').pop() : input
  const url = `${config.baseUrl}/p/${id}`

  vscode.env.openExternal(vscode.Uri.parse(url))
}
