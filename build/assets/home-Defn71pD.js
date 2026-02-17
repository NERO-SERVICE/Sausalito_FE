import{m,a as u,f as p,b as v,c as f,s as g,g as $,d as b}from"./footer-L9VA9lT-.js";import{c as I}from"./cart-service-B2LqFCB-.js";import{r as y,a as H,f as d}from"./store-data-Deux6dsM.js";const L=m({showCart:!0,currentNav:"home"});u();const r={products:[],banners:[],reviews:[],heroIndex:0};let c=null;const s={heroTrack:document.getElementById("homeHeroTrack"),heroDots:document.getElementById("homeHeroDots"),heroPrev:document.getElementById("heroPrev"),heroNext:document.getElementById("heroNext"),bestProductGrid:document.getElementById("bestProductGrid"),bestReviewList:document.getElementById("bestReviewList")};async function P(){const e=await g()||$();let t=0;try{t=await I()}catch{t=0}b(L,{userName:e?.name||e?.email||null,isAdmin:!!(e?.is_staff??e?.isStaff),cartCountValue:t})}function n(e){r.banners.length&&(r.heroIndex=(e+r.banners.length)%r.banners.length,document.querySelectorAll(".home-hero-slide").forEach((t,o)=>t.classList.toggle("active",o===r.heroIndex)),document.querySelectorAll(".home-hero-dot").forEach((t,o)=>t.classList.toggle("active",o===r.heroIndex)))}function a(){r.banners.length&&(c&&clearInterval(c),c=setInterval(()=>n(r.heroIndex+1),4e3))}function B(){if(!r.banners.length){s.heroTrack.innerHTML="",s.heroDots.innerHTML="";return}s.heroTrack.innerHTML=r.banners.map((e,t)=>`
      <article class="home-hero-slide ${t===0?"active":""}">
        <img src="${y(e.image)}" alt="${e.title}" />
        <div class="home-hero-overlay">
          <div class="home-hero-copy">
            <p>${e.subtitle}</p>
            <h2>${e.title}</h2>
            <p>${e.description}</p>
            <a class="home-hero-link" href="${e.link}">${e.cta}</a>
          </div>
        </div>
      </article>`).join(""),s.heroDots.innerHTML=r.banners.map((e,t)=>`<button class="home-hero-dot ${t===0?"active":""}" data-dot="${t}" aria-label="${t+1}번 배너"></button>`).join("")}function E(e,t){e.innerHTML=t.map(o=>{const i=Math.round((1-o.price/o.originalPrice)*100);return`
        <a class="home-product-card" href="/pages/detail.html?id=${o.id}">
          <div class="home-product-thumb">
            <img src="${H(o.image)}" alt="${o.name}" />
          </div>
          <div class="home-product-meta">
            <strong>${o.name}</strong>
            <p>${o.oneLine||o.description}</p>
            <div class="home-product-price">
              <small>${d(o.originalPrice)}</small>
              <div><span>${i}%</span><b>${d(o.price)}</b></div>
            </div>
          </div>
        </a>`}).join("")}function T(){s.bestReviewList.innerHTML=r.reviews.map(e=>{const t=r.products.find(o=>o.id===e.productId);return`
        <a class="home-review-card" href="/pages/detail.html?id=${e.productId}">
          <div class="home-review-head">
            <strong>${t?.name||"상품"}</strong>
            <span>${e.user} · ${e.date}</span>
          </div>
          <p>${e.text}</p>
          <div class="home-review-foot">
            <b>${"★".repeat(e.score)}${"☆".repeat(5-e.score)}</b>
            <span>도움돼요 ${e.helpful}</span>
          </div>
        </a>`}).join("")}function w(){r.banners.length&&(s.heroPrev.addEventListener("click",()=>{n(r.heroIndex-1),a()}),s.heroNext.addEventListener("click",()=>{n(r.heroIndex+1),a()}),s.heroDots.addEventListener("click",e=>{const t=e.target.closest("[data-dot]");t&&(n(Number(t.dataset.dot)),a())}))}async function k(){try{const[e,t,o]=await Promise.all([p(),v(),f(6)]);r.products=e,r.banners=t,r.reviews=o;const i=[...e].sort((l,h)=>h.popularScore-l.popularScore).slice(0,8);await P(),B(),n(0),a(),E(s.bestProductGrid,i),T(),w()}catch(e){console.error(e),alert("홈 데이터를 불러오지 못했습니다. 백엔드 서버 상태를 확인해주세요.")}}k();
