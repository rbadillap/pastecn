import { z } from 'zod'

export const fileSchema = z.object({
  path: z.string().describe('File path (e.g., "components/button.tsx")'),
  content: z.string().describe('File content'),
  target: z.string().optional().describe('Target path for installation'),
})

export const createSnippetInputSchema = z.object({
  name: z.string().describe('Name of the snippet'),
  type: z
    .enum(['file', 'component', 'hook', 'lib', 'block'])
    .describe('Type of snippet'),
  files: z.array(fileSchema).describe('Files to include in the snippet'),
  password: z.string().optional().describe('Optional password protection'),
})

export const getSnippetInputSchema = z.object({
  id: z.string().describe('Snippet ID'),
  password: z
    .string()
    .optional()
    .describe('Password if snippet is protected'),
})
