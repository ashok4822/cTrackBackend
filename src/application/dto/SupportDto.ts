// ─── Support Chat DTOs ──────────────────────────────────────────────────────────

export type ChatCategory = "containers" | "bills" | "pda" | "general";

export interface ChatMessage {
    role: "user" | "assistant" | "system";
    content: string;
}

export interface SupportChatRequestDto {
    messages: ChatMessage[];
    category: ChatCategory;
    user?: {
        id: string;
        name?: string;
        companyName?: string;
    };
}

export interface SupportChatResponseDto {
    content: string;
}

export interface SupportChatStreamResponseDto {
    textStream: AsyncIterable<string>;
}

