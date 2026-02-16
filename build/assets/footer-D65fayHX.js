(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function r(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(n){if(n.ep)return;n.ep=!0;const s=r(n);fetch(n.href,s)}})();const c={cart:"sausalito_cart",wishlist:"sausalito_wishlist",user:"sausalito_user",tokens:"sausalito_tokens"};function A(e,t){try{return JSON.parse(localStorage.getItem(e)||JSON.stringify(t))}catch{return t}}function l(e,t){localStorage.setItem(e,JSON.stringify(t))}const L="http://127.0.0.1:8000/api/v1".replace(/\/$/,"");let p=null;class N extends Error{constructor(t,r=500,i="API_ERROR",n={}){super(t),this.name="ApiError",this.status=r,this.code=i,this.details=n}}function m(){return A(c.tokens,null)}function _(e){l(c.tokens,e)}function g(){l(c.tokens,null)}function v(e,t={}){const r=e.startsWith("/")?e:`/${e}`,i=new URL(`${L}${r}`);return Object.entries(t).forEach(([n,s])=>{s==null||s===""||i.searchParams.set(n,String(s))}),i.toString()}async function S(e){const t=await e.text();if(!t)return null;try{return JSON.parse(t)}catch{return null}}function x(e,t){const r=t?.error||{},i=r.message||t?.message||"요청 처리 중 오류가 발생했습니다.";return new N(i,e,r.code||"API_ERROR",r.details||{})}async function P(){const e=m();return e?.refresh?p||(p=(async()=>{const t=await fetch(v("/auth/refresh"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({refresh:e.refresh})}),r=await S(t);if(!t.ok||r?.success===!1)return g(),l(c.user,null),!1;const i=r?.data||r;return i?.access?(_({access:i.access,refresh:i.refresh||e.refresh}),!0):(g(),l(c.user,null),!1)})().catch(()=>(g(),l(c.user,null),!1)).finally(()=>{p=null}),p):!1}async function u(e,{method:t="GET",query:r={},body:i,auth:n=!0,isForm:s=!1,retryOnAuth:o=!0}={}){const a={},f=m();s||(a["Content-Type"]="application/json"),n&&f?.access&&(a.Authorization=`Bearer ${f.access}`);const h=await fetch(v(e,r),{method:t,headers:a,body:i?s?i:JSON.stringify(i):void 0}),d=await S(h);if(h.status===401&&n&&o&&f?.refresh&&await P())return u(e,{method:t,query:r,body:i,auth:n,isForm:s,retryOnAuth:!1});if(!h.ok||d?.success===!1)throw x(h.status,d);return d?.data!==void 0?d.data:d}function y(e){return e?Array.isArray(e)?e:Array.isArray(e.results)?e.results:[]:[]}function C(e){if(!e)return"";const t=new Date(e);if(Number.isNaN(t.getTime()))return"";const r=t.getFullYear(),i=String(t.getMonth()+1).padStart(2,"0"),n=String(t.getDate()).padStart(2,"0");return`${r}.${i}.${n}`}function k(e={}){const t=Number(e.rating??e.rating_avg??e.review_summary?.avg??0),r=Number(e.reviews??e.review_count??e.review_summary?.count??0);return{id:e.id,name:e.name||"",oneLine:e.oneLine??e.one_line??"",description:e.description||"",price:Number(e.price||0),originalPrice:Number(e.originalPrice??e.original_price??e.price??0),stock:Number(e.stock||0),badges:Array.isArray(e.badges)?e.badges:[],rating:t,reviews:r,popularScore:Number(e.popularScore??e.popular_score??0),releaseDate:e.releaseDate??e.release_date??"",image:e.image||e.images?.find(i=>i.is_thumbnail)?.url||e.images?.[0]?.url||""}}function E(e={}){return{...k(e),intake:e.intake||"",target:e.target||"",ingredients:Array.isArray(e.ingredients)?e.ingredients:[],cautions:Array.isArray(e.cautions)?e.cautions:[],faq:Array.isArray(e.faq)?e.faq:[],images:Array.isArray(e.images)?e.images.map(r=>r.url).filter(Boolean):[],options:Array.isArray(e.options)?e.options.map(r=>({id:r.id,name:r.name,price:Number(r.price||0),stock:Number(r.stock||0)})):[]}}function O(){return{couponText:"",shippingFee:3e3,freeShippingThreshold:5e4,interestFreeText:"",purchaseTypes:[],subscriptionBenefit:"",optionsLabel:"상품구성",options:[],addOns:[],todayShipText:"",inquiryCount:0,detailImages:[]}}function R(e){return e?{couponText:e.coupon_text||"",shippingFee:Number(e.shipping_fee||3e3),freeShippingThreshold:Number(e.free_shipping_threshold||5e4),interestFreeText:e.interest_free_text||"",purchaseTypes:Array.isArray(e.purchase_types)?e.purchase_types:[],subscriptionBenefit:e.subscription_benefit||"",optionsLabel:e.options_label||"상품구성",options:Array.isArray(e.options)?e.options.map(t=>({id:t.id,name:t.name,price:Number(t.price||0),stock:Number(t.stock||0)})):[],addOns:Array.isArray(e.add_ons)?e.add_ons:[],todayShipText:e.today_ship_text||"",inquiryCount:Number(e.inquiry_count||0),detailImages:Array.isArray(e.detail_images)?e.detail_images:[]}:O()}function b(e={}){return{id:e.id,productId:Number(e.productId??e.product_id??e.product?.id??0),user:e.user||e.user_masked||"익명",score:Number(e.score||0),text:e.text||e.content||"",date:e.date||C(e.created_at),helpful:Number(e.helpful??e.helpful_count??0),image:e.image||e.images?.[0]?.url||"",createdAt:e.created_at||null}}async function T({productId:e,sort:t="latest",hasImage:r,pageSize:i=100}={}){let n=1,s=null;const o=[];for(;n<=100;){const a=await u("/reviews",{query:{product_id:e,sort:t,has_image:typeof r=="boolean"?String(r):void 0,page:n,page_size:i},auth:!1,retryOnAuth:!1}),f=y(a);if(o.push(...f.map(b)),typeof a?.count=="number"&&(s=a.count),!a?.next||s!==null&&o.length>=s)break;n+=1}return o}async function $({email:e,password:t}){return u("/auth/login",{method:"POST",body:{email:e,password:t},auth:!1,retryOnAuth:!1})}async function I(){return u("/users/me")}async function M({q:e,sort:t,minPrice:r,maxPrice:i}={}){const n=await u("/products",{query:{q:e,sort:t,min_price:r,max_price:i,page_size:100},auth:!1,retryOnAuth:!1});return y(n).map(k)}async function F(e){if(!e)return null;const t=await u(`/products/${e}`,{auth:!1,retryOnAuth:!1});return E(t)}async function J(e){if(!e)return O();const t=await u(`/products/${e}/detail-meta`,{auth:!1,retryOnAuth:!1});return R(t)}async function H(e){return e?T({productId:e,sort:"latest",pageSize:100}):[]}async function U(){return u("/banners/home",{auth:!1,retryOnAuth:!1})}async function j(e=6){const t=await u("/reviews",{query:{sort:"helpful",page_size:e,page:1},auth:!1,retryOnAuth:!1});return y(t).map(b).slice(0,e)}async function W(){return T({sort:"latest",pageSize:100})}async function G({productId:e,score:t,title:r,content:i,images:n=[]}){const s=new FormData;s.append("product_id",String(e)),s.append("score",String(t)),s.append("title",r||""),s.append("content",i||""),n.forEach(a=>{s.append("images",a)});const o=await u("/reviews",{method:"POST",body:s,isForm:!0});return b(o)}function K(){return A(c.user,null)}function B(){return m()}function q(){return!!B()?.access}async function Y({email:e,password:t}){const r=await $({email:e,password:t}),i=r?.tokens||null,n=r?.user||null;return _(i),l(c.user,n),n}function z(){g(),l(c.user,null)}async function Q(){if(!q())return null;try{const e=await I();return l(c.user,e),e}catch{return z(),null}}function X({showCart:e=!0,currentNav:t=""}={}){const r=document.getElementById("siteHeaderMount");return r?(r.innerHTML=`
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
          ${e?`<a class="icon-btn cart-link" href="/pages/cart.html" aria-label="장바구니">
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
          <a href="/pages/home.html" class="${t==="home"?"active":""}">홈</a>
          <a href="/pages/brand.html" class="${t==="brand"?"active":""}">브랜드</a>
          <a href="/pages/shop.html" class="${t==="shop"?"active":""}">쇼핑</a>
          <a href="/pages/reviews.html" class="${t==="review"?"active":""}">리뷰</a>
        </nav>
      </div>
    </header>
  `,{loginLink:r.querySelector("#loginLink"),cartCount:r.querySelector("#cartCount")}):{loginLink:null,cartCount:null}}function Z(e,{userName:t=null,cartCountValue:r=null}={}){e.loginLink&&(e.loginLink.textContent=t?`${t}님`:"로그인"),e.cartCount&&typeof r=="number"&&(e.cartCount.textContent=r)}function V(){const e=document.getElementById("siteFooterMount");e&&(e.innerHTML=`
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
  `)}export{V as a,U as b,j as c,Z as d,W as e,M as f,K as g,G as h,F as i,J as j,H as k,Y as l,X as m,q as n,u as o,Q as s};
