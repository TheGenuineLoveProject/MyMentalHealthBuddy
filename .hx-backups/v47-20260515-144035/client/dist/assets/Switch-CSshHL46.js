import{a as c}from"./rolldown-runtime-DVDPw_7t.js";import{h as m,m as v}from"./vendor-charts-ENHkH8XD.js";var y=c(m(),1),i=v(),h=y.forwardRef(({checked:r=!1,onCheckedChange:e,disabled:t=!1,className:n="",id:o,name:l,"data-testid":s,"aria-label":u,"aria-labelledby":b,...d},f)=>{const g=a=>{a.preventDefault(),a.stopPropagation(),!t&&e&&e(!r)},p=a=>{t||(a.key==="Enter"||a.key===" ")&&(a.preventDefault(),e?.(!r))};return(0,i.jsx)("button",{type:"button",role:"switch","aria-checked":r,"aria-label":u,"aria-labelledby":b,disabled:t,ref:f,id:o,name:l,"data-testid":s,"data-state":r?"checked":"unchecked",onClick:g,onKeyDown:p,className:`
          relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full
          border-2 border-transparent transition-all duration-200 ease-in-out
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2
          disabled:cursor-not-allowed disabled:opacity-50
          ${r?"bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600":"bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"}
          ${n}
        `.trim().replace(/\s+/g," "),...d,children:(0,i.jsx)("span",{"aria-hidden":"true",className:`
            pointer-events-none inline-block h-5 w-5 transform rounded-full
            bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out
            ${r?"translate-x-5":"translate-x-0"}
          `.trim().replace(/\s+/g," ")})})});h.displayName="Switch";export{h as t};
