# Chain Runner 架构与工具调用系统

本目录包含 Obsidian Copilot 重构后的链运行器系统，提供多种链执行策略及不同的工具调用方式。

## 概述

链运行器系统提供两种工具调用方式：

1. **Copilot Plus**（CopilotPlusChainRunner）— 使用原生工具调用进行意图分析
2. **自主智能体**（AutonomousAgentChainRunner）— 使用 LangChain 原生工具调用与 ReAct 模式

## 架构

```
chainRunner/
├── BaseChainRunner.ts                 # 抽象基类，共享通用逻辑
├── LLMChainRunner.ts                  # 基础 LLM 交互（无工具）
├── VaultQAChainRunner.ts              # 仅知识库问答与检索
├── CopilotPlusChainRunner.ts          # 旧版工具调用系统
├── ProjectChainRunner.ts              # 基于 Plus 的项目感知扩展
├── AutonomousAgentChainRunner.ts      # 使用 ReAct 智能体循环的原生工具调用
├── index.ts                           # 主入口导出
└── utils/
    ├── ThinkBlockStreamer.ts          # 处理模型的思考内容
    ├── xmlParsing.ts                  # XML 转义/反转义（用于上下文信封）
    ├── toolExecution.ts               # 工具执行辅助
    └── modelAdapter.ts                # 模型相关适配
```

## 工具调用系统对比

### 1. 基于模型的工具规划（CopilotPlusChainRunner）

**工作方式：**

- 使用带 `bindTools()` 的聊天模型规划要调用的工具
- 模型通过 AIMessage 上的原生 `tool_calls` 属性输出工具调用
- 在发送给 LLM 生成最终回复前同步执行工具
- 用工具输出增强用户消息作为上下文
- 支持通过 `@` 命令显式调用工具（`@vault`、`@websearch`、`@memory`）

**流程：**

```
用户消息 → 模型规划 → 工具执行 → 增强提示 → LLM 回复
```

**示例：**

```typescript
// 1. 用模型规划工具
const { toolCalls, salientTerms } = await this.planToolCalls(message, chatModel);

// 2. 处理 @ 命令（按需添加 localSearch、webSearch 等）
toolCalls = await this.processAtCommands(message, toolCalls, { salientTerms });

// 3. 执行工具
const toolOutputs = await this.executeToolCalls(toolCalls);

// 4. 发送给 LLM
const response = await this.streamMultimodalResponse(message, toolOutputs, ...);
```

**可用工具：**

- `localSearch` — 搜索知识库内容
- `webSearch` — 网络搜索
- `getCurrentTime` — 获取当前时间
- `getFileTree` — 获取文件结构
- `pomodoroTool` — 番茄钟计时
- `youtubeTranscription` — YouTube 视频转录

### 2. 自主智能体（AutonomousAgentChainRunner）

**工作方式：**

- 通过 `bindTools()` 使用 LangChain 原生工具调用与 ReAct 模式
- AI 通过结构化的 `tool_calls` 自主决定使用哪些工具
- 迭代循环中 AI 可依次调用多个工具
- 每次工具结果通过 `ToolMessage` 参与下一轮决策

**流程：**

```
用户消息 → AI 推理 → tool_calls → 工具执行 →
ToolMessage → AI 分析 → 是否继续调用工具？ → 最终回复
```

**原生工具调用格式：**

```typescript
// AIMessage.tool_calls 包含结构化工具调用
const toolCalls = response.tool_calls; // 数组元素为 { name, args, id }

// 示例工具调用：
{
  name: "localSearch",
  args: {
    query: "machine learning notes",
    salientTerms: ["machine", "learning", "AI", "algorithms"]
  },
  id: "call_abc123"
}
```

**ReAct 循环：**

```typescript
// 将工具绑定到模型以支持原生工具调用
const boundModel = chatModel.bindTools(availableTools);

while (iteration < maxIterations) {
  // 1. 获取可能包含工具调用的 AI 回复
  const response = await boundModel.invoke(messages);
  messages.push(response);

  // 2. 检查结构化格式中的工具调用
  if (!response.tool_calls || response.tool_calls.length === 0) {
    // 无需工具 — 最终回复
    break;
  }

  // 3. 执行每个工具并添加 ToolMessage
  for (const toolCall of response.tool_calls) {
    const result = await executeSequentialToolCall(toolCall, availableTools);
    messages.push(
      new ToolMessage({
        content: JSON.stringify(result),
        tool_call_id: toolCall.id,
        name: toolCall.name,
      })
    );
  }

  // 4. 继续循环 — AI 通过 ToolMessage 看到工具结果
}
```

