import * as vscode from 'vscode'
import { shareSelection, shareFile } from './commands/share'
import { openSnippet } from './commands/open'

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('pastecn.shareSelection', shareSelection),
    vscode.commands.registerCommand('pastecn.shareFile', shareFile),
    vscode.commands.registerCommand('pastecn.openSnippet', openSnippet)
  )
}

export function deactivate() {}
