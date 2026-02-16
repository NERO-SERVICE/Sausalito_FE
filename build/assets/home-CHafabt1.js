import{m as b,g as v,s as f}from"./header-DS7QUZWh.js";import{f as h}from"./api-Dtw6jH7d.js";import{c as I,r as y,f as g}from"./cart-service-D4_pbSDg.js";const l=[{subtitle:"APRIL CURATION",title:"이달의 아이템 01",description:"매일의 웰니스 루틴을 위한 핵심 구성",promo:`매일 아침,
건강한 시작`,image:"/dist/img/products/dummy1.png"},{subtitle:"APRIL CURATION",title:"이달의 아이템 02",description:"한 달 집중 케어를 위한 추천 셀렉션",promo:`지금 가장
인기있는 구성`,image:"/dist/img/products/dummy2.png"},{subtitle:"APRIL CURATION",title:"이달의 아이템 03",description:"컨디션 회복을 위한 데일리 루틴",promo:`간편하지만
확실한 루틴`,image:"/dist/img/products/dummy3.png"},{subtitle:"APRIL CURATION",title:"이달의 아이템 04",description:"장기 섭취 고객을 위한 가치 패키지",promo:`정기 케어
추천 패키지`,image:"/dist/img/products/p4.svg"}],o={bannerIndex:0,products:[]};let u=null;const L=b({showCart:!0}),r={bannerTrack:document.getElementById("homeBannerTrack"),bannerDots:document.getElementById("homeBannerDots"),bannerPrev:document.getElementById("bannerPrev"),bannerNext:document.getElementById("bannerNext"),productGrid:document.getElementById("productGrid"),searchInput:document.getElementById("searchInput"),priceFilter:document.getElementById("priceFilter"),sortFilter:document.getElementById("sortFilter")};function $(){const t=v();f(L,{userName:t?.name||null,cartCountValue:I()})}function c(t){o.bannerIndex=(t+l.length)%l.length,document.querySelectorAll(".home-banner-slide").forEach((e,a)=>e.classList.toggle("active",a===o.bannerIndex)),document.querySelectorAll(".home-banner-dot").forEach((e,a)=>e.classList.toggle("active",a===o.bannerIndex))}function d(){u&&clearInterval(u),u=setInterval(()=>c(o.bannerIndex+1),4e3)}function E(){r.bannerTrack.innerHTML=l.map((t,e)=>`
      <article class="home-banner-slide ${e===0?"active":""}">
        <img src="${t.image}" alt="${t.title}" />
        <div class="home-banner-overlay">
          <p class="home-banner-promo">${t.promo.replace(/\n/g,"<br />")}</p>
          <div class="home-banner-copy">
            <p>${t.subtitle}</p>
            <h2>${t.title}</h2>
            <p>${t.description}</p>
          </div>
        </div>
      </article>`).join(""),r.bannerDots.innerHTML=l.map((t,e)=>`<button class="home-banner-dot ${e===0?"active":""}" data-dot="${e}" aria-label="${e+1}번 배너"></button>`).join("")}function w(){const t=r.searchInput.value.trim().toLowerCase(),e=r.priceFilter.value,a=r.sortFilter.value;let i=[...o.products];if(t&&(i=i.filter(n=>n.name.toLowerCase().includes(t)||n.description.toLowerCase().includes(t))),e!=="all"){const[n,s]=e.split("-").map(Number);i=i.filter(p=>p.price>=n&&p.price<=s)}return a==="popular"&&i.sort((n,s)=>s.popularScore-n.popularScore),a==="newest"&&i.sort((n,s)=>new Date(s.releaseDate)-new Date(n.releaseDate)),a==="priceAsc"&&i.sort((n,s)=>n.price-s.price),a==="priceDesc"&&i.sort((n,s)=>s.price-n.price),i}function m(){const t=w();if(!t.length){r.productGrid.innerHTML='<p class="empty">조건에 맞는 상품이 없습니다.</p>';return}r.productGrid.innerHTML=t.map(e=>{const a=Math.round((1-e.price/e.originalPrice)*100);return`
        <a class="product-card product-card-link" href="/pages/detail.html?id=${e.id}">
          <div class="product-thumb"><img src="${y(e.image)}" alt="${e.name}" /></div>
          <div class="product-meta">
            <h4>${e.name}</h4>
            <p>${e.oneLine||e.description}</p>
          </div>
          <div class="price-stack">
            <small class="old-price">${g(e.originalPrice)}</small>
            <div class="new-price-row"><span class="discount-rate">${a}%</span><strong class="new-price">${g(e.price)}</strong></div>
          </div>
          <div class="review-count">리뷰 (${e.reviews.toLocaleString("ko-KR")})</div>
        </a>`}).join("")}function P(){r.bannerPrev.addEventListener("click",()=>{c(o.bannerIndex-1),d()}),r.bannerNext.addEventListener("click",()=>{c(o.bannerIndex+1),d()}),r.bannerDots.addEventListener("click",t=>{const e=t.target.closest("[data-dot]");e&&(c(Number(e.dataset.dot)),d())}),[r.searchInput,r.priceFilter,r.sortFilter].forEach(t=>{t.addEventListener("input",m),t.addEventListener("change",m)})}async function A(){o.products=await h(),$(),E(),c(0),d(),m(),P()}A();