### ReAct 提示流程

每次迭代向 LLM 发送的消息结构如下：

**第 1 轮（初始）：**

```
messages = [
  SystemMessage: "You are a helpful assistant... [通过 bindTools 提供的工具描述]"
  HumanMessage: "What did I write about machine learning last week?"
]
```

**第 1 轮回复：**

```
AIMessage: {
  content: "",  // 可为空或包含推理内容
  tool_calls: [{
    id: "call_abc123",
    name: "getTimeRangeMs",
    args: { description: "last week" }
  }]
}
```

**第 2 轮（工具执行后）：**

```
messages = [
  SystemMessage: "..."
  HumanMessage: "What did I write about machine learning last week?"
  AIMessage: { tool_calls: [getTimeRangeMs] }
  ToolMessage: { tool_call_id: "call_abc123", content: '{"startTime":1736..., "endTime":1737...}' }
]
```

**第 2 轮回复：**

```
AIMessage: {
  content: "",
  tool_calls: [{
    id: "call_def456",
    name: "localSearch",
    args: {
      query: "machine learning",
      salientTerms: ["machine learning", "ML", "AI"],
      timeRange: { startTime: 1736..., endTime: 1737... }
    }
  }]
}
```

**第 3 轮（第二次工具调用后）：**

```
messages = [
  SystemMessage: "..."
  HumanMessage: "What did I write about machine learning last week?"
  AIMessage: { tool_calls: [getTimeRangeMs] }
  ToolMessage: { tool_call_id: "call_abc123", content: '{"startTime":..., "endTime":...}' }
  AIMessage: { tool_calls: [localSearch] }
  ToolMessage: { tool_call_id: "call_def456", content: '{"documents": [...5 results...]}' }
]
```

**最终回复（无 tool_calls）：**

```
AIMessage: {
  content: "Based on your notes from last week, you wrote about...",
  tool_calls: []  // 为空表示最终回复，退出循环
}
```

### 要点

1. **工具 schema** 通过 `bindTools()` 提供 — LLM 在上下文中可见
2. **带 tool_calls 的 AIMessage** 触发工具执行；**不带 tool_calls 的 AIMessage** 视为最终回复
3. **ToolMessage** 通过 `tool_call_id` 与 AIMessage 对应
4. **对话历史递增** — 每轮迭代都能看到此前全部消息
5. **最多 4 轮迭代** 以防无限循环

## 主要差异

| 方面             | Copilot Plus                | 自主智能体                      |
| ---------------- | ---------------------------- | ------------------------------- |
| **工具决策**     | 基于模型的意图规划           | AI 自主决策（ReAct）            |
| **工具执行**     | LLM 前、同步                 | 对话中、迭代                    |
| **工具格式**     | 原生工具调用（bindTools）    | 原生工具调用（bindTools）       |
| **推理**         | 意图分析 → 工具              | AI 推理 → 工具 → 继续推理       |
| **迭代**         | 单轮                         | 最多 4 轮                       |
| **工具链**       | 有限                         | 完整链式支持                    |

## LangChain 工具接口

### 概述

工具通过 `createLangChainTool` 辅助函数，使用 LangChain 原生的 `tool()` 创建，并配合 Zod schema 校验。工具元数据（执行控制、展示信息）单独存放在 `ToolRegistry`。

```typescript
// 工具创建返回 LangChain StructuredTool
const myTool = createLangChainTool({
  name: string;
  description: string;
  schema: z.ZodType;
  func: (args) => Promise<string | object>;
});

// 工具元数据存放在 ToolRegistry
interface ToolMetadata {
  id: string;
  displayName: string;
  description: string;
  category: "search" | "time" | "file" | "media" | "mcp" | "memory" | "custom";
  isAlwaysEnabled?: boolean;
  timeoutMs?: number;
  isBackground?: boolean;
  isPlusOnly?: boolean;
}
```

### 创建工具

所有工具均使用带 Zod schema 的 `createLangChainTool` 创建：

#### 无参数工具

