<h1 align="center">Obsidian-Mate</h1>

<h2 align="center">
你第二大脑的终极 AI 助手
</h2>

<p align="center">
  <img src="https://img.shields.io/github/v/release/logancyang/obsidian-copilot?style=for-the-badge&sort=semver" alt="GitHub release (latest SemVer)">
  <img src="https://img.shields.io/badge/dynamic/json?logo=obsidian&color=%23483699&label=downloads&query=%24%5B%22copilot%22%5D.downloads&url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2Fmaster%2Fcommunity-plugin-stats.json&style=for-the-badge" alt="Obsidian Downloads">
</p>

<p align="center">
  <a href="https://www.obsidiancopilot.com/en/docs">文档</a> |
  <a href="https://www.youtube.com/@loganhallucinates">YouTube</a> |
  <a href="https://github.com/logancyang/obsidian-copilot/issues/new?template=bug_report.md">报告问题</a> |
  <a href="https://github.com/logancyang/obsidian-copilot/issues/new?template=feature_request.md">功能建议</a>
</p>

<p align="center">
  <a href="https://example.com](https://obsidian.md/blog/2024-goty-winners/">
    <img src="./images/reward-banner.svg" alt="Reward Banner" width="400"/>
  </a>
</p>

## 是什么

_Obsidian-Mate_ 是你的保险库内 AI 助手，支持基于聊天的保险库搜索、网页和 YouTube 搜索、强大的上下文处理能力，以及在 Obsidian 高度可定制的工作空间中不断扩展的智能体功能——所有这些都在你**自己的**掌控之下。

## 为什么

当今的 AI 巨头想要**困住你**：你的数据在他们服务器上，提示词锁定在他们的模型中，切换成本让你不断付费。当他们改变定价、关闭功能或终止你的账户时，你建造的一切都会失去。

我们正在构建相反的体验。我们的目标是创建一个可移植的智能体体验，没有供应商锁定。**数据永远是你的。** 使用任何你喜欢的 LLM。想象一下，一个全新的模型发布了，你在自己的硬件上运行它，它已经了解你（_长期记忆_），知道如何运行你随时间定义的*相同命令和工具*（仅仅是 markdown 文件），并成为你*拥有的*思维伙伴和助手。这是与你一起成长的 AI，而不是让你成为人质的订阅。

这是我们相信的未来。如果你认同这个愿景，请支持这个项目！

## 核心特性

- **🔒 你的数据 100% 属于你**：本地搜索和存储，如果你使用自托管模型，还可以完全控制你的数据。
- **🧠 使用你自己的模型**：使用任何 OpenAI 兼容或本地模型来发现见解、建立联系和创建内容。
- **🖼️ 多媒体理解**：插入网页、YouTube 视频、图片、PDF、EPUB 或实时网络搜索，快速获取见解。
- **🔍 智能保险库搜索**：用聊天搜索你的保险库，无需设置。嵌入是可选的。Obsidian-Mate 立即交付结果。
- **✍️ 组合器和快速命令**：用聊天交互你的写作，一键应用更改。
- **🗂️ 项目模式**：基于文件夹和标签创建 AI -ready 的上下文。想象一下 NotebookLM，但在你的保险库内！
- **🤖 智能体模式（Plus）**：解锁具有内置工具调用的自主智能体。无需命令。Obsidian-Mate 在相关时自动触发保险库、网络搜索或任何其他相关工具。

<p align="center">
  <em>Obsidian-Mate 的智能体可以按照你的请求自动调用适当的工具。</em>
</p>
<p align="center">
  <img src="./images/product-ui-screenshot.png" alt="产品界面截图" width="800"/>
</p>

## 目录

