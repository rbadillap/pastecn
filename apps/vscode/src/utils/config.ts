import * as vscode from 'vscode'

export interface PastecnConfig {
  baseUrl: string
  defaultExpiration: string
}

export function getConfig(): PastecnConfig {
  const config = vscode.workspace.getConfiguration('pastecn')
  return {
    baseUrl: config.get('baseUrl', 'https://pastecn.com'),
    defaultExpiration: config.get('defaultExpiration', 'never'),
  }
}
