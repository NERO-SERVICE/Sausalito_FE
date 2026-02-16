import{m as $,a as x,g as I,s as P}from"./footer-45QzvbMW.js";import{d as q,e as M,g as S}from"./api-0RWHKEw6.js";import{a as h,c as R,f as p,r as E}from"./cart-service-BkS5W-VD.js";const u=Number(new URLSearchParams(location.search).get("id")),t={product:null,meta:null,reviews:[],imageIndex:0,quantity:1,reviewPage:1,activeSection:"section-detail",open:{shipping:!1,inquiry:!1}},k=$({showCart:!0,currentNav:"shop"});x();const b={root:document.getElementById("detailRoot")};let c=null;const g=10;let r=null,d=!1;function L(){window.matchMedia("(min-width: 821px)").matches||(window.addEventListener("touchstart",e=>{window.scrollY>0||(r=e.touches[0].clientY,d=!1)},{passive:!0}),window.addEventListener("touchmove",e=>{if(r===null||d||window.scrollY>0)return;e.touches[0].clientY-r>90&&(d=!0,history.length>1?history.back():location.href="/pages/home.html")},{passive:!0}),window.addEventListener("touchend",()=>{r=null,d=!1},{passive:!0}))}function f(){const e=I();P(k,{userName:e?.name||null,cartCountValue:R()})}function T(){const e=E(t.product.image),a=t.meta.detailImages||[];return[...new Set([e,...a].filter(Boolean))]}function C(){const e=Math.max(1,Math.ceil(t.reviews.length/g));t.reviewPage=Math.min(e,Math.max(1,t.reviewPage));const a=(t.reviewPage-1)*g;return{totalPages:e,list:t.reviews.slice(a,a+g)}}function Y(e){t.activeSection=e,document.querySelectorAll(".pd-tab").forEach(a=>{a.classList.toggle("active",a.dataset.target===e)})}function B(){c&&c.disconnect();const e=[...document.querySelectorAll(".pd-section")];c=new IntersectionObserver(a=>{const i=a.filter(n=>n.isIntersecting).sort((n,l)=>l.intersectionRatio-n.intersectionRatio)[0];i?.target?.id&&Y(i.target.id)},{threshold:[.3,.6],rootMargin:"-20% 0px -45% 0px"}),e.forEach(a=>c.observe(a))}function w(){if(!t.product){b.root.innerHTML='<p class="empty">상품을 찾을 수 없습니다.</p>';return}const e=T();t.imageIndex=Math.min(e.length-1,Math.max(0,t.imageIndex));const a=e[t.imageIndex],n=(t.meta.options&&t.meta.options[0]||{price:t.product.price}).price*t.quantity,l=Math.round((1-t.product.price/t.product.originalPrice)*100),y=t.reviews.length?(t.reviews.reduce((o,s)=>o+s.score,0)/t.reviews.length).toFixed(1):t.product.rating.toFixed(1),{list:v,totalPages:m}=C();b.root.innerHTML=`
    <section class="pd-top">
      <div class="pd-media">
        <div class="pd-media-stage">
          <img src="${a}" alt="${t.product.name}" />
          <button class="pd-gallery-nav prev" data-action="prevImage">‹</button>
          <button class="pd-gallery-nav next" data-action="nextImage">›</button>
        </div>
        <div class="pd-gallery-thumbs">
          ${e.map((o,s)=>`<button class="pd-gallery-thumb ${s===t.imageIndex?"active":""}" data-action="selectImage" data-index="${s}"><img src="${o}" alt="thumb"/></button>`).join("")}
        </div>
      </div>
      <div class="pd-info">
        <p class="pd-eyebrow">${t.product.badges?.join(" · ")||"추천"}</p>
        <h2>${t.product.name}</h2>
        <p class="pd-one-line">${t.product.oneLine||t.product.description}</p>
        <div class="pd-rating">★ ${y} (${t.product.reviews})</div>
        <div class="pd-price"><small>${p(t.product.originalPrice)}</small><div><span>${l}%</span><strong>${p(t.product.price)}</strong></div></div>

        <div class="pd-qty-row"><h4>수량</h4><div class="qty-controls"><button data-action="decreaseQty">-</button><span>${t.quantity}</span><button data-action="increaseQty">+</button></div></div>
        <div class="pd-total-box"><p class="final">총 결제예상금액 <strong>${p(n)}</strong></p></div>
      </div>
    </section>

    <section class="pd-tabs">
      <div class="pd-tab-head">
        <button class="pd-tab ${t.activeSection==="section-detail"?"active":""}" data-action="scrollTab" data-target="section-detail">상세정보</button>
        <button class="pd-tab ${t.activeSection==="section-review"?"active":""}" data-action="scrollTab" data-target="section-review">리뷰</button>
      </div>
      <section class="pd-section-card pd-section" id="section-detail">
        <h3 class="pd-section-label">상세정보</h3>
        <h4>제품 설명</h4><p>${t.product.description}</p>
        <h4>핵심 성분</h4><ul>${t.product.ingredients.map(o=>`<li>${o}</li>`).join("")}</ul>
        <h4>섭취 방법</h4><p>${t.product.intake}</p>
        <div class="pd-accordion">
          <button class="pd-accordion-head" data-action="toggleOpen" data-key="shipping">배송/교환 <span>${t.open.shipping?"−":"+"}</span></button>
          <div class="pd-accordion-body ${t.open.shipping?"open":""}"><p>출고 1~2일, 수령 2~3일 소요됩니다.</p></div>
        </div>
        <div class="pd-accordion">
          <button class="pd-accordion-head" data-action="toggleOpen" data-key="inquiry">상품문의 <span>${t.open.inquiry?"−":"+"}</span></button>
          <div class="pd-accordion-body ${t.open.inquiry?"open":""}"><p>평일 10:00~18:00, 고객센터를 이용해주세요.</p></div>
        </div>
      </section>
      <section class="pd-section-card pd-section" id="section-review">
        <h3 class="pd-section-label">리뷰</h3>
        ${v.length?v.map(o=>`<article class="pd-review-item"><div><strong>${"★".repeat(o.score)}${"☆".repeat(5-o.score)}</strong><span>${o.user} · ${o.date}</span></div><p>${o.text}</p></article>`).join(""):"<p>리뷰가 없습니다.</p>"}
        <div class="pd-review-pagination">
          <button class="ghost" data-action="prevReview" ${t.reviewPage<=1?"disabled":""}>이전</button>
          <span>${t.reviewPage} / ${m}</span>
          <button class="ghost" data-action="nextReview" ${t.reviewPage>=m?"disabled":""}>다음</button>
        </div>
      </section>
    </section>

    <div class="pd-floating-cta">
      <button class="ghost" data-action="toggleWish">찜하기</button>
      <button class="ghost" data-action="addCart">장바구니담기</button>
      <button class="primary" data-action="buyNow">바로구매</button>
    </div>
  `,B()}document.addEventListener("click",e=>{const a=e.target.closest("[data-action]");if(!a)return;const i=a.dataset.action;if(i==="prevImage"&&(t.imageIndex-=1),i==="nextImage"&&(t.imageIndex+=1),i==="selectImage"&&(t.imageIndex=Number(a.dataset.index)),i==="increaseQty"&&(t.quantity=Math.min(99,t.quantity+1)),i==="decreaseQty"&&(t.quantity=Math.max(1,t.quantity-1)),i==="scrollTab"){const n=document.getElementById(a.dataset.target);n&&n.scrollIntoView({behavior:"smooth",block:"start"}),t.activeSection=a.dataset.target}if(i==="toggleOpen"){const n=a.dataset.key;t.open[n]=!t.open[n]}i==="prevReview"&&(t.reviewPage=Math.max(1,t.reviewPage-1)),i==="nextReview"&&(t.reviewPage+=1),i==="addCart"&&(h(t.product.id,t.quantity),alert("장바구니에 담았습니다."),f()),i==="buyNow"&&(h(t.product.id,t.quantity),location.href="/pages/cart.html"),i==="toggleWish"&&alert("찜 API 연동 예정입니다."),w()});async function N(){t.product=await q(u),t.meta=await M(u),t.reviews=await S(u),L(),f(),w()}N();