```typescript
const indexTool = createLangChainTool({
  name: "indexVault",
  description: "Index the vault to the Copilot index",
  schema: z.object({}), // 无参数时使用空对象
  func: async () => {
    // 工具实现
    return { status: "complete" };
  },
});

// 注册并附带元数据
registry.register({
  tool: indexTool,
  metadata: {
    id: "indexVault",
    displayName: "Index Vault",
    description: "Index the vault",
    category: "file",
    isBackground: true,
  },
});
```

#### 带参数工具

```typescript
// 定义带校验规则的 schema
const searchSchema = z.object({
  query: z.string().min(1).describe("The search query"),
  salientTerms: z.array(z.string()).min(1).describe("Key terms extracted from query"),
  timeRange: z
    .object({
      startTime: z.any(),
      endTime: z.any(),
    })
    .optional()
    .describe("Time range for search"),
});

// 创建带自动校验的工具
const searchTool = createLangChainTool({
  name: "localSearch",
  description: "Search for notes based on query and time range",
  schema: searchSchema,
  func: async ({ query, salientTerms, timeRange }) => {
    // 处理函数收到完整类型与校验后的参数
    return performSearch(query, salientTerms, timeRange);
  },
});

// 注册并附带元数据
registry.register({
  tool: searchTool,
  metadata: {
    id: "localSearch",
    displayName: "Vault Search",
    category: "search",
    timeoutMs: 30000,
  },
});
```

### LangChain 原生工具的优势

1. **类型安全**：从 Zod schema 得到完整 TypeScript 类型推断
2. **运行时校验**：所有输入在到达处理函数前完成校验
3. **原生 LangChain 集成**：与 `bindTools()` 及 LangChain 工具生态兼容
4. **更好错误信息**：Zod 提供详细校验错误
5. **职责分离**：工具实现与执行元数据分离
6. **面向未来**：模型支持时即可使用原生工具调用

### 进阶 Zod 用法

#### 复杂校验

```typescript
const emailToolSchema = z.object({
  to: z.string().email().describe("Recipient email"),
  subject: z.string().min(1).max(100).describe("Email subject"),
  body: z.string().min(1).describe("Email content"),
  cc: z.array(z.string().email()).optional().describe("CC recipients"),
});
```

#### 动作的联合类型

```typescript
const actionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("search"),
    query: z.string().min(1),
  }),
  z.object({
    type: z.literal("create"),
    content: z.string().min(1),
    tags: z.array(z.string()).default([]),
  }),
  z.object({
    type: z.literal("delete"),
    id: z.string().uuid(),
  }),
]);

const actionTool = createLangChainTool({
  name: "performAction",
  description: "Perform various actions",
  schema: actionSchema,
  func: async (action) => {
    // TypeScript 可根据判别字段确定具体类型
    switch (action.type) {
      case "search":
        return search(action.query);
      case "create":
        return create(action.content, action.tags);
      case "delete":
        return deleteItem(action.id);
    }
  },
});
```

#### 自定义校验

```typescript
const filePathSchema = z
  .string()
  .refine((val) => val.endsWith(".md") || val.endsWith(".canvas"), {
    message: "File must be .md or .canvas",
  })
  .refine((val) => !val.includes(".."), { message: "Path traversal not allowed" })
  .describe("Path to markdown or canvas file");
```

#### 转换

```typescript
const dateToolSchema = z.object({
  date: z
    .string()
    .describe("Date in ISO format or natural language")
    .transform((str) => new Date(str)),
  timezone: z.string().default("UTC").describe("Timezone identifier"),
});
```

### Schema 组合

```typescript
// 可复用的基础 schema
const timeRangeSchema = z
  .object({
    startTime: z.date(),
    endTime: z.date(),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time",
  });

const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(20),
});

// 组合成更大 schema
const searchWithPaginationSchema = z.object({
  query: z.string().min(1).describe("Search query"),
  filters: z.record(z.string()).optional().describe("Additional filters"),
  timeRange: timeRangeSchema.optional(),
  pagination: paginationSchema,
});
```

### 默认值

```typescript
const configSchema = z.object({
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().int().positive().default(1000),
  model: z.enum(["gpt-4", "gpt-3.5-turbo"]).default("gpt-4"),
});

// 处理函数收到已应用默认值的对象
const configTool = createLangChainTool({
  name: "updateConfig",
  schema: configSchema,
  func: async (config) => {
    // config.temperature 始终有值（未提供时为 0.7）
    // config.maxTokens 始终有值（未提供时为 1000）
    // config.model 始终有值（未提供时为 "gpt-4"）
    return updateConfiguration(config);
  },
});
```

