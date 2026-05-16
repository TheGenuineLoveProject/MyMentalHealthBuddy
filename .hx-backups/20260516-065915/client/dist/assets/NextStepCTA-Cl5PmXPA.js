import{m}from"./vendor-charts-ENHkH8XD.js";import{n}from"./vendor-router-cp-whPRW.js";import{Bn as b,Pr as i,Ur as p,X as s,a as o,bi as f,fi as g,in as u,ji as y,ot as x,st as w,zt as v}from"./vendor-lucide-C8yKtP3N.js";var e=m(),c={"after-breathing":{eyebrow:"Beautifully done.",headline:"Carry that calm forward.",subline:"You just gave your nervous system a gift. The simplest next step is the one that fits the next ten minutes — not the next ten years.",accent:"#74C0FC",accentSoft:"rgba(116, 192, 252, 0.16)",primary:{label:"Capture how you feel",href:"/checkin",icon:p,testid:"link-cta-after-breathing-primary"},secondary:{label:"Celebrate this moment",href:"/celebration",icon:s,testid:"link-cta-after-breathing-secondary"}},"after-checkin":{eyebrow:"Thank you for showing up.",headline:"What you noticed matters.",subline:"Naming a feeling is half the work. If it's helpful, take a few breaths together — or honor the courage it took to check in at all.",accent:"#A8C9A0",accentSoft:"rgba(168, 201, 160, 0.18)",primary:{label:"Breathe with Lumi",href:"/tools/breathing",icon:o,testid:"link-cta-after-checkin-primary"},secondary:{label:"Celebrate showing up",href:"/celebration",icon:s,testid:"link-cta-after-checkin-secondary"}},"after-celebration":{eyebrow:"You did it.",headline:"Small wins, stacked daily, become a life.",subline:"Healing isn't linear and it isn't loud. Come back tomorrow — even for a single minute. Your future self will thank you.",accent:"#FFD93D",accentSoft:"rgba(255, 217, 61, 0.18)",primary:{label:"Set a daily reminder",href:"/dashboard",icon:g,testid:"link-cta-after-celebration-primary"},secondary:{label:"Share with a friend",href:"/about",icon:w,testid:"link-cta-after-celebration-secondary"}},general:{eyebrow:"Begin where you are.",headline:"Your first gentle step is free.",subline:"No signup walls, no clinical jargon. Pick the tool that meets this moment — breathe, reflect, or just notice yourself.",accent:"#8FBF9F",accentSoft:"rgba(143, 191, 159, 0.18)",primary:{label:"Try a free tool",href:"/tools",icon:i,testid:"link-cta-general-primary"},secondary:{label:"Talk to Lumi",href:"/chat",icon:u,testid:"link-cta-general-secondary"}},about:{eyebrow:"Built with care.",headline:"Ready to try the practice?",subline:"Reading about gentle support is one thing — feeling it is another. The tools take less than five minutes and they're free, forever.",accent:"#C8B6FF",accentSoft:"rgba(200, 182, 255, 0.20)",primary:{label:"Open the toolkit",href:"/tools",icon:i,testid:"link-cta-about-primary"},secondary:{label:"Read the journal",href:"/blog",icon:f,testid:"link-cta-about-secondary"}},blog:{eyebrow:"From reflection to practice.",headline:"Turn what you read into a moment of care.",subline:"Insight without action stays abstract. Pick a small practice now while the words are still fresh — even a single breath counts.",accent:"#FFB88C",accentSoft:"rgba(255, 184, 140, 0.20)",primary:{label:"Try a 60-second practice",href:"/tools/breathing",icon:o,testid:"link-cta-blog-primary"},secondary:{label:"Write your own reflection",href:"/journal",icon:v,testid:"link-cta-blog-secondary"}}};function C({context:r="general",className:l=""}){const a=c[r]||c.general,d=a.primary.icon,h=a.secondary.icon,t=`next-step-${r}-heading`;return(0,e.jsxs)("section",{className:`nsc-section ${l}`.trim(),"aria-labelledby":t,"data-testid":`section-next-step-${r}`,"data-context":r,style:{"--nsc-accent":a.accent,"--nsc-accent-soft":a.accentSoft},children:[(0,e.jsxs)("div",{className:"nsc-card",children:[(0,e.jsx)("div",{className:"nsc-glow","aria-hidden":"true"}),(0,e.jsxs)("div",{className:"nsc-content",children:[(0,e.jsxs)("p",{className:"nsc-eyebrow",children:[(0,e.jsx)(b,{className:"w-3.5 h-3.5","aria-hidden":"true"}),(0,e.jsx)("span",{children:a.eyebrow})]}),(0,e.jsx)("h2",{id:t,className:"nsc-heading",children:a.headline}),(0,e.jsx)("p",{className:"nsc-sub",children:a.subline}),(0,e.jsxs)("div",{className:"nsc-actions",children:[(0,e.jsxs)(n,{href:a.primary.href,className:"nsc-btn nsc-btn--primary","data-testid":a.primary.testid,children:[(0,e.jsx)(d,{className:"w-4.5 h-4.5","aria-hidden":"true"}),(0,e.jsx)("span",{children:a.primary.label}),(0,e.jsx)(y,{className:"w-4 h-4 nsc-btn__arrow","aria-hidden":"true"})]}),(0,e.jsxs)(n,{href:a.secondary.href,className:"nsc-btn nsc-btn--secondary","data-testid":a.secondary.testid,children:[(0,e.jsx)(h,{className:"w-4.5 h-4.5","aria-hidden":"true"}),(0,e.jsx)("span",{children:a.secondary.label})]})]}),(0,e.jsxs)(n,{href:"/crisis",className:"nsc-crisis","data-testid":`link-cta-${r}-crisis`,children:[(0,e.jsx)(x,{className:"w-3.5 h-3.5","aria-hidden":"true"}),(0,e.jsx)("span",{children:"If you're in crisis, gentle help is here →"})]})]})]}),(0,e.jsx)("style",{children:`
        .nsc-section {
          padding: clamp(2rem, 5vw, 3.5rem) 1.25rem;
          display: flex;
          justify-content: center;
        }
        .nsc-card {
          position: relative;
          width: 100%;
          max-width: 780px;
          padding: clamp(1.6rem, 3.5vw, 2.6rem);
          border-radius: 22px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.86)),
            var(--nsc-accent-soft);
          border: 1.5px solid color-mix(in srgb, var(--nsc-accent) 32%, transparent);
          box-shadow:
            0 16px 40px rgba(47, 84, 67, 0.08),
            0 2px 6px rgba(47, 84, 67, 0.04);
          overflow: hidden;
          isolation: isolate;
        }
        .nsc-glow {
          position: absolute;
          inset: -40% -40% auto auto;
          width: 70%;
          height: 70%;
          background: radial-gradient(circle, var(--nsc-accent-soft), transparent 65%);
          z-index: 0;
          pointer-events: none;
          filter: blur(8px);
        }
        .nsc-content {
          position: relative;
          z-index: 1;
          text-align: center;
        }
        .nsc-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.32rem 0.8rem;
          margin: 0 0 1rem;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: color-mix(in srgb, var(--nsc-accent) 60%, #2F5443);
          background: var(--nsc-accent-soft);
          border-radius: 999px;
        }
        .nsc-heading {
          font-family: var(--font-serif, ui-serif, Georgia, serif);
          font-weight: 700;
          font-size: clamp(1.45rem, 3.2vw, 2rem);
          line-height: 1.22;
          color: var(--glp-sage-deep, #2F5443);
          margin: 0 0 0.7rem;
        }
        .nsc-sub {
          max-width: 56ch;
          margin: 0 auto 1.5rem;
          font-size: clamp(0.95rem, 1.4vw, 1.02rem);
          line-height: 1.65;
          color: var(--glp-ink, #3a3a36);
        }
        .nsc-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.7rem;
          margin-bottom: 1.1rem;
        }
        .nsc-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.85rem 1.4rem;
          font-size: 0.95rem;
          font-weight: 600;
          font-family: inherit;
          border-radius: 12px;
          text-decoration: none;
          cursor: pointer;
          transition: transform 180ms ease, box-shadow 180ms ease, filter 180ms ease, background-color 180ms ease;
          border: 1.5px solid transparent;
          line-height: 1.2;
        }
        .nsc-btn__arrow {
          transition: transform 200ms ease;
        }
        .nsc-btn--primary {
          color: white;
          background: linear-gradient(135deg, var(--nsc-accent), color-mix(in srgb, var(--nsc-accent) 65%, #2F5443));
          box-shadow: 0 6px 18px color-mix(in srgb, var(--nsc-accent) 35%, transparent);
        }
        .nsc-btn--primary:hover {
          transform: translateY(-1px);
          filter: brightness(1.04);
        }
        .nsc-btn--primary:hover .nsc-btn__arrow {
          transform: translateX(3px);
        }
        .nsc-btn--secondary {
          color: var(--glp-sage-deep, #2F5443);
          background: rgba(255, 255, 255, 0.85);
          border-color: color-mix(in srgb, var(--nsc-accent) 38%, transparent);
        }
        .nsc-btn--secondary:hover {
          background: white;
          border-color: color-mix(in srgb, var(--nsc-accent) 60%, transparent);
          transform: translateY(-1px);
        }
        .nsc-btn:focus-visible {
          outline: 3px solid var(--nsc-accent);
          outline-offset: 3px;
        }
        .nsc-crisis {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8rem;
          color: #a04a40;
          text-decoration: none;
          opacity: 0.85;
          transition: opacity 180ms ease;
        }
        .nsc-crisis:hover {
          opacity: 1;
          text-decoration: underline;
        }
        @media (prefers-reduced-motion: reduce) {
          .nsc-btn, .nsc-btn__arrow {
            transition: none !important;
          }
          .nsc-btn:hover { transform: none !important; }
          .nsc-btn:hover .nsc-btn__arrow { transform: none !important; }
        }
      `})]})}export{C as t};
