import{a as b}from"./rolldown-runtime-DVDPw_7t.js";import{h as v,m as x}from"./vendor-charts-ENHkH8XD.js";import{n as y,o as k}from"./vendor-router-cp-whPRW.js";import{Bn as E,X as F,a as _,n as j}from"./vendor-lucide-C8yKtP3N.js";import{r as S}from"./nlpMiContent-Cq4h_H4A.js";var o=b(v(),1),t=x(),p="mmhb:microwin_shown",L=45e3,N="mmhb_token",T=2200;function A(r){if(typeof window>"u")return null;try{return window.sessionStorage.getItem(r)}catch{return null}}function C(r,s){if(!(typeof window>"u"))try{window.sessionStorage.setItem(r,s)}catch{}}function B(){if(typeof window>"u")return!1;try{return!!window.localStorage.getItem(N)}catch{return!1}}function Y(){const[r,s]=(0,o.useState)(!1),[c,u]=(0,o.useState)(!1),w=(0,o.useMemo)(()=>S(),[]),[m]=k(),l=(0,o.useRef)(null),a=(0,o.useRef)(null),d=()=>{c||(u(!0),a.current=window.setTimeout(()=>s(!1),T))};(0,o.useEffect)(()=>()=>{a.current&&window.clearTimeout(a.current)},[]),(0,o.useEffect)(()=>{if(!r)return;const i=window.setTimeout(()=>{try{l.current?.focus()}catch{}},50);return()=>window.clearTimeout(i)},[r]),(0,o.useEffect)(()=>{if(typeof window>"u"||A(p)==="true")return;let i=null;const e=()=>{i&&window.clearTimeout(i),i=window.setTimeout(()=>{s(!0),C(p,"true")},L)};e();const n={passive:!0};return window.addEventListener("click",e,n),window.addEventListener("scroll",e,n),window.addEventListener("keydown",e,n),window.addEventListener("touchstart",e,n),()=>{i&&window.clearTimeout(i),window.removeEventListener("click",e,n),window.removeEventListener("scroll",e,n),window.removeEventListener("keydown",e,n),window.removeEventListener("touchstart",e,n)}},[]),(0,o.useEffect)(()=>{if(!r)return;const i=e=>{e.key==="Escape"&&d()};return window.addEventListener("keydown",i),()=>window.removeEventListener("keydown",i)},[r]);const f=m==="/crisis"||m.startsWith("/crisis/");if(!r||f)return null;const h=B()?"/chat":"/login";return(0,t.jsxs)("div",{className:"mwp-shell",role:"dialog","aria-modal":"false","aria-label":"A gentle moment of calm","data-testid":"prompt-micro-win",children:[(0,t.jsxs)("div",{className:"mwp-card",children:[(0,t.jsx)("button",{type:"button",ref:l,onClick:d,className:"mwp-close","aria-label":"Dismiss this gentle prompt","data-testid":"button-micro-win-dismiss",children:(0,t.jsx)(j,{className:"w-4 h-4","aria-hidden":"true"})}),c?(0,t.jsx)("p",{className:"mwp-msg mwp-msg--resistance",role:"status","aria-live":"polite","data-testid":"text-micro-win-resistance",children:w}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("p",{className:"mwp-msg",children:"You don't have to figure everything out right now. Would you like a moment of calm?"}),(0,t.jsx)("div",{className:"mwp-options",children:[{label:"Take one calm breath",href:"/tools/breathing",Icon:_,accent:"#74C0FC"},{label:"Name how you feel",href:"/checkin",Icon:E,accent:"#FFB88C"},{label:"Meet your companion",href:h,Icon:F,accent:"#C8B6FF"}].map(({label:i,href:e,Icon:n,accent:g})=>(0,t.jsxs)(y,{href:e,className:"mwp-opt","data-testid":`link-micro-win-${e.replace(/\//g,"-").slice(1)||"home"}`,onClick:()=>s(!1),style:{"--mwp-accent":g},children:[(0,t.jsx)("span",{className:"mwp-opt__icon","aria-hidden":"true",children:(0,t.jsx)(n,{className:"w-4 h-4"})}),(0,t.jsx)("span",{children:i})]},e))})]})]}),(0,t.jsx)("style",{children:`
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
      `})]})}export{Y as default};
