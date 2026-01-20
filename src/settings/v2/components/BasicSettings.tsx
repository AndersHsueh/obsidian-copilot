import { ChainType } from "@/chainFactory";
import { Button } from "@/components/ui/button";
import { HelpTooltip } from "@/components/ui/help-tooltip";
import { Input } from "@/components/ui/input";
import { getModelDisplayWithIcons } from "@/components/ui/model-display";
import { SettingItem } from "@/components/ui/setting-item";
import { DEFAULT_OPEN_AREA, PLUS_UTM_MEDIUMS, SEND_SHORTCUT } from "@/constants";
import { useTab } from "@/contexts/TabContext";
import { changeLanguage, LANGUAGE_NAMES, SUPPORTED_LANGUAGES } from "@/i18n";
import { cn } from "@/lib/utils";
import { createPlusPageUrl } from "@/plusUtils";
import { getModelKeyFromModel, updateSetting, useSettingsValue } from "@/settings/model";
import { PlusSettings } from "@/settings/v2/components/PlusSettings";
import { checkModelApiKey, formatDateTime } from "@/utils";
import { isSortStrategy } from "@/utils/recentUsageManager";
import { Key, Loader2 } from "lucide-react";
import { Notice } from "obsidian";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ApiKeyDialog } from "./ApiKeyDialog";

const { t } = useTranslation();

const ChainType2Label: Record<ChainType, string> = {
  [ChainType.LLM_CHAIN]: "Chat",
  [ChainType.VAULT_QA_CHAIN]: "Vault QA (Basic)",
  [ChainType.COPILOT_PLUS_CHAIN]: "Obsidian-Mate Plus",
  [ChainType.PROJECT_CHAIN]: "Projects (alpha)",
};

