// ─── Support Chat DTOs ──────────────────────────────────────────────────────────

export type ChatCategory = "containers" | "bills" | "pda" | "general";

export class ChatMessage {
    role!: "user" | "assistant" | "system";
    content!: string;
}

export class SupportChatRequestDto {
    messages!: ChatMessage[];
    category!: ChatCategory;
    user?: {
        id: string;
        name?: string;
        companyName?: string;
    };
}

export class SupportChatResponseDto {
    content!: string;
}

export class SupportChatStreamResponseDto {
    textStream!: AsyncIterable<string>;
}

