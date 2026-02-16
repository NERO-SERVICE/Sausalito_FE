(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))a(t);new MutationObserver(t=>{for(const s of t)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function n(t){const s={};return t.integrity&&(s.integrity=t.integrity),t.referrerPolicy&&(s.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?s.credentials="include":t.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(t){if(t.ep)return;t.ep=!0;const s=n(t);fetch(t.href,s)}})();const i={cart:"sausalito_cart",user:"sausalito_user"};function c(r,e){try{return JSON.parse(localStorage.getItem(r)||JSON.stringify(e))}catch{return e}}function l(r,e){localStorage.setItem(r,JSON.stringify(e))}function u(){return c(i.user,null)}function d({email:r,name:e}){const n={email:r,name:e};return l(i.user,n),n}function f({showCart:r=!0,currentNav:e=""}={}){const n=document.getElementById("siteHeaderMount");return n?(n.innerHTML=`
    <header class="site-header">
      <div class="site-header-top">
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
      </div>
      <div class="site-anchor-nav-wrap">
        <nav class="site-anchor-nav">
          <a href="/pages/brand.html" class="${e==="brand"?"active":""}">브랜드</a>
          <a href="/pages/shop.html" class="${e==="shop"?"active":""}">쇼핑</a>
          <a href="/pages/reviews.html" class="${e==="review"?"active":""}">리뷰</a>
        </nav>
      </div>
    </header>
  `,{loginLink:n.querySelector("#loginLink"),cartCount:n.querySelector("#cartCount")}):{loginLink:null,cartCount:null}}function g(r,{userName:e=null,cartCountValue:n=null}={}){r.loginLink&&(r.loginLink.textContent=e?`${e}님`:"로그인"),r.cartCount&&typeof n=="number"&&(r.cartCount.textContent=n)}export{i as S,u as g,d as l,f as m,c as r,g as s,l as w};
