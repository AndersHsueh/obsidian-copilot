import { Button } from "@/components/ui/button";
import { LocalServicesSection } from "@/settings/v2/components/LocalServicesSection";
import { ChevronRight, Info } from "lucide-react";
import { App, Modal } from "obsidian";
import React from "react";
import { createRoot, Root } from "react-dom/client";
import { useTranslation } from "react-i18next";

interface ApiKeyModalContentProps {
  onClose: () => void;
  onGoToModelTab?: () => void;
}

function ApiKeyModalContent({ onClose, onGoToModelTab }: ApiKeyModalContentProps) {
  const { t } = useTranslation();

  return (
    <div className="tw-p-4 sm:tw-max-w-[500px]">
      <div className="tw-mb-4">
        <h2 className="tw-text-xl tw-font-bold">AI Provider Settings</h2>
        <p className="tw-text-sm tw-text-muted">
          Obsidian-Mate uses local AI models only. No API keys required.
        </p>
      </div>

      <div className="tw-space-y-6 tw-py-4">
        {/* Local Services Section */}
        <LocalServicesSection />

        {/* Configuration guide */}
        {onGoToModelTab && (
          <div className="tw-mt-4 tw-border-t tw-border-border tw-pt-4">
            <div className="tw-rounded-lg tw-border tw-p-4 tw-bg-secondary/30 tw-border-border/60">
              <div className="tw-flex tw-gap-3">
                <div className="tw-mt-0.5 tw-shrink-0">
                  <Info className="tw-size-5 tw-text-accent" />
                </div>
                <div className="tw-flex-1">
                  <h4 className="tw-mb-1 tw-text-sm tw-font-semibold">Configure Local Models</h4>
                  <p className="tw-mb-3 tw-text-xs tw-leading-relaxed tw-text-muted">
                    Select and configure your local Ollama or LM Studio models in the Model Settings
                    tab.
                  </p>
                  <button
                    onClick={() => {
                      onGoToModelTab();
                      onClose();
                    }}
                    className="tw-group tw-flex tw-items-center tw-gap-1 tw-text-sm tw-font-medium tw-text-accent hover:tw-text-accent-hover"
                  >
                    Go to Model Settings
                    <ChevronRight className="tw-size-4 tw-transition-transform group-hover:tw-translate-x-0.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="tw-mt-4 tw-flex tw-justify-end">
        <Button onClick={onClose}>{t("common.close")}</Button>
      </div>
    </div>
  );
}

export class ApiKeyDialog extends Modal {
  private root: Root;
  private onGoToModelTab?: () => void;

  constructor(app: App, onGoToModelTab?: () => void) {
    super(app);
    this.onGoToModelTab = onGoToModelTab;
  }

  onOpen() {
    const { contentEl } = this;
    this.root = createRoot(contentEl);

    this.root.render(
      <ApiKeyModalContent onClose={() => this.close()} onGoToModelTab={this.onGoToModelTab} />
    );
  }

  onClose() {
    this.root.unmount();
  }
}
