import{m as M,a as q,s as k,g as R,d as S,i as A,j as L,k as E}from"./footer-CuxST7fX.js";import{a as y,c as C}from"./cart-service-BQgjICxU.js";import{a as v,f as p}from"./store-data-Deux6dsM.js";const u=Number(new URLSearchParams(location.search).get("id")),t={product:null,meta:null,reviews:[],imageIndex:0,quantity:1,reviewPage:1,activeSection:"section-detail",open:{shipping:!1,inquiry:!1},policyOpen:!1},T=M({showCart:!0,currentNav:"shop"});q();const m={root:document.getElementById("detailRoot")};let r=null;const g=10;let d=null,l=!1;function N(){window.matchMedia("(min-width: 821px)").matches||(window.addEventListener("touchstart",a=>{window.scrollY>0||(d=a.touches[0].clientY,l=!1)},{passive:!0}),window.addEventListener("touchmove",a=>{if(d===null||l||window.scrollY>0)return;a.touches[0].clientY-d>90&&(l=!0,history.length>1?history.back():location.href="/pages/home.html")},{passive:!0}),window.addEventListener("touchend",()=>{d=null,l=!1},{passive:!0}))}async function f(){const a=await k()||R();let e=0;try{e=await C()}catch{e=0}S(T,{userName:a?.name||null,cartCountValue:e})}function O(){const a=v(t.product.image,{useFallback:!1}),e=Array.isArray(t.product.images)?t.product.images:[],s=Array.isArray(t.meta?.detailImages)?t.meta.detailImages:[],i=[...new Set([a,...e,...s].filter(c=>typeof c=="string"&&c.trim()))];return i.length?i:[v(null)]}function Y(){const a=Math.max(1,Math.ceil(t.reviews.length/g));t.reviewPage=Math.min(a,Math.max(1,t.reviewPage));const e=(t.reviewPage-1)*g;return{totalPages:a,list:t.reviews.slice(e,e+g)}}function j(a){t.activeSection=a,document.querySelectorAll(".pd-tab").forEach(e=>{e.classList.toggle("active",e.dataset.target===a)})}function H(){r&&r.disconnect();const a=[...document.querySelectorAll(".pd-section")];r=new IntersectionObserver(e=>{const s=e.filter(i=>i.isIntersecting).sort((i,c)=>c.intersectionRatio-i.intersectionRatio)[0];s?.target?.id&&j(s.target.id)},{threshold:[.3,.6],rootMargin:"-20% 0px -45% 0px"}),a.forEach(e=>r.observe(e))}function w(){if(!t.product){m.root.innerHTML='<p class="empty">상품을 찾을 수 없습니다.</p>';return}const a=O(),e=a.length>1;t.imageIndex=Math.min(a.length-1,Math.max(0,t.imageIndex));const s=a[t.imageIndex]||v(null),c=(t.meta.options&&t.meta.options[0]||{price:t.product.price}).price*t.quantity,$=Math.round((1-t.product.price/t.product.originalPrice)*100),P=t.reviews.length?(t.reviews.reduce((o,n)=>o+n.score,0)/t.reviews.length).toFixed(1):Number(t.product.rating||0).toFixed(1),{list:h,totalPages:b}=Y();m.root.innerHTML=`
    <section class="pd-top">
      <div class="pd-media">
        <div class="pd-media-stage">
          <img src="${s}" alt="${t.product.name}" />
          ${e?`<button class="pd-gallery-nav prev" data-action="prevImage">‹</button>
          <button class="pd-gallery-nav next" data-action="nextImage">›</button>`:""}
        </div>
        ${e?`<div class="pd-gallery-thumbs" style="--pd-thumb-columns: ${Math.min(a.length,4)};">
          ${a.map((o,n)=>`<button class="pd-gallery-thumb ${n===t.imageIndex?"active":""}" data-action="selectImage" data-index="${n}"><img src="${o}" alt="thumb"/></button>`).join("")}
        </div>`:""}
      </div>
      <div class="pd-info">
        <p class="pd-eyebrow">${t.product.badges?.join(" · ")||"추천"}</p>
        <h2>${t.product.name}</h2>
        <p class="pd-one-line">${t.product.oneLine||t.product.description}</p>
        <div class="pd-rating">★ ${P} (${t.product.reviews})</div>
        <div class="pd-price"><small>${p(t.product.originalPrice)}</small><div><span>${$}%</span><strong>${p(t.product.price)}</strong></div></div>

        <div class="pd-qty-row"><h4>수량</h4><div class="qty-controls"><button data-action="decreaseQty">-</button><span>${t.quantity}</span><button data-action="increaseQty">+</button></div></div>
        <div class="pd-total-box"><p class="final">총 결제예상금액 <strong>${p(c)}</strong></p></div>
        <div class="pd-static-cta">
          <button class="ghost" data-action="toggleWish">찜하기</button>
          <button class="ghost" data-action="addCart">장바구니담기</button>
          <button class="primary" data-action="buyNow">바로구매</button>
        </div>
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
        <div class="pd-review-links">
          <button class="text-btn pd-policy-link" data-action="openPolicy">운영정책</button>
          <a class="text-btn pd-write-link" href="/pages/review-write.html?productId=${t.product.id}">리뷰작성</a>
        </div>
        ${h.length?h.map(o=>{const n=Array.isArray(o.images)&&o.images.length?o.images.slice(0,3):o.image?[o.image]:[];return`<article class="pd-review-item">
                      <div class="pd-review-head"><strong class="pd-review-stars">${"★".repeat(o.score)}${"☆".repeat(5-o.score)}</strong><span>${o.user} · ${o.date}</span></div>
                      <p>${o.text}</p>
                      ${n.length?`<div class="pd-review-thumb-grid">
                              ${n.map((x,I)=>`<img class="pd-review-thumb" src="${x}" alt="리뷰 이미지 ${I+1}" />`).join("")}
                            </div>`:""}
                    </article>`}).join(""):"<p>리뷰가 없습니다.</p>"}
        <div class="pd-review-pagination">
          <button class="ghost" data-action="prevReview" ${t.reviewPage<=1?"disabled":""}>이전</button>
          <span>${t.reviewPage} / ${b}</span>
          <button class="ghost" data-action="nextReview" ${t.reviewPage>=b?"disabled":""}>다음</button>
        </div>
      </section>
    </section>

    <div class="pd-policy-modal ${t.policyOpen?"open":""}">
      <div class="pd-policy-backdrop" data-action="closePolicy"></div>
      <section class="pd-policy-dialog" role="dialog" aria-modal="true" aria-label="리뷰 운영정책">
        <h4>리뷰 운영정책</h4>
        <ul>
          <li>타인을 비방하거나 허위 사실이 포함된 리뷰는 비노출 처리될 수 있습니다.</li>
          <li>개인정보, 연락처, URL 등 부적절한 정보가 포함된 리뷰는 삭제될 수 있습니다.</li>
          <li>상품과 무관한 내용, 반복/도배성 게시물은 운영정책에 따라 제한됩니다.</li>
        </ul>
        <button class="primary" data-action="closePolicy">확인</button>
      </section>
    </div>

    <div class="pd-floating-cta">
      <button class="ghost" data-action="toggleWish">찜하기</button>
      <button class="ghost" data-action="addCart">장바구니담기</button>
      <button class="primary" data-action="buyNow">바로구매</button>
    </div>
  `,H()}document.addEventListener("click",async a=>{const e=a.target.closest("[data-action]");if(!e)return;const s=e.dataset.action;if(s==="prevImage"&&(t.imageIndex-=1),s==="nextImage"&&(t.imageIndex+=1),s==="selectImage"&&(t.imageIndex=Number(e.dataset.index)),s==="increaseQty"&&(t.quantity=Math.min(99,t.quantity+1)),s==="decreaseQty"&&(t.quantity=Math.max(1,t.quantity-1)),s==="scrollTab"){const i=document.getElementById(e.dataset.target);i&&i.scrollIntoView({behavior:"smooth",block:"start"}),t.activeSection=e.dataset.target}if(s==="toggleOpen"){const i=e.dataset.key;t.open[i]=!t.open[i]}if(s==="prevReview"&&(t.reviewPage=Math.max(1,t.reviewPage-1)),s==="nextReview"&&(t.reviewPage+=1),s==="openPolicy"&&(t.policyOpen=!0),s==="closePolicy"&&(t.policyOpen=!1),s==="addCart")try{await y(t.product.id,t.quantity),alert("장바구니에 담았습니다."),await f()}catch(i){if(console.error(i),alert(i.message||"장바구니 담기에 실패했습니다."),i.status===401||i.message.includes("로그인")){location.href="/pages/login.html";return}}if(s==="buyNow")try{await y(t.product.id,t.quantity),location.href="/pages/cart.html";return}catch(i){if(console.error(i),alert(i.message||"장바구니 담기에 실패했습니다."),i.status===401||i.message.includes("로그인")){location.href="/pages/login.html";return}}s==="toggleWish"&&alert("찜 API 연동 예정입니다."),w()});async function B(){try{t.product=await A(u),t.meta=await L(u),t.reviews=await E(u),N(),await f(),w()}catch(a){console.error(a),m.root.innerHTML='<p class="empty">상품 데이터를 불러오지 못했습니다.</p>'}}B();