### 校验错误与重试

当 AI 生成的参数未通过 Zod 校验时，工具执行会返回格式化错误。自主智能体通过迭代循环自动处理：

```typescript
// 带严格校验的示例工具
const searchToolWithValidation = createLangChainTool({
  name: "searchNotes",
  description: "Search notes with specific criteria",
  schema: z.object({
    query: z.string().min(2, "Query must be at least 2 characters"),
    limit: z.number().int().min(1).max(100),
    sortBy: z.enum(["relevance", "date", "title"]),
  }),
  func: async ({ query, limit, sortBy }) => {
    return performSearch(query, limit, sortBy);
  },
});

// 当 AI 提供无效参数时：
// 输入: { query: "a", limit: 200, sortBy: "random" }
//
// 流程：
// 1. 工具执行捕获 Zod 校验错误
// 2. 返回: "Tool searchNotes validation failed: query: Query must be at least 2 characters,
//            limit: Number must be less than or equal to 100, sortBy: Invalid enum value"
// 3. 该错误作为用户消息加入对话
// 4. AI 在下一轮看到错误并可用修正后的参数重试
// 5. 自主智能体最多进行 4 轮迭代，允许多次重试

// 示例对话流程：
// 第 1 轮：AI 用无效参数调用工具 → 收到错误
// 第 2 轮：AI 理解错误并用 { query: "search term", limit: 50, sortBy: "date" } 重试 → 成功
```

校验错误会被自动格式化为清晰、可操作的说明，便于 AI 自我修正。自主智能体的迭代设计天然支持重试，AI 可从每次错误中学习。

## 原生工具调用细节

### 工具执行（`toolExecution.ts`）

```typescript
// 带超时与错误处理的单次工具执行
async function executeSequentialToolCall(
  toolCall: ToolCall,
  availableTools: any[]
): Promise<ToolExecutionResult> {
  // 每个工具 30 秒超时
  // 错误处理与校验
  // 结果格式化
}

// ToolCall 接口（来自原生工具调用）
interface ToolCall {
  name: string;
  args: Record<string, unknown>;
  id?: string; // 用于与 ToolMessage 关联
}
```

### 智能体模式下的可用工具

在 Copilot Plus 系统全部工具基础上，增加自主决策能力：

- **localSearch** — 带 salient terms 与查询扩展的知识库内容搜索
- **webSearch** — 结合聊天历史的网络搜索
- **getFileTree** — 文件结构浏览
- **getCurrentTime** / **getTimeRangeMs** — 时间相关查询
- **pomodoroTool** — 番茄钟
- **indexTool** — 知识库索引操作
- **youtubeTranscription** — 视频内容分析

### 系统提示设计

自主智能体模式使用系统提示，用于：

1. **描述可用工具** — 工具 schema 通过 `bindTools()` 提供
2. **提供行为指引** — 何时用哪个工具、如何链式调用
3. **设定推理与工具链的预期**
4. **包含关键要求**（如 localSearch 的 salientTerms）

工具描述由 Zod schema 自动提供。模型适配器负责补充行为指引：

```typescript
// 示例：模型适配器添加工具使用指引
enhanceSystemPrompt(basePrompt: string): string {
  return basePrompt + `

When searching notes, always provide both "query" (string) and "salientTerms" (array of key terms).
Use getTimeRangeMs before localSearch for time-based queries.
`;
}
```

## 自主智能体的优势

1. **自主工具选择** — AI 无需预先分析即可决定使用哪些工具
2. **工具链** — 可将前一个工具结果用于下一个工具
3. **复杂工作流** — 多步推理与工具配合
4. **模型无关** — 适用于任何支持原生工具调用的 LLM
5. **无外部依赖** — 不需要 Brevilabs API
6. **可观测** — 用户可通过「智能体推理块」看到 AI 的推理过程
7. **原生集成** — 使用 LangChain 的 `bindTools()` 获得正确的工具调用支持

## 使用方式

### 启用自主智能体

```typescript
// 在设置中
settings.enableAutonomousAgent = true;

// ChainManager 自动选择对应运行器
const runner = chainManager.getChainRunner(); // 返回 AutonomousAgentChainRunner
```

### 示例查询流程

**用户输入：** "Find my notes about machine learning and research current best practices"

**自主智能体流程：**

1. **第 1 轮**：AI 分析任务 → 调用 `localSearch` 查 ML 笔记
2. **第 2 轮**：分析知识库结果 → 调用 `webSearch` 查当前实践
3. **第 3 轮**：综合两路来源 → 给出完整回复

