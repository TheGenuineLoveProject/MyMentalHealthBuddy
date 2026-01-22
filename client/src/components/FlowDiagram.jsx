/**
 * ============================================================================
 * FLOW DIAGRAM COMPONENT
 * ============================================================================
 * 
 * SVG-based user flow diagram for The Genuine Love Project
 * Shows the complete navigation flow between 7 core screens
 * 
 * UX Flow: Landing → Onboarding → Homepage → CRM → Content → Q&A → Login
 * ============================================================================
 */

import { 
  Home, Sparkles, LayoutDashboard, Users, BookOpen, MessageCircle, LogIn 
} from "lucide-react";

export default function FlowDiagram({ compact = false }) {
  const screens = [
    { id: "landing", name: "Landing", icon: Home, color: "#8fbf9f" },
    { id: "onboarding", name: "Onboarding", icon: Sparkles, color: "#eac33b" },
    { id: "homepage", name: "Homepage", icon: LayoutDashboard, color: "#2f5d5d" },
    { id: "crm", name: "CRM", icon: Users, color: "#f4c7c3" },
    { id: "content", name: "Content", icon: BookOpen, color: "#8fbf9f" },
    { id: "qa", name: "Q&A", icon: MessageCircle, color: "#eac33b" },
    { id: "login", name: "Auth", icon: LogIn, color: "#2f5d5d" }
  ];

  if (compact) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-2">
        {screens.map((screen, i) => {
          const Icon = screen.icon;
          return (
            <div key={screen.id} className="flex items-center gap-2">
              <div 
                className="flex items-center gap-2 px-3 py-2 rounded-lg"
                style={{ background: `${screen.color}15` }}
                data-testid={`flow-node-${screen.id}`}
              >
                <Icon className="w-4 h-4" style={{ color: screen.color }} aria-hidden="true" />
                <span className="text-sm font-medium" style={{ color: '#2f5d5d' }}>
                  {screen.name}
                </span>
              </div>
              {i < screens.length - 1 && (
                <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                  <path 
                    d="M9 6l6 6-6 6" 
                    fill="none" 
                    stroke="#eac33b" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <svg 
        width="100%" 
        height="180" 
        viewBox="0 0 900 180"
        className="min-w-[800px]"
        role="img"
        aria-label="User flow diagram showing navigation between 7 core screens"
      >
        <defs>
          <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8fbf9f" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#eac33b" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#2f5d5d" stopOpacity="0.3" />
          </linearGradient>
          <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.15" />
          </filter>
          <marker 
            id="arrowhead" 
            markerWidth="10" 
            markerHeight="7" 
            refX="9" 
            refY="3.5" 
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#eac33b" />
          </marker>
        </defs>

        {/* Background Flow Line */}
        <path
          d="M 60 90 L 840 90"
          stroke="url(#flowGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Connection Arrows */}
        {[0, 1, 2, 3, 4, 5].map(i => (
          <line
            key={`arrow-${i}`}
            x1={110 + i * 130}
            y1="90"
            x2={140 + i * 130}
            y2="90"
            stroke="#eac33b"
            strokeWidth="2"
            markerEnd="url(#arrowhead)"
          />
        ))}

        {/* Screen Nodes */}
        {screens.map((screen, i) => {
          const cx = 60 + i * 130;
          return (
            <g key={screen.id} transform={`translate(${cx}, 90)`}>
              {/* Node Background */}
              <circle
                r="35"
                fill="white"
                stroke={screen.color}
                strokeWidth="3"
                filter="url(#dropShadow)"
              />
              
              {/* Node Inner Circle */}
              <circle
                r="28"
                fill={`${screen.color}20`}
              />
              
              {/* Screen Number */}
              <text
                y="-50"
                textAnchor="middle"
                fill="#3a3a3a"
                fontSize="12"
                fontWeight="600"
                opacity="0.5"
              >
                {i + 1}
              </text>
              
              {/* Screen Label */}
              <text
                y="60"
                textAnchor="middle"
                fill="#2f5d5d"
                fontSize="13"
                fontWeight="600"
              >
                {screen.name}
              </text>
            </g>
          );
        })}

        {/* Legend */}
        <g transform="translate(750, 160)">
          <rect x="-50" y="-15" width="100" height="24" rx="12" fill="rgba(47, 93, 93, 0.05)" />
          <text textAnchor="middle" fill="#3a3a3a" fontSize="10" fontWeight="500">
            UX Flow v1.0
          </text>
        </g>
      </svg>

      {/* Markdown Export */}
      <details className="mt-4">
        <summary 
          className="text-sm font-medium cursor-pointer"
          style={{ color: '#2f5d5d' }}
        >
          View as Markdown
        </summary>
        <pre 
          className="mt-2 p-4 rounded-lg text-xs overflow-x-auto"
          style={{ background: 'rgba(47, 93, 93, 0.05)' }}
        >
{`## User Flow Diagram

\`\`\`
┌─────────┐     ┌────────────┐     ┌──────────┐     ┌─────┐
│ Landing │ ──▶ │ Onboarding │ ──▶ │ Homepage │ ──▶ │ CRM │
└─────────┘     └────────────┘     └──────────┘     └─────┘
                                          │
                                          ▼
┌───────┐     ┌─────┐     ┌─────────┐     │
│ Login │ ◀── │ Q&A │ ◀── │ Content │ ◀───┘
└───────┘     └─────┘     └─────────┘
\`\`\`

### Screen Details

| # | Screen      | Route         | Purpose                    |
|---|-------------|---------------|----------------------------|
| 1 | Landing     | /             | Lead capture, conversion   |
| 2 | Onboarding  | /onboarding   | User preferences setup     |
| 3 | Homepage    | /dashboard    | Daily focus, quick actions |
| 4 | CRM         | /admin        | User management, analytics |
| 5 | Content     | /content      | Articles, resources        |
| 6 | Q&A         | /community    | Community discussions      |
| 7 | Login       | /login        | Authentication             |
`}
        </pre>
      </details>
    </div>
  );
}

/**
 * Export flow diagram as SVG string for external use
 */
export function getFlowDiagramSVG() {
  return `<svg width="900" height="180" viewBox="0 0 900 180" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#8fbf9f" stop-opacity="0.3" />
      <stop offset="50%" stop-color="#eac33b" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#2f5d5d" stop-opacity="0.3" />
    </linearGradient>
  </defs>
  
  <path d="M 60 90 L 840 90" stroke="url(#flowGradient)" stroke-width="8" stroke-linecap="round" fill="none"/>
  
  <!-- Landing -->
  <circle cx="60" cy="90" r="35" fill="white" stroke="#8fbf9f" stroke-width="3"/>
  <text x="60" y="140" text-anchor="middle" fill="#2f5d5d" font-size="13" font-weight="600">Landing</text>
  
  <!-- Onboarding -->
  <circle cx="190" cy="90" r="35" fill="white" stroke="#eac33b" stroke-width="3"/>
  <text x="190" y="140" text-anchor="middle" fill="#2f5d5d" font-size="13" font-weight="600">Onboarding</text>
  
  <!-- Homepage -->
  <circle cx="320" cy="90" r="35" fill="white" stroke="#2f5d5d" stroke-width="3"/>
  <text x="320" y="140" text-anchor="middle" fill="#2f5d5d" font-size="13" font-weight="600">Homepage</text>
  
  <!-- CRM -->
  <circle cx="450" cy="90" r="35" fill="white" stroke="#f4c7c3" stroke-width="3"/>
  <text x="450" y="140" text-anchor="middle" fill="#2f5d5d" font-size="13" font-weight="600">CRM</text>
  
  <!-- Content -->
  <circle cx="580" cy="90" r="35" fill="white" stroke="#8fbf9f" stroke-width="3"/>
  <text x="580" y="140" text-anchor="middle" fill="#2f5d5d" font-size="13" font-weight="600">Content</text>
  
  <!-- Q&A -->
  <circle cx="710" cy="90" r="35" fill="white" stroke="#eac33b" stroke-width="3"/>
  <text x="710" y="140" text-anchor="middle" fill="#2f5d5d" font-size="13" font-weight="600">Q&A</text>
  
  <!-- Login -->
  <circle cx="840" cy="90" r="35" fill="white" stroke="#2f5d5d" stroke-width="3"/>
  <text x="840" y="140" text-anchor="middle" fill="#2f5d5d" font-size="13" font-weight="600">Auth</text>
</svg>`;
}
