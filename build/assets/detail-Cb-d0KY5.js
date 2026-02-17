import{m as O,a as T,s as q,g as R,r as B,i as F,d as j,j as H,k as U,l as Y,t as W,n as Q}from"./footer-Bkz73-x2.js";import{a as N,c as V}from"./cart-service-gW37szOZ.js";import{a as k,f as d}from"./store-data-Deux6dsM.js";const h=Number(new URLSearchParams(location.search).get("id")),t={product:null,meta:null,reviews:[],imageIndex:0,quantity:1,reviewPage:1,activeSection:"section-detail",open:{shipping:!1,inquiry:!1},policyOpen:!1,wished:!1},_=O({showCart:!0,currentNav:"shop"});T();const M={root:document.getElementById("detailRoot")};let y=null;const I=10;let w=null,$=!1;function G(){window.matchMedia("(min-width: 821px)").matches||(window.addEventListener("touchstart",e=>{window.scrollY>0||(w=e.touches[0].clientY,$=!1)},{passive:!0}),window.addEventListener("touchmove",e=>{if(w===null||$||window.scrollY>0)return;e.touches[0].clientY-w>90&&($=!0,history.length>1?history.back():location.href="/pages/home.html")},{passive:!0}),window.addEventListener("touchend",()=>{w=null,$=!1},{passive:!0}))}async function S(){const e=await q()||R();let a=0;try{a=await V()}catch{a=0}j(_,{userName:e?.name||e?.email||null,isAdmin:!!(e?.is_staff??e?.isStaff),cartCountValue:a})}function b(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function L(e,a=1){return`${(Number.isFinite(Number(e))?Number(e):0).toFixed(a)}%`}function z(e){if(!e)return null;const a=new Date(e);if(Number.isNaN(a.getTime()))return null;const o=a.getTime()-Date.now();return Math.ceil(o/(1440*60*1e3))}function J(e,a){const o=t.product?.couponBenefit||null,i=Math.max(0,Number(e||0)),c=Math.max(1,Number(a||i||1));if(!o)return{isAuthenticated:!1,hasAvailableCoupon:!1,hasEligibleCoupon:!1,availableCouponCount:0,eligibleCouponCount:0,marketingCopy:"로그인하면 보유 쿠폰 기반 추가 할인 혜택을 확인할 수 있어요.",bestCoupon:null,couponItems:[],minRequiredAmount:0};const p=Array.isArray(o.couponItems)?o.couponItems.map(s=>{const r=Number(s.minOrderAmount||0),C=Number(s.discountAmount||0),g=i>=r,v=Math.max(r-i,0),n=g?Math.min(i,C):0,l=Math.max(i-n,0),A=i>0?n/i*100:0,P=(1-l/c)*100,f=z(s.expiresAt),D=f!==null&&f>=0&&f<=3;return{...s,isEligible:g,requiredAmount:v,appliedDiscountAmount:n,finalPrice:l,extraDiscountRate:Math.max(0,Number(A.toFixed(2))),finalDiscountRate:Math.max(0,Number(P.toFixed(2))),expiresSoon:D,daysLeft:f}}).sort((s,r)=>r.discountAmount-s.discountAmount):[],m=p.filter(s=>s.isEligible).sort((s,r)=>r.appliedDiscountAmount-s.appliedDiscountAmount||r.finalDiscountRate-s.finalDiscountRate),x=p.filter(s=>!s.isEligible).sort((s,r)=>s.requiredAmount-r.requiredAmount),u=m[0]||null;return{isAuthenticated:!!o.isAuthenticated,hasAvailableCoupon:!!p.length,hasEligibleCoupon:!!u,availableCouponCount:Number(o.availableCouponCount||p.length),eligibleCouponCount:Number(m.length),marketingCopy:o.marketingCopy||"",bestCoupon:u,couponItems:p.slice(0,4),minRequiredAmount:Number(x[0]?.requiredAmount||0)}}function K(e){if(!e.isAuthenticated)return`
      <section class="pd-coupon-panel is-locked">
        <p class="pd-coupon-kicker">회원 전용 혜택</p>
        <h4>내 쿠폰으로 추가 할인받기</h4>
        <p class="pd-coupon-copy">${b(e.marketingCopy)}</p>
        <button class="ghost pd-coupon-login-btn" data-action="loginForCoupon">로그인하고 혜택 확인</button>
      </section>
    `;if(!e.hasAvailableCoupon)return`
      <section class="pd-coupon-panel">
        <p class="pd-coupon-kicker">내 쿠폰 혜택</p>
        <h4>현재 사용 가능한 쿠폰이 없어요</h4>
        <p class="pd-coupon-copy">${b(e.marketingCopy||"신규회원/이벤트 쿠폰을 확인해보세요.")}</p>
      </section>
    `;const a=e.bestCoupon;return`
    <section class="pd-coupon-panel ${a?"is-available":"is-pending"}">
      <div class="pd-coupon-head">
        <div>
          <p class="pd-coupon-kicker">내 쿠폰 추가 할인</p>
          <h4>${a?"지금 결제 시 최대 추가 할인 가능":"조금만 더 담으면 쿠폰 할인이 가능해요"}</h4>
        </div>
        <span class="pd-coupon-count">보유 ${e.availableCouponCount}장</span>
      </div>
      ${a?`
            <p class="pd-coupon-final">
              쿠폰 적용 예상가
              <strong>${d(a.finalPrice)}</strong>
            </p>
            <p class="pd-coupon-copy">
              ${b(a.name)} 적용 시 ${d(a.appliedDiscountAmount)} 추가 할인
              (${L(a.extraDiscountRate)}), 정가 대비 총 할인율 ${L(a.finalDiscountRate)}
            </p>
          `:`
            <p class="pd-coupon-copy">
              현재 수량 기준 적용 가능한 쿠폰이 없습니다.
              ${d(e.minRequiredAmount)} 더 담으면 쿠폰 할인이 적용돼요.
            </p>
          `}
      <div class="pd-coupon-list">
        ${e.couponItems.map(o=>{const i=o.isEligible?"적용 가능":`${d(o.requiredAmount)} 추가 필요`,c=o.daysLeft===null?"":o.daysLeft<0?"만료":o.daysLeft===0?"오늘 만료":`${o.daysLeft}일 남음`;return`
              <article class="pd-coupon-item ${o.isEligible?"eligible":"ineligible"}">
                <div>
                  <p>${b(o.name)}</p>
                  <small>${b(o.code)} · ${d(o.discountAmount)} 할인</small>
                </div>
                <div class="pd-coupon-meta">
                  ${o.expiresSoon?'<span class="pd-coupon-chip is-urgent">곧 만료</span>':""}
                  ${c?`<span class="pd-coupon-chip">${c}</span>`:""}
                  <span class="pd-coupon-status">${i}</span>
                </div>
              </article>
            `}).join("")}
      </div>
    </section>
  `}function X(){const e=k(t.product.image,{useFallback:!1}),a=Array.isArray(t.product.images)?t.product.images:[],o=Array.isArray(t.meta?.detailImages)?t.meta.detailImages:[],i=[...new Set([e,...a,...o].filter(c=>typeof c=="string"&&c.trim()))];return i.length?i:[k(null)]}function Z(){const e=Math.max(1,Math.ceil(t.reviews.length/I));t.reviewPage=Math.min(e,Math.max(1,t.reviewPage));const a=(t.reviewPage-1)*I;return{totalPages:e,list:t.reviews.slice(a,a+I)}}function tt(e){t.activeSection=e,document.querySelectorAll(".pd-tab").forEach(a=>{a.classList.toggle("active",a.dataset.target===e)})}function et(){y&&y.disconnect();const e=[...document.querySelectorAll(".pd-section")];y=new IntersectionObserver(a=>{const o=a.filter(i=>i.isIntersecting).sort((i,c)=>c.intersectionRatio-i.intersectionRatio)[0];o?.target?.id&&tt(o.target.id)},{threshold:[.3,.6],rootMargin:"-20% 0px -45% 0px"}),e.forEach(a=>y.observe(a))}function E(){if(!t.product){M.root.innerHTML='<p class="empty">상품을 찾을 수 없습니다.</p>';return}const e=X(),a=e.length>1;t.imageIndex=Math.min(e.length-1,Math.max(0,t.imageIndex));const o=e[t.imageIndex]||k(null),i=t.meta.options&&t.meta.options[0]||{price:t.product.price},c=Number(i.price||t.product.price||0),p=Number(t.product.originalPrice||c||0),m=c*t.quantity,x=p*t.quantity,u=J(m,x),s=u.bestCoupon?u.bestCoupon.finalPrice:m,r=t.product.originalPrice>0?Math.max(0,Math.round((1-t.product.price/t.product.originalPrice)*100)):0,C=t.reviews.length?(t.reviews.reduce((n,l)=>n+l.score,0)/t.reviews.length).toFixed(1):Number(t.product.rating||0).toFixed(1),{list:g,totalPages:v}=Z();M.root.innerHTML=`
    <section class="pd-top">
      <div class="pd-media">
        <div class="pd-media-stage">
          <img src="${o}" alt="${t.product.name}" />
          ${a?`<button class="pd-gallery-nav prev" data-action="prevImage">‹</button>
          <button class="pd-gallery-nav next" data-action="nextImage">›</button>`:""}
        </div>
        ${a?`<div class="pd-gallery-thumbs" style="--pd-thumb-columns: ${Math.min(e.length,4)};">
          ${e.map((n,l)=>`<button class="pd-gallery-thumb ${l===t.imageIndex?"active":""}" data-action="selectImage" data-index="${l}"><img src="${n}" alt="thumb"/></button>`).join("")}
        </div>`:""}
      </div>
      <div class="pd-info">
        <p class="pd-eyebrow">${t.product.badges?.join(" · ")||"추천"}</p>
        <h2>${t.product.name}</h2>
        <p class="pd-one-line">${t.product.oneLine||t.product.description}</p>
        <div class="pd-rating">★ ${C} (${t.product.reviews})</div>
        <div class="pd-price"><small>${d(t.product.originalPrice)}</small><div><span>${r}%</span><strong>${d(t.product.price)}</strong></div></div>
        ${K(u)}

        <div class="pd-qty-row"><h4>수량</h4><div class="qty-controls"><button data-action="decreaseQty">-</button><span>${t.quantity}</span><button data-action="increaseQty">+</button></div></div>
        <div class="pd-total-box">
          <p><span>상품 금액(수량 반영)</span><b>${d(m)}</b></p>
          ${u.bestCoupon?`<p><span>쿠폰 추가 할인</span><b class="pd-total-discount">-${d(u.bestCoupon.appliedDiscountAmount)}</b></p>`:""}
          <p class="final"><span>총 결제예상금액</span><strong>${d(s)}</strong></p>
          <small>쿠폰 할인은 주문서에서 최종 적용됩니다.</small>
        </div>
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
        <h4>핵심 성분</h4><ul>${t.product.ingredients.map(n=>`<li>${n}</li>`).join("")}</ul>
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
        ${g.length?g.map(n=>{const l=Array.isArray(n.images)&&n.images.length?n.images.slice(0,3):n.image?[n.image]:[];return`<article class="pd-review-item">
                      <div class="pd-review-head"><strong class="pd-review-stars">${"★".repeat(n.score)}${"☆".repeat(5-n.score)}</strong><span>${n.user} · ${n.date}</span></div>
                      <p>${n.text}</p>
                      ${l.length?`<div class="pd-review-thumb-grid">
                              ${l.map((A,P)=>`<img class="pd-review-thumb" src="${A}" alt="리뷰 이미지 ${P+1}" />`).join("")}
                            </div>`:""}
                    </article>`}).join(""):"<p>리뷰가 없습니다.</p>"}
        <div class="pd-review-pagination">
          <button class="ghost" data-action="prevReview" ${t.reviewPage<=1?"disabled":""}>이전</button>
          <span>${t.reviewPage} / ${v}</span>
          <button class="ghost" data-action="nextReview" ${t.reviewPage>=v?"disabled":""}>다음</button>
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
  `,et()}document.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const o=a.dataset.action;if(o==="prevImage"&&(t.imageIndex-=1),o==="nextImage"&&(t.imageIndex+=1),o==="selectImage"&&(t.imageIndex=Number(a.dataset.index)),o==="increaseQty"&&(t.quantity=Math.min(99,t.quantity+1)),o==="decreaseQty"&&(t.quantity=Math.max(1,t.quantity-1)),o==="scrollTab"){const i=document.getElementById(a.dataset.target);i&&i.scrollIntoView({behavior:"smooth",block:"start"}),t.activeSection=a.dataset.target}if(o==="toggleOpen"){const i=a.dataset.key;t.open[i]=!t.open[i]}if(o==="prevReview"&&(t.reviewPage=Math.max(1,t.reviewPage-1)),o==="nextReview"&&(t.reviewPage+=1),o==="openPolicy"&&(t.policyOpen=!0),o==="closePolicy"&&(t.policyOpen=!1),o==="loginForCoupon"){location.href="/pages/login.html";return}if(o==="addCart")try{await N(t.product.id,t.quantity),alert("장바구니에 담았습니다."),await S()}catch(i){if(console.error(i),alert(i.message||"장바구니 담기에 실패했습니다."),i.status===401||i.message.includes("로그인")){location.href="/pages/login.html";return}}if(o==="buyNow")try{await N(t.product.id,t.quantity),location.href="/pages/cart.html";return}catch(i){if(console.error(i),alert(i.message||"장바구니 담기에 실패했습니다."),i.status===401||i.message.includes("로그인")){location.href="/pages/login.html";return}}if(o==="toggleWish"){if(!(await q()||R())){alert("로그인 후 이용 가능합니다."),location.href="/pages/login.html";return}try{t.wished?(await B(t.product.id),t.wished=!1,alert("위시리스트에서 제거했습니다.")):(await F(t.product.id),t.wished=!0,alert("위시리스트에 추가했습니다."))}catch(c){console.error(c),alert(c.message||"찜 처리에 실패했습니다.")}}E()});async function at(){try{if(t.product=await H(h),t.meta=await U(h),t.reviews=await Y(h),await q()||R()){try{await W(h)}catch(a){console.error(a)}try{const a=await Q();t.wished=a.some(o=>o.id===h)}catch(a){console.error(a)}}else t.wished=!1;G(),await S(),E()}catch(e){console.error(e),M.root.innerHTML='<p class="empty">상품 데이터를 불러오지 못했습니다.</p>'}}at();
