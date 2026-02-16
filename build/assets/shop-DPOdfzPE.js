import{m as d,a as l,g as u,s as p}from"./footer-45QzvbMW.js";import{f as m}from"./api-0RWHKEw6.js";import{c as f,r as h,f as a}from"./cart-service-BkS5W-VD.js";const v=d({showCart:!0,currentNav:"shop"});l();const c={products:[]},i={searchInput:document.getElementById("shopSearchInput"),sortSelect:document.getElementById("shopSortSelect"),productGrid:document.getElementById("shopProductGrid")};function g(){const n=u();p(v,{userName:n?.name||null,cartCountValue:f()})}function w(){const n=i.searchInput.value.trim().toLowerCase(),e=i.sortSelect.value;let r=[...c.products];return n&&(r=r.filter(t=>t.name.toLowerCase().includes(n)||(t.oneLine||t.description).toLowerCase().includes(n))),e==="popular"&&r.sort((t,s)=>s.popularScore-t.popularScore),e==="review"&&r.sort((t,s)=>s.reviews-t.reviews),e==="priceAsc"&&r.sort((t,s)=>t.price-s.price),e==="priceDesc"&&r.sort((t,s)=>s.price-t.price),e==="newest"&&r.sort((t,s)=>new Date(s.releaseDate)-new Date(t.releaseDate)),r}function o(){const n=w();if(!n.length){i.productGrid.innerHTML='<p class="empty">검색 결과가 없습니다.</p>';return}i.productGrid.innerHTML=n.map(e=>{const r=Math.round((1-e.price/e.originalPrice)*100);return`
        <a class="home-product-card" href="/pages/detail.html?id=${e.id}">
          <div class="home-product-thumb">
            <img src="${h(e.image)}" alt="${e.name}" />
          </div>
          <div class="home-product-meta">
            <strong>${e.name}</strong>
            <p>${e.oneLine||e.description}</p>
            <div class="home-product-price">
              <small>${a(e.originalPrice)}</small>
              <div><span>${r}%</span><b>${a(e.price)}</b></div>
            </div>
          </div>
        </a>`}).join("")}function S(){i.searchInput.addEventListener("input",o),i.sortSelect.addEventListener("change",o)}async function y(){c.products=await m(),g(),o(),S()}y();