export const BasicSettings: React.FC = () => {
  const settings = useSettingsValue();
  const { setSelectedTab } = useTab();
  const [isChecking, setIsChecking] = useState(false);
  const [conversationNoteName, setConversationNoteName] = useState(
    settings.defaultConversationNoteName || "{$date}_{$time}__{$topic}"
  );

  const applyCustomNoteFormat = () => {
    setIsChecking(true);

    try {
      // Check required variables
      const format = conversationNoteName || "{$date}_{$time}__{$topic}";
      const requiredVars = ["{$date}", "{$time}", "{$topic}"];
      const missingVars = requiredVars.filter((v) => !format.includes(v));

      if (missingVars.length > 0) {
        new Notice(`Error: Missing required variables: ${missingVars.join(", ")}`, 4000);
        return;
      }

      // Check illegal characters (excluding variable placeholders)
      const illegalChars = /[\\/:*?"<>|]/;
      const formatWithoutVars = format
        .replace(/\{\$date}/g, "")
        .replace(/\{\$time}/g, "")
        .replace(/\{\$topic}/g, "");

      if (illegalChars.test(formatWithoutVars)) {
        new Notice(`Error: Format contains illegal characters (\\/:*?"<>|)`, 4000);
        return;
      }

      // Generate example filename
      const { fileName: timestampFileName } = formatDateTime(new Date());
      const firstTenWords = "test topic name";

      // Create example filename
      const customFileName = format
        .replace("{$topic}", firstTenWords.slice(0, 100).replace(/\s+/g, "_"))
        .replace("{$date}", timestampFileName.split("_")[0])
        .replace("{$time}", timestampFileName.split("_")[1]);

      // Save settings
      updateSetting("defaultConversationNoteName", format);
      setConversationNoteName(format);
      new Notice(`Format applied successfully! Example: ${customFileName}`, 4000);
    } catch (error) {
      new Notice(`Error applying format: ${error.message}`, 4000);
    } finally {
      setIsChecking(false);
    }
  };

  const defaultModelActivated = !!settings.activeModels.find(
    (m) => m.enabled && getModelKeyFromModel(m) === settings.defaultModelKey
  );
  const enableActivatedModels = settings.activeModels
    .filter((m) => m.enabled)
    .map((model) => ({
      label: getModelDisplayWithIcons(model),
      value: getModelKeyFromModel(model),
    }));

  return (
    <div className="tw-space-y-4">
      <PlusSettings />

      {/* General Section */}
      <section>
        <div className="tw-mb-3 tw-text-xl tw-font-bold">{t("settings.general.sectionTitle")}</div>
        <div className="tw-space-y-4">
          {/* Language Selector */}
          <SettingItem
            type="select"
            title={t("settings.language.title")}
            description={t("settings.language.description")}
            value={settings.language}
            onChange={(value) => {
              updateSetting(
                "language",
                value as (typeof SUPPORTED_LANGUAGES)[keyof typeof SUPPORTED_LANGUAGES]
              );
              changeLanguage(
                value as (typeof SUPPORTED_LANGUAGES)[keyof typeof SUPPORTED_LANGUAGES]
              );
            }}
            options={Object.entries(SUPPORTED_LANGUAGES).map(([key, value]) => ({
              label: LANGUAGE_NAMES[key as keyof typeof LANGUAGE_NAMES],
              value,
            }))}
          />

          {/* API Key Section */}
          <div className="tw-space-y-4">
            <SettingItem
              type="custom"
              title={t("settings.general.apiKeys.title")}
              description={
                <div className="tw-flex tw-items-center tw-gap-1.5">
                  <span className="tw-leading-none">
                    {t("settings.general.apiKeys.description")}
                  </span>
                  <HelpTooltip
                    content={
                      <div className="tw-flex tw-max-w-96 tw-flex-col tw-gap-2 tw-py-4">
                        <div className="tw-text-sm tw-font-medium tw-text-accent">
                          {t("settings.general.apiKeys.helpTitle")}
                        </div>
                        <div className="tw-text-xs tw-text-muted">
                          {t("settings.general.apiKeys.helpContent")}
                        </div>
                      </div>
                    }
                  />
                </div>
              }
            >
              <Button
                onClick={() => {
                  new ApiKeyDialog(app, () => setSelectedTab("model")).open();
                }}
                variant="secondary"
                className="tw-flex tw-w-full tw-items-center tw-justify-center tw-gap-2 sm:tw-w-auto sm:tw-justify-start"
              >
                {t("settings.general.apiKeys.setKeys")}
                <Key className="tw-size-4" />
              </Button>
            </SettingItem>
          </div>

          <SettingItem
            type="select"
            title={t("settings.general.defaultModel.title")}
            description={
              <div className="tw-flex tw-items-center tw-gap-1.5">
                <span className="tw-leading-none">
                  {t("settings.general.defaultModel.description")}
                </span>
                <HelpTooltip
                  content={
                    <div className="tw-flex tw-max-w-96 tw-flex-col tw-gap-2 tw-py-4">
                      <div className="tw-text-sm tw-font-medium tw-text-accent">
                        {t("settings.general.defaultModel.helpTitle")}
                      </div>
                      <div className="tw-text-xs tw-text-muted">
                        {t("settings.general.defaultModel.helpContent")}
                      </div>
                    </div>
                  }
                />
              </div>
            }
            value={
              defaultModelActivated
                ? settings.defaultModelKey
                : t("settings.general.defaultModel.selectModel")
            }
            onChange={(value) => {
              const selectedModel = settings.activeModels.find(
                (m) => m.enabled && getModelKeyFromModel(m) === value
              );
              if (!selectedModel) return;

              const { hasApiKey, errorNotice } = checkModelApiKey(selectedModel, settings);
              if (!hasApiKey && errorNotice) {
                // Keep selection allowed; error will surface in chat on send
              }
              updateSetting("defaultModelKey", value);
            }}
            options={
              defaultModelActivated
                ? enableActivatedModels
                : [
                    {
                      label: t("settings.general.defaultModel.selectModel"),
                      value: "Select Model",
                    },
                    ...enableActivatedModels,
                  ]
            }
            placeholder={t("models.model")}
          />

          {/* Basic Configuration Group */}
          <SettingItem
            type="select"
            title={t("settings.general.defaultMode.title")}
            description={
              <div className="tw-flex tw-items-center tw-gap-1.5">
                <span className="tw-leading-none">
                  {t("settings.general.defaultMode.description")}
                </span>
                <HelpTooltip
                  content={
                    <div className="tw-flex tw-max-w-96 tw-flex-col tw-gap-2">
                      <ul className="tw-pl-4 tw-text-sm tw-text-muted">
                        <li
                          dangerouslySetInnerHTML={{
                            __html: t("settings.general.defaultMode.helpContent.chat", {
                              url: createPlusPageUrl(PLUS_UTM_MEDIUMS.MODE_SELECT_TOOLTIP),
                            }),
                          }}
                        />
                        <li
                          dangerouslySetInnerHTML={{
                            __html: t("settings.general.defaultMode.helpContent.vaultQA"),
                          }}
                        />
                        <li
                          dangerouslySetInnerHTML={{
                            __html: t("settings.general.defaultMode.helpContent.copilotPlus", {
                              url: createPlusPageUrl(PLUS_UTM_MEDIUMS.MODE_SELECT_TOOLTIP),
                            }),
                          }}
                        />
                      </ul>
                    </div>
                  }
                />
              </div>
            }
            value={settings.defaultChainType}
            onChange={(value) => updateSetting("defaultChainType", value as ChainType)}
            options={Object.entries(ChainType2Label).map(([key, value]) => ({
              label: value,
              value: key,
            }))}
          />

          <SettingItem
            type="select"
            title={t("settings.general.openPluginIn.title")}
            description={t("settings.general.openPluginIn.description")}
            value={settings.defaultOpenArea}
            onChange={(value) => updateSetting("defaultOpenArea", value as DEFAULT_OPEN_AREA)}
            options={[
              {
                label: t("settings.general.openPluginIn.sidebarView"),
                value: DEFAULT_OPEN_AREA.VIEW,
              },
              { label: t("settings.general.openPluginIn.editor"), value: DEFAULT_OPEN_AREA.EDITOR },
            ]}
          />

          <SettingItem
            type="select"
            title={t("settings.general.sendShortcut.title")}
            description={
              <div className="tw-flex tw-items-center tw-gap-1.5">
                <span className="tw-leading-none">
                  {t("settings.general.sendShortcut.description")}
                </span>
                <HelpTooltip
                  content={
                    <div className="tw-flex tw-max-w-96 tw-flex-col tw-gap-2 tw-py-4">
                      <div className="tw-text-sm tw-font-medium tw-text-accent">
                        {t("settings.general.sendShortcut.helpTitle")}
                      </div>
                      <div
                        className="tw-text-xs tw-text-muted"
                        dangerouslySetInnerHTML={{
                          __html: t("settings.general.sendShortcut.helpContent"),
                        }}
                      />
                    </div>
                  }
                />
              </div>
            }
            value={settings.defaultSendShortcut}
            onChange={(value) => updateSetting("defaultSendShortcut", value as SEND_SHORTCUT)}
            options={[
              { label: t("settings.general.sendShortcut.enter"), value: SEND_SHORTCUT.ENTER },
              {
                label: t("settings.general.sendShortcut.shiftEnter"),
                value: SEND_SHORTCUT.SHIFT_ENTER,
              },
            ]}
          />

          <SettingItem
            type="switch"
            title={t("settings.general.autoAddActiveContent.title")}
            description={t("settings.general.autoAddActiveContent.description")}
            checked={settings.autoAddActiveContentToContext}
            onCheckedChange={(checked) => {
              updateSetting("autoAddActiveContentToContext", checked);
            }}
          />

          <SettingItem
            type="switch"
            title={t("settings.general.autoAddSelection.title")}
            description={t("settings.general.autoAddSelection.description")}
            checked={settings.autoAddSelectionToContext}
            onCheckedChange={(checked) => {
              updateSetting("autoAddSelectionToContext", checked);
            }}
          />

          <SettingItem
            type="switch"
            title={t("settings.general.imagesInMarkdown.title")}
            description={t("settings.general.imagesInMarkdown.description")}
            checked={settings.passMarkdownImages}
            onCheckedChange={(checked) => {
              updateSetting("passMarkdownImages", checked);
            }}
          />

          <SettingItem
            type="switch"
            title={t("settings.general.suggestedPrompts.title")}
            description={t("settings.general.suggestedPrompts.description")}
            checked={settings.showSuggestedPrompts}
            onCheckedChange={(checked) => updateSetting("showSuggestedPrompts", checked)}
          />

          <SettingItem
            type="switch"
            title={t("settings.general.relevantNotes.title")}
            description={t("settings.general.relevantNotes.description")}
            checked={settings.showRelevantNotes}
            onCheckedChange={(checked) => updateSetting("showRelevantNotes", checked)}
          />
        </div>
      </section>

      {/* Saving Conversations Section */}
      <section>
        <div className="tw-mb-3 tw-text-xl tw-font-bold">
          {t("settings.savingConversations.sectionTitle")}
        </div>
        <div className="tw-space-y-4">
          <SettingItem
            type="switch"
            title={t("settings.savingConversations.autosaveChat.title")}
            description={t("settings.savingConversations.autosaveChat.description")}
            checked={settings.autosaveChat}
            onCheckedChange={(checked) => updateSetting("autosaveChat", checked)}
          />

          <SettingItem
            type="switch"
            title={t("settings.savingConversations.generateAIChatTitle.title")}
            description={t("settings.savingConversations.generateAIChatTitle.description")}
            checked={settings.generateAIChatTitleOnSave}
            onCheckedChange={(checked) => updateSetting("generateAIChatTitleOnSave", checked)}
          />

          <SettingItem
            type="text"
            title={t("settings.savingConversations.defaultConversationFolder.title")}
            description={t("settings.savingConversations.defaultConversationFolder.description")}
            value={settings.defaultSaveFolder}
            onChange={(value) => updateSetting("defaultSaveFolder", value)}
            placeholder={t("settings.savingConversations.defaultConversationFolder.placeholder")}
          />

          <SettingItem
            type="text"
            title={t("settings.savingConversations.defaultConversationTag.title")}
            description={t("settings.savingConversations.defaultConversationTag.description")}
            value={settings.defaultConversationTag}
            onChange={(value) => updateSetting("defaultConversationTag", value)}
            placeholder={t("settings.savingConversations.defaultConversationTag.placeholder")}
          />

          <SettingItem
            type="custom"
            title={t("settings.savingConversations.conversationFilenameTemplate.title")}
            description={
              <div className="tw-flex tw-items-start tw-gap-1.5 ">
                <span className="tw-leading-none">
                  {t("settings.savingConversations.conversationFilenameTemplate.description")}
                </span>
                <HelpTooltip
                  content={
                    <div className="tw-flex tw-max-w-96 tw-flex-col tw-gap-2 tw-py-4">
                      <div className="tw-text-sm tw-font-medium tw-text-accent">
                        {t("settings.savingConversations.conversationFilenameTemplate.helpTitle")}
                      </div>
                      <div>
                        <div className="tw-text-sm tw-font-medium tw-text-muted">
                          {t(
                            "settings.savingConversations.conversationFilenameTemplate.helpContent"
                          )}
                        </div>
                        <ul className="tw-pl-4 tw-text-sm tw-text-muted">
                          <li
                            dangerouslySetInnerHTML={{
                              __html: t(
                                "settings.savingConversations.conversationFilenameTemplate.variableDate"
                              ),
                            }}
                          />
                          <li
                            dangerouslySetInnerHTML={{
                              __html: t(
                                "settings.savingConversations.conversationFilenameTemplate.variableTime"
                              ),
                            }}
                          />
                          <li
                            dangerouslySetInnerHTML={{
                              __html: t(
                                "settings.savingConversations.conversationFilenameTemplate.variableTopic"
                              ),
                            }}
                          />
                        </ul>
                        <i className="tw-mt-2 tw-text-sm tw-text-muted">
                          {t("settings.savingConversations.conversationFilenameTemplate.example")}
                        </i>
                      </div>
                    </div>
                  }
                />
              </div>
            }
          >
            <div className="tw-flex tw-w-[320px] tw-items-center tw-gap-1.5">
              <Input
                type="text"
                className={cn(
                  "tw-min-w-[80px] tw-grow tw-transition-all tw-duration-200",
                  isChecking ? "tw-w-[80px]" : "tw-w-[120px]"
                )}
                placeholder={
                  t("settings.savingConversations.conversationFilenameTemplate.placeholder") ||
                  "{$date}_{$time}__{$topic}"
                }
                value={conversationNoteName}
                onChange={(e) => setConversationNoteName(e.target.value)}
                disabled={isChecking}
              />

              <Button
                onClick={() => applyCustomNoteFormat()}
                disabled={isChecking}
                variant="secondary"
              >
                {isChecking ? (
                  <>
                    <Loader2 className="tw-mr-2 tw-size-4 tw-animate-spin" />
                    {t("common.loading")}
                  </>
                ) : (
                  t("settings.savingConversations.conversationFilenameTemplate.apply")
                )}
              </Button>
            </div>
          </SettingItem>
        </div>
      </section>

      {/* Sorting Section */}
      <section>
        <div className="tw-mb-3 tw-text-xl tw-font-bold">{t("settings.sorting.sectionTitle")}</div>
        <div className="tw-space-y-4">
          <SettingItem
            type="select"
            title={t("settings.sorting.chatHistorySort.title")}
            description={t("settings.sorting.chatHistorySort.description")}
            value={settings.chatHistorySortStrategy}
            onChange={(value) => {
              if (isSortStrategy(value)) {
                updateSetting("chatHistorySortStrategy", value);
              }
            }}
            options={[
              { label: t("settings.sorting.sortOptions.recency"), value: "recent" },
              { label: t("settings.sorting.sortOptions.created"), value: "created" },
              { label: t("settings.sorting.sortOptions.alphabetical"), value: "name" },
            ]}
          />

          <SettingItem
            type="select"
            title={t("settings.sorting.projectListSort.title")}
            description={t("settings.sorting.projectListSort.description")}
            value={settings.projectListSortStrategy}
            onChange={(value) => {
              if (isSortStrategy(value)) {
                updateSetting("projectListSortStrategy", value);
              }
            }}
            options={[
              { label: t("settings.sorting.sortOptions.recency"), value: "recent" },
              { label: t("settings.sorting.sortOptions.created"), value: "created" },
              { label: t("settings.sorting.sortOptions.alphabetical"), value: "name" },
            ]}
          />
        </div>
      </section>
    </div>
  );
};
