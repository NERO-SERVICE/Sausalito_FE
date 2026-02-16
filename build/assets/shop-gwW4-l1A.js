import{m as d,a as l,f as u,s as p,g as m,d as h}from"./footer-CuxST7fX.js";import{c as f}from"./cart-service-BQgjICxU.js";import{a as v,f as o}from"./store-data-Deux6dsM.js";const g=d({showCart:!0,currentNav:"shop"});l();const c={products:[]},a={searchInput:document.getElementById("shopSearchInput"),sortSelect:document.getElementById("shopSortSelect"),productGrid:document.getElementById("shopProductGrid")};async function w(){const r=await p()||m();let e=0;try{e=await f()}catch{e=0}h(g,{userName:r?.name||null,cartCountValue:e})}function y(){const r=a.searchInput.value.trim().toLowerCase(),e=a.sortSelect.value;let s=[...c.products];return r&&(s=s.filter(t=>t.name.toLowerCase().includes(r)||(t.oneLine||t.description).toLowerCase().includes(r))),e==="popular"&&s.sort((t,n)=>n.popularScore-t.popularScore),e==="review"&&s.sort((t,n)=>n.reviews-t.reviews),e==="priceAsc"&&s.sort((t,n)=>t.price-n.price),e==="priceDesc"&&s.sort((t,n)=>n.price-t.price),e==="newest"&&s.sort((t,n)=>new Date(n.releaseDate)-new Date(t.releaseDate)),s}function i(){const r=y();if(!r.length){a.productGrid.innerHTML='<p class="empty">검색 결과가 없습니다.</p>';return}a.productGrid.innerHTML=r.map(e=>{const s=Math.round((1-e.price/e.originalPrice)*100);return`
        <a class="home-product-card" href="/pages/detail.html?id=${e.id}">
          <div class="home-product-thumb">
            <img src="${v(e.image)}" alt="${e.name}" />
          </div>
          <div class="home-product-meta">
            <strong>${e.name}</strong>
            <p>${e.oneLine||e.description}</p>
            <div class="home-product-price">
              <small>${o(e.originalPrice)}</small>
              <div><span>${s}%</span><b>${o(e.price)}</b></div>
            </div>
          </div>
        </a>`}).join("")}function S(){a.searchInput.addEventListener("input",i),a.sortSelect.addEventListener("change",i)}async function L(){try{c.products=await u(),await w(),i(),S()}catch(r){console.error(r),a.productGrid.innerHTML='<p class="empty">상품 데이터를 불러오지 못했습니다.</p>'}}L();
