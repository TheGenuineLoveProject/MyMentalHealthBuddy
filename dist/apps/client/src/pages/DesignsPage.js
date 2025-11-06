import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useCanva } from "@/contexts/CanvaContext";
import { Palette, Instagram, Facebook, Twitter, Linkedin, Sparkles, ExternalLink, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
const DESIGN_TYPES = [
    { id: "InstagramPost", name: "Instagram Post", icon: Instagram },
    { id: "InstagramStory", name: "Instagram Story", icon: Instagram },
    { id: "FacebookPost", name: "Facebook Post", icon: Facebook },
    { id: "TwitterPost", name: "Twitter Post", icon: Twitter },
    { id: "LinkedInPost", name: "LinkedIn Post", icon: Linkedin },
];
export default function DesignsPage() {
    const { isConnected, isEnabled, designs, isLoading, connectToCanva, createDesign, createSocialPost, generateQuote, refreshDesigns } = useCanva();
    const [activeTab, setActiveTab] = useState("create");
    const [selectedDesignType, setSelectedDesignType] = useState("InstagramPost");
    const [designTitle, setDesignTitle] = useState("");
    const [socialPlatform, setSocialPlatform] = useState("instagram");
    const [socialTitle, setSocialTitle] = useState("");
    const [quoteText, setQuoteText] = useState("");
    const [quoteAuthor, setQuoteAuthor] = useState("");
    useEffect(() => {
        if (isConnected) {
            refreshDesigns();
        }
    }, [isConnected]);
    const handleCreateDesign = async () => {
        if (!selectedDesignType) {
            alert("Please select a design type");
            return;
        }
        const design = await createDesign(selectedDesignType, designTitle || undefined);
        if (design) {
            window.open(design.editUrl, "_blank");
            setDesignTitle("");
        }
        else {
            alert("Failed to create design. Please try again or check your Canva connection.");
        }
    };
    const handleCreateSocialPost = async () => {
        if (!socialTitle) {
            alert("Please enter a title for your social post");
            return;
        }
        const design = await createSocialPost(socialPlatform, socialTitle);
        if (design) {
            window.open(design.editUrl, "_blank");
            setSocialTitle("");
        }
        else {
            alert("Failed to create social post. Please try again or check your Canva connection.");
        }
    };
    const handleGenerateQuote = async () => {
        if (!quoteText) {
            alert("Please enter a quote");
            return;
        }
        const design = await generateQuote(quoteText, quoteAuthor || undefined);
        if (design) {
            window.open(design.editUrl, "_blank");
            setQuoteText("");
            setQuoteAuthor("");
        }
        else {
            alert("Failed to generate quote. Please try again or check your Canva connection.");
        }
    };
    if (!isEnabled) {
        return (_jsx("div", { className: "container mx-auto p-6 max-w-4xl", children: _jsx("div", { className: "bg-yellow-50 border border-yellow-200 rounded-lg p-6", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(AlertCircle, { className: "h-5 w-5 text-yellow-600 mt-1" }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-yellow-900 mb-1", children: "Canva Not Configured" }), _jsx("p", { className: "text-yellow-700 text-sm", children: "Canva API credentials are not configured. Please set up CANVA_CLIENT_ID and CANVA_CLIENT_SECRET environment variables to enable visual design features." })] })] }) }) }));
    }
    if (!isConnected) {
        return (_jsx("div", { className: "container mx-auto p-6 max-w-4xl", children: _jsxs("div", { className: "bg-white rounded-lg shadow-lg text-center py-16 px-8", children: [_jsx("div", { className: "mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6", children: _jsx(Palette, { className: "h-10 w-10 text-white" }) }), _jsx("h1", { className: "text-4xl font-bold mb-4", children: "Connect to Canva" }), _jsx("p", { className: "text-gray-600 text-lg mb-8 max-w-2xl mx-auto", children: "Unlock stunning visual content creation for your mental health journey. Create beautiful social media posts, mood boards, inspirational quotes, and more with professional design tools." }), _jsxs("button", { onClick: connectToCanva, className: "inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg shadow-lg transition-all transform hover:scale-105", "data-testid": "button-connect-canva", children: [_jsx(Sparkles, { className: "h-6 w-6" }), "Connect to Canva"] })] }) }));
    }
    return (_jsxs("div", { className: "container mx-auto p-6 max-w-7xl", children: [_jsxs("div", { className: "flex items-center justify-between mb-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent", children: "Design Studio" }), _jsx("p", { className: "text-gray-600 mt-2 text-lg", children: "Create stunning visual content for your mental health journey" })] }), _jsxs("div", { className: "flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg", children: [_jsx(CheckCircle2, { className: "h-4 w-4 text-green-600" }), _jsx("span", { className: "text-green-700 font-medium", children: "Canva Connected" })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-lg mb-8", children: [_jsx("div", { className: "border-b border-gray-200", children: _jsxs("div", { className: "flex gap-1 p-1", children: [_jsx("button", { onClick: () => setActiveTab("create"), className: `flex-1 py-3 px-6 rounded-lg font-medium transition ${activeTab === "create"
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-600 hover:bg-gray-100"}`, "data-testid": "tab-create", children: "Create Design" }), _jsx("button", { onClick: () => setActiveTab("social"), className: `flex-1 py-3 px-6 rounded-lg font-medium transition ${activeTab === "social"
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-600 hover:bg-gray-100"}`, "data-testid": "tab-social", children: "Social Posts" }), _jsx("button", { onClick: () => setActiveTab("quotes"), className: `flex-1 py-3 px-6 rounded-lg font-medium transition ${activeTab === "quotes"
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-600 hover:bg-gray-100"}`, "data-testid": "tab-quotes", children: "Quote Generator" })] }) }), _jsxs("div", { className: "p-8", children: [activeTab === "create" && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold mb-2", children: "Create New Design" }), _jsx("p", { className: "text-gray-600 mb-6", children: "Choose a template and start designing" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Design Type" }), _jsx("select", { value: selectedDesignType, onChange: (e) => setSelectedDesignType(e.target.value), className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent", "data-testid": "select-design-type", children: DESIGN_TYPES.map((type) => (_jsx("option", { value: type.id, children: type.name }, type.id))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Title (Optional)" }), _jsx("input", { type: "text", value: designTitle, onChange: (e) => setDesignTitle(e.target.value), placeholder: "My Mental Health Post", className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent", "data-testid": "input-design-title" })] }), _jsx("button", { onClick: handleCreateDesign, disabled: isLoading, className: "w-full flex items-center justify-center gap-2 px-6 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition", "data-testid": "button-create-design", children: isLoading ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "h-5 w-5 animate-spin" }), "Creating..."] })) : (_jsxs(_Fragment, { children: [_jsx(Palette, { className: "h-5 w-5" }), "Create Design"] })) })] })), activeTab === "social" && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold mb-2", children: "Social Media Post Creator" }), _jsx("p", { className: "text-gray-600 mb-6", children: "Create platform-optimized designs" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Platform" }), _jsxs("select", { value: socialPlatform, onChange: (e) => setSocialPlatform(e.target.value), className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent", "data-testid": "select-platform", children: [_jsx("option", { value: "instagram", children: "Instagram" }), _jsx("option", { value: "facebook", children: "Facebook" }), _jsx("option", { value: "twitter", children: "Twitter" }), _jsx("option", { value: "linkedin", children: "LinkedIn" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Post Title" }), _jsx("input", { type: "text", value: socialTitle, onChange: (e) => setSocialTitle(e.target.value), placeholder: "Mental Health Awareness", className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent", "data-testid": "input-social-title" })] }), _jsx("button", { onClick: handleCreateSocialPost, disabled: isLoading, className: "w-full flex items-center justify-center gap-2 px-6 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition", "data-testid": "button-create-social", children: isLoading ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "h-5 w-5 animate-spin" }), "Creating..."] })) : (_jsxs(_Fragment, { children: [_jsx(Sparkles, { className: "h-5 w-5" }), "Create Social Post"] })) })] })), activeTab === "quotes" && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold mb-2", children: "Inspirational Quote Generator" }), _jsx("p", { className: "text-gray-600 mb-6", children: "Transform quotes into beautiful visuals" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Quote" }), _jsx("textarea", { value: quoteText, onChange: (e) => setQuoteText(e.target.value), placeholder: "Every day may not be good, but there is something good in every day", rows: 3, className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent", "data-testid": "textarea-quote" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Author (Optional)" }), _jsx("input", { type: "text", value: quoteAuthor, onChange: (e) => setQuoteAuthor(e.target.value), placeholder: "Anonymous", className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent", "data-testid": "input-quote-author" })] }), _jsx("button", { onClick: handleGenerateQuote, disabled: isLoading, className: "w-full flex items-center justify-center gap-2 px-6 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition", "data-testid": "button-generate-quote", children: isLoading ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "h-5 w-5 animate-spin" }), "Generating..."] })) : (_jsxs(_Fragment, { children: [_jsx(Sparkles, { className: "h-5 w-5" }), "Generate Quote Design"] })) })] }))] })] }), designs.length > 0 && (_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-bold mb-6", children: "Your Designs" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: designs.map((design) => (_jsx("div", { className: "bg-white rounded-lg shadow-lg overflow-hidden", children: _jsxs("div", { className: "p-6", children: [_jsx("h3", { className: "text-xl font-bold mb-4 truncate", children: design.title || "Untitled Design" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("button", { onClick: () => window.open(design.editUrl, "_blank"), className: "w-full flex items-center justify-center gap-2 px-4 py-3 text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition", "data-testid": `button-edit-${design.canvaDesignId}`, children: [_jsx(ExternalLink, { className: "h-4 w-4" }), "Edit in Canva"] }), _jsx("button", { onClick: () => window.open(design.viewUrl, "_blank"), className: "w-full px-4 py-3 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition", "data-testid": `button-view-${design.canvaDesignId}`, children: "View" })] })] }) }, design.canvaDesignId))) })] }))] }));
}
