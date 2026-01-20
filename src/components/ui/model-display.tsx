import React from "react";
import { CustomModel } from "@/aiParams";
import { getProviderLabel } from "@/utils";
import { Lightbulb, Eye, Globe } from "lucide-react";

interface ModelDisplayProps {
  model: CustomModel;
  iconSize?: number;
}

interface ModelCapabilityIconsProps {
  capabilities?: string[];
  iconSize?: number;
}

export const ModelCapabilityIcons: React.FC<ModelCapabilityIconsProps> = ({
  capabilities = [],
  iconSize = 16,
}) => {
  return (
    <>
      {capabilities
        .sort((a, b) => a.localeCompare(b))
        .map((cap, index) => {
          switch (cap) {
            case "reasoning":
              return (
                <Lightbulb
                  key={index}
                  className="tw-text-model-capabilities-blue"
                  style={{ width: iconSize, height: iconSize }}
                />
              );
            case "vision":
              return (
                <Eye
                  key={index}
                  className="tw-text-model-capabilities-green"
                  style={{ width: iconSize, height: iconSize }}
                />
              );
            case "web_search":
              return (
                <Globe
                  key={index}
                  className="tw-text-model-capabilities-blue"
                  style={{ width: iconSize, height: iconSize }}
                />
              );
            default:
              return null;
          }
        })}
    </>
  );
};

export const ModelDisplay: React.FC<ModelDisplayProps> = ({ model, iconSize = 14 }) => {
  const displayName = model.displayName || model.name;
  return (
    <div className="tw-flex tw-min-w-0 tw-items-center tw-gap-1">
      <span className="tw-truncate tw-text-sm hover:tw-text-normal">{displayName}</span>
      {model.capabilities && model.capabilities.length > 0 && (
        <div className="tw-flex tw-shrink-0 tw-items-center tw-gap-0.5">
          <ModelCapabilityIcons capabilities={model.capabilities} iconSize={iconSize} />
        </div>
      )}
    </div>
  );
};

export const getModelDisplayText = (model: CustomModel): string => {
  const displayName = model.displayName || model.name;
  const provider = `(${getProviderLabel(model.provider)})`;
  return `${displayName} ${provider}`;
};

export const getModelDisplayWithIcons = (model: CustomModel): string => {
  const displayName = model.displayName || model.name;
  const provider = `(${getProviderLabel(model.provider, model)})`;
  const icons =
    model.capabilities
      ?.map((cap) => {
        switch (cap) {
          case "reasoning":
            return "Reasoning";
          case "vision":
            return "Vision";
          case "web_search":
            return "Websearch";
          default:
            return "";
        }
      })
      .join("|") || "";
  return `${displayName} ${provider} ${icons}`;
};
