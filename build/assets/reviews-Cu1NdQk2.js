import{m,a as g,g as v,s as f}from"./footer-5xJtchcy.js";import{f as h,c as P}from"./api-lDZN3vsg.js";import{c as w,r as b}from"./cart-service-C6sXeXRB.js";const $=m({showCart:!0,currentNav:"review"});g();const c=12,t={products:[],reviews:[],currentPage:1},s={productFilter:document.getElementById("reviewProductFilter"),sortSelect:document.getElementById("reviewSortSelect"),reviewGrid:document.getElementById("reviewGrid"),pagination:document.getElementById("reviewPagination")};function y(){const e=v();f($,{userName:e?.name||null,cartCountValue:w()})}function I(e,r){if(e.image)return e.image;const a=t.products.find(i=>i.id===e.productId);return!a||r%3===0?"/dist/img/reviews/empty_review.svg":b(a.image)||"/dist/img/reviews/empty_review.svg"}function E(){const e=s.productFilter.value,r=s.sortSelect.value;let a=[...t.reviews];return e!=="all"&&(a=a.filter(i=>i.productId===Number(e))),r==="latest"&&a.sort((i,n)=>Number(n.date.replaceAll(".",""))-Number(i.date.replaceAll(".",""))),r==="helpful"&&a.sort((i,n)=>n.helpful-i.helpful),r==="score"&&a.sort((i,n)=>n.score-i.score),a}function o(){const e=E(),r=Math.max(1,Math.ceil(e.length/c));t.currentPage=Math.min(r,Math.max(1,t.currentPage));const a=(t.currentPage-1)*c,i=e.slice(a,a+c);if(!i.length){s.reviewGrid.innerHTML='<p class="empty">리뷰가 없습니다.</p>',s.pagination.innerHTML="";return}s.reviewGrid.innerHTML=i.map((n,d)=>{const u=t.products.find(p=>p.id===n.productId),l=I(n,d+a);return`
        <a class="review-card" href="/pages/detail.html?id=${n.productId}">
          <div class="review-thumb">
            <img src="${l}" alt="리뷰 이미지" />
          </div>
          <div class="review-body">
            <p class="review-product">${u?.name||"상품"}</p>
            <p class="review-text">${n.text}</p>
            <div class="review-meta">
              <span>${n.user} · ${n.date}</span>
              <b>${"★".repeat(n.score)}${"☆".repeat(5-n.score)}</b>
            </div>
          </div>
        </a>`}).join(""),s.pagination.innerHTML=`
    <button class="ghost" data-action="prev" ${t.currentPage<=1?"disabled":""}>이전</button>
    <span>${t.currentPage} / ${r}</span>
    <button class="ghost" data-action="next" ${t.currentPage>=r?"disabled":""}>다음</button>
  `}function M(){s.productFilter.innerHTML=`
    <option value="all">전체 상품</option>
    ${t.products.map(e=>`<option value="${e.id}">${e.name}</option>`).join("")}
  `}function F(){s.productFilter.addEventListener("change",()=>{t.currentPage=1,o()}),s.sortSelect.addEventListener("change",()=>{t.currentPage=1,o()}),s.pagination.addEventListener("click",e=>{const r=e.target.closest("[data-action]");r&&(r.dataset.action==="prev"&&(t.currentPage-=1),r.dataset.action==="next"&&(t.currentPage+=1),o())})}async function H(){const[e,r]=await Promise.all([h(),P()]);t.products=e,t.reviews=r,y(),M(),o(),F()}H();
