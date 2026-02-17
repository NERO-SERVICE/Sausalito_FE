import{m as D,a as O,s as x,g as C,r as T,i as B,d as U,j as F,k as j,l as H,t as Y,n as W}from"./footer-CX_4Vxnh.js";import{a as Q,c as V}from"./cart-service-BJL0NQK-.js";import{a as M,f as u}from"./store-data-Deux6dsM.js";const h=Number(new URLSearchParams(location.search).get("id")),t={product:null,meta:null,reviews:[],imageIndex:0,quantity:1,reviewPage:1,activeSection:"section-detail",open:{shipping:!1,inquiry:!1},policyOpen:!1,wished:!1,currentUser:null},_=D({showCart:!0,currentNav:"shop"});O();const R={root:document.getElementById("detailRoot")};let y=null;const q=10;let w=null,$=!1;function G(){window.matchMedia("(min-width: 821px)").matches||(window.addEventListener("touchstart",e=>{window.scrollY>0||(w=e.touches[0].clientY,$=!1)},{passive:!0}),window.addEventListener("touchmove",e=>{if(w===null||$||window.scrollY>0)return;e.touches[0].clientY-w>90&&($=!0,history.length>1?history.back():location.href="/pages/home.html")},{passive:!0}),window.addEventListener("touchend",()=>{w=null,$=!1},{passive:!0}))}async function S(){const e=await x()||C();let a=0;try{a=await V()}catch{a=0}U(_,{userName:e?.name||e?.email||null,isAdmin:!!(e?.is_staff??e?.isStaff),cartCountValue:a})}function b(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function N(e,a=1){return`${(Number.isFinite(Number(e))?Number(e):0).toFixed(a)}%`}function z(e){if(!e)return null;const a=new Date(e);if(Number.isNaN(a.getTime()))return null;const o=a.getTime()-Date.now();return Math.ceil(o/(1440*60*1e3))}function J(e,a){const o=t.product?.couponBenefit||null,n=Math.max(0,Number(e||0)),s=Math.max(1,Number(a||n||1));if(!o)return{isAuthenticated:!1,hasAvailableCoupon:!1,hasEligibleCoupon:!1,availableCouponCount:0,eligibleCouponCount:0,marketingCopy:"로그인하면 보유 쿠폰 기반 추가 할인 혜택을 확인할 수 있어요.",bestCoupon:null,couponItems:[],minRequiredAmount:0};const l=Array.isArray(o.couponItems)?o.couponItems.map(c=>{const r=Number(c.minOrderAmount||0),P=Number(c.discountAmount||0),g=n>=r,v=Math.max(r-n,0),i=g?Math.min(n,P):0,d=Math.max(n-i,0),I=n>0?i/n*100:0,k=(1-d/s)*100,f=z(c.expiresAt),E=f!==null&&f>=0&&f<=3;return{...c,isEligible:g,requiredAmount:v,appliedDiscountAmount:i,finalPrice:d,extraDiscountRate:Math.max(0,Number(I.toFixed(2))),finalDiscountRate:Math.max(0,Number(k.toFixed(2))),expiresSoon:E,daysLeft:f}}).sort((c,r)=>r.discountAmount-c.discountAmount):[],m=l.filter(c=>c.isEligible).sort((c,r)=>r.appliedDiscountAmount-c.appliedDiscountAmount||r.finalDiscountRate-c.finalDiscountRate),A=l.filter(c=>!c.isEligible).sort((c,r)=>c.requiredAmount-r.requiredAmount),p=m[0]||null;return{isAuthenticated:!!o.isAuthenticated,hasAvailableCoupon:!!l.length,hasEligibleCoupon:!!p,availableCouponCount:Number(o.availableCouponCount||l.length),eligibleCouponCount:Number(m.length),marketingCopy:o.marketingCopy||"",bestCoupon:p,couponItems:l.slice(0,4),minRequiredAmount:Number(A[0]?.requiredAmount||0)}}function K(e){if(!e.isAuthenticated)return`
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
              <strong>${u(a.finalPrice)}</strong>
            </p>
            <p class="pd-coupon-copy">
              ${b(a.name)} 적용 시 ${u(a.appliedDiscountAmount)} 추가 할인
              (${N(a.extraDiscountRate)}), 정가 대비 총 할인율 ${N(a.finalDiscountRate)}
            </p>
          `:`
            <p class="pd-coupon-copy">
              현재 수량 기준 적용 가능한 쿠폰이 없습니다.
              ${u(e.minRequiredAmount)} 더 담으면 쿠폰 할인이 적용돼요.
            </p>
          `}
      <div class="pd-coupon-list">
        ${e.couponItems.map(o=>{const n=o.isEligible?"적용 가능":`${u(o.requiredAmount)} 추가 필요`,s=o.daysLeft===null?"":o.daysLeft<0?"만료":o.daysLeft===0?"오늘 만료":`${o.daysLeft}일 남음`;return`
              <article class="pd-coupon-item ${o.isEligible?"eligible":"ineligible"}">
                <div>
                  <p>${b(o.name)}</p>
                  <small>${b(o.code)} · ${u(o.discountAmount)} 할인</small>
                </div>
                <div class="pd-coupon-meta">
                  ${o.expiresSoon?'<span class="pd-coupon-chip is-urgent">곧 만료</span>':""}
                  ${s?`<span class="pd-coupon-chip">${s}</span>`:""}
                  <span class="pd-coupon-status">${n}</span>
                </div>
              </article>
            `}).join("")}
      </div>
    </section>
  `}function X(){const e=M(t.product.image,{useFallback:!1}),a=Array.isArray(t.product.images)?t.product.images:[],o=Array.isArray(t.meta?.detailImages)?t.meta.detailImages:[],n=[...new Set([e,...a,...o].filter(s=>typeof s=="string"&&s.trim()))];return n.length?n:[M(null)]}function Z(){const e=Math.max(1,Math.ceil(t.reviews.length/q));t.reviewPage=Math.min(e,Math.max(1,t.reviewPage));const a=(t.reviewPage-1)*q;return{totalPages:e,list:t.reviews.slice(a,a+q)}}function tt(e){t.activeSection=e,document.querySelectorAll(".pd-tab").forEach(a=>{a.classList.toggle("active",a.dataset.target===e)})}function et(){y&&y.disconnect();const e=[...document.querySelectorAll(".pd-section")];y=new IntersectionObserver(a=>{const o=a.filter(n=>n.isIntersecting).sort((n,s)=>s.intersectionRatio-n.intersectionRatio)[0];o?.target?.id&&tt(o.target.id)},{threshold:[.3,.6],rootMargin:"-20% 0px -45% 0px"}),e.forEach(a=>y.observe(a))}function L(){if(!t.product){R.root.innerHTML='<p class="empty">상품을 찾을 수 없습니다.</p>';return}const e=X(),a=e.length>1;t.imageIndex=Math.min(e.length-1,Math.max(0,t.imageIndex));const o=e[t.imageIndex]||M(null),n=t.meta.options&&t.meta.options[0]||{price:t.product.price},s=Number(n.price||t.product.price||0),l=Number(t.product.originalPrice||s||0),m=s*t.quantity,A=l*t.quantity,p=J(m,A),c=p.bestCoupon?p.bestCoupon.finalPrice:m,r=t.product.originalPrice>0?Math.max(0,Math.round((1-t.product.price/t.product.originalPrice)*100)):0,P=t.reviews.length?(t.reviews.reduce((i,d)=>i+d.score,0)/t.reviews.length).toFixed(1):Number(t.product.rating||0).toFixed(1),{list:g,totalPages:v}=Z();R.root.innerHTML=`
    <section class="pd-top">
      <div class="pd-media">
        <div class="pd-media-stage">
          <img src="${o}" alt="${t.product.name}" />
          ${a?`<button class="pd-gallery-nav prev" data-action="prevImage">‹</button>
          <button class="pd-gallery-nav next" data-action="nextImage">›</button>`:""}
        </div>
        ${a?`<div class="pd-gallery-thumbs" style="--pd-thumb-columns: ${Math.min(e.length,4)};">
          ${e.map((i,d)=>`<button class="pd-gallery-thumb ${d===t.imageIndex?"active":""}" data-action="selectImage" data-index="${d}"><img src="${i}" alt="thumb"/></button>`).join("")}
        </div>`:""}
      </div>
      <div class="pd-info">
        <p class="pd-eyebrow">${t.product.badges?.join(" · ")||"추천"}</p>
        <h2>${t.product.name}</h2>
        <p class="pd-one-line">${t.product.oneLine||t.product.description}</p>
        <div class="pd-rating">★ ${P} (${t.product.reviews})</div>
        <div class="pd-price"><small>${u(t.product.originalPrice)}</small><div><span>${r}%</span><strong>${u(t.product.price)}</strong></div></div>
        ${K(p)}

        <div class="pd-qty-row"><h4>수량</h4><div class="qty-controls"><button data-action="decreaseQty">-</button><span>${t.quantity}</span><button data-action="increaseQty">+</button></div></div>
        <div class="pd-total-box">
          <p><span>상품 금액(수량 반영)</span><b>${u(m)}</b></p>
          ${p.bestCoupon?`<p><span>쿠폰 추가 할인</span><b class="pd-total-discount">-${u(p.bestCoupon.appliedDiscountAmount)}</b></p>`:""}
          <p class="final"><span>총 결제예상금액</span><strong>${u(c)}</strong></p>
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
        <h4>핵심 성분</h4><ul>${t.product.ingredients.map(i=>`<li>${i}</li>`).join("")}</ul>
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
        ${g.length?g.map(i=>{const d=Array.isArray(i.images)&&i.images.length?i.images.slice(0,3):i.image?[i.image]:[];return`<article class="pd-review-item">
                      <div class="pd-review-head"><strong class="pd-review-stars">${"★".repeat(i.score)}${"☆".repeat(5-i.score)}</strong><span>${i.user} · ${i.date}</span></div>
                      <p>${i.text}</p>
                      ${d.length?`<div class="pd-review-thumb-grid">
                              ${d.map((I,k)=>`<img class="pd-review-thumb" src="${I}" alt="리뷰 이미지 ${k+1}" />`).join("")}
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
  `,et()}document.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(!a)return;const o=a.dataset.action;if(o==="prevImage"&&(t.imageIndex-=1),o==="nextImage"&&(t.imageIndex+=1),o==="selectImage"&&(t.imageIndex=Number(a.dataset.index)),o==="increaseQty"&&(t.quantity=Math.min(99,t.quantity+1)),o==="decreaseQty"&&(t.quantity=Math.max(1,t.quantity-1)),o==="scrollTab"){const n=document.getElementById(a.dataset.target);n&&n.scrollIntoView({behavior:"smooth",block:"start"}),t.activeSection=a.dataset.target}if(o==="toggleOpen"){const n=a.dataset.key;t.open[n]=!t.open[n]}if(o==="prevReview"&&(t.reviewPage=Math.max(1,t.reviewPage-1)),o==="nextReview"&&(t.reviewPage+=1),o==="openPolicy"&&(t.policyOpen=!0),o==="closePolicy"&&(t.policyOpen=!1),o==="loginForCoupon"){location.href="/pages/login.html";return}if(o==="addCart")try{await Q(t.product.id,t.quantity),alert("장바구니에 담았습니다."),await S()}catch(n){if(console.error(n),alert(n.message||"장바구니 담기에 실패했습니다."),n.status===401||n.message.includes("로그인")){location.href="/pages/login.html";return}}if(o==="buyNow"){const n=t.currentUser||await x()||C();if(!n){alert("로그인 후 바로구매가 가능합니다."),location.href="/pages/login.html";return}t.currentUser=n;const s=t.meta?.options&&t.meta.options[0]||null,l=new URLSearchParams({buyNow:"1",productId:String(t.product.id),quantity:String(t.quantity)});s?.id&&l.set("optionId",String(s.id)),location.href=`/pages/checkout.html?${l.toString()}`;return}if(o==="toggleWish"){if(!(await x()||C())){alert("로그인 후 이용 가능합니다."),location.href="/pages/login.html";return}try{t.wished?(await T(t.product.id),t.wished=!1,alert("위시리스트에서 제거했습니다.")):(await B(t.product.id),t.wished=!0,alert("위시리스트에 추가했습니다."))}catch(s){console.error(s),alert(s.message||"찜 처리에 실패했습니다.")}}L()});async function at(){try{t.product=await F(h),t.meta=await j(h),t.reviews=await H(h);const e=await x()||C();if(t.currentUser=e||null,e){try{await Y(h)}catch(a){console.error(a)}try{const a=await W();t.wished=a.some(o=>o.id===h)}catch(a){console.error(a)}}else t.wished=!1;G(),await S(),L()}catch(e){console.error(e),R.root.innerHTML='<p class="empty">상품 데이터를 불러오지 못했습니다.</p>'}}at();
