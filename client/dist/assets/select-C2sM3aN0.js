import{a as m}from"./rolldown-runtime-DVDPw_7t.js";import{h,m as b}from"./vendor-charts-ENHkH8XD.js";var u=m(h(),1),t=b(),w=({className:e})=>(0,t.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",className:e,children:(0,t.jsx)("path",{d:"m6 9 6 6 6-6"})}),k=({className:e})=>(0,t.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",className:e,children:(0,t.jsx)("path",{d:"M20 6 9 17l-5-5"})}),x=(0,u.createContext)(null);function v(){const e=(0,u.useContext)(x);if(!e)throw new Error("Select components must be used within a Select provider");return e}function C({value:e,defaultValue:s="",onValueChange:i,children:r,disabled:n=!1}){const[a,c]=(0,u.useState)(s),[l,o]=(0,u.useState)(!1),d=(0,u.useId)(),p=e!==void 0?e:a,g=f=>{e===void 0&&c(f),i?.(f),o(!1)};return(0,t.jsx)(x.Provider,{value:{value:p,onValueChange:g,open:l,setOpen:o,baseId:d},children:(0,t.jsx)("div",{className:"relative inline-block w-full","data-select-root":"",children:r})})}function S({children:e,className:s="","data-testid":i,placeholder:r}){const{open:n,setOpen:a,baseId:c,value:l}=v(),o=(0,u.useRef)(null),d=()=>{a(!n)},p=g=>{g.key==="Enter"||g.key===" "||g.key==="ArrowDown"?(g.preventDefault(),a(!0)):g.key==="Escape"&&a(!1)};return(0,t.jsxs)("button",{ref:o,type:"button",role:"combobox","aria-expanded":n,"aria-haspopup":"listbox","aria-controls":`${c}-content`,id:`${c}-trigger`,onClick:d,onKeyDown:p,"data-testid":i,"data-state":n?"open":"closed",className:`
        flex h-10 w-full items-center justify-between rounded-xl border-2 
        border-[var(--glp-border)] bg-[var(--glp-surface)] px-3 py-2 text-sm 
        text-[var(--glp-text)] placeholder:text-[var(--glp-text-tertiary)]
        focus:outline-none focus:ring-2 focus:ring-[var(--glp-gold)] focus:border-[var(--glp-sage)]
        disabled:cursor-not-allowed disabled:opacity-50
        dark:border-[var(--glp-teal-700)] dark:bg-[var(--glp-teal-900)] dark:text-[var(--glp-paper)]
        transition-all duration-200 cursor-pointer
        ${s}
      `.trim().replace(/\s+/g," "),children:[(0,t.jsx)("span",{className:"flex-1 text-left truncate",children:e}),(0,t.jsx)(w,{className:`h-4 w-4 opacity-50 transition-transform duration-200 ${n?"rotate-180":""}`})]})}function E({placeholder:e="Select..."}){const{value:s}=v();return(0,t.jsx)("span",{className:s?"":"text-[var(--glp-text-tertiary)]",children:s||e})}function I({children:e,className:s=""}){const{open:i,setOpen:r,baseId:n}=v(),a=(0,u.useRef)(null);return(0,u.useEffect)(()=>{const c=o=>{if(a.current&&!a.current.contains(o.target)){const d=document.getElementById(`${n}-trigger`);d&&!d.contains(o.target)&&r(!1)}},l=o=>{o.key==="Escape"&&r(!1)};return i&&(document.addEventListener("mousedown",c),document.addEventListener("keydown",l)),()=>{document.removeEventListener("mousedown",c),document.removeEventListener("keydown",l)}},[i,r,n]),i?(0,t.jsx)("div",{ref:a,role:"listbox",id:`${n}-content`,"aria-labelledby":`${n}-trigger`,className:`
        absolute z-50 mt-1 w-full min-w-[8rem] overflow-hidden rounded-xl 
        border-2 border-[var(--glp-border)] bg-[var(--glp-surface)] 
        shadow-lg animate-in fade-in-0 zoom-in-95 duration-200
        dark:border-[var(--glp-teal-700)] dark:bg-[var(--glp-teal-900)]
        max-h-60 overflow-y-auto
        ${s}
      `.trim().replace(/\s+/g," "),children:(0,t.jsx)("div",{className:"p-1",children:e})}):null}function $({value:e,children:s,className:i="",disabled:r=!1}){const{value:n,onValueChange:a,baseId:c}=v(),l=n===e,o=()=>{r||a(e)},d=p=>{(p.key==="Enter"||p.key===" ")&&(p.preventDefault(),r||a(e))};return(0,t.jsxs)("div",{role:"option","aria-selected":l,"aria-disabled":r,tabIndex:r?-1:0,onClick:o,onKeyDown:d,"data-value":e,"data-state":l?"checked":"unchecked",className:`
        relative flex w-full cursor-pointer select-none items-center rounded-lg 
        py-2 px-3 text-sm outline-none transition-colors duration-150
        hover:bg-[var(--glp-sage-100)] focus:bg-[var(--glp-sage-100)]
        dark:hover:bg-[var(--glp-teal-800)] dark:focus:bg-[var(--glp-teal-800)]
        ${l?"bg-[var(--glp-sage-100)] dark:bg-[var(--glp-teal-800)]":""}
        ${r?"pointer-events-none opacity-50":""}
        ${i}
      `.trim().replace(/\s+/g," "),children:[(0,t.jsx)("span",{className:"flex-1",children:s}),l&&(0,t.jsx)(k,{className:"h-4 w-4 text-[var(--glp-sage-deep)]"})]})}export{E as a,S as i,I as n,$ as r,C as t};
