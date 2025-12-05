import{r as s}from"./vendor-react-BVcW2APL.js";var _={exports:{}},n={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var a=s,v=Symbol.for("react.element"),m=Symbol.for("react.fragment"),x=Object.prototype.hasOwnProperty,l=a.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,y={key:!0,ref:!0,__self:!0,__source:!0};function i(e,r,f){var t,o={},u=null,p=null;f!==void 0&&(u=""+f),r.key!==void 0&&(u=""+r.key),r.ref!==void 0&&(p=r.ref);for(t in r)x.call(r,t)&&!y.hasOwnProperty(t)&&(o[t]=r[t]);if(e&&e.defaultProps)for(t in r=e.defaultProps,r)o[t]===void 0&&(o[t]=r[t]);return{$$typeof:v,type:e,key:u,ref:p,props:o,_owner:l.current}}n.Fragment=m;n.jsx=i;n.jsxs=i;_.exports=n;var d=_.exports,E=s.createContext(void 0),R=({client:e,children:r})=>(s.useEffect(()=>(e.mount(),()=>{e.unmount()}),[e]),d.jsx(E.Provider,{value:e,children:r}));export{R as Q,d as j};
