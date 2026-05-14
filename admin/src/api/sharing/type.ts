import type { Sign } from "@/types";

export interface CreateSharingRequest {
    content: string;
    author: string;
    private: boolean;
    attachment_ids: string[];
    tags: Sign[];
}

export type PostStatus = 'draft' | 'publish' | 'archive'

export interface UpdatePostStatusRequest {
    post_type: 'article' | 'sharing' | 'message'
    post_id: string
    status: PostStatus
}
