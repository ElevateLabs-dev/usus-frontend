import { apiClient } from "@/services/api-client";

export type KnowledgeBaseDocumentStatus = "processing" | "ready" | "failed";

export interface KnowledgeBaseDocument {
  id: string;
  filename: string;
  file_type: string;
  size_bytes: number;
  status: KnowledgeBaseDocumentStatus;
  error: string | null;
  char_count: number;
  created_at: string;
}

export async function getKnowledgeBaseDocuments(): Promise<KnowledgeBaseDocument[]> {
  return apiClient<KnowledgeBaseDocument[]>("/knowledge-base/documents");
}

export async function uploadKnowledgeBaseDocument(
  file: File,
): Promise<KnowledgeBaseDocument> {
  const formData = new FormData();
  formData.append("file", file);

  return apiClient<KnowledgeBaseDocument>("/knowledge-base/documents", {
    method: "POST",
    body: formData,
  });
}

export async function getKnowledgeBaseDocument(
  documentId: string,
): Promise<KnowledgeBaseDocument> {
  return apiClient<KnowledgeBaseDocument>(
    `/knowledge-base/documents/${encodeURIComponent(documentId)}`,
  );
}

export async function deleteKnowledgeBaseDocument(
  documentId: string,
): Promise<void> {
  return apiClient<void>(
    `/knowledge-base/documents/${encodeURIComponent(documentId)}`,
    { method: "DELETE" },
  );
}
