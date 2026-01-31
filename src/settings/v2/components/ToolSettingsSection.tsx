import React from "react";
import { SettingItem } from "@/components/ui/setting-item";
import { ToolRegistry } from "@/tools/ToolRegistry";
import { updateSetting, useSettingsValue } from "@/settings/model";

export const ToolSettingsSection: React.FC = () => {
  const settings = useSettingsValue();
  const registry = ToolRegistry.getInstance();

  const enabledToolIds = new Set(settings.autonomousAgentEnabledToolIds || []);

  // Get configurable tools grouped by category
  const toolsByCategory = registry.getToolsByCategory();
  const configurableTools = registry.getConfigurableTools();

  const handleToolToggle = (toolId: string, enabled: boolean) => {
    const newEnabledIds = new Set(enabledToolIds);
    if (enabled) {
      newEnabledIds.add(toolId);
    } else {
      newEnabledIds.delete(toolId);
    }

    updateSetting("autonomousAgentEnabledToolIds", Array.from(newEnabledIds));
  };

  const renderToolsByCategory = () => {
    const categories = Array.from(toolsByCategory.entries()).filter(([_, tools]) =>
      tools.some((t) => configurableTools.includes(t))
    );

    return categories.map(([category, tools]) => {
      const configurableInCategory = tools.filter((t) => configurableTools.includes(t));

      if (configurableInCategory.length === 0) return null;

      return (
        <React.Fragment key={category}>
          {configurableInCategory.map(({ metadata }) => (
            <SettingItem
              key={metadata.id}
              type="switch"
              title={metadata.displayName}
              description={metadata.description}
              checked={enabledToolIds.has(metadata.id)}
              onCheckedChange={(checked) => handleToolToggle(metadata.id, checked)}
            />
          ))}
        </React.Fragment>
      );
    });
  };

  return (
    <>
      <SettingItem
        type="slider"
        title="最大迭代次数"
        description="自主代理可以执行的最大推理迭代次数。较高的值允许更复杂的推理，但可能需要更长时间。"
        value={settings.autonomousAgentMaxIterations ?? 4}
        onChange={(value) => {
          updateSetting("autonomousAgentMaxIterations", value);
        }}
        min={4}
        max={8}
        step={1}
      />

      <div className="tw-mt-4 tw-rounded-lg tw-bg-secondary tw-p-4">
        <div className="tw-mb-2 tw-text-sm tw-font-medium">代理可访问的工具</div>
        <div className="tw-mb-4 tw-text-xs tw-text-muted">切换自主代理可以使用的工具</div>

        <div className="tw-flex tw-flex-col tw-gap-2">{renderToolsByCategory()}</div>
      </div>
    </>
  );
};
