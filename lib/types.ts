export type Pages = Record<string, Page>;

export type Page = {
    image_path: string;
    content: string;
}

export type StreamEvent = {
    id: string;
    message: string;
    final?: boolean;
    error?: boolean;
}

export type StoryRequest = {
    prompt: string;
    pages: number;
}