import { PatternMatchingModal } from "@/components/modals/PatternMatchingModal";
import { RebuildIndexConfirmModal } from "@/components/modals/RebuildIndexConfirmModal";
import { SemanticSearchToggleModal } from "@/components/modals/SemanticSearchToggleModal";
import { Button } from "@/components/ui/button";
import { getModelDisplayWithIcons } from "@/components/ui/model-display";
import { SettingItem } from "@/components/ui/setting-item";
import { HelpTooltip } from "@/components/ui/help-tooltip";
import { VAULT_VECTOR_STORE_STRATEGIES } from "@/constants";
import { getModelKeyFromModel, updateSetting, useSettingsValue } from "@/settings/model";
import { Notice } from "obsidian";
import React from "react";

export const QASettings: React.FC = () => {
  const settings = useSettingsValue();

  const handleSetDefaultEmbeddingModel = async (modelKey: string) => {
    if (modelKey === settings.embeddingModelKey) return;

    if (settings.enableSemanticSearchV3) {
      // Persist only after user confirms rebuild
      new RebuildIndexConfirmModal(app, async () => {
        updateSetting("embeddingModelKey", modelKey);
        const VectorStoreManager = (await import("@/search/vectorStoreManager")).default;
        await VectorStoreManager.getInstance().indexVaultToVectorStore(false);
      }).open();
      return;
    }

    // Persist without rebuild when semantic search is disabled
    updateSetting("embeddingModelKey", modelKey);
    new Notice("嵌入模型已保存。启用语义搜索以构建索引。");
  };

  // Partitions are automatically managed in v3 (150MB per JSONL partition).
  // Remove UI control; keep handler stub to avoid accidental usage.
  // const handlePartitionsChange = (_value: string) => {};

  return (
    <div className="tw-space-y-4">
      <section>
        <div className="tw-space-y-4">
          {/* Enable Semantic Search (v3) */}
          <SettingItem
            type="switch"
            title="启用语义搜索"
            description="启用基于语义的文档检索。禁用时仅使用快速词法搜索。使用「刷新知识库索引」或「强制重建知识库索引」来构建嵌入索引。"
            checked={settings.enableSemanticSearchV3}
            onCheckedChange={(checked) => {
              // Show confirmation modal with appropriate message
              new SemanticSearchToggleModal(
                app,
                async () => {
                  updateSetting("enableSemanticSearchV3", checked);
                  if (checked) {
                    const VectorStoreManager = (await import("@/search/vectorStoreManager"))
                      .default;
                    await VectorStoreManager.getInstance().indexVaultToVectorStore(false);
                  }
                },
                checked // true = enabling, false = disabling
              ).open();
            }}
          />

          {/* Enable Inline Citations */}
          <SettingItem
            type="switch"
            title="启用内联引用 (实验性)"
            description="启用后，AI 回复将在文本中包含脚注式引用，并在末尾列出编号来源。这是一个实验性功能，可能不适用于所有模型。"
            checked={settings.enableInlineCitations}
            onCheckedChange={(checked) => updateSetting("enableInlineCitations", checked)}
          />

          {/* Embedding Model - Always shown to reduce ambiguity */}
          <SettingItem
            type="select"
            title="嵌入模型"
            description={
              <div className="tw-space-y-2">
                <div className="tw-flex tw-items-center tw-gap-1.5">
                  <span className="tw-font-medium tw-leading-none tw-text-accent">
                    为语义知识库搜索和相关笔记功能提供支持。启用语义搜索以使用它。
                  </span>
                  <HelpTooltip
                    content={
                      <div className="tw-flex tw-max-w-96 tw-flex-col tw-gap-2">
                        <div className="tw-pt-2 tw-text-sm tw-text-muted">
                          此模型将文本转换为向量表示，对于语义搜索和问答 (QA) 功能至关重要。
                          更改嵌入模型将：
                        </div>
                        <ul className="tw-pl-4 tw-text-sm tw-text-muted">
                          <li>需要重建您知识库的向量索引</li>
                          <li>影响语义搜索质量</li>
                          <li>影响问答功能性能</li>
                        </ul>
                      </div>
                    }
                  />
                </div>
              </div>
            }
            value={settings.embeddingModelKey}
            onChange={handleSetDefaultEmbeddingModel}
            options={settings.activeEmbeddingModels.map((model) => ({
              label: getModelDisplayWithIcons(model),
              value: getModelKeyFromModel(model),
            }))}
            placeholder="模型"
          />

          {/* Auto-Index Strategy */}
          <SettingItem
            type="select"
            title="自动索引策略"
            description={
              <div className="tw-flex tw-items-center tw-gap-1.5">
                <span className="tw-leading-none">决定何时对知识库进行索引。</span>
                <HelpTooltip
                  content={
                    <div className="tw-space-y-2 tw-py-2">
                      <div className="tw-space-y-1">
                        <div className="tw-text-sm tw-text-muted">选择何时索引您的知识库：</div>
                        <ul className="tw-list-disc tw-space-y-1 tw-pl-2 tw-text-sm">
                          <li>
                            <div className="tw-flex tw-items-center tw-gap-1">
                              <strong className="tw-inline-block tw-whitespace-nowrap">
                                NEVER（从不）：
                              </strong>
                              <span>仅通过命令或刷新手动索引</span>
                            </div>
                          </li>
                          <li>
                            <div className="tw-flex tw-items-center tw-gap-1">
                              <strong className="tw-inline-block tw-whitespace-nowrap">
                                ON STARTUP（启动时）：
                              </strong>
                              <span>插件加载或重新加载时更新索引</span>
                            </div>
                          </li>
                          <li>
                            <div className="tw-flex tw-items-center tw-gap-1">
                              <strong className="tw-inline-block tw-whitespace-nowrap">
                                ON MODE SWITCH（切换模式时）：
                              </strong>
                              <span>进入问答模式时更新（推荐）</span>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <p className="tw-text-sm tw-text-callout-warning">
                        警告：对于使用付费模型的大型知识库，可能会产生费用
                      </p>
                    </div>
                  }
                />
              </div>
            }
            value={settings.indexVaultToVectorStore}
            onChange={(value) => {
              updateSetting("indexVaultToVectorStore", value);
            }}
            options={VAULT_VECTOR_STORE_STRATEGIES.map((strategy) => ({
              label: strategy,
              value: strategy,
            }))}
            placeholder="策略"
          />

          {/* Max Sources */}
          <SettingItem
            type="slider"
            title="最大来源数"
            description="Copilot 会遍历您的知识库找到相关笔记，并将前 N 个传递给 LLM。N 的默认值为 15。如果希望在回答生成步骤中包含更多笔记，请增加此值。"
            min={1}
            max={128}
            step={1}
            value={settings.maxSourceChunks}
            onChange={(value) => updateSetting("maxSourceChunks", value)}
          />

          {/* Embedding-related settings - Only shown when semantic search is enabled */}
          {settings.enableSemanticSearchV3 && (
            <>
              {/* Requests per Minute */}
              <SettingItem
                type="slider"
                title="每分钟请求数"
                description="默认为 60。如果被嵌入服务商限速，请降低此值。"
                min={10}
                max={60}
                step={10}
                value={Math.min(settings.embeddingRequestsPerMin, 60)}
                onChange={(value) => updateSetting("embeddingRequestsPerMin", value)}
              />

              {/* Embedding batch size */}
              <SettingItem
                type="slider"
                title="嵌入批量大小"
                description="默认为 16。如果被嵌入服务商限速，请增加此值。"
                min={1}
                max={128}
                step={1}
                value={settings.embeddingBatchSize}
                onChange={(value) => updateSetting("embeddingBatchSize", value)}
              />

              {/* Number of Partitions */}
              <SettingItem
                type="select"
                title="分区数量"
                description="Copilot 索引的分区数量。默认为 1。如果在索引大型知识库时遇到问题，请增加此值。警告：更改需要清除并重建索引！"
                value={String(settings.numPartitions || 1)}
                onChange={(value) => updateSetting("numPartitions", Number(value))}
                options={[
                  { label: "1", value: "1" },
                  { label: "2", value: "2" },
                  { label: "4", value: "4" },
                  { label: "8", value: "8" },
                  { label: "16", value: "16" },
                  { label: "32", value: "32" },
                  { label: "40", value: "40" },
                ]}
                placeholder="选择分区数"
              />
            </>
          )}

          {/* Lexical Search RAM Limit */}
          <SettingItem
            type="slider"
            title="词法搜索内存限制"
            description="全文搜索索引的最大内存使用量。较低的值使用更少内存，但可能会限制大型知识库的搜索性能。默认为 100 MB。"
            min={20}
            max={1000}
            step={20}
            value={settings.lexicalSearchRamLimit || 100}
            onChange={(value) => updateSetting("lexicalSearchRamLimit", value)}
            suffix=" MB"
          />

          {/* Enable Folder and Graph Boosts */}
          <SettingItem
            type="switch"
            title="启用文件夹和图谱加权"
            description="为词法搜索结果启用基于文件夹和图谱的相关性加权。禁用后，提供纯粹基于关键词的相关性评分，不包含文件夹或连接的调整。"
            checked={settings.enableLexicalBoosts}
            onCheckedChange={(checked) => updateSetting("enableLexicalBoosts", checked)}
          />

          {/* Exclusions */}
          <SettingItem
            type="custom"
            title="排除项"
            description={
              <>
                <p>
                  排除文件夹、标签、笔记标题或文件扩展名不被索引。
                  之前已索引的文件将保留，直到执行强制重新索引。
                </p>
              </>
            }
          >
            <Button
              variant="secondary"
              onClick={() =>
                new PatternMatchingModal(
                  app,
                  (value) => updateSetting("qaExclusions", value),
                  settings.qaExclusions,
                  "管理排除项"
                ).open()
              }
            >
              管理
            </Button>
          </SettingItem>

          {/* Inclusions */}
          <SettingItem
            type="custom"
            title="包含项"
            description={
              <p>
                仅索引指定的路径、标签或笔记标题。排除项优先于包含项。
                之前已索引的文件将保留，直到执行强制重新索引。
              </p>
            }
          >
            <Button
              variant="secondary"
              onClick={() =>
                new PatternMatchingModal(
                  app,
                  (value) => updateSetting("qaInclusions", value),
                  settings.qaInclusions,
                  "管理包含项"
                ).open()
              }
            >
              管理
            </Button>
          </SettingItem>

          {/* Enable Obsidian Sync */}
          <SettingItem
            type="switch"
            title="为 Copilot 索引启用 Obsidian 同步"
            description="启用后，将语义索引存储在 .obsidian 文件夹中，以便与 Obsidian 同步。禁用后，存储在知识库根目录的 .copilot/ 下。"
            checked={settings.enableIndexSync}
            onCheckedChange={(checked) => updateSetting("enableIndexSync", checked)}
          />

          {/* Disable index loading on mobile */}
          <SettingItem
            type="switch"
            title="在移动端禁用索引加载"
            description="启用后，Copilot 索引不会在移动设备上加载以节省资源。仅聊天模式可用。从桌面同步的任何现有索引将被保留。取消勾选以在移动端启用问答模式。"
            checked={settings.disableIndexOnMobile}
            onCheckedChange={(checked) => updateSetting("disableIndexOnMobile", checked)}
          />
        </div>
      </section>
    </div>
  );
};
