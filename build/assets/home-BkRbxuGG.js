import{m as v,g as f,s as $}from"./header-DLoS0fe4.js";import{f as I,a as P,b}from"./api-D55WLMj5.js";import{c as y,r as u,f as h}from"./cart-service-D5m3_gdm.js";const E=v({showCart:!0}),o={products:[],banners:[],reviews:[],heroIndex:0};let l=null;const s={heroTrack:document.getElementById("homeHeroTrack"),heroDots:document.getElementById("homeHeroDots"),heroPrev:document.getElementById("heroPrev"),heroNext:document.getElementById("heroNext"),bestProductGrid:document.getElementById("bestProductGrid"),bestReviewList:document.getElementById("bestReviewList"),newProductGrid:document.getElementById("newProductGrid"),timeDealGrid:document.getElementById("timeDealGrid"),instagramGrid:document.getElementById("instagramGrid")};function H(){const e=f();$(E,{userName:e?.name||null,cartCountValue:y()})}function n(e){o.heroIndex=(e+o.banners.length)%o.banners.length,document.querySelectorAll(".home-hero-slide").forEach((t,r)=>t.classList.toggle("active",r===o.heroIndex)),document.querySelectorAll(".home-hero-dot").forEach((t,r)=>t.classList.toggle("active",r===o.heroIndex))}function c(){l&&clearInterval(l),l=setInterval(()=>n(o.heroIndex+1),4e3)}function L(){s.heroTrack.innerHTML=o.banners.map((e,t)=>`
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
      </article>`).join(""),s.heroDots.innerHTML=o.banners.map((e,t)=>`<button class="home-hero-dot ${t===0?"active":""}" data-dot="${t}" aria-label="${t+1}번 배너"></button>`).join("")}function m(e,t){e.innerHTML=t.map(r=>{const d=Math.round((1-r.price/r.originalPrice)*100);return`
        <a class="home-product-card" href="/pages/detail.html?id=${r.id}">
          <div class="home-product-thumb">
            <img src="${u(r.image)}" alt="${r.name}" />
          </div>
          <div class="home-product-meta">
            <strong>${r.name}</strong>
            <p>${r.oneLine||r.description}</p>
            <div class="home-product-price">
              <small>${h(r.originalPrice)}</small>
              <div><span>${d}%</span><b>${h(r.price)}</b></div>
            </div>
          </div>
        </a>`}).join("")}function w(){s.bestReviewList.innerHTML=o.reviews.map(e=>{const t=o.products.find(r=>r.id===e.productId);return`
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
        </a>`}).join("")}function B(e){s.instagramGrid.innerHTML=e.slice(0,8).map(t=>`
      <a class="home-instagram-item" href="/pages/detail.html?id=${t.id}">
        <img src="${u(t.image)}" alt="${t.name}" />
      </a>`).join("")}function D(){s.heroPrev.addEventListener("click",()=>{n(o.heroIndex-1),c()}),s.heroNext.addEventListener("click",()=>{n(o.heroIndex+1),c()}),s.heroDots.addEventListener("click",e=>{const t=e.target.closest("[data-dot]");t&&(n(Number(t.dataset.dot)),c())})}async function G(){const[e,t,r]=await Promise.all([I(),P(),b(6)]);o.products=e,o.banners=t,o.reviews=r;const d=[...e].sort((a,i)=>i.popularScore-a.popularScore).slice(0,8),g=[...e].sort((a,i)=>new Date(i.releaseDate)-new Date(a.releaseDate)).slice(0,8),p=[...e].sort((a,i)=>(i.originalPrice-i.price)/i.originalPrice-(a.originalPrice-a.price)/a.originalPrice).slice(0,4);H(),L(),n(0),c(),m(s.bestProductGrid,d),w(),m(s.newProductGrid,g),m(s.timeDealGrid,p),B(e),D()}G();
