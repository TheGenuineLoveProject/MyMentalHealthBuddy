export interface CanvaTokenResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
    scope: string;
}
export interface CanvaDesignResponse {
    id: string;
    title?: string;
    urls: {
        edit_url: string;
        view_url: string;
    };
    thumbnail?: {
        url: string;
    };
    created_at: number;
    updated_at: number;
}
export interface CanvaExportResponse {
    job: {
        id: string;
        status: string;
    };
    urls?: string[];
}
export type DesignType = "InstagramPost" | "InstagramStory" | "FacebookPost" | "TwitterPost" | "LinkedInPost" | "Presentation" | "Document" | "Poster" | "Logo";
export declare class CanvaService {
    private clientId;
    private clientSecret;
    private redirectUri;
    private apiBaseUrl;
    constructor();
    isEnabled(): boolean;
    getAuthorizationUrl(state: string): string;
    exchangeCodeForToken(code: string): Promise<CanvaTokenResponse>;
    refreshAccessToken(refreshToken: string): Promise<CanvaTokenResponse>;
    createDesign(accessToken: string, designType: DesignType, title?: string, assetId?: string): Promise<CanvaDesignResponse>;
    createSocialMediaPost(accessToken: string, platform: "instagram" | "facebook" | "twitter" | "linkedin", title: string, imageUrl?: string): Promise<CanvaDesignResponse>;
    uploadAsset(accessToken: string, imageUrl: string, name: string): Promise<string>;
    getDesign(accessToken: string, designId: string): Promise<CanvaDesignResponse>;
    exportDesign(accessToken: string, designId: string, format?: "PNG" | "JPG" | "PDF"): Promise<CanvaExportResponse>;
    getExportJob(accessToken: string, jobId: string): Promise<CanvaExportResponse>;
    listUserDesigns(accessToken: string, limit?: number): Promise<CanvaDesignResponse[]>;
    generateMentalHealthQuote(accessToken: string, quote: string, author?: string): Promise<CanvaDesignResponse>;
    generateMoodVisualization(accessToken: string, mood: string, intensity: number, date: string): Promise<CanvaDesignResponse>;
    generateJournalVisual(accessToken: string, journalTitle: string, excerpt: string): Promise<CanvaDesignResponse>;
    getDesignTemplates(): {
        social: {
            id: string;
            name: string;
            type: DesignType;
        }[];
        wellness: {
            id: string;
            name: string;
            type: DesignType;
        }[];
        marketing: {
            id: string;
            name: string;
            type: DesignType;
        }[];
    };
}
export declare const canvaService: CanvaService;
//# sourceMappingURL=canva-service.d.ts.map