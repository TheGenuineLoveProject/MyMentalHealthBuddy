import{n as b}from"./rolldown-runtime-xSXa1GVp.js";import{a as v}from"./vendor-forms-8QpcYN5m.js";import{c as k,i as x}from"./vendor-router-BOKW17hU.js";import{C as T}from"./vendor-query-CtuAzxq0.js";import{Bn as E,X as I,a as S,n as F}from"./vendor-lucide-CjvKhvT1.js";var a=b(v(),1),n={VISUAL:"visual",AUDITORY:"auditory",KINESTHETIC:"kinesthetic"},K={path:"/",headline:"You don't have to figure this out alone.",subline:"A calm companion for gentle check-ins, emotional support, and quiet moments when you need someone there.",trustLine:"Private. No judgment. Emotionally safe.",affirmation:"You're here. That already means something beautiful.",openQuestion:"What would feeling supported look like for you today?",reflection:"Coming here — that's wisdom, not weakness. Whatever brought you, it's welcome.",presupposition:"As you explore, you will discover tools that feel right for the way you feel right now.",embeddedCommand:"Allow yourself to take one gentle breath before you read on.",ctaPrimary:{label:"Talk With Buddy",href:"/chat"},ctaSecondary:{label:"Take a Calm Check-In",href:"/checkin"},sections:[{icon:"Wind",title:"A soft place to land",content:"No forms, no diagnosis, no pressure. Just a quiet space where you can breathe and feel heard.",sensoryWords:[{word:"soft",kind:n.KINESTHETIC},{word:"breathe",kind:n.KINESTHETIC},{word:"heard",kind:n.AUDITORY}],accent:"#A8C9A0",tint:"rgba(168, 201, 160, 0.12)",halo:"rgba(168, 213, 186, 0.35)",avatar:"/lumi/official/lumi-meditation.png",avatarWebp:void 0,cta:{label:"Take a Calm Breath",href:"/tools/breathing"}},{icon:"Heart",title:"A companion who listens",content:"Lumi remembers what matters to you and meets you where you are — gently, every time.",sensoryWords:[{word:"listens",kind:n.AUDITORY},{word:"gently",kind:n.KINESTHETIC}],accent:"#C8B6FF",tint:"rgba(200, 182, 255, 0.14)",halo:"rgba(200, 182, 255, 0.40)",avatar:"/lumi/official/lumi-heart.png",avatarWebp:void 0,cta:{label:"Talk With Lumi",href:"/chat"}},{icon:"Sparkles",title:"Tools that feel kind",content:"Tiny exercises you can use in two minutes — designed to ease tension, not add to it.",sensoryWords:[{word:"kind",kind:n.KINESTHETIC},{word:"ease",kind:n.KINESTHETIC}],accent:"#FFD93D",tint:"rgba(255, 217, 61, 0.10)",halo:"rgba(232, 145, 58, 0.32)",avatar:"/lumi/official/lumi-float-idle.png",avatarWebp:void 0,cta:{label:"Explore Gentle Tools",href:"/tools"}},{icon:"Shield",title:"Safety that stays close",content:"If anything ever feels too heavy, crisis support is one calm tap away — always visible, always free.",sensoryWords:[{word:"heavy",kind:n.KINESTHETIC},{word:"visible",kind:n.VISUAL}],accent:"#FF9A8B",tint:"rgba(255, 154, 139, 0.12)",halo:"rgba(255, 184, 140, 0.40)",avatar:"/lumi/official/lumi-heart.png",avatarWebp:void 0,cta:{label:"Crisis Support",href:"/crisis"}}]},W={rollingWithResistance:["No pressure at all. You'll know when you're ready.","It's okay to take your time. There's no rush here.","Some days are harder than others. That's completely normal.","You don't have to have all the answers right now."],developingDiscrepancy:["You give so much to others. What would it feel like to give a little to yourself?","You show up everywhere else. What if you showed up here too?","Your heart works so hard for everyone. When does it get to rest?"],advancedAffirmations:["You have a wisdom inside you that knows exactly what you need.","The fact that you're here tells me you haven't given up on yourself.","You've survived every hard day so far. That is not small.","Your willingness to feel — that IS courage.","You don't have to be perfect to be worthy of care."],advancedOpenQuestions:["If your heart could speak right now, what would it say?","What does 'feeling better' actually look like for you?","When was the last time you truly felt at peace?","What would you tell a friend who felt exactly how you feel?","What tiny step feels possible right now — not perfect, just possible?"]};function C(o){const s=W.rollingWithResistance,l=typeof o=="number"?Math.abs(o)%1:Math.random();return s[Math.floor(l*s.length)]}var t=T(),h="mmhb:microwin_shown",N=45e3,A="mmhb_token",Y=2200;function _(o){if(typeof window>"u")return null;try{return window.sessionStorage.getItem(o)}catch{return null}}function j(o,s){if(!(typeof window>"u"))try{window.sessionStorage.setItem(o,s)}catch{}}function L(){if(typeof window>"u")return!1;try{return!!window.localStorage.getItem(A)}catch{return!1}}function O(){const[o,s]=(0,a.useState)(!1),[l,p]=(0,a.useState)(!1),w=(0,a.useMemo)(()=>C(),[]),[c]=k(),d=(0,a.useRef)(null),m=(0,a.useRef)(null),u=()=>{l||(p(!0),m.current=window.setTimeout(()=>s(!1),Y))};(0,a.useEffect)(()=>()=>{m.current&&window.clearTimeout(m.current)},[]),(0,a.useEffect)(()=>{if(!o)return;const i=window.setTimeout(()=>{try{d.current?.focus()}catch{}},50);return()=>window.clearTimeout(i)},[o]),(0,a.useEffect)(()=>{if(typeof window>"u"||_(h)==="true")return;let i=null;const e=()=>{i&&window.clearTimeout(i),i=window.setTimeout(()=>{s(!0),j(h,"true")},N)};e();const r={passive:!0};return window.addEventListener("click",e,r),window.addEventListener("scroll",e,r),window.addEventListener("keydown",e,r),window.addEventListener("touchstart",e,r),()=>{i&&window.clearTimeout(i),window.removeEventListener("click",e,r),window.removeEventListener("scroll",e,r),window.removeEventListener("keydown",e,r),window.removeEventListener("touchstart",e,r)}},[]),(0,a.useEffect)(()=>{if(!o)return;const i=e=>{e.key==="Escape"&&u()};return window.addEventListener("keydown",i),()=>window.removeEventListener("keydown",i)},[o]);const f=c==="/crisis"||c.startsWith("/crisis/");if(!o||f||c==="/")return null;const y=L()?"/chat":"/login";return(0,t.jsxs)("div",{className:"mwp-shell",role:"dialog","aria-modal":"false","aria-label":"A gentle moment of calm","data-testid":"prompt-micro-win",children:[(0,t.jsxs)("div",{className:"mwp-card",children:[(0,t.jsx)("button",{type:"button",ref:d,onClick:u,className:"mwp-close","aria-label":"Dismiss this gentle prompt","data-testid":"button-micro-win-dismiss",children:(0,t.jsx)(F,{className:"w-4 h-4","aria-hidden":"true"})}),l?(0,t.jsx)("p",{className:"mwp-msg mwp-msg--resistance",role:"status","aria-live":"polite","data-testid":"text-micro-win-resistance",children:w}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("p",{className:"mwp-msg",children:"You don't have to figure everything out right now. Would you like a moment of calm?"}),(0,t.jsx)("div",{className:"mwp-options",children:[{label:"Take one calm breath",href:"/tools/breathing",Icon:S,accent:"#74C0FC"},{label:"Name how you feel",href:"/checkin",Icon:E,accent:"#FFB88C"},{label:"Meet your companion",href:y,Icon:I,accent:"#C8B6FF"}].map(({label:i,href:e,Icon:r,accent:g})=>(0,t.jsxs)(x,{href:e,className:"mwp-opt","data-testid":`link-micro-win-${e.replace(/\//g,"-").slice(1)||"home"}`,onClick:()=>s(!1),style:{"--mwp-accent":g},children:[(0,t.jsx)("span",{className:"mwp-opt__icon","aria-hidden":"true",children:(0,t.jsx)(r,{className:"w-4 h-4"})}),(0,t.jsx)("span",{children:i})]},e))})]})]}),(0,t.jsx)("style",{children:`
        .mwp-shell {
          position: fixed;
          left: 50%;
          /* v5.6 architect fix: lift above AccessibilityToolbar (bottom-6 right-6)
             on small screens so the toolbar's floating button remains tappable. */
          bottom: 5rem;
          transform: translateX(-50%);
          /* v5.6 architect fix: yield z-index to ConsentBanner (z-50) so privacy
             consent always wins. MicroWinPrompt is non-critical and waits 45s — it
             can sit beneath the consent surface. */
          z-index: 40;
          width: min(540px, calc(100% - 2rem));
          pointer-events: none;
        }
        @media (min-width: 768px) {
          /* On larger screens AccessibilityToolbar is in the corner and the prompt
             centers above it cleanly with a smaller offset. */
          .mwp-shell { bottom: 1.5rem; }
        }
        .mwp-card {
          position: relative;
          pointer-events: auto;
          background: #FFFFFF;
          border: 1px solid rgba(143, 191, 159, 0.32);
          border-radius: 18px;
          padding: 1.1rem 1.15rem 1rem;
          box-shadow: 0 14px 40px rgba(47, 84, 67, 0.18);
          animation: mwpFadeUp 360ms cubic-bezier(0.22, 0.9, 0.32, 1) both;
        }
        .mwp-close {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          width: 1.85rem;
          height: 1.85rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: transparent;
          border: none;
          color: #6B7B6E;
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 180ms ease, background-color 180ms ease;
        }
        .mwp-close:hover { opacity: 1; background: rgba(47, 84, 67, 0.08); }
        .mwp-close:focus-visible {
          outline: 3px solid #D4AF37;
          outline-offset: 2px;
          opacity: 1;
        }
        .mwp-msg {
          margin: 0 1.85rem 0.85rem 0;
          font-size: 0.92rem;
          line-height: 1.45;
          color: #2F5443;
          font-weight: 500;
        }
        /* v5.8.9 — V20 rolling-with-resistance message styling */
        .mwp-msg--resistance {
          margin: 0.4rem 1.85rem 0.4rem 0;
          font-style: italic;
          color: #5C4A1A;
          animation: mwpFadeUp 280ms cubic-bezier(0.22, 0.9, 0.32, 1) both;
        }
        .mwp-options {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.45rem;
        }
        @media (min-width: 480px) {
          .mwp-options { grid-template-columns: repeat(3, 1fr); }
        }
        .mwp-opt {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.55rem 0.7rem;
          border-radius: 12px;
          background: rgba(143, 191, 159, 0.08);
          border: 1px solid rgba(143, 191, 159, 0.22);
          color: #2F5443;
          font-size: 0.85rem;
          font-weight: 600;
          text-decoration: none;
          transition: transform 180ms ease, background-color 180ms ease, border-color 180ms ease;
        }
        .mwp-opt:hover, .mwp-opt:focus-visible {
          transform: translateY(-1px);
          background: rgba(143, 191, 159, 0.14);
          border-color: var(--mwp-accent, rgba(143, 191, 159, 0.55));
        }
        .mwp-opt:focus-visible {
          outline: 3px solid #D4AF37;
          outline-offset: 2px;
        }
        .mwp-opt__icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1.6rem;
          height: 1.6rem;
          border-radius: 50%;
          background: var(--mwp-accent, #8FBF9F);
          color: white;
          flex-shrink: 0;
        }
        @keyframes mwpFadeUp {
          from { transform: translateY(8px); opacity: 0; }
          to   { transform: translateY(0);   opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mwp-card { animation: none !important; }
          /* v5.8.9 architect fix — kill the resistance message fade-up too */
          .mwp-msg--resistance { animation: none !important; }
          .mwp-opt, .mwp-close { transition: none !important; }
          .mwp-opt:hover, .mwp-opt:focus-visible { transform: none !important; }
        }
      `})]})}export{O as default};
