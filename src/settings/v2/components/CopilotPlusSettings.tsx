import { Badge } from "@/components/ui/badge";
import { HelpTooltip } from "@/components/ui/help-tooltip";
import { SettingItem } from "@/components/ui/setting-item";
import { validateSelfHostMode } from "@/plusUtils";
import { updateSetting, useSettingsValue } from "@/settings/model";
import React, { useState } from "react";
import { ToolSettingsSection } from "./ToolSettingsSection";

export const CopilotPlusSettings: React.FC = () => {
  const settings = useSettingsValue();
  const [isValidatingSelfHost, setIsValidatingSelfHost] = useState(false);

  const handleSelfHostModeToggle = async (enabled: boolean) => {
    if (enabled) {
      setIsValidatingSelfHost(true);
      const isValid = await validateSelfHostMode();
      setIsValidatingSelfHost(false);
      if (!isValid) {
        // Validation failed - Notice already shown by validateSelfHostMode
        return;
      }
      updateSetting("enableSelfHostMode", true);
    } else {
      updateSetting("enableSelfHostMode", false);
    }
  };

  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      <section className="tw-flex tw-flex-col tw-gap-4">
        <div className="tw-flex tw-items-center tw-py-4">
          <Badge variant="secondary" className="tw-text-accent">
            需要 Plus
          </Badge>
        </div>
        <div className="tw-flex tw-flex-col tw-gap-4">
          <div className="tw-pt-4 tw-text-xl tw-font-semibold">自主代理</div>

          <SettingItem
            type="switch"
            title="启用自主代理"
            description="在 Plus 聊天中启用自主代理模式。AI 将逐步推理并自动决定使用哪些工具，提高复杂查询的响应质量。"
            checked={settings.enableAutonomousAgent}
            onCheckedChange={(checked) => {
              updateSetting("enableAutonomousAgent", checked);
            }}
          />

          {settings.enableAutonomousAgent && (
            <>
              <ToolSettingsSection />
            </>
          )}

          <div className="tw-pt-4 tw-text-xl tw-font-semibold">记忆功能 (实验性)</div>

          <SettingItem
            type="text"
            title="记忆文件夹名称"
            description="指定存储记忆数据的文件夹。"
            value={settings.memoryFolderName}
            onChange={(value) => {
              updateSetting("memoryFolderName", value);
            }}
            placeholder="copilot/memory"
          />

          <SettingItem
            type="switch"
            title="引用最近对话"
            description="启用后，Copilot 会引用您最近的对话历史，以提供更符合上下文的回复。所有历史数据都存储在您的知识库本地。"
            checked={settings.enableRecentConversations}
            onCheckedChange={(checked) => {
              updateSetting("enableRecentConversations", checked);
            }}
          />

          {settings.enableRecentConversations && (
            <SettingItem
              type="slider"
              title="最大最近对话数"
              description="记忆的最近对话数量，用于上下文参考。数值越高提供的上下文越多，但可能会减慢响应速度。"
              min={10}
              max={50}
              step={1}
              value={settings.maxRecentConversations}
              onChange={(value) => updateSetting("maxRecentConversations", value)}
            />
          )}

          <SettingItem
            type="switch"
            title="引用保存的记忆"
            description="启用后，Copilot 可以访问您明确要求它记住的记忆。用于存储重要事实、偏好或未来对话的上下文。"
            checked={settings.enableSavedMemory}
            onCheckedChange={(checked) => {
              updateSetting("enableSavedMemory", checked);
            }}
          />

          <div className="tw-pt-4 tw-text-xl tw-font-semibold">自托管模式</div>

          <SettingItem
            type="switch"
            title="启用自托管模式"
            description={
              <div className="tw-flex tw-items-center tw-gap-1.5">
                <span className="tw-leading-none">
                  使用您自己的基础设施运行
                  LLM、嵌入模型（以及即将推出的桌面应用中的本地文档理解功能）。
                </span>
                <HelpTooltip
                  content={
                    <div className="tw-flex tw-max-w-96 tw-flex-col tw-gap-2 tw-py-4">
                      <div className="tw-text-sm tw-font-medium tw-text-accent">
                        自托管模式（仅限 Believer/Supporter）
                      </div>
                      <div className="tw-text-xs tw-text-muted">
                        连接到您自己的自托管后端（例如 Miyo），完全控制您的 AI 基础设施。
                        这允许离线使用和自定义模型部署。
                      </div>
                      <div className="tw-text-xs tw-text-muted">
                        在线时需要每 14 天重新验证一次。
                      </div>
                    </div>
                  }
                />
              </div>
            }
            checked={settings.enableSelfHostMode}
            onCheckedChange={handleSelfHostModeToggle}
            disabled={isValidatingSelfHost}
          />
        </div>
      </section>
    </div>
  );
};
