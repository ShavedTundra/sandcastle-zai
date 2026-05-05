/**
 * Z.ai Coding Plan provider for pi
 *
 * Registers Z.ai's GLM Coding Plan gateway as a custom provider,
 * giving access to GLM-5.1, GLM-5-Turbo, GLM-4.7, and GLM-4.5-Air
 * through the OpenAI-compatible streaming API.
 *
 * The Z.ai Coding Plan endpoint (https://api.z.ai/api/coding/paas/v4) is a
 * subscription-based service optimized for coding tasks. It uses standard
 * Bearer token authentication and is fully OpenAI Chat Completions compatible.
 *
 * Usage:
 *   - Set env var ZAI_API_KEY or configure via /zai command
 *   - Switch to a Z.ai model via pi's model picker
 *   - Use /zai to check status, set API key, or switch models
 */

import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { resolve } from "node:path";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";

const PROVIDER_NAME = "zai";
const CODING_BASE_URL = "https://api.z.ai/api/coding/paas/v4";
const API_KEY_ENV = "ZAI_API_KEY";
const CONFIG_PATH = resolve(__dirname, ".zai-config.json");

interface ZaiModel {
  id: string;
  name: string;
  reasoning: boolean;
  cost: { input: number; output: number; cacheRead: number; cacheWrite: number };
  contextWindow: number;
  maxTokens: number;
}

const ZAI_MODELS: ZaiModel[] = [
  {
    id: "glm-5.1",
    name: "GLM-5.1 (Z.ai Coding Plan)",
    reasoning: true,
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    contextWindow: 200000,
    maxTokens: 128000,
  },
  {
    id: "glm-5-turbo",
    name: "GLM-5-Turbo (Z.ai Coding Plan)",
    reasoning: true,
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    contextWindow: 200000,
    maxTokens: 128000,
  },
  {
    id: "glm-4.7",
    name: "GLM-4.7 (Z.ai Coding Plan)",
    reasoning: true,
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    contextWindow: 200000,
    maxTokens: 128000,
  },
  {
    id: "glm-4.5-air",
    name: "GLM-4.5-Air (Z.ai Coding Plan)",
    reasoning: false,
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    contextWindow: 128000,
    maxTokens: 16384,
  },
];

function registerZaiProvider(pi: ExtensionAPI, apiKey: string) {
  pi.registerProvider(PROVIDER_NAME, {
    baseUrl: CODING_BASE_URL,
    apiKey,
    api: "openai-completions" as const,
    authHeader: true,
    models: ZAI_MODELS.map((m) => ({
      id: m.id,
      name: m.name,
      reasoning: m.reasoning,
      input: ["text" as const],
      cost: m.cost,
      contextWindow: m.contextWindow,
      maxTokens: m.maxTokens,
      compat: {
        supportsDeveloperRole: false,
        supportsReasoningEffort: false,
        maxTokensField: "max_tokens" as const,
        thinkingFormat: "zai" as const,
      },
    })),
  });
}

function loadSavedKey(): string | null {
  try {
    if (existsSync(CONFIG_PATH)) {
      const cfg = JSON.parse(readFileSync(CONFIG_PATH, "utf-8"));
      return cfg.api_key || null;
    }
  } catch {
    // corrupted or unreadable — treat as missing
  }
  return null;
}

function saveKey(apiKey: string): void {
  try {
    const dir = resolve(CONFIG_PATH, "..");
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(CONFIG_PATH, JSON.stringify({ api_key: apiKey }, null, 2), "utf-8");
  } catch {
    // best effort — env var still works for this session
  }
}

function maskKey(key: string): string {
  return key.length > 8 ? key.slice(0, 4) + "..." + key.slice(-4) : "****";
}

function resolveApiKey(): string | null {
  // Priority: env var > saved config
  return process.env[API_KEY_ENV] || loadSavedKey();
}

export default function zaiProviderExtension(pi: ExtensionAPI) {
  // Auto-register if API key is available (env var or persisted config)
  const apiKey = resolveApiKey();
  if (apiKey) {
    process.env[API_KEY_ENV] = apiKey;
    registerZaiProvider(pi, apiKey);
  }

  // /provider command — interactive Z.ai management
  pi.registerCommand("zai", {
    description: "Manage the Z.ai Coding Plan provider (status, set key, switch model)",
    handler: async (args, ctx) => {
      // Parse subcommand without lowercasing the entire string (preserves API key case)
      const raw = (args || "").trim();
      const subcmd = raw.toLowerCase();

      if (subcmd === "status" || subcmd === "") {
        const key = resolveApiKey();
        if (key) {
          ctx.ui.notify(`Z.ai provider configured (key: ${maskKey(key)})\n  Endpoint: ${CODING_BASE_URL}\n  Models: GLM-5.1, GLM-5-Turbo, GLM-4.7, GLM-4.5-Air\n  Source: ${process.env[API_KEY_ENV] === key ? "env var" : "saved config"}`, "info");
        } else {
          ctx.ui.notify(
            "Z.ai provider not configured.\n  Use: /zai set-key <your-api-key>",
            "warning"
          );
        }
        return;
      }

      if (subcmd === "models") {
        const lines = ZAI_MODELS.map((m) =>
          `  ${m.id.padEnd(16)} ${m.reasoning ? "reasoning" : "standard"}  ctx:${(m.contextWindow / 1000) + "K"}  out:${(m.maxTokens / 1000) + "K"}`
        );
        ctx.ui.notify("Available Z.ai Coding Plan models:\n" + lines.join("\n"), "info");
        return;
      }

      if (subcmd.startsWith("set-key ")) {
        // Extract key from ORIGINAL string (preserves case)
        const newKey = raw.slice("set-key ".length).trim();
        if (!newKey) {
          ctx.ui.notify("Usage: /zai set-key <your-api-key>", "warning");
          return;
        }
        // Persist for future sessions
        saveKey(newKey);
        // Set in env for current process
        process.env[API_KEY_ENV] = newKey;
        // Register the provider (or re-register with new key)
        registerZaiProvider(pi, newKey);
        ctx.ui.notify(
          `Z.ai provider configured with key: ${maskKey(newKey)}\n  Key saved to: ${CONFIG_PATH}\n  Use pi's model picker to switch to a Z.ai model.`,
          "info"
        );
        return;
      }

      if (subcmd === "help") {
        ctx.ui.notify(
          [
            "Z.ai Coding Plan provider commands:",
            "  /zai           — Show provider status",
            "  /zai status    — Show provider status",
            "  /zai models    — List available models",
            "  /zai set-key K — Set your Z.ai API key (persisted)",
            "  /zai help      — Show this help",
            "",
            "The API key is persisted across sessions.",
            "You can also set ZAI_API_KEY env var to override.",
            "Endpoint: " + CODING_BASE_URL,
            "Docs: https://docs.z.ai/devpack/overview",
          ].join("\n"),
          "info"
        );
        return;
      }

      ctx.ui.notify(
        `Unknown subcommand: "${subcmd}". Use /zai help for available commands.`,
        "warning"
      );
    },
  });
}
