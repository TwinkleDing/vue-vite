import{e as p,o as f,f as d,g as h,h as y}from"./@vue.9cf5584f.js";import{r as g}from"./vite-plugin-qiankun.874d9343.js";import{c as v,a as w}from"./vue-router.ced10e9c.js";import{c as A}from"./vuex.29e3df77.js";const E=function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&t(n)}).observe(document,{childList:!0,subtree:!0});function o(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerpolicy&&(r.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?r.credentials="include":e.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function t(e){if(e.ep)return;e.ep=!0;const r=o(e);fetch(e.href,r)}};E();window.__POWERED_BY_QIANKUN__&&(window.__webpack_public_path__=window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__);var b=(s,i)=>{const o=s.__vccOpts||s;for(const[t,e]of i)o[t]=e;return o};const N={};function O(s,i){const o=p("router-view");return f(),d(o)}var B=b(N,[["render",O],["__file","E:/Demo/vue-vite/micro-vue-application/src/App.vue"]]);const I="modulepreload",l={},k="/",c=function(i,o){return!o||o.length===0?i():Promise.all(o.map(t=>{if(t=`${k}${t}`,t in l)return;l[t]=!0;const e=t.endsWith(".css"),r=e?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${t}"]${r}`))return;const n=document.createElement("link");if(n.rel=e?"stylesheet":I,e||(n.as="script",n.crossOrigin=""),n.href=t,document.head.appendChild(n),e)return new Promise((_,m)=>{n.addEventListener("load",_),n.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${t}`)))})})).then(()=>i())},L=v({routes:[{path:"/",redirect:"/home"},{path:"/home",component:()=>c(()=>import("./home.8482c18e.js"),["assets/home.8482c18e.js","assets/@vue.9cf5584f.js","assets/vite-plugin-qiankun.874d9343.js","assets/vue-router.ced10e9c.js","assets/vuex.29e3df77.js"])},{path:"/first",name:"first",component:()=>c(()=>import("./first.4b7447f9.js"),["assets/first.4b7447f9.js","assets/@vue.9cf5584f.js","assets/vite-plugin-qiankun.874d9343.js","assets/vue-router.ced10e9c.js","assets/vuex.29e3df77.js"])},{path:"/second",name:"second",component:()=>c(()=>import("./second.9a992f09.js"),["assets/second.9a992f09.js","assets/@vue.9cf5584f.js","assets/vite-plugin-qiankun.874d9343.js","assets/vue-router.ced10e9c.js","assets/vuex.29e3df77.js"])}],history:w(window.__POWERED_BY_QIANKUN__?"/MicroVue":"/"),scrollBehavior(s,i,o){const t={el:"#layout-main",top:o?o.top:0,left:o?o.left:0,behavior:"smooth"};return new Promise((e,r)=>{setTimeout(()=>{const n=document.getElementById("layout-main");n&&n.scrollTo(t),e()},200)})}}),M=new A({state:""});let a=null;g({mount(){console.log("MicroVueApp Mount"),u()},bootstrap(){console.log("MicroVueApp Bootstrap")},unmount(){console.log("MicroVueApp Unmount"),a.unmount(),a=null}});function u(){const s=h({mounted(){},render:()=>y(B)});s.use(L).use(M).mount("#MicroVueApp"),a=s}window.__POWERED_BY_QIANKUN__||u();export{b as _};
