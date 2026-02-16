(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const n of o.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&a(n)}).observe(document,{childList:!0,subtree:!0});function s(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(r){if(r.ep)return;r.ep=!0;const o=s(r);fetch(r.href,o)}})();const i={cart:"sausalito_cart",user:"sausalito_user"};function l(t,e){try{return JSON.parse(localStorage.getItem(t)||JSON.stringify(e))}catch{return e}}function c(t,e){localStorage.setItem(t,JSON.stringify(e))}function u(){return l(i.user,null)}function d({email:t,name:e}){const s={email:t,name:e};return c(i.user,s),s}function g({showCart:t=!0,currentNav:e=""}={}){const s=document.getElementById("siteHeaderMount");return s?(s.innerHTML=`
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
          ${t?`<a class="icon-btn cart-link" href="/pages/cart.html" aria-label="장바구니">
                   <svg class="cart-svg" viewBox="0 0 24 24" aria-hidden="true">
                     <path d="M3 4h2l2.4 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 7H7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                     <circle cx="10" cy="19" r="1.6" fill="currentColor"/>
                     <circle cx="17" cy="19" r="1.6" fill="currentColor"/>
                   </svg>
                   <span class="cart-link-label">장바구니</span>
                   <span class="count" id="cartCount">0</span>
                 </a>`:""}
        </div>
      </div>
      <div class="site-anchor-nav-wrap">
        <nav class="site-anchor-nav">
          <a href="/pages/home.html" class="${e==="home"?"active":""}">홈</a>
          <a href="/pages/brand.html" class="${e==="brand"?"active":""}">브랜드</a>
          <a href="/pages/shop.html" class="${e==="shop"?"active":""}">쇼핑</a>
          <a href="/pages/reviews.html" class="${e==="review"?"active":""}">리뷰</a>
        </nav>
      </div>
    </header>
  `,{loginLink:s.querySelector("#loginLink"),cartCount:s.querySelector("#cartCount")}):{loginLink:null,cartCount:null}}function p(t,{userName:e=null,cartCountValue:s=null}={}){t.loginLink&&(t.loginLink.textContent=e?`${e}님`:"로그인"),t.cartCount&&typeof s=="number"&&(t.cartCount.textContent=s)}function f(){const t=document.getElementById("siteFooterMount");t&&(t.innerHTML=`
    <footer class="site-footer">
      <div class="site-footer-inner">
        <nav class="site-footer-links">
          <a href="/pages/privacy.html">개인정보처리방침</a>
          <a href="/pages/terms.html">이용약관</a>
          <a href="/pages/guide.html">이용안내</a>
        </nav>
        <div class="site-footer-info">
          <p><strong>상호</strong> 소살리토웰니스 주식회사</p>
          <p><strong>대표</strong> 홍길동</p>
          <p><strong>사업자등록번호</strong> 123-45-67890</p>
          <p><strong>통신판매업신고</strong> 2026-서울강남-0001</p>
          <p><strong>주소</strong> 서울특별시 강남구 테헤란로 123, 소살리토빌딩 8층</p>
          <p><strong>고객센터</strong> 1588-1234 (평일 10:00 - 18:00 / 점심 12:30 - 13:30)</p>
          <p><strong>이메일</strong> help@sausalito.co.kr</p>
        </div>
        <p class="site-footer-copy">Copyright © SAUSALITO WELLNESS Co., Ltd. All rights reserved.</p>
      </div>
    </footer>
  `)}export{i as S,f as a,u as g,d as l,g as m,l as r,p as s,c as w};
