import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, FileText, Eye, Send, Plus, Edit3, Trash2, Calendar, CheckCircle, Clock, Save, X } from "lucide-react";
import SEO from "../components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

const WORKFLOW_STEPS = [
  { name: "Draft", description: "Create and edit your content", icon: FileText, status: "active" },
  { name: "Review", description: "Preview and quality check", icon: Eye, status: "pending" },
  { name: "Publish", description: "Make content live", icon: Send, status: "pending" },
];

const INITIAL_DRAFTS = [
  { id: 1, title: "Morning Mindfulness Routine", type: "Article", status: "draft", lastEdited: "2 hours ago", wordCount: 850 },
  { id: 2, title: "5 Grounding Techniques for Anxiety", type: "Guide", status: "review", lastEdited: "1 day ago", wordCount: 1200 },
  { id: 3, title: "Weekly Reflection Prompts", type: "Template", status: "scheduled", lastEdited: "3 days ago", wordCount: 450, scheduledFor: "Jan 28, 2026" },
];

export default function Publishing() {
  const [drafts, setDrafts] = useState(INITIAL_DRAFTS);
  const [showNewDraftModal, setShowNewDraftModal] = useState(false);
  const [newDraft, setNewDraft] = useState({ title: "", type: "Article" });
  const [selectedDraft, setSelectedDraft] = useState(null);

  const handleCreateDraft = () => {
    if (!newDraft.title.trim()) return;
    const draft = {
      id: Date.now(),
      title: newDraft.title,
      type: newDraft.type,
      status: "draft",
      lastEdited: "Just now",
      wordCount: 0
    };
    setDrafts([draft, ...drafts]);
    setNewDraft({ title: "", type: "Article" });
    setShowNewDraftModal(false);
  };

  const handleDeleteDraft = (id) => {
    setDrafts(drafts.filter(d => d.id !== id));
    if (selectedDraft?.id === id) setSelectedDraft(null);
  };

  const handleUpdateStatus = (id, newStatus) => {
    setDrafts(drafts.map(d => d.id === id ? { ...d, status: newStatus, lastEdited: "Just now" } : d));
  };

  const getStatusBadge = (status) => {
    const styles = {
      draft: "bg-gray-100 text-gray-600",
      review: "bg-amber-100 text-amber-700",
      scheduled: "bg-blue-100 text-blue-700",
      published: "bg-green-100 text-green-700"
    };
    return styles[status] || styles.draft;
  };

  return (
  <WellnessPageShell
    title="Publishing"
    subtitle="Educational reflection tools. Choose what feels safe and supportive."
    benefits={pickBenefits(["Agency","Calm","Clarity","Self-respect","Your pace"], 5)}
    clarity={{
      what: "A self-paced reflection tool you control.",
      why: "To support clarity, values alignment, and gentle next steps.",
      who: "For adults (18+) who want educational wellness tools (not medical care).",
      when: "Anytime you want a small reset or a thoughtful pause.",
      where: "Anywhere you can breathe and write for 1–5 minutes.",
      how: "Pick one prompt, answer briefly, stop whenever you want."
    }}
    examples={[
      { label: "Beginner", examples: ["Write one honest sentence about how you feel.", "Name one value you want to protect today."] },
      { label: "Intermediate", examples: ["Describe the situation + the need underneath it.", "Write a boundary you could try in one sentence."] },
      { label: "Advanced", examples: ["Identify a pattern and the smallest experiment to change it.", "Write a compassionate reframe and one measurable step."] }
    ]}
  >

    <>
      <SEO 
        title="Publishing Studio - The Genuine Love Project"
        description="Draft, review, and publish your wellness content."
      />
      <div className="min-h-screen hero-gradient p-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-2 text-body-sm text-[var(--sage-500)] hover:text-[var(--teal-600)] transition mb-6"
              data-testid="link-back-dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="icon-container icon-xl icon-gradient-sage">
                  <FileText className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-display-lg text-teal">Publishing Studio</h1>
                  <p className="text-lead">Draft, review, and publish your content</p>
                </div>
              </div>
              <button
                onClick={() => setShowNewDraftModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                data-testid="button-new-draft"
              >
                <Plus className="w-4 h-4" />
                New Draft
              </button>
            </div>
          </header>

          <div className="card-bordered mb-8">
            <h2 className="text-heading-md text-teal mb-6">Workflow</h2>
            <div className="flex items-center justify-between mb-6">
              {WORKFLOW_STEPS.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="flex items-center gap-4 flex-1">
                    <div className="flex flex-col items-center">
                      <div className={`icon-container icon-lg ${step.status === 'active' ? 'icon-gradient-sage' : 'icon-soft-sage'}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <p className={`text-caption mt-2 ${step.status === 'active' ? 'text-teal font-medium' : 'text-[var(--sage-500)]'}`}>
                        {step.name}
                      </p>
                    </div>
                    {index < WORKFLOW_STEPS.length - 1 && (
                      <div className="flex-1 h-0.5 bg-[var(--sage-200)] mx-4" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="card-bordered">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-heading-md text-teal">Your Drafts</h2>
                  <span className="text-body-sm text-gray-500">{drafts.length} items</span>
                </div>
                
                <div className="space-y-4">
                  {drafts.map((draft) => (
                    <div 
                      key={draft.id}
                      className={`p-4 rounded-xl border transition cursor-pointer ${selectedDraft?.id === draft.id ? 'border-teal-400 bg-teal-50' : 'border-gray-200 hover:border-sage-300'}`}
                      onClick={() => setSelectedDraft(draft)}
                      data-testid={`draft-item-${draft.id}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium text-teal-800">{draft.title}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(draft.status)}`}>
                              {draft.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{draft.type}</span>
                            <span>•</span>
                            <span>{draft.wordCount} words</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {draft.lastEdited}
                            </span>
                            {draft.scheduledFor && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1 text-blue-600">
                                  <Calendar className="w-3 h-3" />
                                  {draft.scheduledFor}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            className="p-2 rounded-lg hover:bg-gray-100 transition"
                            onClick={(e) => { e.stopPropagation(); }}
                            data-testid={`button-edit-${draft.id}`}
                          >
                            <Edit3 className="w-4 h-4 text-gray-500" />
                          </button>
                          <button 
                            className="p-2 rounded-lg hover:bg-red-50 transition"
                            onClick={(e) => { e.stopPropagation(); handleDeleteDraft(draft.id); }}
                            data-testid={`button-delete-${draft.id}`}
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {drafts.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                      <p>No drafts yet. Create your first one!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="card-bordered sticky top-8">
                <h2 className="text-heading-md text-teal mb-4">Quick Actions</h2>
                
                {selectedDraft ? (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 mb-4">
                      Selected: <strong>{selectedDraft.title}</strong>
                    </p>
                    
                    <button 
                      onClick={() => handleUpdateStatus(selectedDraft.id, 'review')}
                      className="w-full flex items-center gap-2 px-4 py-3 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition"
                      data-testid="button-send-review"
                    >
                      <Eye className="w-4 h-4" />
                      Send to Review
                    </button>
                    
                    <button 
                      onClick={() => handleUpdateStatus(selectedDraft.id, 'scheduled')}
                      className="w-full flex items-center gap-2 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
                      data-testid="button-schedule"
                    >
                      <Calendar className="w-4 h-4" />
                      Schedule Publication
                    </button>
                    
                    <button 
                      onClick={() => handleUpdateStatus(selectedDraft.id, 'published')}
                      className="w-full flex items-center gap-2 px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition"
                      data-testid="button-publish"
                    >
                      <Send className="w-4 h-4" />
                      Publish Now
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Select a draft to see available actions.
                  </p>
                )}

                <hr className="my-6 border-gray-200" />

                <h3 className="text-heading-sm text-teal mb-3">Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Drafts</span>
                    <span className="font-medium text-gray-800">{drafts.filter(d => d.status === 'draft').length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">In Review</span>
                    <span className="font-medium text-amber-600">{drafts.filter(d => d.status === 'review').length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Scheduled</span>
                    <span className="font-medium text-blue-600">{drafts.filter(d => d.status === 'scheduled').length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Published</span>
                    <span className="font-medium text-green-600">{drafts.filter(d => d.status === 'published').length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showNewDraftModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-heading-md text-teal">Create New Draft</h2>
              <button 
                onClick={() => setShowNewDraftModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
                data-testid="button-close-modal"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newDraft.title}
                  onChange={(e) => setNewDraft({ ...newDraft, title: e.target.value })}
                  placeholder="Enter draft title..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition"
                  data-testid="input-draft-title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                <select
                  value={newDraft.type}
                  onChange={(e) => setNewDraft({ ...newDraft, type: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition"
                  data-testid="select-draft-type"
                >
                  <option value="Article">Article</option>
                  <option value="Guide">Guide</option>
                  <option value="Template">Template</option>
                  <option value="Newsletter">Newsletter</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowNewDraftModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition"
                  data-testid="button-cancel-draft"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateDraft}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition"
                  data-testid="button-create-draft"
                >
                  <Save className="w-4 h-4" />
                  Create Draft
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  </WellnessPageShell>
  );
}
