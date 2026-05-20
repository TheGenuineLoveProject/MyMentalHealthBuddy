import{a as k}from"./rolldown-runtime-DVDPw_7t.js";import{h as S,m as I}from"./vendor-charts-ENHkH8XD.js";import{n as E,o as N}from"./vendor-router-cp-whPRW.js";import{Bn as j,ji as T,n as F}from"./vendor-lucide-C8yKtP3N.js";import{a as A,i as D}from"./lumi-memory-DyWCHSoG.js";var i=k(S(),1),t=I(),a="mmhb_visit_count",h="mmhb:visit_counted_this_session",g="mmhb:returnloop_dismissed",M="mmhb_token",l=[{text:"Welcome back. How has your heart been feeling today?",accent:"sage"},{text:"I'm glad you came back today.",accent:"gold"},{text:"Let's take this one moment at a time.",accent:"lavender"},{text:"Lumi missed you. Ready to check in?",accent:"mint"},{text:"However you're feeling right now — it's okay. We're here.",accent:"rose"},{text:"You have a wisdom inside you that knows exactly what you need.",accent:"lavender"},{text:"The fact that you're here tells me you haven't given up on yourself.",accent:"sage"},{text:"You've survived every hard day so far. That is not small.",accent:"gold"},{text:"Your willingness to feel — that IS courage.",accent:"rose"},{text:"You don't have to be perfect to be worthy of care.",accent:"mint"}],Y=[0,2,3],C=[1,5,9],B=[4,6,7,8],L=1440*60*1e3;function s(e){return l[e[Math.floor(Math.random()*e.length)]]}function O(e){return e<1?s(Y):e<7?s(C):s(B)}var H={sage:{bg:"rgba(168, 201, 160, 0.18)",border:"rgba(143, 191, 159, 0.36)",icon:"#8FBF9F",text:"#2F5443"},gold:{bg:"rgba(255, 217,  61, 0.16)",border:"rgba(212, 175,  55, 0.34)",icon:"#D4AF37",text:"#5C4A1A"},lavender:{bg:"rgba(200, 182, 255, 0.18)",border:"rgba(200, 182, 255, 0.42)",icon:"#9B86E0",text:"#3F2F66"},mint:{bg:"rgba(168, 213, 186, 0.20)",border:"rgba(168, 213, 186, 0.44)",icon:"#7FB89A",text:"#2F5443"},rose:{bg:"rgba(255, 154, 139, 0.16)",border:"rgba(247, 183, 163, 0.42)",icon:"#E89685",text:"#5C2F2A"}};function p(e){if(typeof window>"u")return null;try{return window.sessionStorage.getItem(e)}catch{return null}}function b(e,n){if(!(typeof window>"u"))try{window.sessionStorage.setItem(e,n)}catch{}}function c(e){if(typeof window>"u")return null;try{return window.localStorage.getItem(e)}catch{return null}}function R(e,n){if(!(typeof window>"u"))try{window.localStorage.setItem(e,n)}catch{}}function K(){return!!c(M)}function G(){const[e,n]=(0,i.useState)(!1),[d]=N(),[u,x]=(0,i.useState)(()=>l[Math.floor(Math.random()*l.length)]);(0,i.useEffect)(()=>{if(typeof window>"u"||p(g)==="true")return;if(p(h)!=="true"){const o=parseInt(c(a)||"0",10)||0;R(a,String(o+1)),b(h,"true")}if((parseInt(c(a)||"0",10)||0)<2)return;try{const o=D().lastSessionAt;if(o){const m=Date.parse(o);if(!Number.isNaN(m)){const f=Math.floor((Date.now()-m)/L);f>=0&&x(O(f))}}A("lastSessionAt",new Date().toISOString())}catch{}const v=window.setTimeout(()=>n(!0),800);return()=>window.clearTimeout(v)},[]);const w=d==="/crisis"||d.startsWith("/crisis/");if(!e||w)return null;const y=K()?"/chat":"/login",r=H[u.accent],_=()=>{b(g,"true"),n(!1)};return(0,t.jsxs)("div",{className:"rl-bar",role:"status","aria-live":"polite","data-testid":"banner-return-loop",style:{background:`linear-gradient(${r.bg}, ${r.bg}), #FBF8F1`,borderBottom:`1px solid ${r.border}`,color:r.text,boxShadow:"0 2px 12px rgba(20, 38, 38, 0.08)"},children:[(0,t.jsxs)("div",{className:"rl-inner",children:[(0,t.jsx)("span",{className:"rl-icon","aria-hidden":"true",style:{background:r.icon},children:(0,t.jsx)(j,{className:"w-3.5 h-3.5"})}),(0,t.jsxs)("p",{className:"rl-msg",children:[(0,t.jsxs)("span",{children:[u.text," "]}),(0,t.jsxs)(E,{href:y,className:"rl-link","data-testid":"link-return-loop-continue",style:{color:r.text},children:[(0,t.jsx)("span",{children:"Continue your journey"}),(0,t.jsx)(T,{className:"w-3.5 h-3.5 rl-link__arrow","aria-hidden":"true"})]})]}),(0,t.jsx)("button",{type:"button",onClick:_,className:"rl-close","aria-label":"Dismiss welcome back banner","data-testid":"button-return-loop-dismiss",style:{color:r.text},children:(0,t.jsx)(F,{className:"w-4 h-4","aria-hidden":"true"})})]}),(0,t.jsx)("style",{children:`
        .rl-bar {
          position: sticky;
          top: 0;
          width: 100%;
          z-index: 50;
          animation: rlSlideDown 380ms cubic-bezier(0.22, 0.9, 0.32, 1) both;
        }
        .rl-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0.55rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .rl-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1.6rem;
          height: 1.6rem;
          border-radius: 50%;
          color: white;
          flex-shrink: 0;
        }
        .rl-msg {
          flex: 1;
          margin: 0;
          font-size: 0.9rem;
          line-height: 1.4;
        }
        .rl-link {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-weight: 600;
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-thickness: 1.5px;
        }
        .rl-link:hover .rl-link__arrow { transform: translateX(2px); }
        .rl-link__arrow { transition: transform 200ms ease; }
        .rl-link:focus-visible {
          outline: 3px solid #D4AF37;
          outline-offset: 3px;
          border-radius: 4px;
        }
        .rl-close {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1.85rem;
          height: 1.85rem;
          border-radius: 8px;
          background: transparent;
          border: none;
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 180ms ease, background-color 180ms ease;
          flex-shrink: 0;
        }
        .rl-close:hover {
          opacity: 1;
          background: rgba(0, 0, 0, 0.06);
        }
        .rl-close:focus-visible {
          outline: 3px solid #D4AF37;
          outline-offset: 2px;
          opacity: 1;
        }
        @keyframes rlSlideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .rl-bar { animation: none !important; }
          .rl-link__arrow, .rl-close { transition: none !important; }
          .rl-link:hover .rl-link__arrow { transform: none !important; }
        }
      `})]})}export{G as default};
