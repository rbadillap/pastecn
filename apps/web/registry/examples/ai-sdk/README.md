# @pastecn/ai-sdk Example

This example demonstrates how to use the pastecn AI SDK tools with OpenAI.

## Setup

1. Copy `.env.example` to `.env` and add your API key:

```bash
cp .env.example .env
```

2. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)

3. Install dependencies:

```bash
pnpm install
```

## Run

```bash
pnpm start
```

Or directly with npx:

```bash
npx tsx index.ts
```

## What it does

1. Uses GPT-4o-mini via OpenAI API
2. Prompts the AI to create a React component
3. The AI calls `createSnippet` to save the component to pastecn
4. Returns the shareable URL and install command
