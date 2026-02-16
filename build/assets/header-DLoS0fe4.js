(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))i(t);new MutationObserver(t=>{for(const n of t)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function o(t){const n={};return t.integrity&&(n.integrity=t.integrity),t.referrerPolicy&&(n.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?n.credentials="include":t.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(t){if(t.ep)return;t.ep=!0;const n=o(t);fetch(t.href,n)}})();const a={cart:"sausalito_cart",user:"sausalito_user"};function c(r,e){try{return JSON.parse(localStorage.getItem(r)||JSON.stringify(e))}catch{return e}}function l(r,e){localStorage.setItem(r,JSON.stringify(e))}function u(){return c(a.user,null)}function d({email:r,name:e}){const o={email:r,name:e};return l(a.user,o),o}function f({showCart:r=!0}={}){const e=document.getElementById("siteHeaderMount");return e?(e.innerHTML=`
    <header class="site-header">
      <a class="brand" href="/pages/home.html">
        <img src="/dist/assets/logo/main_logo.svg" alt="소살리토" class="brand-logo" />
        <div>
          <h1>소살리토</h1>
          <p>트렌디 웰니스 셀렉트샵</p>
        </div>
      </a>
      <div class="header-actions">
        <a class="text-btn" href="/pages/login.html" id="loginLink">로그인</a>
        ${r?'<a class="icon-btn" href="/pages/cart.html">장바구니 <span class="count" id="cartCount">0</span></a>':""}
      </div>
    </header>
  `,{loginLink:e.querySelector("#loginLink"),cartCount:e.querySelector("#cartCount")}):{loginLink:null,cartCount:null}}function g(r,{userName:e=null,cartCountValue:o=null}={}){r.loginLink&&(r.loginLink.textContent=e?`${e}님`:"로그인"),r.cartCount&&typeof o=="number"&&(r.cartCount.textContent=o)}export{a as S,u as g,d as l,f as m,c as r,g as s,l as w};
