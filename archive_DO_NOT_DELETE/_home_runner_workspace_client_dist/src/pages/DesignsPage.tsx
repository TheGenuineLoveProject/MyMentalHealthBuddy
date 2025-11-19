import { useEffect, useState } from "react";
import { useCanva } from "@/contexts/CanvaContext";
import { 
  Palette, 
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin,
  Sparkles,
  ExternalLink,
  Loader2,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { SkeletonContentList } from "@/components/LoadingStates";

const DESIGN_TYPES = [
  { id: "InstagramPost", name: "Instagram Post", icon: Instagram },
  { id: "InstagramStory", name: "Instagram Story", icon: Instagram },
  { id: "FacebookPost", name: "Facebook Post", icon: Facebook },
  { id: "TwitterPost", name: "Twitter Post", icon: Twitter },
  { id: "LinkedInPost", name: "LinkedIn Post", icon: Linkedin },
];

export default function DesignsPage() {
  const { 
    isConnected, 
    isEnabled, 
    designs, 
    isLoading, 
    connectToCanva,
    createDesign,
    createSocialPost,
    generateQuote,
    refreshDesigns
  } = useCanva();
  
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
    } else {
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
    } else {
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
    } else {
      alert("Failed to generate quote. Please try again or check your Canva connection.");
    }
  };

  if (!isEnabled) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-1" />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-1">Canva Not Configured</h3>
              <p className="text-yellow-700 text-sm">
                Canva API credentials are not configured. Please set up CANVA_CLIENT_ID and CANVA_CLIENT_SECRET 
                environment variables to enable visual design features.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg text-center py-16 px-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6">
            <Palette className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Connect to Canva</h1>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Unlock stunning visual content creation for your mental health journey. 
            Create beautiful social media posts, mood boards, inspirational quotes, 
            and more with professional design tools.
          </p>
          <button
            onClick={connectToCanva}
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg shadow-lg transition-all transform hover:scale-105"
            data-testid="button-connect-canva"
          >
            <Sparkles className="h-6 w-6" />
            Connect to Canva
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Design Studio
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Create stunning visual content for your mental health journey
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <span className="text-green-700 font-medium">Canva Connected</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg mb-8">
        <div className="border-b border-gray-200">
          <div className="flex gap-1 p-1">
            <button
              onClick={() => setActiveTab("create")}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition ${
                activeTab === "create"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              data-testid="tab-create"
            >
              Create Design
            </button>
            <button
              onClick={() => setActiveTab("social")}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition ${
                activeTab === "social"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              data-testid="tab-social"
            >
              Social Posts
            </button>
            <button
              onClick={() => setActiveTab("quotes")}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition ${
                activeTab === "quotes"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              data-testid="tab-quotes"
            >
              Quote Generator
            </button>
          </div>
        </div>

        <div className="p-8">
          {activeTab === "create" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Create New Design</h2>
                <p className="text-gray-600 mb-6">Choose a template and start designing</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Design Type
                </label>
                <select
                  value={selectedDesignType}
                  onChange={(e) => setSelectedDesignType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  data-testid="select-design-type"
                >
                  {DESIGN_TYPES.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title (Optional)
                </label>
                <input
                  type="text"
                  value={designTitle}
                  onChange={(e) => setDesignTitle(e.target.value)}
                  placeholder="My Mental Health Post"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  data-testid="input-design-title"
                />
              </div>

              <button
                onClick={handleCreateDesign}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                data-testid="button-create-design"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Palette className="h-5 w-5" />
                    Create Design
                  </>
                )}
              </button>
            </div>
          )}

          {activeTab === "social" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Social Media Post Creator</h2>
                <p className="text-gray-600 mb-6">Create platform-optimized designs</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform
                </label>
                <select
                  value={socialPlatform}
                  onChange={(e) => setSocialPlatform(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  data-testid="select-platform"
                >
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="twitter">Twitter</option>
                  <option value="linkedin">LinkedIn</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Post Title
                </label>
                <input
                  type="text"
                  value={socialTitle}
                  onChange={(e) => setSocialTitle(e.target.value)}
                  placeholder="Mental Health Awareness"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  data-testid="input-social-title"
                />
              </div>

              <button
                onClick={handleCreateSocialPost}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                data-testid="button-create-social"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Create Social Post
                  </>
                )}
              </button>
            </div>
          )}

          {activeTab === "quotes" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Inspirational Quote Generator</h2>
                <p className="text-gray-600 mb-6">Transform quotes into beautiful visuals</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quote
                </label>
                <textarea
                  value={quoteText}
                  onChange={(e) => setQuoteText(e.target.value)}
                  placeholder="Every day may not be good, but there is something good in every day"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  data-testid="textarea-quote"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author (Optional)
                </label>
                <input
                  type="text"
                  value={quoteAuthor}
                  onChange={(e) => setQuoteAuthor(e.target.value)}
                  placeholder="Anonymous"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  data-testid="input-quote-author"
                />
              </div>

              <button
                onClick={handleGenerateQuote}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                data-testid="button-generate-quote"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Generate Quote Design
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {designs.length > 0 && (
        <div>
          <h2 className="text-3xl font-bold mb-6">Your Designs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designs.map((design) => (
              <div key={design.canvaDesignId} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4 truncate">
                    {design.title || "Untitled Design"}
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => window.open(design.editUrl, "_blank")}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition"
                      data-testid={`button-edit-${design.canvaDesignId}`}
                    >
                      <ExternalLink className="h-4 w-4" />
                      Edit in Canva
                    </button>
                    <button
                      onClick={() => window.open(design.viewUrl, "_blank")}
                      className="w-full px-4 py-3 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition"
                      data-testid={`button-view-${design.canvaDesignId}`}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
