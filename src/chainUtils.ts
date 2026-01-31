import ProjectManager from "@/LLMProviders/projectManager";
import {
  ChatHistoryEntry,
  removeErrorTags,
  removeThinkTags,
  withSuppressedTokenWarnings,
} from "@/utils";

export async function getStandaloneQuestion(
  question: string,
  chatHistory: ChatHistoryEntry[]
): Promise<string> {
  const condenseQuestionTemplate = `根据以下对话和后续问题，
    将对话总结为上下文，并保持后续问题不变、使用其原始语言。
    若后续问题与前述消息无关，则直接返回该后续问题。
    若相关，则将摘要与后续问题结合，构成一个独立问题。
    确保问题中所有 [[]] 包裹的笔记标题保持不变。
    若聊天记录为空，则直接返回后续问题。

    聊天记录：
    {chat_history}
    后续输入：{question}
    独立问题：`;

  const formattedChatHistory = chatHistory
    .map(({ role, content }) => `${role}: ${content}`)
    .join("\n");

  // Wrap the model call with token warning suppression
  return await withSuppressedTokenWarnings(async () => {
    // Use temperature=0 for deterministic question condensation
    const chatModel = await ProjectManager.instance
      .getCurrentChainManager()
      .chatModelManager.getChatModelWithTemperature(0);

    const response = await chatModel.invoke([
      {
        role: "user",
        content: condenseQuestionTemplate
          .replace("{chat_history}", formattedChatHistory)
          .replace("{question}", question),
      },
    ]);

    const cleanedResponse = removeThinkTags(response.content as string);
    return removeErrorTags(cleanedResponse);
  });
}
