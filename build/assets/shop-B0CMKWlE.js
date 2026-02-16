import{m as d,g as l,s as u}from"./header-Bv8tAKev.js";import{f as p}from"./api-C4vJdtqo.js";import{c as m,r as f,f as a}from"./cart-service-BM7B5bfh.js";const h=d({showCart:!0,currentNav:"shop"}),c={products:[]},i={searchInput:document.getElementById("shopSearchInput"),sortSelect:document.getElementById("shopSortSelect"),productGrid:document.getElementById("shopProductGrid")};function v(){const n=l();u(h,{userName:n?.name||null,cartCountValue:m()})}function g(){const n=i.searchInput.value.trim().toLowerCase(),e=i.sortSelect.value;let r=[...c.products];return n&&(r=r.filter(t=>t.name.toLowerCase().includes(n)||(t.oneLine||t.description).toLowerCase().includes(n))),e==="popular"&&r.sort((t,s)=>s.popularScore-t.popularScore),e==="review"&&r.sort((t,s)=>s.reviews-t.reviews),e==="priceAsc"&&r.sort((t,s)=>t.price-s.price),e==="priceDesc"&&r.sort((t,s)=>s.price-t.price),e==="newest"&&r.sort((t,s)=>new Date(s.releaseDate)-new Date(t.releaseDate)),r}function o(){const n=g();if(!n.length){i.productGrid.innerHTML='<p class="empty">검색 결과가 없습니다.</p>';return}i.productGrid.innerHTML=n.map(e=>{const r=Math.round((1-e.price/e.originalPrice)*100);return`
        <a class="home-product-card" href="/pages/detail.html?id=${e.id}">
          <div class="home-product-thumb">
            <img src="${f(e.image)}" alt="${e.name}" />
          </div>
          <div class="home-product-meta">
            <strong>${e.name}</strong>
            <p>${e.oneLine||e.description}</p>
            <div class="home-product-price">
              <small>${a(e.originalPrice)}</small>
              <div><span>${r}%</span><b>${a(e.price)}</b></div>
            </div>
          </div>
        </a>`}).join("")}function w(){i.searchInput.addEventListener("input",o),i.sortSelect.addEventListener("change",o)}async function S(){c.products=await p(),v(),o(),w()}S();