- [快速开始](#快速开始)
  - [安装 Obsidian-Mate](#安装-obsidian-mate)
  - [设置 API 密钥](#设置-api-密钥)
- [使用](#使用)
  - [免费用户](#免费用户)
  - [Obsidian-Mate Plus/Believer](#obsidian-mate-plusbeliever)
- [需要帮助？](#需要帮助)
- [常见问题](#常见问题)

## Obsidian-Mate V3：新时代 🔥

经过数月的努力，我们彻底重构了代码库，并为智能体基础设施采用了新的范式。这为更轻松地添加智能体工具打开了大门（MCP 支持即将推出）。我们将很快提供新版本的文档。以下是你不能错过的几个新功能：

- **面向所有用户**：你可以开箱即用地进行保险库搜索，**无需先构建索引**（索引仍然可用，但在 QA 设置的"语义搜索"切换后面可选）。
- **面向免费用户**：图片支持和聊天上下文菜单从 v3.0.0 开始对所有用户可用！
- **面向 Plus 用户**：**自主智能体**可用于保险库搜索、网络搜索、YouTube、Composer，很快还会有更多工具！**长期记忆**也是智能体可以从 3.1.0 开始自己使用的工具！

阅读[更新日志](https://github.com/logancyang/obsidian-copilot/releases/tag/3.0.0)。

## 用户评价 ❤️

- _"Obsidian-Mate 是将 Obsidian 变成真正的第二大脑的缺失环节。我用它起草包含文本、代码和可视化的投资备忘录——所有内容都在一个地方。它是第一个真正统一我搜索、处理、组织和检索知识的方式的工具，让我无需离开 Obsidian。具有 AI 驱动的搜索、组织和推理功能，我的笔记变得更加高效、深入和连贯，我无法想象没有它的日子。"_ - @jasonzhangb，投资者和研究分析师
- _"自从发现 Obsidian-Mate 以来，我的写作过程发生了彻底转变。与自己的文章和想法对话是我几十年来最 refreshing 的体验。"_ - Mat QV，作家
- _"Obsidian-Mate 改变了我们的家庭——不仅仅是作为一个生产力助手，而是作为一个治疗师。我把它介绍给了我不懂技术的妻子 Mania，她对女儿即将到来的考试感到压力；在一个小时内，她对自己的心态和下一步行动有了清晰的认识，找到了平静和信心。"_ - @screenfluent，一位亲爱的丈夫

## 快速开始

### 安装 Obsidian-Mate

1. 打开 **Obsidian → 设置 → 社区插件**。
2. 关闭**安全模式**（如果已启用）。
3. 点击**浏览**，搜索 **"Obsidian-Mate"**。
4. 点击**安装**，然后**启用**。

### 设置 API 密钥

**免费用户**

1. 前往 **Obsidian → 设置 → Obsidian-Mate → 基础** 并点击**设置密钥**。
2. 选择你的 AI 提供商（例如 **OpenRouter、Gemini、OpenAI、Anthropic、Cohere**）并粘贴你的 API 密钥。**推荐使用 OpenRouter。**

**Obsidian-Mate Plus/Believer**

1. 在你的[仪表板](https://www.obsidiancopilot.com/en/dashboard)复制你的许可证密钥。_别忘了加入我们精彩的 Discord 社区！_
2. 前往 **Obsidian → 设置 → Obsidian-Mate → 基础** 并将密钥粘贴到 **Obsidian-Mate Plus** 卡片中。

## 使用

### 目录

- [是什么](#是什么)
- [为什么](#为什么)
- [核心特性](#核心特性)
- [目录](#目录)
- [Obsidian-Mate V3：新时代 🔥](#obsidian-mate-v3新时代-)
- [用户评价 ❤️](#用户评价-)
- [快速开始](#快速开始)
  - [安装 Obsidian-Mate](#安装-obsidian-mate)
  - [设置 API 密钥](#设置-api-密钥)
- [使用](#使用)
  - [目录](#目录-1)
  - [免费用户](#免费用户)
    - [**聊天模式：参考笔记并与 Obsidian-Mate 讨论想法**](#聊天模式参考笔记并与-obsidian-mate-讨论想法)
    - [**保险库问答模式：与你的整个保险库对话**](#保险库问答模式与你的整个保险库对话)
    - [Obsidian-Mate 命令面板](#obsidian-mate-命令面板)
    - [**相关笔记：基于语义相似性和链接的笔记建议**](#相关笔记基于语义相似性和链接的笔记建议)
  - [Obsidian-Mate Plus/Believer](#obsidian-mate-plusbeliever)
    - [**从特定时间窗口获取精确见解**](#从特定时间窗口获取精确见解)
    - [**智能体模式：自主工具调用**](#智能体模式自主工具调用)
    - [**理解笔记中的图片**](#理解笔记中的图片)
    - [**一个提示，每个来源——PDF、视频和网页的即时摘要**](#一个提示每个来源pdf视频和网页的即时摘要)
- [**需要帮助？**](#需要帮助)
- [**常见问题**](#常见问题)
- [**🙏 感谢你**](#-感谢你)
- [**Obsidian-Mate Plus 声明**](#obsidian-mate-plus-声明)
- [**作者**](#作者)

### 免费用户

#### **聊天模式：参考笔记并与 Obsidian-Mate 讨论想法**

使用 `@` 添加上下文并与你的笔记聊天。

<p align="center">
    <img src="./images/Add-Context.png" alt="聊天模式" width="700">
</p>

向 Obsidian-Mate 提问：

> _总结 [[Q3 回顾]] 并根据 {01-Projects} 中的笔记确定 Q4 的前 3 个行动项。_

<p align="center">
    <img src="./images/Chat-Mode.png" alt="聊天模式" width="700">
</p>

#### **保险库问答模式：与你的整个保险库对话**

向 Obsidian-Mate 提问：

> _我的研究中关于 AI 和 SaaS 交叉点的 recurring themes 是什么？_

<p align="center">
    <img src="./images/Vault-Mode.png" alt="保险库模式" width="700">
</p>

#### Obsidian-Mate 命令面板

Obsidian-Mate 命令面板将强大的 AI 功能放在你的指尖。通过 `/` 或右键菜单访问聊天窗口中的所有命令。

**将选择添加到聊天上下文**

选择文本并将其添加到上下文。推荐快捷键：`ctrl/cmd + L`

<p align="center">
    <img src="./images/Add-Selection-to-Context.png" alt="将选择添加到上下文" width="700">
</p>

**快速命令**

选择文本并应用操作，无需打开聊天。推荐快捷键：`ctrl/cmd + K`

<p align="center">
    <img src="./images/Quick-Command.png" alt="快速命令" width="700">
</p>

**一键编辑并应用**

选择文本并右键点击一次进行编辑。

<p align="center">
    <img src="./images/One-Click-Commands.png" alt="一键命令" width="700">
</p>

**创建你的命令**

在 `设置 → Obsidian-Mate → 命令 → 添加命令` 中创建命令和工作流。

<p align="center">
    <img src="./images/Create-Command.png" alt="创建命令" width="700">
</p>

**聊天中的命令面板**

在聊天窗口中使用命令面板输入 `/`。

<p align="center">
    <img src="./images/Prompt-Palette.png" alt="提示面板" width="700">
</p>

#### **相关笔记：基于语义相似性和链接的笔记建议**

当有有用的相关内容和建议时自动出现。

使用它可以快速参考过去的研究、想法或决策——无需搜索或切换标签。

<p align="center">
    <img src="./images/Relevant-Notes.png" alt="相关笔记" width="700">
</p>

### Obsidian-Mate Plus/Believer

Obsidian-Mate Plus 带来强大的 AI 智能体能力、上下文感知操作和无缝工具集成——旨在提升你在 Obsidian 中的知识工作。

#### **从特定时间窗口获取精确见解**

在智能体模式下，向 Obsidian-Mate 提问：

> _我上周做了什么？_

<p align="center">
    <img src="./images/Time-Based-Queries.png" alt="基于时间的查询" width="700">
</p>

#### **智能体模式：自主工具调用**

Obsidian-Mate 的智能体自动调用正确的工具——无需手动命令。只需提问，它就会搜索网络、查询你的保险库，无缝地结合见解。

在智能体模式下向 Obsidian-Mate 提问：

> _研究网络和我的保险库，并起草一份关于 AI SaaS 入职最佳实践的笔记。_

<p align="center">
    <img src="./images/Agent-Mode.png" alt="智能体模式" width="700">
</p>

#### **理解笔记中的图片**

Obsidian-Mate 可以分析笔记中嵌入的图片——从线框图和图表到截图和照片。基于视觉内容获取详细的反馈、建议和见解。

要求 Obsidian-Mate 分析你的线框图：

> _分析 [[UX Design - Mobile App Wireframes]] 中的线框图，并建议导航流程的改进。_

<p align="center">
    <img src="./images/Note-Image.png" alt="图片理解" width="700">
</p>

#### **一个提示，每个来源——PDF、视频和网页的即时摘要**

在智能体模式下，向 Obsidian-Mate 提问

> _比较来自这个 YouTube 视频：[URL]，这个 PDF：[文件]，以及 @web[搜索结果] 中关于 [智能体记忆] 的信息。在你的回复中先用要点总结你的结论_

<p align="center">
    <img src="./images/One-Prompt-Every-Source.png" alt="一个提示，每个来源" width="700">
</p>

## **需要帮助？**

- 查看[文档](https://www.obsidiancopilot.com/en/docs)获取设置指南、使用方法和高级功能。
- 观看 [YouTube](https://www.youtube.com/@loganhallucinates) 获取教程。
- 如果你遇到 bug 或有新功能想法，请按照以下步骤帮助我们更快地帮助你：
  - 🐛 Bug 报告清单
    - ☑️ 报告问题时使用 [bug 报告模板](https://github.com/logancyang/obsidian-copilot/issues/new?template=bug_report.md)
    - ☑️ 在 Obsidian-Mate 设置 → 高级中启用调试模式以获取更详细的日志
    - ☑️ 打开开发者控制台收集错误信息：
      - Mac: Cmd + Option + I
      - Windows: Ctrl + Shift + I
    - ☑️ 关闭其他插件，只保留 Obsidian-Mate 启用
    - ☑️ 将相关控制台日志附加到你的报告中
    - ☑️ 在[这里](https://github.com/logancyang/obsidian-copilot/issues/new?template=bug_report.md)提交你的 bug 报告
  - 💡 功能建议清单
    - ☗ 使用[功能建议模板](https://github.com/logancyang/obsidian-copilot/issues/new?template=feature_request.md)请求新功能
    - ☑️ 清楚地描述功能、为什么重要以及如何提供帮助
    - ☑️ 在[这里](https://github.com/logancyang/obsidian-copilot/issues/new?template=feature_request.md)提交你的功能建议

## **常见问题**

<details>
  <summary><strong>为什么保险库搜索找不到我的笔记？</strong></summary>

如果你正在使用保险库问答模式（或 Plus 中的工具 <code>@vault</code>），请尝试以下操作：

- 确保你的 AI 模型提供商有可用的嵌入模型（例如 OpenAI）。观看此视频：[AI 模型设置（API 密钥）](https://www.youtube.com/watch?v=mzMbiamzOqM)
- 确保你的 Obsidian-Mate 索引是最新的。观看此视频：[保险库模式](https://www.youtube.com/watch?v=hBLMWE8WRFU)
- 如果问题持续存在，运行<strong>强制重新索引</strong>或使用<strong>列出索引文件</strong>命令面板来检查索引中包含的内容。
- ⚠️ <strong>索引后不要切换嵌入模型</strong>——这可能会破坏结果。
</details>

<details>
  <summary><strong>为什么我的 AI 模型返回错误代码 429："配额不足"？</strong></summary>

最有可能发生这种情况是因为你没有为所选模型提供商配置账单——或者你已经达到了月度配额。例如，OpenAI 通常将个人账户限制在每月 $120。解决方法是：

- ▶️ 观看"AI 模型设置"视频：[AI 模型设置（API 密钥）](https://www.youtube.com/watch?v=mzMbiamzOqM)
- 🔍 在你的 OpenAI 仪表板中验证账单设置
- 💳 添加付款方式（如果没有）
- 📊 检查你的使用仪表板是否有任何配额或限制警告

如果你使用不同的提供商，请参考他们的文档和账单政策了解等效步骤。

</details>

<details>
  <summary><strong>为什么我收到 token 限制错误？</strong></summary>

请参考你的模型提供商的文档了解上下文窗口大小。

⚠️ 如果你在 Obsidian-Mate 设置中设置了较大的<strong>最大 token 限制</strong>，可能会遇到此错误。

- <strong>最大 tokens</strong> 指的是<em>完成 tokens</em>，而不是输入 tokens。
- 更高的输出 token 限制意味着输入空间更少！

🧠 Obsidian-Mate 命令的后台提示也会消耗 tokens，因此：

- 保持你的消息长度简短
- 设置合理的最大 token 值以避免达到上限

💡 对于无限上下文的问答，请在 dropdown 中切换到<strong>保险库问答</strong>模式（需要 Obsidian-Mate v2.1.0+）。

</details>

## **🙏 感谢你**

如果你认同构建最强大的第二大脑 AI 智能体的愿景，请考虑[赞助这个项目](https://github.com/sponsors/logancyang)或给我买杯咖啡。通过在 Twitter/X、Reddit 或你喜欢的平台上分享 Obsidian-Mate 来帮助传播这个词！

<p align="center">
  <img src="https://camo.githubusercontent.com/7b8f7343bfc6e3c65c7901846637b603fd812f1a5f768d8b0572558bde859eb9/68747470733a2f2f63646e2e6275796d6561636f666665652e636f6d2f627574746f6e732f76322f64656661756c742d79656c6c6f772e706e67" alt="BuyMeACoffee" width="200">
</p>

**鸣谢**

特别感谢我们的顶级赞助商：@mikelaaron、@pedramamini、@Arlorean、@dashinja、@azagore、@MTGMAD、@gpythomas、@emaynard、@scmarinelli、@borthwick、@adamhill、@gluecode、@rusi、@timgrote、@JiaruiYu-Consilium、@ddocta、@AMOz1、@chchwy、@pborenstein、@GitTom、@kazukgw、@mjluser1、@joesfer、@rwaal、@turnoutnow-harpreet、@dreznicek、@xrise-informatik、@jeremygentles、@ZhengRui、@bfoujols、@jsmith0475、@pagiaddlemon、@sebbyyyywebbyyy、@royschwartz2、@vikram11、@amiable-dev、@khalidhalim、@DrJsPBs、@chishaku、@Andrea18500、@shayonpal、@rhm2k、@snorcup、@JohnBub、@obstinatelark、@jonashaefele、@vishnu2kmohan

## **Obsidian-Mate Plus 声明**

Obsidian-Mate Plus 是 Brevilabs LLC 的高级产品，与 Obsidian 无关。它为 Obsidian 提供了强大的智能体 AI 集成。请在我们的网站 [obsidiancopilot.com](https://www.obsidiancopilot.com/) 了解更多详情！

- 需要账户和付款才能获得完全访问权限。
- Obsidian-Mate Plus 需要使用网络来促进 AI 智能体运行。
- **隐私与数据处理**：
  - **免费版**：你的消息和笔记只会发送到你配置的 LLM 提供商（OpenAI、Anthropic、Google 等）。不会发送到 Brevilabs 服务器。
  - **Plus 版**：消息发送到你配置的 LLM 提供商。文件转换（PDF、DOCX、EPUB、图片等）仅在你通过 `@` 命令明确触发这些功能时才由 Brevilabs 服务器处理。
  - **处理与保留**：我们处理你的数据以交付你请求的功能，然后丢弃它。处理后不会在我们的服务器上保留任何消息内容、文件上传或文档。
  - **用户 ID**：随机生成的 UUID 与 Plus API 请求一起发送，用于服务交付（许可证滥用预防、速率限制），但不用于用户跟踪、分析或分析。
- 请查看网站上的隐私政策了解更多详情。
- Obsidian-Mate 插件的前端代码是完全开源的。然而，促进 AI 智能体的后端代码是闭源和专有的。
- 如果你对产品不满意，我们提供 14 天内无条件全额退款。

## **作者**

Brevilabs 团队 | 邮箱：logan@brevilabs.com | X/Twitter：[@logancyang](https://twitter.com/logancyang)
