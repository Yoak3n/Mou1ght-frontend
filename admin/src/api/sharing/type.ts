import type { Sign } from "@/types";

export interface CreateSharingRequest {
    content: string;
    author: string;
    attachment: string;
    tags: Sign[];
}