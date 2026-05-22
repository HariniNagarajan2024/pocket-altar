import{h as o,r as a,S as y,o as s,p as M}from"./index-CXq8bVKM.js";/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=[["path",{d:"M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v1M9 8a3 3 0 1 0 3 3M9 8h1m5 0a3 3 0 1 1-3 3m3-3h-1m-2 3v-1",key:"3pnvol"}],["circle",{cx:"12",cy:"8",r:"2",key:"1822b1"}],["path",{d:"M12 10v12",key:"6ubwww"}],["path",{d:"M12 22c4.2 0 7-1.667 7-5-4.2 0-7 1.667-7 5Z",key:"9hd38g"}],["path",{d:"M12 22c-4.2 0-7-1.667-7-5 4.2 0 7 1.667 7 5Z",key:"ufn41s"}]],f=o("flower-2",p);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=[["path",{d:"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",key:"c3ymky"}]],_=o("heart",w);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]],x=o("moon",k);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",key:"r04s7s"}]],v=o("star",b),g={sparkles:y,stars:v,moons:x,hearts:_,flowers:f};function F({type:r="sparkles",count:t=12,color:d="#d4b5e8"}){const[i,c]=a.useState(!1),l=typeof window<"u"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches,m=typeof window<"u"&&window.innerWidth<768?Math.floor(t*.6):t,n=Math.min(m,l?0:t),h=a.useMemo(()=>{const e=g[r];return Array.from({length:n},(I,u)=>({id:u,x:Math.random()*100,y:Math.random()*100,delay:Math.random()*5,duration:8+Math.random()*6,Icon:e,rotation:Math.random()*360,scale:.5+Math.random()*.8}))},[n,r]);return a.useEffect(()=>{const e=requestAnimationFrame(()=>c(!0));return()=>cancelAnimationFrame(e)},[]),!i||n===0?null:s.jsx("div",{className:"fixed inset-0 pointer-events-none overflow-hidden z-0","aria-hidden":!0,children:h.map(e=>s.jsx(M.div,{className:"absolute",style:{left:`${e.x}%`,top:`${e.y}%`},animate:{y:[0,-24,0],opacity:[0,.55,0]},transition:{duration:e.duration,delay:e.delay,repeat:1/0,ease:"easeInOut"},children:s.jsx(e.Icon,{size:14*e.scale,style:{color:d},className:"drop-shadow-lg"})},e.id))})}const N=a.memo(F),$=Object.freeze(Object.defineProperty({__proto__:null,FloatingParticles:N},Symbol.toStringTag,{value:"Module"}));export{N as F,_ as H,x as M,$ as a};
