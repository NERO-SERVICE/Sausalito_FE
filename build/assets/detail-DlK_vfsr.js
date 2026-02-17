import{m as k,a as R,s as v,g as w,r as S,i as L,d as A,j as E,k as C,l as T,t as N,n as O}from"./footer-CGVTRZKF.js";import{a as f,c as Y}from"./cart-service-CmqApfUf.js";import{a as m,f as u}from"./store-data-Deux6dsM.js";const c=Number(new URLSearchParams(location.search).get("id")),t={product:null,meta:null,reviews:[],imageIndex:0,quantity:1,reviewPage:1,activeSection:"section-detail",open:{shipping:!1,inquiry:!1},policyOpen:!1,wished:!1},j=k({showCart:!0,currentNav:"shop"});R();const h={root:document.getElementById("detailRoot")};let d=null;const g=10;let l=null,p=!1;function H(){window.matchMedia("(min-width: 821px)").matches||(window.addEventListener("touchstart",a=>{window.scrollY>0||(l=a.touches[0].clientY,p=!1)},{passive:!0}),window.addEventListener("touchmove",a=>{if(l===null||p||window.scrollY>0)return;a.touches[0].clientY-l>90&&(p=!0,history.length>1?history.back():location.href="/pages/home.html")},{passive:!0}),window.addEventListener("touchend",()=>{l=null,p=!1},{passive:!0}))}async function $(){const a=await v()||w();let e=0;try{e=await Y()}catch{e=0}A(j,{userName:a?.name||a?.email||null,cartCountValue:e})}function U(){const a=m(t.product.image,{useFallback:!1}),e=Array.isArray(t.product.images)?t.product.images:[],i=Array.isArray(t.meta?.detailImages)?t.meta.detailImages:[],s=[...new Set([a,...e,...i].filter(n=>typeof n=="string"&&n.trim()))];return s.length?s:[m(null)]}function W(){const a=Math.max(1,Math.ceil(t.reviews.length/g));t.reviewPage=Math.min(a,Math.max(1,t.reviewPage));const e=(t.reviewPage-1)*g;return{totalPages:a,list:t.reviews.slice(e,e+g)}}function B(a){t.activeSection=a,document.querySelectorAll(".pd-tab").forEach(e=>{e.classList.toggle("active",e.dataset.target===a)})}function F(){d&&d.disconnect();const a=[...document.querySelectorAll(".pd-section")];d=new IntersectionObserver(e=>{const i=e.filter(s=>s.isIntersecting).sort((s,n)=>n.intersectionRatio-s.intersectionRatio)[0];i?.target?.id&&B(i.target.id)},{threshold:[.3,.6],rootMargin:"-20% 0px -45% 0px"}),a.forEach(e=>d.observe(e))}function I(){if(!t.product){h.root.innerHTML='<p class="empty">상품을 찾을 수 없습니다.</p>';return}const a=U(),e=a.length>1;t.imageIndex=Math.min(a.length-1,Math.max(0,t.imageIndex));const i=a[t.imageIndex]||m(null),n=(t.meta.options&&t.meta.options[0]||{price:t.product.price}).price*t.quantity,P=Math.round((1-t.product.price/t.product.originalPrice)*100),x=t.reviews.length?(t.reviews.reduce((o,r)=>o+r.score,0)/t.reviews.length).toFixed(1):Number(t.product.rating||0).toFixed(1),{list:b,totalPages:y}=W();h.root.innerHTML=`
    <section class="pd-top">
      <div class="pd-media">
        <div class="pd-media-stage">
          <img src="${i}" alt="${t.product.name}" />
          ${e?`<button class="pd-gallery-nav prev" data-action="prevImage">‹</button>
          <button class="pd-gallery-nav next" data-action="nextImage">›</button>`:""}
        </div>
        ${e?`<div class="pd-gallery-thumbs" style="--pd-thumb-columns: ${Math.min(a.length,4)};">
          ${a.map((o,r)=>`<button class="pd-gallery-thumb ${r===t.imageIndex?"active":""}" data-action="selectImage" data-index="${r}"><img src="${o}" alt="thumb"/></button>`).join("")}
        </div>`:""}
      </div>
      <div class="pd-info">
        <p class="pd-eyebrow">${t.product.badges?.join(" · ")||"추천"}</p>
        <h2>${t.product.name}</h2>
        <p class="pd-one-line">${t.product.oneLine||t.product.description}</p>
        <div class="pd-rating">★ ${x} (${t.product.reviews})</div>
        <div class="pd-price"><small>${u(t.product.originalPrice)}</small><div><span>${P}%</span><strong>${u(t.product.price)}</strong></div></div>

        <div class="pd-qty-row"><h4>수량</h4><div class="qty-controls"><button data-action="decreaseQty">-</button><span>${t.quantity}</span><button data-action="increaseQty">+</button></div></div>
        <div class="pd-total-box"><p class="final">총 결제예상금액 <strong>${u(n)}</strong></p></div>
        <div class="pd-static-cta">
          <button class="ghost" data-action="toggleWish">${t.wished?"찜 해제":"찜하기"}</button>
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
        ${b.length?b.map(o=>{const r=Array.isArray(o.images)&&o.images.length?o.images.slice(0,3):o.image?[o.image]:[];return`<article class="pd-review-item">
                      <div class="pd-review-head"><strong class="pd-review-stars">${"★".repeat(o.score)}${"☆".repeat(5-o.score)}</strong><span>${o.user} · ${o.date}</span></div>
                      <p>${o.text}</p>
                      ${r.length?`<div class="pd-review-thumb-grid">
                              ${r.map((M,q)=>`<img class="pd-review-thumb" src="${M}" alt="리뷰 이미지 ${q+1}" />`).join("")}
                            </div>`:""}
                    </article>`}).join(""):"<p>리뷰가 없습니다.</p>"}
        <div class="pd-review-pagination">
          <button class="ghost" data-action="prevReview" ${t.reviewPage<=1?"disabled":""}>이전</button>
          <span>${t.reviewPage} / ${y}</span>
          <button class="ghost" data-action="nextReview" ${t.reviewPage>=y?"disabled":""}>다음</button>
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
      <button class="ghost" data-action="toggleWish">${t.wished?"찜 해제":"찜하기"}</button>
      <button class="ghost" data-action="addCart">장바구니담기</button>
      <button class="primary" data-action="buyNow">바로구매</button>
    </div>
  `,F()}document.addEventListener("click",async a=>{const e=a.target.closest("[data-action]");if(!e)return;const i=e.dataset.action;if(i==="prevImage"&&(t.imageIndex-=1),i==="nextImage"&&(t.imageIndex+=1),i==="selectImage"&&(t.imageIndex=Number(e.dataset.index)),i==="increaseQty"&&(t.quantity=Math.min(99,t.quantity+1)),i==="decreaseQty"&&(t.quantity=Math.max(1,t.quantity-1)),i==="scrollTab"){const s=document.getElementById(e.dataset.target);s&&s.scrollIntoView({behavior:"smooth",block:"start"}),t.activeSection=e.dataset.target}if(i==="toggleOpen"){const s=e.dataset.key;t.open[s]=!t.open[s]}if(i==="prevReview"&&(t.reviewPage=Math.max(1,t.reviewPage-1)),i==="nextReview"&&(t.reviewPage+=1),i==="openPolicy"&&(t.policyOpen=!0),i==="closePolicy"&&(t.policyOpen=!1),i==="addCart")try{await f(t.product.id,t.quantity),alert("장바구니에 담았습니다."),await $()}catch(s){if(console.error(s),alert(s.message||"장바구니 담기에 실패했습니다."),s.status===401||s.message.includes("로그인")){location.href="/pages/login.html";return}}if(i==="buyNow")try{await f(t.product.id,t.quantity),location.href="/pages/cart.html";return}catch(s){if(console.error(s),alert(s.message||"장바구니 담기에 실패했습니다."),s.status===401||s.message.includes("로그인")){location.href="/pages/login.html";return}}if(i==="toggleWish"){if(!(await v()||w())){alert("로그인 후 이용 가능합니다."),location.href="/pages/login.html";return}try{t.wished?(await S(t.product.id),t.wished=!1,alert("위시리스트에서 제거했습니다.")):(await L(t.product.id),t.wished=!0,alert("위시리스트에 추가했습니다."))}catch(n){console.error(n),alert(n.message||"찜 처리에 실패했습니다.")}}I()});async function Q(){try{if(t.product=await E(c),t.meta=await C(c),t.reviews=await T(c),await v()||w()){try{await N(c)}catch(e){console.error(e)}try{const e=await O();t.wished=e.some(i=>i.id===c)}catch(e){console.error(e)}}else t.wished=!1;H(),await $(),I()}catch(a){console.error(a),h.root.innerHTML='<p class="empty">상품 데이터를 불러오지 못했습니다.</p>'}}Q();
