# Obsidian Copilot 项目概述

## 项目简介

Obsidian Copilot 是一个为 Obsidian 笔记应用设计的 AI 助手插件，旨在成为用户第二大脑的终极 AI 助手。它提供了基于聊天的仓库搜索、网络和 YouTube 支持、强大的上下文处理能力，以及在 Obsidian 高度可定制工作空间内不断扩展的智能体功能，同时确保数据始终由用户自己控制。

## 核心特性

- **数据隐私保护**：本地搜索和存储，完全控制数据（如果使用自托管模型）
- **支持多种模型**：可以接入任何与 OpenAI 兼容或本地运行的模型
- **多媒体理解**：支持网页、YouTube 视频、图像、PDF、EPUB 或实时网络搜索
- **智能仓库搜索**：无需设置即可进行聊天式仓库搜索，嵌入是可选的
- **Composer 和快速命令**：通过聊天与写作互动，一键应用更改
- **项目模式**：基于文件夹和标签创建 AI 就绪的上下文
- **智能体模式（Plus版）**：解锁具有内置工具调用的自主智能体

## 技术架构

### 主要技术栈
- **前端框架**：React + TypeScript
- **样式**：Tailwind CSS + Radix UI 组件
- **状态管理**：Jotai
- **AI 框架**：LangChain.js 及其生态系统
- **构建工具**：esbuild
- **测试框架**：Jest

### 关键组件
1. **LLMProviders**：AI 模型提供商的集成层，支持 OpenAI、Anthropic、Google Gemini、Ollama 等
2. **ChatManager**：聊天会话管理器，处理消息历史和对话流程
3. **VectorStoreManager**：向量存储管理器，用于语义搜索
4. **CopilotView**：主要的 UI 组件，提供聊天界面
5. **Settings System**：集中化的设置管理系统，使用 Jotai 进行状态管理

### 文件结构
- `src/` - 主要源代码
  - `components/` - React UI 组件
  - `LLMProviders/` - AI 模型提供商集成
  - `commands/` - Obsidian 命令实现
  - `search/` - 搜索功能实现
  - `settings/` - 设置相关逻辑
  - `tools/` - 各种 AI 工具实现
  - `services/` - 后台服务
  - `contexts/` - React 上下文
  - `hooks/` - 自定义 React Hooks
  - `utils/` - 工具函数
  - `types/` - 类型定义
  - `memory/` - 用户记忆管理
  - `imageProcessing/` - 图像处理功能

## 构建和运行

### 开发环境设置
1. Fork 仓库
2. 在 Obsidian 插件目录中克隆仓库
3. 运行 `npm install` 安装依赖
4. 运行 `npm run dev` 启动开发服务器

### 构建命令
- `npm run dev` - 启动开发模式（监听文件变化）
- `npm run build` - 构建生产版本
- `npm run lint` - 检查代码风格
- `npm run format` - 格式化代码
- `npm run test` - 运行单元测试
- `npm run test:integration` - 运行集成测试

## 开发约定

### 代码风格
- 使用 TypeScript 编写类型安全的代码
- 遵循 React 最佳实践
- 使用 Tailwind CSS 进行样式设计
- 遵循 Obsidian 插件开发规范

### 测试
- 对于提示词变更，需要运行集成测试
- 手动测试清单包括：新鲜安装、聊天模式、仓库问答、Plus 模式、设置等

### 贡献流程
1. Fork 仓库并在分支上进行开发
2. 确保代码符合现有风格
3. 充分测试变更
4. 提交描述性的 PR，链接到相关 issue
5. 在提交前运行 `npm run format` 格式化代码

## 重要配置

### API 密钥支持
插件支持多种 AI 服务提供商的 API 密钥：
- OpenAI
- Anthropic
- Google Gemini
- Azure OpenAI
- Hugging Face
- Cohere
- OpenRouter
- Groq
- Mistral AI
- DeepSeek
- Amazon Bedrock
- SiliconFlow

### 设置管理
使用 Jotai 进行全局状态管理，所有设置都集中在一个 `CopilotSettings` 接口中，并通过原子更新机制保持一致性。

## 特殊功能

### 智能体模式
Plus 版本提供自主智能体功能，能够自动调用适当的工具（仓库搜索、网络搜索、YouTube、Composer 等），无需手动命令。

### 语义搜索
支持使用向量数据库进行语义搜索，可以选择不同的嵌入模型提供商，并提供混合检索功能。

### 记忆管理
包含长期记忆功能，允许智能体记住用户的重要信息和偏好。

## 许可证

该项目采用 GNU Affero General Public License v3.0 (AGPL-3.0) 许可证，确保软件始终保持开源和自由。