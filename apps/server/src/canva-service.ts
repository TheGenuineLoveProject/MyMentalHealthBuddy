import type { SelectCanvaDesign } from "../../shared/schema.js";

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

export type DesignType = 
  | "InstagramPost" 
  | "InstagramStory" 
  | "FacebookPost" 
  | "TwitterPost" 
  | "LinkedInPost"
  | "Presentation"
  | "Document"
  | "Poster"
  | "Logo";

export class CanvaService {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private apiBaseUrl = "https://api.canva.com/rest/v1";

  constructor() {
    this.clientId = process.env.CANVA_CLIENT_ID || "";
    this.clientSecret = process.env.CANVA_CLIENT_SECRET || "";
    this.redirectUri = process.env.CANVA_REDIRECT_URI || "http://localhost:5000/api/canva/callback";

    if (!this.clientId || !this.clientSecret) {
      console.warn("⚠️  Canva API credentials not configured. Visual design features will be disabled.");
    }
  }

  isEnabled(): boolean {
    return !!(this.clientId && this.clientSecret);
  }

  getAuthorizationUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: "code",
      scope: "design:content:read design:content:write design:meta:read asset:read asset:write folder:read",
      state: state,
    });
    
    return `https://www.canva.com/api/oauth/authorize?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string): Promise<CanvaTokenResponse> {
    const response = await fetch("https://api.canva.com/rest/v1/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to exchange code for token: ${error}`);
    }

    return response.json();
  }

  async refreshAccessToken(refreshToken: string): Promise<CanvaTokenResponse> {
    const response = await fetch("https://api.canva.com/rest/v1/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to refresh token: ${error}`);
    }

    return response.json();
  }

  async createDesign(
    accessToken: string, 
    designType: DesignType,
    title?: string,
    assetId?: string
  ): Promise<CanvaDesignResponse> {
    const body: any = {
      design_type: designType,
    };

    if (title) {
      body.title = title;
    }

    if (assetId) {
      body.asset_id = assetId;
    }

    const response = await fetch(`${this.apiBaseUrl}/designs`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to create design: ${error}`);
    }

    const data = await response.json();
    return data.design;
  }

  async createSocialMediaPost(
    accessToken: string,
    platform: "instagram" | "facebook" | "twitter" | "linkedin",
    title: string,
    imageUrl?: string
  ): Promise<CanvaDesignResponse> {
    const designTypeMap: Record<string, DesignType> = {
      instagram: "InstagramPost",
      facebook: "FacebookPost",
      twitter: "TwitterPost",
      linkedin: "LinkedInPost",
    };

    let assetId: string | undefined;

    if (imageUrl) {
      assetId = await this.uploadAsset(accessToken, imageUrl, title);
    }

    return this.createDesign(accessToken, designTypeMap[platform], title, assetId);
  }

  async uploadAsset(
    accessToken: string,
    imageUrl: string,
    name: string
  ): Promise<string> {
    const response = await fetch(`${this.apiBaseUrl}/assets`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "IMAGE",
        name: name,
        url: imageUrl,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to upload asset: ${error}`);
    }

    const data = await response.json();
    return data.asset.id;
  }

  async getDesign(accessToken: string, designId: string): Promise<CanvaDesignResponse> {
    const response = await fetch(`${this.apiBaseUrl}/designs/${designId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get design: ${error}`);
    }

    const data = await response.json();
    return data.design;
  }

  async exportDesign(
    accessToken: string,
    designId: string,
    format: "PNG" | "JPG" | "PDF" = "PNG"
  ): Promise<CanvaExportResponse> {
    const response = await fetch(`${this.apiBaseUrl}/exports`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        design_id: designId,
        format: format,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to export design: ${error}`);
    }

    return response.json();
  }

  async getExportJob(accessToken: string, jobId: string): Promise<CanvaExportResponse> {
    const response = await fetch(`${this.apiBaseUrl}/exports/${jobId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get export job: ${error}`);
    }

    return response.json();
  }

  async listUserDesigns(accessToken: string, limit: number = 20): Promise<CanvaDesignResponse[]> {
    const response = await fetch(`${this.apiBaseUrl}/designs?limit=${limit}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to list designs: ${error}`);
    }

    const data = await response.json();
    return data.designs || [];
  }

  async generateMentalHealthQuote(
    accessToken: string,
    quote: string,
    author?: string
  ): Promise<CanvaDesignResponse> {
    const title = `Mental Health Quote: ${quote.substring(0, 50)}...`;
    
    return this.createDesign(
      accessToken,
      "InstagramPost",
      title
    );
  }

  async generateMoodVisualization(
    accessToken: string,
    mood: string,
    intensity: number,
    date: string
  ): Promise<CanvaDesignResponse> {
    const title = `Mood Check-in: ${mood} (${intensity}/10) - ${date}`;
    
    return this.createDesign(
      accessToken,
      "InstagramStory",
      title
    );
  }

  async generateJournalVisual(
    accessToken: string,
    journalTitle: string,
    excerpt: string
  ): Promise<CanvaDesignResponse> {
    const title = `Journal: ${journalTitle}`;
    
    return this.createDesign(
      accessToken,
      "Document",
      title
    );
  }

  getDesignTemplates() {
    return {
      social: [
        { id: "instagram-post", name: "Instagram Post", type: "InstagramPost" as DesignType },
        { id: "instagram-story", name: "Instagram Story", type: "InstagramStory" as DesignType },
        { id: "facebook-post", name: "Facebook Post", type: "FacebookPost" as DesignType },
        { id: "twitter-post", name: "Twitter Post", type: "TwitterPost" as DesignType },
        { id: "linkedin-post", name: "LinkedIn Post", type: "LinkedInPost" as DesignType },
      ],
      wellness: [
        { id: "mood-tracker", name: "Mood Tracker", type: "InstagramStory" as DesignType },
        { id: "quote-card", name: "Quote Card", type: "InstagramPost" as DesignType },
        { id: "journal-cover", name: "Journal Cover", type: "Document" as DesignType },
        { id: "gratitude-post", name: "Gratitude Post", type: "FacebookPost" as DesignType },
      ],
      marketing: [
        { id: "presentation", name: "Presentation", type: "Presentation" as DesignType },
        { id: "poster", name: "Poster", type: "Poster" as DesignType },
        { id: "logo", name: "Logo", type: "Logo" as DesignType },
      ],
    };
  }
}

export const canvaService = new CanvaService();
