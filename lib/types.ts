export type Pages = Record<string, Page>;

export type Page = {
    image_path: string;
    content: string;
}

export type PendingStory = {
    id: string;
    prompt: string;
}