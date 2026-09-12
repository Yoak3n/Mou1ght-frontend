import type { UserInfo } from "./user";

export interface CreateSharingRequest {
    content: string;
    author: string;
    attachment: string;
    tags: Sign[];
}

export interface CreateMessageRequest {
    content: string;
    position: MessagePosition;
    visitor_token?: string;
    board_answer?: string;
}

export interface UpdateMessageRequest {
    id: string;
    content: string;
    position: MessagePosition;
    visitor_token?: string;
}

export interface UpdateMessagePositionRequest {
    id: string;
    position: MessagePosition;
    visitor_token?: string;
}

export interface CategoryWithArticles {
    category: Sign;
    articles: ArticleInfo[];
}

export interface TagWithArticles {
    tag: Sign;
    articles: ArticleInfo[];
}

export interface AuthorWithPosts {
    author: UserInfo
    articles: ArticleInfo[]
    sharings: SharingInfo[]
}

export interface PostListResponse {
    articles?: ArticleInfo[]
    sharings?: SharingInfo[]
    messages?: MessageInfo[]
    authors?: AuthorWithPosts[]
    tags?: TagWithArticles[]
    categories? : CategoryWithArticles[]
    total?: number
    page?: number
    page_size?: number
}


export interface ArticleInfo {
    id: string,
    title: string,
    content: string,
    tags: Sign[],
    categories: Sign[],
    author: UserInfo,
    state: PostState,
    time: PostTimeInfo
}

export interface SharingInfo {
    id: string,
    content: string,
    tags: Sign[],
    author: UserInfo,
    state: PostState,
    time: PostTimeInfo,
    attachments?: Attachment[]
}

export interface MessageInfo {
    id: string,
    content: string,
    position: MessagePosition,
    state: PostState,
    time: PostTimeInfo,
}

export interface Attachment {
    file_name: string,
    file_path: string
    mime?: string
}

export interface MessagePosition{
    x: number,
    y: number,
    z: number
}

export interface Sign {
    id: string;
    label: string;
}

export interface CategoryGroup extends Sign {
    children: CategoryGroup[];
}

export interface PostState {
    view: number,
    like: number,
    length: number,
    status: string
}

export interface PostTimeInfo{
    created_at: string,
    updated_at: string
}
