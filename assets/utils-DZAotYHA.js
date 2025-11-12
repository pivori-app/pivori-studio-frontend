import{r as e}from"./vendor-CUqL0VC2.js";var t={exports:{}},n={},r={exports:{}},u={},o=e;var a="function"==typeof Object.is?Object.is:function(e,t){return e===t&&(0!==e||1/e==1/t)||e!=e&&t!=t},i=o.useState,s=o.useEffect,c=o.useLayoutEffect,f=o.useDebugValue;function l(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!a(e,n)}catch(r){return!0}}var v="undefined"==typeof window||void 0===window.document||void 0===window.document.createElement?function(e,t){return t()}:function(e,t){var n=t(),r=i({inst:{value:n,getSnapshot:t}}),u=r[0].inst,o=r[1];return c(function(){u.value=n,u.getSnapshot=t,l(u)&&o({inst:u})},[e,n,t]),s(function(){return l(u)&&o({inst:u}),e(function(){l(u)&&o({inst:u})})},[e]),f(n),n};u.useSyncExternalStore=void 0!==o.useSyncExternalStore?o.useSyncExternalStore:v,r.exports=u;var d=e,S=r.exports;
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var p="function"==typeof Object.is?Object.is:function(e,t){return e===t&&(0!==e||1/e==1/t)||e!=e&&t!=t},x=S.useSyncExternalStore,y=d.useRef,E=d.useEffect,h=d.useMemo,w=d.useDebugValue;n.useSyncExternalStoreWithSelector=function(e,t,n,r,u){var o=y(null);if(null===o.current){var a={hasValue:!1,value:null};o.current=a}else a=o.current;o=h(function(){function e(e){if(!s){if(s=!0,o=e,e=r(e),void 0!==u&&a.hasValue){var t=a.value;if(u(t,e))return i=t}return i=e}if(t=i,p(o,e))return t;var n=r(e);return void 0!==u&&u(t,n)?(o=e,t):(o=e,i=n)}var o,i,s=!1,c=void 0===n?null:n;return[function(){return e(t())},null===c?void 0:function(){return e(c())}]},[t,n,r,u]);var i=x(e,o[0],o[1]);return E(function(){a.hasValue=!0,a.value=i},[i]),w(i),i},t.exports=n;var b=t.exports;export{b as w};
