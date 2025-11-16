import{a9 as m,j as o,a as f}from"./vendor-DGy-tjT1.js";const i={motion:{duration:{instant:"0ms",fast:"150ms",base:"300ms",slow:"500ms",slower:"700ms",breath:"4000ms"}}};function l(t){return parseInt(t.replace("ms",""),10)}l(i.motion.duration.instant),l(i.motion.duration.fast),l(i.motion.duration.base),l(i.motion.duration.slow),l(i.motion.duration.slower),l(i.motion.duration.breath);function u(){if(typeof window>"u")return!1;const[t,e]=m.useState(()=>window.matchMedia("(prefers-reduced-motion: reduce)").matches);return m.useEffect(()=>{const a=window.matchMedia("(prefers-reduced-motion: reduce)"),s=n=>e(n.matches);return a.addEventListener("change",s),()=>a.removeEventListener("change",s)},[]),t}function h(t){let e=t;return function(){e=e+1831565813|0;let a=Math.imul(e^e>>>15,1|e);return a=a+Math.imul(a^a>>>7,61|a)^a,((a^a>>>14)>>>0)/4294967296}}function p(t){let e=0;for(let a=0;a<t.length;a++){const s=t.charCodeAt(a);e=(e<<5)-e+s,e=e&e}return Math.abs(e)}function g({scene:t="default",intensity:e="moderate",showParticles:a=!0,className:s=""}){const n=u(),d={serenity:{from:"hsl(205, 100%, 97%)",via:"hsl(199, 89%, 95%)",to:"hsl(142, 69%, 96%)",accent:"hsla(199, 89%, 48%, 0.1)"},empowerment:{from:"hsl(24, 100%, 97%)",via:"hsl(16, 90%, 95%)",to:"hsl(45, 93%, 95%)",accent:"hsla(16, 90%, 58%, 0.1)"},focus:{from:"hsl(210, 20%, 98%)",via:"hsl(220, 14%, 96%)",to:"hsl(216, 12%, 94%)",accent:"hsla(215, 14%, 34%, 0.05)"},recovery:{from:"hsl(270, 100%, 98%)",via:"hsl(271, 81%, 95%)",to:"hsl(199, 89%, 97%)",accent:"hsla(271, 81%, 56%, 0.1)"},default:{from:"hsl(210, 20%, 98%)",via:"hsl(205, 100%, 97%)",to:"hsl(220, 14%, 96%)",accent:"hsla(199, 89%, 48%, 0.08)"}}[t],c=n?{}:{animation:"breathe 8s ease-in-out infinite"};return o.jsxs("div",{className:`fixed inset-0 -z-10 overflow-hidden ${s}`,"aria-hidden":"true",children:[o.jsx("div",{className:"absolute inset-0 transition-opacity duration-1000",style:{background:`linear-gradient(135deg, ${d.from} 0%, ${d.via} 50%, ${d.to} 100%)`}}),!n&&o.jsx("div",{className:"absolute inset-0 opacity-70",style:{...c,background:`radial-gradient(ellipse at top, ${d.accent} 0%, transparent 60%)`}}),a&&!n&&o.jsx(y,{scene:t,intensity:e}),o.jsx("div",{className:"absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none",style:{backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`}})]})}if(typeof document<"u"){const t="atmospheric-animations";if(!document.getElementById(t)){const e=document.createElement("style");e.id=t,e.innerHTML=`
      @keyframes breathe {
        0%, 100% { opacity: 0.7; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.02); }
      }
      @keyframes float {
        0%, 100% { transform: translate(0, 0) scale(1); }
        25% { transform: translate(10px, -20px) scale(1.1); }
        50% { transform: translate(-10px, -40px) scale(0.9); }
        75% { transform: translate(15px, -60px) scale(1.05); }
      }
      @keyframes wave {
        0%, 100% { transform: translateX(0) scaleX(1); }
        50% { transform: translateX(-5%) scaleX(1.05); }
      }
    `,document.head.appendChild(e)}}function y({scene:t,intensity:e}){const a={subtle:8,moderate:15,immersive:25}[e]||15,s=f.useMemo(()=>{const n=p(`${t}-${e}-particles`),r=h(n);return Array.from({length:a},(d,c)=>({id:c,size:r()*4+2,x:r()*100,y:r()*100,duration:r()*20+15,delay:r()*-20,opacity:r()*.3+.1}))},[t,e,a]);return o.jsx("div",{className:"absolute inset-0 overflow-hidden pointer-events-none",children:s.map(n=>o.jsx("div",{className:"absolute rounded-full bg-gradient-to-br from-white/40 to-white/10 blur-sm",style:{width:`${n.size}px`,height:`${n.size}px`,left:`${n.x}%`,top:`${n.y}%`,opacity:n.opacity,animation:`float ${n.duration}s ease-in-out infinite`,animationDelay:`${n.delay}s`}},n.id))})}function w({position:t="top",scene:e="serenity",className:a=""}){const s=u(),n={serenity:"hsla(199, 89%, 48%, 0.08)",empowerment:"hsla(16, 90%, 58%, 0.08)",focus:"hsla(215, 14%, 34%, 0.05)",recovery:"hsla(271, 81%, 56%, 0.08)"},r=s?{}:{animation:"wave 12s ease-in-out infinite"};return o.jsx("div",{className:`absolute ${t==="top"?"top-0":"bottom-0"} left-0 right-0 h-32 overflow-hidden pointer-events-none ${a}`,"aria-hidden":"true",children:o.jsx("svg",{className:"absolute w-full h-full",viewBox:"0 0 1440 320",preserveAspectRatio:"none",style:{...r,transform:t==="bottom"?"scaleY(-1)":"none"},children:o.jsx("path",{fill:n[e],d:"M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"})})})}if(typeof document<"u"){const t="glow-animations";if(!document.getElementById(t)){const e=document.createElement("style");e.id=t,e.innerHTML=`
      @keyframes glow-pulse {
        0%, 100% { filter: brightness(1); }
        50% { filter: brightness(1.15); }
      }
      @keyframes ambient-float {
        0%, 100% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 0.6;
        }
        50% {
          transform: translate(-50%, -45%) scale(1.1);
          opacity: 1;
        }
      }
    `,document.head.appendChild(e)}}export{g as A,w as D};
