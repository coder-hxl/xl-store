var w=0,l=!1,i=null;function x(t){for(let r in t)if(typeof t[r]!="function")throw new Error("actions \u91CC\u53EA\u80FD\u653E\u51FD\u6570")}function k(t){if(t===null||typeof t!="object")throw new Error("state \u5FC5\u987B\u662F\u5BF9\u8C61")}function d(t){return(r,n)=>{let c=t[r];c||(c=t[r]=new Set),c.add(n)}}function b(t){return(r,n)=>{let c=t[r];!c||c.delete(n)}}function A(t,r){let{trackStore:n}=t,c=t.state[r],o=n[r];if(!!o)for(let e of o)e(c)}function h(t,r){let{state:n,actions:c}=t;return new Proxy(t,{get(o,e){if(e in r)return r[e];if(e in n)return n[e];if(e in c)return c[e];throw new Error(`\u6CA1\u6709\u627E\u5230 ${e}`)},set(o,e,a){if(e in r)throw new Error(`${e} \u662F Store \u81EA\u5E26\u7684\u65B9\u6CD5\u4E0D\u5141\u8BB8\u88AB\u4FEE\u6539`);if(e in n)return n[e]=a,!0;throw e in c?new Error(`${e} \u662F actions \u7684\u65B9\u6CD5, \u4E0D\u5141\u8BB8\u88AB\u4FEE\u6539`):new Error(`${e} \u8BF7\u5728\u521B\u5EFA Store \u65F6\u6DFB\u52A0\u5230 State \u6216 Actions \u4E2D`)}})}function I(t,r,n=null){return new Proxy(r,{set(c,o,e){return c[o]===e?!1:l?(c[o]=e,!0):(typeof e=="object"&&e!==null?(i=n||o,c[o]=y(t,e),i=null):c[o]=e,n?A(t,n):A(t,o),!0)}})}function y(t,r,n=!1){let c={};Array.isArray(r)&&(c=[]),l=!0;function o(e,a,S=!1){for(let f in e){let s=e[f];if(S&&(i=f),typeof s=="object"&&s!==null){let u={};Array.isArray(s)&&(u=[]),o(s,u),a[f]=I(t,u,i)}else a[f]=s;S&&(i=null)}}return o(r,c,n),l=!1,n?I(t,c):I(t,c,i)}function j(t,r){let n={id:w++,trackStore:{},state:{},actions:r};return n.state=y(n,t,!0),n}function P(t){let{trackStore:r}=t;return{watch:d(r),deleteWatch:b(r)}}function g(t){let r=t.state??{},n=t.actions??{};k(r),x(n);let c=j(r,n),o=P(c);return h(c,o)}export{g as default};
