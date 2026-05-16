import{a as _}from"./rolldown-runtime-DVDPw_7t.js";import{h as w,m as y}from"./vendor-charts-ENHkH8XD.js";import{Bn as j,Pr as N,X as k,ai as A,ei as S,fn as F,it as C}from"./vendor-lucide-C8yKtP3N.js";var s=_(w(),1),e=y(),h="mmhb:email_subscribers",E=[{icon:j,title:"Trauma-informed support",body:"Gentle, consent-based prompts designed with mental wellness best practices — never clinical, never alarmist.",accent:"#A8C9A0"},{icon:k,title:"Daily reflection cues",body:"A small, kind nudge to pause, breathe, and notice. Your inbox stays calm — one short note a week, not a flood.",accent:"#E8913A"},{icon:C,title:"Privacy by default",body:"Your email is stored locally on this device until you confirm. No cross-site trackers, no data brokers, ever.",accent:"#74C0FC"},{icon:N,title:"Tools you can use today",body:"Free breathing, check-in, journaling, and celebration tools — no signup required to use them, ever.",accent:"#C8B6FF"}],z=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;function f(){if(typeof window>"u")return[];try{const t=window.localStorage.getItem(h);if(!t)return[];const o=JSON.parse(t);return Array.isArray(o)?o:[]}catch{return[]}}function Y(t){if(!(typeof window>"u"))try{window.localStorage.setItem(h,JSON.stringify(t))}catch{}}function T({variant:t="full",className:o=""}){const l=t==="full",[c,d]=(0,s.useState)(""),[i,n]=(0,s.useState)("idle"),[b,p]=(0,s.useState)(""),[v,u]=(0,s.useState)(!1);(0,s.useEffect)(()=>{f().length>0&&(u(!0),n("success"))},[]);const g=r=>{r.preventDefault();const a=c.trim().toLowerCase();if(!z.test(a)){p("Please enter a valid email address."),n("error");return}const m=f();m.includes(a)||m.push(a),Y(m),d(""),p(""),n("success"),u(!0)},x=()=>i==="success"?(0,e.jsxs)("div",{role:"status","aria-live":"polite",className:"vp-success","data-testid":"status-email-success",children:[(0,e.jsx)("span",{className:"vp-success__check","aria-hidden":"true",children:(0,e.jsx)(A,{className:"w-5 h-5"})}),(0,e.jsx)("span",{className:"vp-success__text",children:v&&!c?"You're already on the list. Welcome back.":"Thank you — you're on the list."})]}):(0,e.jsxs)("form",{className:"vp-form",onSubmit:g,noValidate:!0,"data-testid":"form-email-subscribe",children:[(0,e.jsxs)("label",{htmlFor:"vp-email-input",className:"vp-form__label",children:[(0,e.jsx)("span",{className:"vp-form__label-text",children:"Email address"}),(0,e.jsxs)("span",{className:"vp-form__input-wrap",children:[(0,e.jsx)(F,{className:"vp-form__input-icon","aria-hidden":"true"}),(0,e.jsx)("input",{id:"vp-email-input",type:"email",autoComplete:"email",required:!0,value:c,onChange:r=>{d(r.target.value),i==="error"&&n("idle")},placeholder:"you@example.com",className:"vp-form__input","aria-invalid":i==="error"||void 0,"aria-describedby":i==="error"?"vp-email-error":void 0,"data-testid":"input-email-subscribe"})]})]}),(0,e.jsx)("button",{type:"submit",className:"vp-form__submit","data-testid":"button-email-subscribe",children:"Stay Connected"}),i==="error"&&(0,e.jsxs)("p",{id:"vp-email-error",role:"alert",className:"vp-form__error","data-testid":"text-email-error",children:[(0,e.jsx)(S,{className:"w-4 h-4","aria-hidden":"true"}),(0,e.jsx)("span",{children:b})]})]});return(0,e.jsxs)("section",{className:`vp-section vp-section--${t} ${o}`.trim(),"data-testid":`section-value-proposition-${t}`,"aria-labelledby":"vp-heading",children:[(0,e.jsxs)("div",{className:"vp-inner",children:[(0,e.jsxs)("div",{className:"vp-header",children:[(0,e.jsx)("h2",{id:"vp-heading",className:"vp-heading",children:l?"Healing, in your inbox — gently.":"Stay close to your practice."}),(0,e.jsx)("p",{className:"vp-sub",children:l?"One short, trauma-informed note a week. No marketing fluff. Unsubscribe with one click, anytime.":"Get a soft weekly check-in by email. No spam — ever."})]}),l&&(0,e.jsx)("ul",{className:"vp-benefits",role:"list",children:E.map(r=>{const a=r.icon;return(0,e.jsxs)("li",{className:"vp-benefit","data-testid":`benefit-${r.title.toLowerCase().replace(/\s+/g,"-")}`,style:{"--vp-accent":r.accent},children:[(0,e.jsx)("span",{className:"vp-benefit__icon","aria-hidden":"true",style:{background:`color-mix(in srgb, ${r.accent} 14%, transparent)`,color:r.accent},children:(0,e.jsx)(a,{className:"w-5 h-5",strokeWidth:2})}),(0,e.jsx)("h3",{className:"vp-benefit__title",children:r.title}),(0,e.jsx)("p",{className:"vp-benefit__body",children:r.body})]},r.title)})}),(0,e.jsxs)("div",{className:"vp-form-wrap",children:[x(),(0,e.jsx)("p",{className:"vp-trust","data-testid":"text-trust-line",children:"No spam. Unsubscribe anytime."})]})]}),(0,e.jsx)("style",{children:`
        .vp-section {
          padding: clamp(3rem, 6vw, 5rem) 1.25rem;
          background: #F7F4EE;
          position: relative;
          overflow: hidden;
        }
        .vp-section--compact {
          padding: clamp(2rem, 5vw, 3.5rem) 1.25rem;
        }
        .vp-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: clamp(1.5rem, 3vw, 2.5rem);
        }
        .vp-header {
          text-align: center;
          max-width: 720px;
          margin: 0 auto;
        }
        .vp-heading {
          font-family: var(--font-serif, ui-serif, Georgia, serif);
          font-weight: 700;
          font-size: clamp(1.6rem, 3.6vw, 2.4rem);
          line-height: 1.2;
          color: var(--glp-sage-deep, #2F5443);
          margin: 0 0 0.6rem;
        }
        .vp-sub {
          font-size: clamp(0.95rem, 1.4vw, 1.05rem);
          color: var(--glp-ink, #3a3a36);
          line-height: 1.65;
          margin: 0;
        }
        .vp-benefits {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: clamp(0.85rem, 1.6vw, 1.2rem);
        }
        .vp-benefit {
          position: relative;
          background: #FFFFFF;
          border: 1px solid rgba(168, 201, 160, 0.30);
          border-radius: 18px;
          padding: 1.5rem 1.25rem;
          transition: transform 240ms ease, box-shadow 240ms ease, border-color 240ms ease;
          box-shadow: 0 1px 3px rgba(45, 55, 50, 0.04), 0 1px 2px rgba(45, 55, 50, 0.03);
          overflow: hidden;
        }
        .vp-benefit::before {
          content: "";
          position: absolute;
          inset: 0 0 auto 0;
          height: 2px;
          background: var(--vp-accent, #A8C9A0);
          opacity: 0.85;
        }
        .vp-benefit:hover, .vp-benefit:focus-within {
          transform: translateY(-2px);
          border-color: rgba(168, 201, 160, 0.55);
          box-shadow: 0 10px 24px rgba(45, 55, 50, 0.08), 0 2px 6px rgba(45, 55, 50, 0.04);
        }
        .vp-benefit__icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 2.75rem;
          height: 2.75rem;
          border-radius: 50%;
          margin-bottom: 0.85rem;
        }
        .vp-benefit__title {
          font-family: var(--font-serif, ui-serif, Georgia, serif);
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--glp-sage-deep, #2F5443);
          margin: 0 0 0.4rem;
        }
        .vp-benefit__body {
          font-size: 0.9rem;
          line-height: 1.6;
          color: var(--glp-ink, #3a3a36);
          margin: 0;
        }
        .vp-form-wrap {
          max-width: 560px;
          width: 100%;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
          align-items: center;
        }
        .vp-form {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 0.6rem;
          align-items: stretch;
        }
        .vp-form__label {
          display: contents;
        }
        .vp-form__label-text {
          position: absolute;
          width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden;
          clip: rect(0 0 0 0); white-space: nowrap; border: 0;
        }
        .vp-form__input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .vp-form__input-icon {
          position: absolute;
          left: 0.85rem;
          width: 1.05rem;
          height: 1.05rem;
          color: #A8C9A0;
          pointer-events: none;
        }
        .vp-form__input {
          width: 100%;
          padding: 0.85rem 1rem 0.85rem 2.6rem;
          font-size: 1rem;
          font-family: inherit;
          color: var(--glp-ink, #3a3a36);
          background: rgba(255, 255, 255, 0.95);
          border: 1.5px solid rgba(168, 201, 160, 0.4);
          border-radius: 12px;
          transition: border-color 200ms ease, box-shadow 200ms ease;
        }
        .vp-form__input::placeholder {
          color: rgba(58, 58, 54, 0.45);
        }
        .vp-form__input:focus {
          outline: none;
          border-color: #A8C9A0;
          box-shadow: 0 0 0 4px rgba(168, 201, 160, 0.18);
        }
        .vp-form__input[aria-invalid="true"] {
          border-color: #c1554b;
          box-shadow: 0 0 0 4px rgba(193, 85, 75, 0.15);
        }
        .vp-form__submit {
          padding: 0.85rem 1.4rem;
          font-size: 0.95rem;
          font-weight: 600;
          color: white;
          background: linear-gradient(135deg, #4A7E72 0%, #A8C9A0 100%);
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: transform 180ms ease, box-shadow 180ms ease, filter 180ms ease;
          box-shadow: 0 4px 14px rgba(74, 126, 114, 0.22);
          white-space: nowrap;
        }
        .vp-form__submit:hover { transform: translateY(-1px); filter: brightness(1.04); }
        .vp-form__submit:active { transform: translateY(0); }
        .vp-form__submit:focus-visible {
          outline: 3px solid #4A7E72;
          outline-offset: 2px;
        }
        .vp-form__error {
          grid-column: 1 / -1;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: #b74840;
          font-size: 0.85rem;
          line-height: 1.4;
        }
        .vp-success {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.7rem;
          padding: 0.95rem 1.1rem;
          background: rgba(168, 201, 160, 0.16);
          border: 1.5px solid rgba(168, 201, 160, 0.5);
          border-radius: 12px;
          color: var(--glp-sage-deep, #2F5443);
          font-size: 0.95rem;
          line-height: 1.45;
        }
        .vp-success__check {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1.9rem;
          height: 1.9rem;
          border-radius: 50%;
          background: #A8C9A0;
          color: white;
          flex-shrink: 0;
        }
        .vp-trust {
          font-size: 0.8rem;
          color: rgba(58, 58, 54, 0.6);
          margin: 0;
          text-align: center;
        }
        @media (max-width: 520px) {
          .vp-form { grid-template-columns: 1fr; }
        }
        @media (prefers-reduced-motion: reduce) {
          .vp-benefit, .vp-form__input, .vp-form__submit {
            transition: none !important;
          }
          .vp-benefit:hover, .vp-form__submit:hover {
            transform: none !important;
          }
        }
      `})]})}export{T as t};
