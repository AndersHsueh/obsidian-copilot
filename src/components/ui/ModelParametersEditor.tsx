import React from "react";
import { CustomModel } from "@/aiParams";
import { FormField } from "@/components/ui/form-field";
import { ParameterControl } from "@/components/ui/parameter-controls";
import { DEFAULT_MODEL_SETTING } from "@/constants";
import { CopilotSettings } from "@/settings/model";

/**
 * 参数范围配置（硬编码，简单明了）
 */
const PARAM_RANGES = {
  temperature: { min: 0, max: 2, step: 0.01, default: DEFAULT_MODEL_SETTING.TEMPERATURE },
  topP: { min: 0, max: 1, step: 0.05, default: 0.9 },
  frequencyPenalty: { min: 0, max: 2, step: 0.05, default: 0 },
  maxTokens: { min: 100, max: 128000, step: 100, default: DEFAULT_MODEL_SETTING.MAX_TOKENS },
};

interface ModelParametersEditorProps {
  model: CustomModel;
  settings: CopilotSettings;
  onChange: (field: keyof CustomModel, value: any) => void;
  onReset?: (field: keyof CustomModel) => void;
  showTokenLimit?: boolean; // 是否显示 Token limit，默认 true
}

/**
 * 共享的模型参数编辑器组件
 * 用于 ChatSettingsPopover 和 ModelEditDialog
 */
export function ModelParametersEditor({
  model,
  settings,
  onChange,
  onReset,
  showTokenLimit = true,
}: ModelParametersEditorProps) {
  // 参数值：model.xxx ?? settings.xxx
  const temperature = model.temperature ?? settings.temperature;
  const maxTokens = model.maxTokens ?? settings.maxTokens;
  const topP = model.topP;
  const frequencyPenalty = model.frequencyPenalty;

  return (
    <div className="tw-space-y-4">
      {/* Token limit */}
      {showTokenLimit && (
        <FormField>
          <ParameterControl
            type="slider"
            optional={false}
            label="Token limit"
            value={maxTokens}
            onChange={(value) => onChange("maxTokens", value)}
            disableFn={onReset ? () => onReset("maxTokens") : undefined}
            defaultValue={DEFAULT_MODEL_SETTING.MAX_TOKENS}
            min={PARAM_RANGES.maxTokens.min}
            max={PARAM_RANGES.maxTokens.max}
            step={PARAM_RANGES.maxTokens.step}
            helpText={
              <>
                <p>Maximum number of tokens the model can generate in response.</p>
                <em>Note: Models have different context windows and max output tokens.</em>
              </>
            }
          />
        </FormField>
      )}

      {/* Temperature */}
      <FormField>
        <ParameterControl
          type="slider"
          optional={false}
          label="Temperature"
          value={temperature}
          onChange={(value) => onChange("temperature", value)}
          disableFn={onReset ? () => onReset("temperature") : undefined}
          defaultValue={PARAM_RANGES.temperature.default}
          min={PARAM_RANGES.temperature.min}
          max={PARAM_RANGES.temperature.max}
          step={PARAM_RANGES.temperature.step}
          helpText={
            <>
              <p>Controls randomness in the model output.</p>
              <ul className="tw-mt-2 tw-space-y-1 tw-text-xs">
                <li>0: Deterministic, focused output</li>
                <li>0.7: Balanced creativity</li>
                <li>1+: More random, creative output</li>
              </ul>
            </>
          }
        />
      </FormField>

      {/* Top P */}
      <FormField>
        <ParameterControl
          type="slider"
          optional={true}
          label="Top P"
          value={topP}
          onChange={(value) => onChange("topP", value)}
          disableFn={onReset ? () => onReset("topP") : undefined}
          defaultValue={PARAM_RANGES.topP.default}
          min={PARAM_RANGES.topP.min}
          max={PARAM_RANGES.topP.max}
          step={PARAM_RANGES.topP.step}
          helpText={
            <>
              <p>
                Controls token selection by probability mass. Lower values restrict selection to
                more likely tokens.
              </p>
              <em>Recommended: Keep at 0.9 unless you have specific reason to change.</em>
            </>
          }
        />
      </FormField>

      {/* Frequency Penalty */}
      <FormField>
        <ParameterControl
          type="slider"
          optional={true}
          label="Frequency Penalty"
          value={frequencyPenalty}
          onChange={(value) => onChange("frequencyPenalty", value)}
          disableFn={onReset ? () => onReset("frequencyPenalty") : undefined}
          defaultValue={PARAM_RANGES.frequencyPenalty.default}
          min={PARAM_RANGES.frequencyPenalty.min}
          max={PARAM_RANGES.frequencyPenalty.max}
          step={PARAM_RANGES.frequencyPenalty.step}
          helpText={
            <>
              <p>
                The frequency penalty parameter tells the model not to repeat a word that has
                already been used multiple times in the conversation.
              </p>
              <em>The higher the value, the more the model is penalized for repeating words.</em>
            </>
          }
        />
      </FormField>
    </div>
  );
}
