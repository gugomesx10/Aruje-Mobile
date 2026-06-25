import { api } from "./api";

export type RagAskRequest = {
  question: string;
  maxItems: number;
};

export type RagSourceResponse = {
  type: string;
  id: string | null;
  title: string;
  summary: string;
  relevanceScore: number;
  createdAt: string;
};

export type RagAskResponse = {
  question: string;
  answer: string;
  riskLevel: string;
  recommendation: string;
  provider: string;
  sources: RagSourceResponse[];
  generatedAt: string;
};

export async function askRagAssistant(
  question: string,
  maxItems = 8
): Promise<RagAskResponse> {
  const response = await api.post<RagAskResponse>("/api/rag/ask", {
    question,
    maxItems,
  });

  return response.data;
}