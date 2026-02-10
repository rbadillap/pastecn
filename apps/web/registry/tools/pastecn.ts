import { tool } from "ai";
import {
  createSnippetInputSchema,
  getSnippetInputSchema,
} from "@pastecn/sdk/schemas";

export const createSnippet = (options?: { baseUrl?: string }) =>
  tool({
    description: "Create a code snippet on pastecn and get a shareable URL",
    inputSchema: createSnippetInputSchema,
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
    inputSchema: getSnippetInputSchema,
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
