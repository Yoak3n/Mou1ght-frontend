export interface BlogSetting{
    nav_bar: NavBar;
    bottom_extra: BottomExtra;
}

export interface NavBar{
    links: LinkSetting[];
    website_information: WebsiteInformation;
}

export interface BottomExtra{
    html: string;
    css: string;
}

export interface WebsiteInformation{
    title: string;
    icon: string;
    logo: string;
    keywords: string[];
}

export interface LinkSetting{
    type: string;
    label: string;
    url: string;
} 