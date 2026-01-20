import { ChatModelProviders, SettingKeyProviders } from "@/constants";
import { logError } from "@/logger";

/**
 * Standard model interface definition - for frontend display
 */
export interface StandardModel {
  id: string; // Model unique identifier
  name: string; // Model display name
  provider: SettingKeyProviders; // Provider
}

// Response type mapping - simplified for local-only mode
export interface ProviderResponseMap {
  [ChatModelProviders.OLLAMA]: null; // Local - uses hardcoded models
  [ChatModelProviders.LM_STUDIO]: null; // Local - uses hardcoded models
}

// Adapter type definition - converts provider-specific models to standard format
export type ModelAdapter<T extends SettingKeyProviders> = (
  data: ProviderResponseMap[T]
) => StandardModel[];

// Create adapter function type
export type ProviderModelAdapters = {
  [K in SettingKeyProviders]?: ModelAdapter<K>;
};

/**
 * Provider model adapters - converts different provider model data to standard format
 * For local providers (Ollama, LM Studio), models are typically hardcoded
 * This is kept for interface compatibility
 */
export const providerAdapters: ProviderModelAdapters = {
  // Local providers don't need dynamic model fetching adapters
  // Models are configured via BUILTIN_CHAT_MODELS in constants.ts
};

/**
 * Default model adapter - handles unknown provider or format model data
 * For local-only mode, this primarily handles configuration-based model lists
 */
export const getDefaultModelAdapter = (provider: SettingKeyProviders) => {
  return (data: any): StandardModel[] => {
    // For local providers, we typically don't fetch models dynamically
    // This fallback handles edge cases or custom configurations
    if (data.data && Array.isArray(data.data)) {
      return data.data.map((model: any) => ({
        id: model.id || model.name || String(Math.random()),
        name: model.name || model.id || model.display_name || "Unknown Model",
        provider: provider,
      }));
    } else if (data.models && Array.isArray(data.models)) {
      return data.models.map((model: any) => ({
        id: model.id || model.name || String(Math.random()),
        name: model.name || model.displayName || model.id || "Unknown Model",
        provider: provider,
      }));
    } else if (Array.isArray(data)) {
      return data.map((model: any) => ({
        id: model.id || model.name || String(Math.random()),
        name: model.name || model.id || "Unknown Model",
        provider: provider,
      }));
    }
    return [];
  };
};

/**
 * Get adapter function
 * For local providers, returns null adapter (no dynamic model fetching)
 */
export const getModelAdapter = (provider: SettingKeyProviders) => {
  return providerAdapters[provider] || getDefaultModelAdapter(provider);
};

/**
 * Parse model data and convert to standard format
 * For local providers, this primarily returns empty arrays since models are configured
 */
export const parseModelsResponse = (provider: SettingKeyProviders, data: any): StandardModel[] => {
  const adapter = getModelAdapter(provider);
  try {
    return adapter(data);
  } catch (error) {
    logError(`Error parsing ${provider} model data:`, error);
    return [];
  }
};
