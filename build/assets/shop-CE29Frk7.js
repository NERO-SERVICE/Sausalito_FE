import{m as d,a as l,f as u,s as p,g as m,d as f}from"./footer-CX_4Vxnh.js";import{c as h}from"./cart-service-BJL0NQK-.js";import{a as v,f as o}from"./store-data-Deux6dsM.js";const g=d({showCart:!0,currentNav:"shop"});l();const c={products:[]},n={searchInput:document.getElementById("shopSearchInput"),sortSelect:document.getElementById("shopSortSelect"),productGrid:document.getElementById("shopProductGrid")};async function w(){const t=await p()||m();let e=0;try{e=await h()}catch{e=0}f(g,{userName:t?.name||t?.email||null,isAdmin:!!(t?.is_staff??t?.isStaff),cartCountValue:e})}function y(){const t=n.searchInput.value.trim().toLowerCase(),e=n.sortSelect.value;let s=[...c.products];return t&&(s=s.filter(r=>r.name.toLowerCase().includes(t)||(r.oneLine||r.description).toLowerCase().includes(t))),e==="popular"&&s.sort((r,a)=>a.popularScore-r.popularScore),e==="review"&&s.sort((r,a)=>a.reviews-r.reviews),e==="priceAsc"&&s.sort((r,a)=>r.price-a.price),e==="priceDesc"&&s.sort((r,a)=>a.price-r.price),e==="newest"&&s.sort((r,a)=>new Date(a.releaseDate)-new Date(r.releaseDate)),s}function i(){const t=y();if(!t.length){n.productGrid.innerHTML='<p class="empty">검색 결과가 없습니다.</p>';return}n.productGrid.innerHTML=t.map(e=>{const s=Math.round((1-e.price/e.originalPrice)*100);return`
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
        </a>`}).join("")}function S(){n.searchInput.addEventListener("input",i),n.sortSelect.addEventListener("change",i)}async function L(){try{c.products=await u(),await w(),i(),S()}catch(t){console.error(t),n.productGrid.innerHTML='<p class="empty">상품 데이터를 불러오지 못했습니다.</p>'}}L();