**旧版流程：**

1. 意图分析确定需要的工具
2. 执行全部工具
3. 单次 LLM 调用并带入所有上下文

## 错误处理与回退

### 自主智能体回退

```typescript
try {
  // 顺序思考与执行
} catch (error) {
  // 自动回退到 CopilotPlusChainRunner
  const fallbackRunner = new CopilotPlusChainRunner(this.chainManager);
  return await fallbackRunner.run(/* 相同参数 */);
}
```

### 工具执行保护

- 每个工具 30 秒超时
- 带描述信息的优雅错误处理
- 工具可用性校验
- 结果校验与格式化

## 模型适配器模式

### 概述

模型适配器模式用于干净地处理模型特有的差异与要求，使核心逻辑与具体模型解耦。

### 架构

```typescript
interface ModelAdapter {
  enhanceSystemPrompt(basePrompt: string, toolDescriptions: string): string;
  enhanceUserMessage(message: string, requiresTools: boolean): string;
  needsSpecialHandling(): boolean;
}
```

> **说明：** 使用 `bindTools()` 的原生工具调用时，工具调用以结构化的 `response.tool_calls` 返回。模型适配器现在主要提供行为指引，而非解析或响应清洗。

### 当前适配器

1. **BaseModelAdapter** — 行为良好模型的默认行为
2. **GPTModelAdapter** — 对常跳过工具调用的 GPT 模型加强提示
3. **ClaudeModelAdapter** — 针对 Claude 思考模型（3.7 Sonnet、Claude 4）的特殊处理
4. **GeminiModelAdapter** — 预留 Gemini 专用处理

### 添加新模型

```typescript
class NewModelAdapter extends BaseModelAdapter {
  enhanceSystemPrompt(basePrompt: string, toolDescriptions: string): string {
    const base = super.enhanceSystemPrompt(basePrompt, toolDescriptions);
    return base + "\n\n[此处填写模型专用说明]";
  }

  enhanceUserMessage(message: string, requiresTools: boolean): string {
    // 如需可添加模型专用提示
    return requiresTools ? `${message}\n[模型专用提示]` : message;
  }
}

// 在 ModelAdapterFactory 中注册
if (modelName.includes("newmodel")) {
  return new NewModelAdapter(modelName);
}
```

### Claude 模型适配器特性

`ClaudeModelAdapter` 为 Claude 思考模型提供专门处理：

#### 思考模型支持

- **Claude 3.7 Sonnet** 与 **Claude 4** — 自动配置思考模式
- **思考块保留** — 在回复中保留有价值的推理上下文
- **温度控制** — 对思考模型关闭 temperature（按 API 要求）

> **说明：** 使用原生工具调用时，工具调用以结构化的 `response.tool_calls` 返回。中间工具调用对用户不可见，通过「智能体推理块」展示；仅最终回复流式输出到 UI。

#### 智能体推理块

推理过程通过「智能体推理块」组件展示，例如：

```
⏱️ 2.3s 已用
├─ 正在为 "piano", "learning", "practice" 搜索笔记...
├─ 找到 5 条笔记：Piano Practice.md, Learning Music.md...
└─ 正在生成回复...
```

### 优势

1. **职责分离** — 模型差异与核心逻辑隔离
2. **可维护** — 模型相关代码集中、易更新
3. **可扩展** — 新增模型支持简单
4. **可测试** — 模型适配器可单独单元测试
5. **核心简洁** — 自主智能体逻辑保持模型无关
6. **减少幻觉** — 对问题模型做专门处理
7. **流式保护** — 避免不良内容到达用户
8. **通用方案** — 使用基于阈值的检测而非正则匹配

## 后续考虑

1. **工具发现** — 动态工具注册
2. **自定义工具** — 用户定义的工具能力
3. **并行执行** — 多工具同时执行
4. **工具结果缓存** — 避免重复调用
5. **进阶推理** — 更复杂的决策树
6. **工具权限** — 用户对工具访问的控制（人在回路审批）
7. **深度搜索** — 复杂查询的迭代搜索优化
8. **回复校验** — 适配器可校验模型输出
9. **模型专项优化** — 为新模型扩展适配器能力

基于原生工具调用的自主智能体方案，相较传统工具调用是一次明显演进，支持更复杂的 AI 推理与自主任务完成。
