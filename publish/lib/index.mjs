var a=(t,e)=>()=>(t&&(e=t(t=0)),e);var h=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports);function k(t){for(let e in t)if(typeof t[e]!="function")throw new Error("actions \u91CC\u53EA\u80FD\u653E\u51FD\u6570")}function E(t){if(t===null||typeof t!="object")throw new Error("state \u5FC5\u987B\u662F\u5BF9\u8C61")}function m(t){let{state:e={},actions:n={}}=t;E(e),k(n)}var R=a(()=>{"use strict"});function x(t,e=!1){function n(s,o){if(e){let i=t.state[s];o(s,i)}let r=t.trackStore,c=r[s];c||(c=r[s]=new Set),c.add(o)}return(s,o)=>{if(Array.isArray(s))for(let r of s)n(r,o);else n(s,o)}}function p({trackStore:t}){function e(n,s){let o=t[n];!o||o.delete(s)}return(n,s)=>{if(Array.isArray(n))for(let o of n)e(o,s);else e(n,s)}}function O(t,e){let{trackStore:n}=t,s=t.state[e],o=n[e];if(!!o)for(let r of o)r(e,s)}var y=a(()=>{"use strict"});function g(t){let{state:e,actions:n,storeApi:s}=t;return new Proxy(t,{get(o,r){return r in s?s[r]:r in e?e[r]:r in n?n[r]:void 0},set(o,r,c){if(r in s)throw new Error(`${r} \u662F Store \u81EA\u5E26\u7684\u4E0D\u5141\u8BB8\u88AB\u4FEE\u6539`);if(r in e)return e[r]=c,!0;throw r in n?new Error(`${r} \u662F actions , \u4E0D\u5141\u8BB8\u5728\u6B64\u88AB\u4FEE\u6539`):new Error(`${r} \u4E0D\u5141\u8BB8\u88AB\u4FEE\u6539\u6216\u6DFB\u52A0`)}})}function f(t,e,n=null){let{isDeepWatch:s}=t.options;return new Proxy(e,{set(o,r,c){if(o[r]===c)return!0;if(s){if(u)return o[r]=c,!0;typeof c=="object"&&c!==null?(I=n!=null?n:r,o[r]=l(t,c),I=null):o[r]=c}else o[r]=c;return O(t,n!=null?n:r),!0}})}function l(t,e,n=!1){let s=Array.isArray(e)?[]:{};function o(r,c,i=!1){for(let S in r){let A=r[S];if(i&&(I=S),typeof A=="object"&&A!==null){let P=Array.isArray(A)?[]:{};o(A,P),c[S]=f(t,P,I)}else c[S]=A;i&&(I=null)}}return u=!0,o(e,s,n),u=!1,f(t,s,n?null:I)}var u,I,d=a(()=>{"use strict";y();u=!1,I=null});function v(t,e){let{isDeepWatch:n}=t.options,s=n?l(t,e,!0):f(t,e);t.state=s}function D(t){let e={watch:x(t),watchEffect:x(t,!0),deleteWatch:p(t)};t.storeApi=e}function j(t,e={}){let{state:n={},actions:s={}}=t,o={id:F++,trackStore:{},storeApi:{},state:{},actions:s,options:e};return D(o),v(o,n),o}var F,w=a(()=>{"use strict";y();d();F=0});var $=h((N,b)=>{R();w();d();function W(t,e){m(t);let n=j(t,e);return g(n)}b.exports=W});export default $();
