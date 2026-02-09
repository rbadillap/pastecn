import { tool } from "ai";
import { z } from "zod";

export const createSnippet = (options?: { baseUrl?: string }) =>
  tool({
    description: "Create a code snippet on pastecn and get a shareable URL",
    inputSchema: z.object({
      name: z.string().describe("Name of the snippet"),
      type: z
        .enum(["file", "component", "hook", "lib", "block"])
        .describe("Type of snippet"),
      files: z
        .array(
          z.object({
            path: z
              .string()
              .describe('File path (e.g., "components/button.tsx")'),
            content: z.string().describe("File content"),
            target: z
              .string()
              .optional()
              .describe("Target path for installation"),
          })
        )
        .describe("Files to include in the snippet"),
      password: z.string().optional().describe("Optional password protection"),
    }),
    execute: async ({ name, type, files, password }) => {
      const baseUrl = options?.baseUrl ?? "https://pastecn.com";
      const response = await fetch(`${baseUrl}/api/v1/snippets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type, files, password }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to create snippet");
      }

      return response.json();
    },
  });

export const getSnippet = (options?: { baseUrl?: string }) =>
  tool({
    description: "Retrieve a code snippet from pastecn by ID",
    inputSchema: z.object({
      id: z.string().describe("Snippet ID"),
      password: z
        .string()
        .optional()
        .describe("Password if snippet is protected"),
    }),
    execute: async ({ id, password }) => {
      const baseUrl = options?.baseUrl ?? "https://pastecn.com";
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (password) {
        headers["Authorization"] = `Bearer ${password}`;
      }

      const response = await fetch(`${baseUrl}/api/v1/snippets/${id}`, {
        headers,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to get snippet");
      }

      return response.json();
    },
  });
