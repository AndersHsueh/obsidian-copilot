import { setChainType, setModelKey } from "@/aiParams";
import { ChainType } from "@/chainFactory";
import { DEFAULT_SETTINGS } from "@/constants";
import { logInfo } from "@/logger";
import { getSettings, setSettings, updateSetting, useSettingsValue } from "@/settings/model";

// Default models for local users (imported from DEFAULT_SETTINGS)
export const DEFAULT_FREE_CHAT_MODEL_KEY = DEFAULT_SETTINGS.defaultModelKey;
export const DEFAULT_FREE_EMBEDDING_MODEL_KEY = DEFAULT_SETTINGS.embeddingModelKey;

/** Check if the model key is a Plus model (always false in local-only mode). */
export function isPlusModel(_modelKey: string): boolean {
  return false;
}

/** Hook to get the isPlusUser setting (always undefined in local-only mode). */
export function useIsPlusUser(): boolean | undefined {
  return undefined;
}

/** Check if the user is a Plus user (always false in local-only mode). */
export async function checkIsPlusUser(): Promise<boolean | undefined> {
  return undefined;
}

/** Check if the user is on the believer plan (always false in local-only mode). */
export async function isBelieverPlan(): Promise<boolean> {
  return false;
}

/**
 * Apply the default local settings.
 */
export function applyLocalSettings(): void {
  const defaultModelKey = DEFAULT_FREE_CHAT_MODEL_KEY;
  const embeddingModelKey = DEFAULT_FREE_EMBEDDING_MODEL_KEY;

  logInfo("applyLocalSettings: Setting default local models", {
    defaultModelKey,
    embeddingModelKey,
  });

  setModelKey(defaultModelKey);
  setChainType(ChainType.LLM_CHAIN);
  setSettings({
    defaultModelKey,
    embeddingModelKey,
    defaultChainType: ChainType.LLM_CHAIN,
  });
}

/**
 * Turn off Plus user status.
 * In local-only mode, this is a no-op since there's no Plus feature.
 */
export function turnOffPlus(): void {
  // No-op in local-only mode
}

/**
 * Turn on Plus user status.
 * In local-only mode, this sets isPlusUser but doesn't enable any Plus features.
 */
export function turnOnPlus(): void {
  updateSetting("isPlusUser", true);
}
