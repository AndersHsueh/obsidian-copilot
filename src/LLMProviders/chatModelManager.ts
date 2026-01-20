import { CustomModel, getModelKey, ModelConfig } from "@/aiParams";
import { BUILTIN_CHAT_MODELS, ChatModelProviders, ProviderInfo } from "@/constants";
import { logError, logInfo } from "@/logger";
import {
  CopilotSettings,
  getModelKeyFromModel,
  getSettings,
  subscribeToSettingsChange,
} from "@/settings/model";
import {
  findCustomModel,
  getModelInfo,
  ModelInfo,
  safeFetch,
  withSuppressedTokenWarnings,
} from "@/utils";
import { ChatOllama } from "@langchain/ollama";
import { ChatOpenAI } from "@langchain/openai";
import { MissingApiKeyError } from "@/error";
import { Notice } from "obsidian";

// Local model constructors (no cloud providers)
const CHAT_PROVIDER_CONSTRUCTORS = {
  [ChatModelProviders.OLLAMA]: ChatOllama,
  [ChatModelProviders.LM_STUDIO]: ChatOpenAI,
} as const;

type ChatProviderConstructMap = typeof CHAT_PROVIDER_CONSTRUCTORS;

export default class ChatModelManager {
  private static instance: ChatModelManager;
  private static chatModel: any;
  private static modelMap: Record<
    string,
    {
      hasApiKey: boolean;
      AIConstructor: new (config: any) => any;
      vendor: string;
    }
  >;

  private constructor() {
    this.buildModelMap();
    subscribeToSettingsChange(() => {
      this.buildModelMap();
      this.validateCurrentModel();
    });
  }

  static getInstance(): ChatModelManager {
    if (!ChatModelManager.instance) {
      ChatModelManager.instance = new ChatModelManager();
    }
    return ChatModelManager.instance;
  }

  private static readonly REASONING_MODEL_TEMPERATURE = 1;

  private getTemperatureForModel(
    modelInfo: ModelInfo,
    customModel: CustomModel,
    settings: CopilotSettings
  ): number | undefined {
    // O-series and GPT-5 models require temperature = 1
    if (modelInfo.isOSeries || modelInfo.isGPT5) {
      return ChatModelManager.REASONING_MODEL_TEMPERATURE;
    }
    return customModel.temperature ?? settings.temperature;
  }

  private async getModelConfig(customModel: CustomModel): Promise<ModelConfig> {
    const settings = getSettings();

    const modelName = customModel.name;
    const modelInfo = getModelInfo(modelName);
    const resolvedTemperature = this.getTemperatureForModel(modelInfo, customModel, settings);
    const maxTokens = customModel.maxTokens ?? settings.maxTokens;

    // Local models don't need API keys
    const baseConfig: Omit<ModelConfig, "maxTokens" | "maxCompletionTokens"> = {
      modelName: modelName,
      streaming: customModel.stream ?? true,
      maxRetries: 3,
      maxConcurrency: 3,
      enableCors: customModel.enableCors,
      temperature: resolvedTemperature,
    };

    // Local provider configuration
    const providerConfig: Record<keyof typeof CHAT_PROVIDER_CONSTRUCTORS, any> = {
      [ChatModelProviders.OLLAMA]: {
        model: modelName,
        baseUrl: customModel.baseUrl || ProviderInfo[ChatModelProviders.OLLAMA].host,
        // Ollama uses default configuration
      },
      [ChatModelProviders.LM_STUDIO]: {
        modelName: modelName,
        apiKey: "not-required", // Local model doesn't need API key
        configuration: {
          baseURL: customModel.baseUrl || ProviderInfo[ChatModelProviders.LM_STUDIO].host,
          fetch: customModel.enableCors ? safeFetch : undefined,
        },
      },
    };

    return {
      ...baseConfig,
      ...providerConfig[customModel.provider as keyof typeof CHAT_PROVIDER_CONSTRUCTORS],
    };
  }

  async getChatModel(customModel?: CustomModel): Promise<any> {
    const currentModel = customModel ?? findCustomModel(getModelKey());
    const modelKey = getModelKeyFromModel(currentModel);
    const cachedModel = ChatModelManager.chatModel;
    const cachedModelKey = cachedModel ? ((cachedModel as any).modelName ?? "") : "";

    if (cachedModel && cachedModelKey === modelKey) {
      return cachedModel;
    }

    const settings = getSettings();
    const effectiveModel = currentModel ?? findCustomModel(settings.defaultModelKey);

    const config = await this.getModelConfig(effectiveModel);
    const AIConstructor =
      CHAT_PROVIDER_CONSTRUCTORS[
        effectiveModel.provider as keyof typeof CHAT_PROVIDER_CONSTRUCTORS
      ];

    if (!AIConstructor) {
      throw new Error(`Unsupported provider: ${effectiveModel.provider}`);
    }

    try {
      const modelInstance = await withSuppressedTokenWarnings(async () => {
        return new AIConstructor(config);
      });
      ChatModelManager.chatModel = modelInstance;
      return modelInstance;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(err2String(error));
      logError("Failed to initialize chat model:", err);
      if (err.message.includes("api key")) {
        throw new MissingApiKeyError(effectiveModel.provider, err.message);
      }
      throw err;
    }
  }

  // Re-build the model map when settings change
  private buildModelMap(): void {
    const settings = getSettings();

    const processModels = (models: CustomModel[]) => {
      for (const model of models) {
        const provider = model.provider as ChatModelProviders;
        if (!Object.values(ChatModelProviders).includes(provider)) {
          continue;
        }

        const providerInfo = ProviderInfo[provider];
        if (!providerInfo) {
          continue;
        }

        ChatModelManager.modelMap ??= {};
        ChatModelManager.modelMap[`${model.name}|${provider}`] = {
          hasApiKey: !!model.apiKey,
          AIConstructor:
            CHAT_PROVIDER_CONSTRUCTORS[provider as keyof typeof CHAT_PROVIDER_CONSTRUCTORS],
          vendor: providerInfo.label,
        };
      }
    };

    processModels(settings.activeModels);
  }

  async validateCurrentModel(): Promise<void> {
    const settings = getSettings();
    const currentModel = findCustomModel(getModelKey());

    if (!currentModel) {
      logInfo("validateCurrentModel: No custom model found, skipping validation");
      return;
    }

    try {
      await this.getChatModel(currentModel);
    } catch (error) {
      if (error instanceof MissingApiKeyError) {
        const providerInfo = ProviderInfo[currentModel.provider as ChatModelProviders];
        new Notice(
          `Your ${providerInfo.label} API key is invalid or missing. Please check your settings.`
        );
        logError("validateCurrentModel: API key error", error);
      } else {
        logError("validateCurrentModel: Unexpected error", error);
      }
    }
  }

  async updateSettings(settings: CopilotSettings): Promise<void> {
    const currentModel = findCustomModel(getModelKey());

    if (currentModel) {
      const currentModelIndex = settings.activeModels.findIndex(
        (m) => m.name === currentModel.name && m.provider === currentModel.provider
      );

      if (currentModelIndex !== -1) {
        settings.activeModels[currentModelIndex] = currentModel;
      }
    }
  }
}
