<h1 align="center">AX Copilot for Obsidian</h1>

<h2 align="center">
基于 Obsidian Copilot 的中文修改版
</h2>

<p align="center">
  <img src="https://img.shields.io/badge/version-3.1.5--ax1-blue?style=for-the-badge" alt="版本">
</p>

## 项目说明

这是 [Obsidian Copilot](https://github.com/AndersHsueh/obsidian-copilot) 的中文修改版本，主要修改内容：

1. **完整中文界面** - 设置界面、对话控件等全部汉化
2. **移除授权验证** - 所有 Plus/Believer 功能无需许可证即可使用
3. **自托管模式优化** - 始终可用，无需在线验证

## 主要功能

- **🔒 数据完全自主**: 本地搜索和存储，使用自托管模型时完全控制您的数据
- **🧠 自带模型**: 接入任何 OpenAI 兼容或本地模型，发现洞察、激发联想、创作内容
- **🖼️ 多媒体理解**: 支持网页、YouTube 视频、图片、PDF、EPUB 等内容的快速洞察
- **🔍 智能知识库搜索**: 通过聊天搜索您的知识库，无需设置，即开即用
- **✍️ 编辑器和快捷命令**: 通过聊天与您的写作互动，一键应用更改
- **🗂️ 项目模式**: 基于文件夹和标签创建 AI 就绪的上下文
- **🤖 智能代理模式**: 解锁具有内置工具调用的自主代理

## 安装方法

### 方式一：手动安装（推荐）

1. 下载最新发布版本的 `main.js`、`manifest.json`、`styles.css`
2. 在您的 Obsidian 知识库中创建文件夹：`.obsidian/plugins/ax-copilot/`
3. 将下载的三个文件复制到该文件夹
4. 重启 Obsidian
5. 在设置中启用插件

### 方式二：从源码构建

```bash
# 克隆仓库
git clone <repository-url>
cd obsidian-copilot

# 安装依赖
npm install

# 构建
npm run build

# 复制构建产物到您的插件目录
# main.js, manifest.json, styles.css
```

## 配置 API 密钥

1. 打开 **Obsidian → 设置 → AX Copilot → 通用设置**
2. 点击 **设置密钥**
3. 选择您的 AI 服务商（如 OpenRouter、Gemini、OpenAI、Anthropic 等）
4. 粘贴您的 API 密钥

**推荐使用 OpenRouter**，它提供多种模型的统一接口。

## 使用模式

### 聊天模式（免费）

使用 `@` 添加上下文并与您的笔记聊天。

### 知识库问答模式（免费）

与您的整个知识库进行对话，获取跨笔记的洞察。

### Copilot Plus 模式

增强的 AI 代理能力，包含自动工具调用。

### 项目模式（测试版）

为特定项目创建独立的上下文环境。

## 开发命令

```bash
# 构建
npm run build

# 代码检查
npm run lint
npm run lint:fix

# 格式化
npm run format

# 测试
npm run test
```

## 技术架构

- **LLM 服务商系统**: 支持 OpenAI、Anthropic、Google、Azure、本地模型等
- **链工厂模式**: 不同的 AI 操作链类型（聊天、Copilot、自定义提示）
- **向量存储与搜索**: 嵌入和语义搜索管理
- **React UI 组件**: Radix UI 原语 + Tailwind CSS
- **消息管理架构**: 单一数据源的消息仓库模式

## 注意事项

- 本项目仅供学习研究使用
- 原项目 [Obsidian Copilot](https://github.com/logancyang/obsidian-copilot) 由 Brevilabs 团队开发
- 如果您觉得有用，请考虑支持原作者

## 许可证

MIT License - 详见 [LICENSE](./LICENSE)

## 致谢

感谢 [Logan Yang](https://twitter.com/logancyang) 和 Brevilabs 团队创建了出色的 Obsidian Copilot 插件。
