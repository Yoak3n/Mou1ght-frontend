export interface BlogSetting {
    nav_bar: NavBar;
    bottom_extra: BottomExtra;
    board: Board;
}

export interface NavBar {
    links: LinkSetting[];
    website_information: WebsiteInformation;
}

export interface LinkSetting {
    type: string;
    label: string;
    href: string;
}

export interface WebsiteInformation {
    title: string;
    icon: string;
    logo: string;
    keywords: string[];
}

export interface BottomExtra {
    html: string;
    css: string;
}

export interface Board {
    question: string;
    answer: string;
    need_reviewed: boolean;
}

export interface Response<T> {
    code: number;
    message: string;
    data: T;
}
