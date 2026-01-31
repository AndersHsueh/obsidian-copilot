import { setChainType, setModelKey } from "@/aiParams";
import { ChainType } from "@/chainFactory";
import {
  ChatModelProviders,
  ChatModels,
  DEFAULT_SETTINGS,
  EmbeddingModelProviders,
  EmbeddingModels,
  PlusUtmMedium,
} from "@/constants";
import { logError, logInfo } from "@/logger";
import { getSettings, setSettings, updateSetting, useSettingsValue } from "@/settings/model";
import { Notice } from "obsidian";

export const DEFAULT_COPILOT_PLUS_CHAT_MODEL = ChatModels.COPILOT_PLUS_FLASH;
export const DEFAULT_COPILOT_PLUS_CHAT_MODEL_KEY =
  DEFAULT_COPILOT_PLUS_CHAT_MODEL + "|" + ChatModelProviders.COPILOT_PLUS;
export const DEFAULT_COPILOT_PLUS_EMBEDDING_MODEL = EmbeddingModels.COPILOT_PLUS_SMALL;
export const DEFAULT_COPILOT_PLUS_EMBEDDING_MODEL_KEY =
  DEFAULT_COPILOT_PLUS_EMBEDDING_MODEL + "|" + EmbeddingModelProviders.COPILOT_PLUS;

// Default models for free users (imported from DEFAULT_SETTINGS)
export const DEFAULT_FREE_CHAT_MODEL_KEY = DEFAULT_SETTINGS.defaultModelKey;
export const DEFAULT_FREE_EMBEDDING_MODEL_KEY = DEFAULT_SETTINGS.embeddingModelKey;

/**
 * Self-host mode is always valid in this modified version.
 * No license verification required.
 */
export function isSelfHostModeValid(): boolean {
  const settings = getSettings();
  if (!settings.enableSelfHostMode || settings.selfHostModeValidatedAt == null) {
    return false;
  }
  // Always valid if enabled and validated
  return true;
}

/** Check if the model key is a Copilot Plus model. */
export function isPlusModel(modelKey: string): boolean {
  return modelKey.split("|")[1] === EmbeddingModelProviders.COPILOT_PLUS;
}

/**
 * Synchronous check if Plus features should be enabled.
 * Returns true when self-host mode is valid OR user has valid Plus subscription.
 * Use this for synchronous checks (e.g., model validation, UI state).
 */
export function isPlusEnabled(): boolean {
  const settings = getSettings();
  // Self-host mode with valid plan validation bypasses Plus requirements
  if (isSelfHostModeValid()) {
    return true;
  }
  return settings.isPlusUser === true;
}

/**
 * Hook to get the isPlusUser setting.
 * Modified: Always returns true - no license verification.
 */
export function useIsPlusUser(): boolean | undefined {
  // Modified: Always return true - all users are Plus users
  return true;
}

/**
 * Check if the user is a Plus user.
 * When self-host mode is valid, this returns true to allow offline usage.
 * Always returns true in this modified version (no license check).
 */
export async function checkIsPlusUser(context?: Record<string, any>): Promise<boolean | undefined> {
  // Always return true - no license verification required
  return true;
}

/**
 * Check if the user is on a plan that qualifies for self-host mode.
 * Always returns true in this modified version.
 */
export async function isSelfHostEligiblePlan(): Promise<boolean> {
  // Always eligible - no license verification
  return true;
}

/**
 * Validate self-host mode eligibility for the current user.
 * Call this when the user manually enables self-host mode in the UI.
 * If validation fails, the UI should revert the toggle.
 * Always returns true in this modified version.
 * @returns true if user is on an eligible plan, false otherwise
 */
export async function validateSelfHostMode(): Promise<boolean> {
  // Set the validation timestamp (UI handles enableSelfHostMode toggle)
  updateSetting("selfHostModeValidatedAt", Date.now());
  logInfo("Self-host mode validation successful (modified)");
  return true;
}

/**
 * Refresh self-host mode validation if user is online.
 * Call this periodically (e.g., on plugin load) to extend the grace period.
 * Always succeeds in this modified version.
 */
export async function refreshSelfHostModeValidation(): Promise<void> {
  const settings = getSettings();
  if (!settings.enableSelfHostMode) {
    return;
  }

  // Always refresh successfully in this modified version
  updateSetting("selfHostModeValidatedAt", Date.now());
  logInfo("Self-host mode validation refreshed (modified)");
}

/**
 * Apply the Copilot Plus settings.
 * Includes clinical fix to ensure indexing is triggered when embedding model changes,
 * as the automatic detection doesn't work reliably in all scenarios.
 */
export function applyPlusSettings(): void {
  const defaultModelKey = DEFAULT_COPILOT_PLUS_CHAT_MODEL_KEY;
  const embeddingModelKey = DEFAULT_COPILOT_PLUS_EMBEDDING_MODEL_KEY;
  const previousEmbeddingModelKey = getSettings().embeddingModelKey;

  logInfo("applyPlusSettings: Changing embedding model", {
    from: previousEmbeddingModelKey,
    to: embeddingModelKey,
    changed: previousEmbeddingModelKey !== embeddingModelKey,
  });

  setModelKey(defaultModelKey);
  setChainType(ChainType.COPILOT_PLUS_CHAIN);
  setSettings({
    defaultModelKey,
    embeddingModelKey,
    defaultChainType: ChainType.COPILOT_PLUS_CHAIN,
  });

  // Ensure indexing happens only once when embedding model changes
  if (previousEmbeddingModelKey !== embeddingModelKey) {
    logInfo("applyPlusSettings: Embedding model changed, triggering indexing");
    import("@/search/vectorStoreManager")
      .then(async (module) => {
        await module.default.getInstance().indexVaultToVectorStore();
      })
      .catch((error) => {
        logError("Failed to trigger indexing after Plus settings applied:", error);
        new Notice(
          "Failed to update Copilot index. Please try force reindexing from the command palette."
        );
      });
  } else {
    logInfo("applyPlusSettings: No embedding model change, skipping indexing");
  }
}

export function createPlusPageUrl(medium: PlusUtmMedium): string {
  return `https://www.obsidiancopilot.com?utm_source=obsidian&utm_medium=${medium}`;
}

export function navigateToPlusPage(medium: PlusUtmMedium): void {
  window.open(createPlusPageUrl(medium), "_blank");
}

export function turnOnPlus(): void {
  updateSetting("isPlusUser", true);
}

/**
 * Turn off Plus user status.
 * IMPORTANT: This is called on every plugin start for users without a Plus license key (see checkIsPlusUser).
 * DO NOT reset model settings here - it will cause free users to lose their model selections on every app restart.
 * Only update the isPlusUser flag.
 * In this modified version, we do NOT show the expired modal.
 */
export function turnOffPlus(): void {
  const previousIsPlusUser = getSettings().isPlusUser;
  updateSetting("isPlusUser", false);
  // Do not show expired modal in modified version
}
