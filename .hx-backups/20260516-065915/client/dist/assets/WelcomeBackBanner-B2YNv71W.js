import{a as m}from"./rolldown-runtime-DVDPw_7t.js";import{h as u,m as w}from"./vendor-charts-ENHkH8XD.js";import{n as f,o as p}from"./vendor-router-cp-whPRW.js";import{Bn as h,ji as g,n as x}from"./vendor-lucide-C8yKtP3N.js";var t=m(u(),1),e=w(),a="mmhb:returning_visitor",o="mmhb:welcome_dismissed",k="mmhb_token",_="mmhb_visit_count";function s(r){if(typeof window>"u")return null;try{return window.sessionStorage.getItem(r)}catch{return null}}function l(r,i){if(!(typeof window>"u"))try{window.sessionStorage.setItem(r,i)}catch{}}function y(){if(typeof window>"u")return!1;try{return!!window.localStorage.getItem(k)}catch{return!1}}function N(){const[r,i]=(0,t.useState)(!1),[n]=p();(0,t.useEffect)(()=>{if(!(typeof window>"u")&&s(o)!=="true"){try{if((parseInt(window.localStorage.getItem(_)||"0",10)||0)>=2)return}catch{}if(!s(a)){l(a,"true");return}i(!0)}},[]);const c=n==="/crisis"||n.startsWith("/crisis/");if(!r||c)return null;const b=y()?"/chat":"/login",d=()=>{l(o,"true"),i(!1)};return(0,e.jsxs)("div",{className:"wbb-bar",role:"status","aria-live":"polite","data-testid":"banner-welcome-back",children:[(0,e.jsxs)("div",{className:"wbb-inner",children:[(0,e.jsx)("span",{className:"wbb-icon","aria-hidden":"true",children:(0,e.jsx)(h,{className:"w-3.5 h-3.5"})}),(0,e.jsxs)("p",{className:"wbb-msg",children:[(0,e.jsx)("span",{children:"Welcome back. Lumi missed you. "}),(0,e.jsxs)(f,{href:b,className:"wbb-link","data-testid":"link-welcome-back-continue",children:[(0,e.jsx)("span",{children:"Continue your journey"}),(0,e.jsx)(g,{className:"w-3.5 h-3.5 wbb-link__arrow","aria-hidden":"true"})]})]}),(0,e.jsx)("button",{type:"button",onClick:d,className:"wbb-close","aria-label":"Dismiss welcome back banner","data-testid":"button-welcome-back-dismiss",children:(0,e.jsx)(x,{className:"w-4 h-4","aria-hidden":"true"})})]}),(0,e.jsx)("style",{children:`
        .wbb-bar {
          position: relative;
          width: 100%;
          background: linear-gradient(90deg, rgba(168, 201, 160, 0.18), rgba(168, 201, 160, 0.10));
          border-bottom: 1px solid rgba(143, 191, 159, 0.32);
          z-index: 35;
          animation: wbbSlideDown 380ms cubic-bezier(0.22, 0.9, 0.32, 1) both;
        }
        .wbb-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0.55rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .wbb-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1.6rem;
          height: 1.6rem;
          border-radius: 50%;
          background: var(--glp-sage, #8FBF9F);
          color: white;
          flex-shrink: 0;
        }
        .wbb-msg {
          flex: 1;
          margin: 0;
          font-size: 0.9rem;
          line-height: 1.4;
          color: var(--glp-sage-deep, #2F5443);
        }
        .wbb-link {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          color: var(--glp-sage-deep, #2F5443);
          font-weight: 600;
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-thickness: 1.5px;
        }
        .wbb-link:hover .wbb-link__arrow { transform: translateX(2px); }
        .wbb-link__arrow { transition: transform 200ms ease; }
        .wbb-link:focus-visible {
          outline: 3px solid var(--glp-gold, #D4AF37);
          outline-offset: 3px;
          border-radius: 4px;
        }
        .wbb-close {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1.85rem;
          height: 1.85rem;
          border-radius: 8px;
          background: transparent;
          border: none;
          color: var(--glp-sage-deep, #2F5443);
          cursor: pointer;
          opacity: 0.65;
          transition: opacity 180ms ease, background-color 180ms ease;
          flex-shrink: 0;
        }
        .wbb-close:hover {
          opacity: 1;
          background: rgba(47, 84, 67, 0.08);
        }
        .wbb-close:focus-visible {
          outline: 3px solid var(--glp-gold, #D4AF37);
          outline-offset: 2px;
          opacity: 1;
        }
        @keyframes wbbSlideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .wbb-bar { animation: none !important; }
          .wbb-link__arrow, .wbb-close { transition: none !important; }
          .wbb-link:hover .wbb-link__arrow { transform: none !important; }
        }
      `})]})}export{N as default};
