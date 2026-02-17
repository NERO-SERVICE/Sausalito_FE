import{m as p,a as m,f as g,e as f,s as v,g as h,d as P}from"./footer-DLgmIPmE.js";import{c as b}from"./cart-service-LKHAjlVQ.js";import{a as w}from"./store-data-Deux6dsM.js";const y=p({showCart:!0,currentNav:"review"});m();const c=12,r={products:[],reviews:[],currentPage:1},i={productFilter:document.getElementById("reviewProductFilter"),sortSelect:document.getElementById("reviewSortSelect"),reviewGrid:document.getElementById("reviewGrid"),pagination:document.getElementById("reviewPagination")};async function $(){const e=await v()||h();let t=0;try{t=await b()}catch{t=0}P(y,{userName:e?.name||e?.email||null,isAdmin:!!(e?.is_staff??e?.isStaff),cartCountValue:t})}function I(e){if(Array.isArray(e.images)&&e.images[0])return e.images[0];if(e.image)return e.image;const t=r.products.find(n=>n.id===e.productId);return w(t?.image)}function M(){const e=i.productFilter.value,t=i.sortSelect.value;let n=[...r.reviews];return e!=="all"&&(n=n.filter(s=>s.productId===Number(e))),t==="latest"&&n.sort((s,a)=>Number(a.date.replaceAll(".",""))-Number(s.date.replaceAll(".",""))),t==="helpful"&&n.sort((s,a)=>a.helpful-s.helpful),t==="score"&&n.sort((s,a)=>a.score-s.score),n}function o(){const e=M(),t=Math.max(1,Math.ceil(e.length/c));r.currentPage=Math.min(t,Math.max(1,r.currentPage));const n=(r.currentPage-1)*c,s=e.slice(n,n+c);if(!s.length){i.reviewGrid.innerHTML='<p class="empty">리뷰가 없습니다.</p>',i.pagination.innerHTML="";return}i.reviewGrid.innerHTML=s.map(a=>{const d=r.products.find(l=>l.id===a.productId),u=`<img src="${I(a)}" alt="리뷰 이미지" />`;return`
        <a class="review-card" href="/pages/detail.html?id=${a.productId}">
          <div class="review-thumb">
            ${u}
          </div>
          <div class="review-body">
            <p class="review-product">${d?.name||"상품"}</p>
            <p class="review-text">${a.text}</p>
            <div class="review-meta">
              <span>${a.user} · ${a.date}</span>
              <b>${"★".repeat(a.score)}${"☆".repeat(5-a.score)}</b>
            </div>
          </div>
        </a>`}).join(""),i.pagination.innerHTML=`
    <button class="ghost" data-action="prev" ${r.currentPage<=1?"disabled":""}>이전</button>
    <span>${r.currentPage} / ${t}</span>
    <button class="ghost" data-action="next" ${r.currentPage>=t?"disabled":""}>다음</button>
  `}function E(){i.productFilter.innerHTML=`
    <option value="all">전체 상품</option>
    ${r.products.map(e=>`<option value="${e.id}">${e.name}</option>`).join("")}
  `}function H(){i.productFilter.addEventListener("change",()=>{r.currentPage=1,o()}),i.sortSelect.addEventListener("change",()=>{r.currentPage=1,o()}),i.pagination.addEventListener("click",e=>{const t=e.target.closest("[data-action]");t&&(t.dataset.action==="prev"&&(r.currentPage-=1),t.dataset.action==="next"&&(r.currentPage+=1),o())})}async function L(){try{const[e,t]=await Promise.all([g(),f()]);r.products=e,r.reviews=t,await $(),E(),o(),H()}catch(e){console.error(e),i.reviewGrid.innerHTML='<p class="empty">리뷰 데이터를 불러오지 못했습니다.</p>'}}L();
