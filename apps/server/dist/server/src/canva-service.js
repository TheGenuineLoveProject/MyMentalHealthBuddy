export class CanvaService {
    constructor() {
        this.apiBaseUrl = "https://api.canva.com/rest/v1";
        // Canva Apps SDK uses PKCE (no client secret needed)
        this.appId = process.env.CANVA_CLIENT_ID || "";
        this.appOrigin = process.env.CANVA_APP_ORIGIN || "";
        if (!this.appId || !this.appOrigin) {
            console.warn("⚠️  Canva Apps SDK credentials not configured. Visual design features will be disabled.");
            console.warn("   Required: CANVA_CLIENT_ID (App ID) and CANVA_APP_ORIGIN");
        }
        else {
            console.log("✅ Canva Apps SDK configured successfully");
            console.log(`   App ID: ${this.appId.substring(0, 8)}...`);
            console.log(`   App Origin: ${this.appOrigin}`);
        }
    }
    isEnabled() {
        return !!(this.appId && this.appOrigin);
    }
    getAuthorizationUrl(state) {
        // Canva Apps SDK uses PKCE-based authentication
        // This URL is primarily for Connect API (external integrations)
        // For Apps SDK, authentication happens via @canva/user package in the frontend
        const params = new URLSearchParams({
            client_id: this.appId,
            response_type: "code",
            scope: "design:content:read design:content:write design:meta:read asset:read asset:write folder:read",
            state: state,
            // PKCE parameters will be added by frontend SDK
        });
        return `https://www.canva.com/api/oauth/authorize?${params.toString()}`;
    }
    async exchangeCodeForToken(code, codeVerifier) {
        // Canva Apps SDK uses PKCE (code_verifier instead of client_secret)
        const response = await fetch("https://api.canva.com/rest/v1/oauth/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                code: code,
                client_id: this.appId,
                code_verifier: codeVerifier, // PKCE - no client secret needed
            }),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to exchange code for token: ${error}`);
        }
        return response.json();
    }
    async refreshAccessToken(refreshToken) {
        // For Apps SDK, token refresh doesn't require client secret
        const response = await fetch("https://api.canva.com/rest/v1/oauth/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: refreshToken,
                client_id: this.appId,
            }),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to refresh token: ${error}`);
        }
        return response.json();
    }
    async createDesign(accessToken, designType, title, assetId) {
        const body = {
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
    async createSocialMediaPost(accessToken, platform, title, imageUrl) {
        const designTypeMap = {
            instagram: "InstagramPost",
            facebook: "FacebookPost",
            twitter: "TwitterPost",
            linkedin: "LinkedInPost",
        };
        let assetId;
        if (imageUrl) {
            assetId = await this.uploadAsset(accessToken, imageUrl, title);
        }
        return this.createDesign(accessToken, designTypeMap[platform], title, assetId);
    }
    async uploadAsset(accessToken, imageUrl, name) {
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
    async getDesign(accessToken, designId) {
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
    async exportDesign(accessToken, designId, format = "PNG") {
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
    async getExportJob(accessToken, jobId) {
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
    async listUserDesigns(accessToken, limit = 20) {
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
    async generateMentalHealthQuote(accessToken, quote, author) {
        const title = `Mental Health Quote: ${quote.substring(0, 50)}...`;
        return this.createDesign(accessToken, "InstagramPost", title);
    }
    async generateMoodVisualization(accessToken, mood, intensity, date) {
        const title = `Mood Check-in: ${mood} (${intensity}/10) - ${date}`;
        return this.createDesign(accessToken, "InstagramStory", title);
    }
    async generateJournalVisual(accessToken, journalTitle, excerpt) {
        const title = `Journal: ${journalTitle}`;
        return this.createDesign(accessToken, "Document", title);
    }
    getDesignTemplates() {
        return {
            social: [
                { id: "instagram-post", name: "Instagram Post", type: "InstagramPost" },
                { id: "instagram-story", name: "Instagram Story", type: "InstagramStory" },
                { id: "facebook-post", name: "Facebook Post", type: "FacebookPost" },
                { id: "twitter-post", name: "Twitter Post", type: "TwitterPost" },
                { id: "linkedin-post", name: "LinkedIn Post", type: "LinkedInPost" },
            ],
            wellness: [
                { id: "mood-tracker", name: "Mood Tracker", type: "InstagramStory" },
                { id: "quote-card", name: "Quote Card", type: "InstagramPost" },
                { id: "journal-cover", name: "Journal Cover", type: "Document" },
                { id: "gratitude-post", name: "Gratitude Post", type: "FacebookPost" },
            ],
            marketing: [
                { id: "presentation", name: "Presentation", type: "Presentation" },
                { id: "poster", name: "Poster", type: "Poster" },
                { id: "logo", name: "Logo", type: "Logo" },
            ],
        };
    }
}
export const canvaService = new CanvaService();
