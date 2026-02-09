import { generateText, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

// This is the same tool distributed via `npx shadcn@latest add @pastecn/ai-sdk`
// See: registry/tools/pastecn.ts
const createSnippet = (options?: { baseUrl?: string }) =>
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

const prompt =
  "Create a simple React loading spinner component with Tailwind CSS and save it to pastecn. The component should be named LoadingSpinner.";

async function main() {
  console.log("🤖 Generating a React component with AI...\n");
  console.log(`📝 Prompt: "${prompt}"\n`);

  const { text, steps } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt,
    tools: {
      createSnippet: createSnippet(),
    },
    toolChoice: { type: "tool", toolName: "createSnippet" },
    maxSteps: 2,
  });

  if (text) {
    console.log("💬 AI Response:", text);
  }

  // Extract tool results from steps
  for (const step of steps) {
    for (const toolResult of step.toolResults) {
      if (toolResult.toolName === "createSnippet" && toolResult.output) {
        const output = toolResult.output as {
          id: string;
          url: string;
          registryUrl: string;
        };
        console.log("✅ Snippet created successfully!");
        console.log(`   URL: ${output.url}`);
        console.log(`   Registry: ${output.registryUrl}`);
        console.log(`   Install: npx shadcn@latest add ${output.registryUrl}`);
      }
    }
  }
}

main().catch(console.error);
