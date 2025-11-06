import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from "react";
const CanvaContext = createContext(undefined);
export function CanvaProvider({ children }) {
    const [isConnected, setIsConnected] = useState(false);
    const [isEnabled, setIsEnabled] = useState(false);
    const [designs, setDesigns] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const checkStatus = async () => {
        try {
            const response = await fetch("/api/canva/status", {
                headers: {
                    "x-user-id": "demo-user-123"
                }
            });
            const data = await response.json();
            setIsEnabled(data.enabled);
            if (data.enabled) {
                await refreshDesigns();
            }
        }
        catch (error) {
            console.error("Failed to check Canva status:", error);
            setIsEnabled(false);
        }
    };
    useEffect(() => {
        checkStatus();
        const params = new URLSearchParams(window.location.search);
        if (params.get("canva_connected") === "true") {
            setIsConnected(true);
            refreshDesigns();
            window.history.replaceState({}, "", window.location.pathname);
        }
    }, []);
    const connectToCanva = async () => {
        try {
            const response = await fetch("/api/canva/auth-url", {
                headers: {
                    "x-user-id": "demo-user-123"
                }
            });
            const data = await response.json();
            if (data.authUrl) {
                window.location.href = data.authUrl;
            }
        }
        catch (error) {
            console.error("Failed to get Canva auth URL:", error);
            throw error;
        }
    };
    const createDesign = async (designType, title) => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/canva/designs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": "demo-user-123"
                },
                body: JSON.stringify({ designType, title })
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to create design");
            }
            const design = await response.json();
            await refreshDesigns();
            return design;
        }
        catch (error) {
            console.error("Failed to create design:", error);
            return null;
        }
        finally {
            setIsLoading(false);
        }
    };
    const createSocialPost = async (platform, title, imageUrl) => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/canva/create-social-post", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": "demo-user-123"
                },
                body: JSON.stringify({ platform, title, imageUrl })
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to create social post");
            }
            const design = await response.json();
            await refreshDesigns();
            return design;
        }
        catch (error) {
            console.error("Failed to create social post:", error);
            return null;
        }
        finally {
            setIsLoading(false);
        }
    };
    const generateQuote = async (quote, author) => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/canva/generate-quote", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": "demo-user-123"
                },
                body: JSON.stringify({ quote, author })
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to generate quote");
            }
            const design = await response.json();
            await refreshDesigns();
            return design;
        }
        catch (error) {
            console.error("Failed to generate quote:", error);
            return null;
        }
        finally {
            setIsLoading(false);
        }
    };
    const generateMoodVisual = async (mood, intensity, date) => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/canva/generate-mood-visual", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": "demo-user-123"
                },
                body: JSON.stringify({ mood, intensity, date })
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to generate mood visual");
            }
            const design = await response.json();
            await refreshDesigns();
            return design;
        }
        catch (error) {
            console.error("Failed to generate mood visual:", error);
            return null;
        }
        finally {
            setIsLoading(false);
        }
    };
    const refreshDesigns = async () => {
        try {
            const response = await fetch("/api/canva/designs", {
                headers: {
                    "x-user-id": "demo-user-123"
                }
            });
            if (response.ok) {
                const data = await response.json();
                setDesigns(data.designs || []);
                setIsConnected(true);
                return true;
            }
            else if (response.status === 401) {
                setIsConnected(false);
                return false;
            }
            return false;
        }
        catch (error) {
            console.error("Failed to refresh designs:", error);
            setIsConnected(false);
            return false;
        }
    };
    const value = {
        isConnected,
        isEnabled,
        designs,
        isLoading,
        connectToCanva,
        createDesign,
        createSocialPost,
        generateQuote,
        generateMoodVisual,
        refreshDesigns,
        checkStatus
    };
    return _jsx(CanvaContext.Provider, { value: value, children: children });
}
export function useCanva() {
    const context = useContext(CanvaContext);
    if (context === undefined) {
        throw new Error("useCanva must be used within a CanvaProvider");
    }
    return context;
}
