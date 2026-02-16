import{m as f,g as w,s as $}from"./header-Bv8tAKev.js";import{d as x,e as I,g as P}from"./api-C4vJdtqo.js";import{a as v,c as q,f as r,r as M}from"./cart-service-BM7B5bfh.js";const p=Number(new URLSearchParams(location.search).get("id")),t={product:null,meta:null,reviews:[],imageIndex:0,quantity:1,reviewPage:1,activeSection:"section-detail",open:{shipping:!1,inquiry:!1}},R=f({showCart:!0,currentNav:"shop"}),m={root:document.getElementById("detailRoot")};let c=null;const l=10;function b(){const a=w();$(R,{userName:a?.name||null,cartCountValue:q()})}function S(){const a=M(t.product.image),e=t.meta.detailImages||[];return[...new Set([a,...e].filter(Boolean))]}function k(){const a=Math.max(1,Math.ceil(t.reviews.length/l));t.reviewPage=Math.min(a,Math.max(1,t.reviewPage));const e=(t.reviewPage-1)*l;return{totalPages:a,list:t.reviews.slice(e,e+l)}}function C(a){t.activeSection=a,document.querySelectorAll(".pd-tab").forEach(e=>{e.classList.toggle("active",e.dataset.target===a)})}function E(){c&&c.disconnect();const a=[...document.querySelectorAll(".pd-section")];c=new IntersectionObserver(e=>{const i=e.filter(n=>n.isIntersecting).sort((n,d)=>d.intersectionRatio-n.intersectionRatio)[0];i?.target?.id&&C(i.target.id)},{threshold:[.3,.6],rootMargin:"-20% 0px -45% 0px"}),a.forEach(e=>c.observe(e))}function h(){if(!t.product){m.root.innerHTML='<p class="empty">상품을 찾을 수 없습니다.</p>';return}const a=S();t.imageIndex=Math.min(a.length-1,Math.max(0,t.imageIndex));const e=a[t.imageIndex],n=(t.meta.options&&t.meta.options[0]||{price:t.product.price}).price*t.quantity,d=Math.round((1-t.product.price/t.product.originalPrice)*100),y=t.reviews.length?(t.reviews.reduce((o,s)=>o+s.score,0)/t.reviews.length).toFixed(1):t.product.rating.toFixed(1),{list:u,totalPages:g}=k();m.root.innerHTML=`
    <section class="pd-top">
      <div class="pd-media">
        <div class="pd-media-stage">
          <img src="${e}" alt="${t.product.name}" />
          <button class="pd-gallery-nav prev" data-action="prevImage">‹</button>
          <button class="pd-gallery-nav next" data-action="nextImage">›</button>
        </div>
        <div class="pd-gallery-thumbs">
          ${a.map((o,s)=>`<button class="pd-gallery-thumb ${s===t.imageIndex?"active":""}" data-action="selectImage" data-index="${s}"><img src="${o}" alt="thumb"/></button>`).join("")}
        </div>
      </div>
      <div class="pd-info">
        <p class="pd-eyebrow">${t.product.badges?.join(" · ")||"추천"}</p>
        <h2>${t.product.name}</h2>
        <p class="pd-one-line">${t.product.oneLine||t.product.description}</p>
        <div class="pd-rating">★ ${y} (${t.product.reviews})</div>
        <div class="pd-price"><small>${r(t.product.originalPrice)}</small><div><span>${d}%</span><strong>${r(t.product.price)}</strong></div></div>

        <div class="pd-qty-row"><h4>수량</h4><div class="qty-controls"><button data-action="decreaseQty">-</button><span>${t.quantity}</span><button data-action="increaseQty">+</button></div></div>
        <div class="pd-total-box"><p class="final">총 결제예상금액 <strong>${r(n)}</strong></p></div>
      </div>
    </section>

    <section class="pd-tabs">
      <div class="pd-tab-head">
        <button class="pd-tab ${t.activeSection==="section-detail"?"active":""}" data-action="scrollTab" data-target="section-detail">상세정보</button>
        <button class="pd-tab ${t.activeSection==="section-review"?"active":""}" data-action="scrollTab" data-target="section-review">리뷰</button>
      </div>
      <div class="pd-tab-panel active pd-section" id="section-detail">
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
      </div>
      <div class="pd-tab-panel active pd-section" id="section-review">
        ${u.length?u.map(o=>`<article class="pd-review-item"><div><strong>${"★".repeat(o.score)}${"☆".repeat(5-o.score)}</strong><span>${o.user} · ${o.date}</span></div><p>${o.text}</p></article>`).join(""):"<p>리뷰가 없습니다.</p>"}
        <div class="pd-review-pagination">
          <button class="ghost" data-action="prevReview" ${t.reviewPage<=1?"disabled":""}>이전</button>
          <span>${t.reviewPage} / ${g}</span>
          <button class="ghost" data-action="nextReview" ${t.reviewPage>=g?"disabled":""}>다음</button>
        </div>
      </div>
    </section>

    <div class="pd-floating-cta">
      <button class="ghost" data-action="toggleWish">찜하기</button>
      <button class="ghost" data-action="addCart">장바구니담기</button>
      <button class="primary" data-action="buyNow">바로구매</button>
    </div>
  `,E()}document.addEventListener("click",a=>{const e=a.target.closest("[data-action]");if(!e)return;const i=e.dataset.action;if(i==="prevImage"&&(t.imageIndex-=1),i==="nextImage"&&(t.imageIndex+=1),i==="selectImage"&&(t.imageIndex=Number(e.dataset.index)),i==="increaseQty"&&(t.quantity=Math.min(99,t.quantity+1)),i==="decreaseQty"&&(t.quantity=Math.max(1,t.quantity-1)),i==="scrollTab"){const n=document.getElementById(e.dataset.target);n&&n.scrollIntoView({behavior:"smooth",block:"start"}),t.activeSection=e.dataset.target}if(i==="toggleOpen"){const n=e.dataset.key;t.open[n]=!t.open[n]}i==="prevReview"&&(t.reviewPage=Math.max(1,t.reviewPage-1)),i==="nextReview"&&(t.reviewPage+=1),i==="addCart"&&(v(t.product.id,t.quantity),alert("장바구니에 담았습니다."),b()),i==="buyNow"&&(v(t.product.id,t.quantity),location.href="/pages/cart.html"),i==="toggleWish"&&alert("찜 API 연동 예정입니다."),h()});async function T(){t.product=await x(p),t.meta=await I(p),t.reviews=await P(p),b(),h()}T();
