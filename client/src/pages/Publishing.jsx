import { Link } from "wouter";
import { ArrowLeft, FileText, Eye, Send, Clock, CheckCircle, Settings } from "lucide-react";
import SEO from "../components/SEO";

const WORKFLOW_STEPS = [
  { name: "Draft", description: "Create and edit your content", icon: FileText, status: "active" },
  { name: "Review", description: "Preview and quality check", icon: Eye, status: "pending" },
  { name: "Publish", description: "Make content live", icon: Send, status: "pending" },
];

export default function Publishing() {
  return (
    <>
      <SEO 
        title="Publishing Studio - The Genuine Love Project"
        description="Draft, review, and publish your wellness content."
      />
      <div className="min-h-screen hero-gradient p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-2 text-body-sm text-[var(--sage-500)] hover:text-[var(--teal-600)] transition mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <div className="flex items-center gap-4">
              <div className="icon-container icon-xl icon-gradient-sage">
                <FileText className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-display-lg text-teal">Publishing Studio</h1>
                <p className="text-lead">Draft, review, and publish your content</p>
              </div>
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

          <div className="card-bordered">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-container icon-md icon-soft-gold">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-heading-sm text-teal">Coming Soon</h3>
            </div>
            <p className="text-body-sm mb-4">
              The publishing studio is being enhanced with powerful new features:
            </p>
            <ul className="space-y-3">
              {[
                "Role-based access for editors and reviewers",
                "Rich text editor with formatting tools",
                "Scheduling for timed publication",
                "Version history and rollback",
                "CMS tables and admin workflow"
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-body-sm">
                  <div className="icon-container icon-sm icon-soft-sage">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
