import{m as h,a as u,g as p,s as v}from"./footer-5xJtchcy.js";import{f,a as g,b as $}from"./api-lDZN3vsg.js";import{c as b,r as I,f as d}from"./cart-service-C6sXeXRB.js";const y=h({showCart:!0,currentNav:"home"});u();const r={products:[],banners:[],reviews:[],heroIndex:0};let c=null;const s={heroTrack:document.getElementById("homeHeroTrack"),heroDots:document.getElementById("homeHeroDots"),heroPrev:document.getElementById("heroPrev"),heroNext:document.getElementById("heroNext"),bestProductGrid:document.getElementById("bestProductGrid"),bestReviewList:document.getElementById("bestReviewList")};function H(){const e=p();v(y,{userName:e?.name||null,cartCountValue:b()})}function a(e){r.heroIndex=(e+r.banners.length)%r.banners.length,document.querySelectorAll(".home-hero-slide").forEach((t,o)=>t.classList.toggle("active",o===r.heroIndex)),document.querySelectorAll(".home-hero-dot").forEach((t,o)=>t.classList.toggle("active",o===r.heroIndex))}function n(){c&&clearInterval(c),c=setInterval(()=>a(r.heroIndex+1),4e3)}function L(){s.heroTrack.innerHTML=r.banners.map((e,t)=>`
      <article class="home-hero-slide ${t===0?"active":""}">
        <img src="${e.image}" alt="${e.title}" />
        <div class="home-hero-overlay">
          <div class="home-hero-copy">
            <p>${e.subtitle}</p>
            <h2>${e.title}</h2>
            <p>${e.description}</p>
            <a class="home-hero-link" href="${e.link}">${e.cta}</a>
          </div>
        </div>
      </article>`).join(""),s.heroDots.innerHTML=r.banners.map((e,t)=>`<button class="home-hero-dot ${t===0?"active":""}" data-dot="${t}" aria-label="${t+1}번 배너"></button>`).join("")}function P(e,t){e.innerHTML=t.map(o=>{const i=Math.round((1-o.price/o.originalPrice)*100);return`
        <a class="home-product-card" href="/pages/detail.html?id=${o.id}">
          <div class="home-product-thumb">
            <img src="${I(o.image)}" alt="${o.name}" />
          </div>
          <div class="home-product-meta">
            <strong>${o.name}</strong>
            <p>${o.oneLine||o.description}</p>
            <div class="home-product-price">
              <small>${d(o.originalPrice)}</small>
              <div><span>${i}%</span><b>${d(o.price)}</b></div>
            </div>
          </div>
        </a>`}).join("")}function E(){s.bestReviewList.innerHTML=r.reviews.map(e=>{const t=r.products.find(o=>o.id===e.productId);return`
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
        </a>`}).join("")}function x(){s.heroPrev.addEventListener("click",()=>{a(r.heroIndex-1),n()}),s.heroNext.addEventListener("click",()=>{a(r.heroIndex+1),n()}),s.heroDots.addEventListener("click",e=>{const t=e.target.closest("[data-dot]");t&&(a(Number(t.dataset.dot)),n())})}async function B(){const[e,t,o]=await Promise.all([f(),g(),$(6)]);r.products=e,r.banners=t,r.reviews=o;const i=[...e].sort((l,m)=>m.popularScore-l.popularScore).slice(0,8);H(),L(),a(0),n(),P(s.bestProductGrid,i),E(),x()}B();
