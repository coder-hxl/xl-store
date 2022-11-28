!function(){"use strict";function t(t){const{state:n={},actions:o={}}=t;!function(t){if(null===t||"object"!=typeof t)throw new Error("state 必须是对象")}(n),function(t){for(const n in t)if("function"!=typeof t[n])throw new Error("actions 里只能放函数")}(o)}function n(t,n=!1){function o(o,e){if(n){e(o,t.state[o])}const r=t.trackStore;let c=r[o];c||(c=r[o]=new Set),c.add(e)}return(t,n)=>{if(Array.isArray(t))for(const e of t)o(e,n);else o(t,n)}}function o({trackStore:t}){function n(n,o){const e=t[n];e&&e.delete(o)}return(t,o)=>{if(Array.isArray(t))for(const e of t)n(e,o);else n(t,o)}}let e=!1,r=null;function c(t,n,o=null){const{isDeepWatch:c}=t.options;return new Proxy(n,{set(n,s,f){if(n[s]===f)return!0;if(c){if(e)return n[s]=f,!0;"object"==typeof f&&null!==f?(r=o??s,n[s]=i(t,f),r=null):n[s]=f}else n[s]=f;return function(t,n){const{trackStore:o}=t,e=t.state[n],r=o[n];if(r)for(const t of r)t(n,e)}(t,o??s),!0}})}function i(t,n,o=!1){const i=Array.isArray(n)?[]:{};return e=!0,function n(o,e,i=!1){for(const s in o){const f=o[s];if(i&&(r=s),"object"==typeof f&&null!==f){const o=Array.isArray(f)?[]:{};n(f,o),e[s]=c(t,o,r)}else e[s]=f;i&&(r=null)}}(n,i,o),e=!1,c(t,i,o?null:r)}let s=0;function f(t,e={}){const{state:r={},actions:f={}}=t,u={id:s++,trackStore:{},storeApi:{},state:{},actions:f,options:e};return function(t){const e={watch:n(t),watchEffect:n(t,!0),deleteWatch:o(t)};t.storeApi=e}(u),function(t,n){const{isDeepWatch:o}=t.options,e=o?i(t,n,!0):c(t,n);t.state=e}(u,r),u}const u=function(n,o){t(n);const e=function(t){const{state:n,actions:o,storeApi:e}=t;return new Proxy(t,{get:(t,r)=>r in e?e[r]:r in n?n[r]:r in o?o[r]:void 0,set(t,r,c){if(r in e)throw new Error(`${r} 是 Store 自带的不允许被修改`);if(r in n)return n[r]=c,!0;throw r in o?new Error(`${r} 是 actions , 不允许在此被修改`):new Error(`${r} 不允许被修改或添加`)}})}(f(n,o));return e}({state:{count:0,userInfo:{name:"hxl",age:18}},actions:{incrementAction(){this.count+=1},changeUserInfoAction(t){this.userInfo.name=t.name}}},{isDeepWatch:!0});u.watchEffect("count",(function(t,n){console.log("getCount",t,n)})),u.watchEffect("userInfo",(function(t,n){console.log("getUserInfo",t,n)})),console.log("------------------------------"),u.incrementAction(),u.incrementAction(),u.changeUserInfoAction({name:"coderhxl",age:18})}();
