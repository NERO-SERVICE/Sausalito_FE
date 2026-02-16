import{p as b,S as p,r as k,b as N,c as Q,f as c,a as W,d as x}from"./store-data-BcRpfODc.js";const K=Number(new URLSearchParams(window.location.search).get("id")),s=b.find(e=>e.id===K)||b[0],M=10;let $=null;const t={cart:JSON.parse(localStorage.getItem(p.cart)||"[]"),wishlist:JSON.parse(localStorage.getItem(p.wishlist)||"[]"),orders:JSON.parse(localStorage.getItem(p.orders)||"[]"),user:JSON.parse(localStorage.getItem(p.user)||"null"),promoHidden:JSON.parse(localStorage.getItem(p.promoHidden)||"false"),authMode:"login",coupon:null,activeSection:"section-detail",reviewPage:1,sectionsOpen:{shipping:!1,inquiry:!1},detail:{purchaseType:0,optionId:null,addOnIds:new Set,quantity:1,imageIndex:0}},_={WELCOME20:{type:"percent",value:20,label:"신규회원 20%"},FREESHIP:{type:"shipping",value:3e3,label:"배송비 무료"}},r={body:document.body,promoClose:document.getElementById("promoClose"),detailContent:document.getElementById("detailContent"),cartCount:document.getElementById("cartCount"),wishlistCount:document.getElementById("wishlistCount"),cartItems:document.getElementById("cartItems"),wishlistItems:document.getElementById("wishlistItems"),priceSummary:document.getElementById("priceSummary"),couponInput:document.getElementById("couponInput"),authBtn:document.getElementById("authBtn"),authTitle:document.getElementById("authTitle"),authForm:document.getElementById("authForm"),authEmail:document.getElementById("authEmail"),authPassword:document.getElementById("authPassword"),authName:document.getElementById("authName"),toggleAuthMode:document.getElementById("toggleAuthMode"),checkoutForm:document.getElementById("checkoutForm"),ordersList:document.getElementById("ordersList")};function m(){localStorage.setItem(p.cart,JSON.stringify(t.cart)),localStorage.setItem(p.wishlist,JSON.stringify(t.wishlist)),localStorage.setItem(p.orders,JSON.stringify(t.orders)),localStorage.setItem(p.user,JSON.stringify(t.user)),localStorage.setItem(p.promoHidden,JSON.stringify(t.promoHidden))}function B(){const e=x[s.id]||x.default,a=[{id:`${s.id}-base`,name:"기본 구성",price:s.price},{id:`${s.id}-double`,name:"더블 구성",price:Math.round(s.price*1.9)}];return{...x.default,...e,options:e.options?.length?e.options:a,detailImages:e.detailImages?.length?e.detailImages:[N(s.image),"/dist/img/products/p4.svg","/dist/img/products/p5.svg"]}}function z(e){return t.detail.optionId||(t.detail.optionId=e.options[0].id),e.options.find(a=>a.id===t.detail.optionId)||e.options[0]}function G(e){const a=z(e),i=e.addOns.filter(h=>t.detail.addOnIds.has(h.id)).reduce((h,u)=>h+u.price,0),n=(a.price+i)*t.detail.quantity,o=n>=e.freeShippingThreshold?0:e.shippingFee;return{selectedOption:a,addOnTotal:i,itemTotal:n,shipping:o,paymentTotal:n+o}}function y(){return t.cart.map(e=>{const a=b.find(i=>i.id===e.productId);return a?{...e,product:a}:null}).filter(Boolean)}function F(){const a=y().reduce((h,u)=>h+u.product.price*u.quantity,0),i=a>0&&a<3e4?3e3:0;let n=0,o="-";return t.coupon?.type==="percent"&&(n=Math.floor(a*t.coupon.value/100),o=`${t.coupon.label} (-${c(n)})`),t.coupon?.type==="shipping"&&(n=Math.min(i,t.coupon.value),o=`${t.coupon.label} (-${c(n)})`),{subtotal:a,shipping:i,discount:n,total:Math.max(0,a+i-n),discountText:o}}function U(e){const a=Math.max(1,Math.ceil(e.length/M));t.reviewPage=Math.min(a,Math.max(1,t.reviewPage));const i=(t.reviewPage-1)*M;return{list:e.slice(i,i+M),totalPages:a}}function L(e){t.activeSection=e,document.querySelectorAll(".pd-tab").forEach(a=>{a.classList.toggle("active",a.dataset.target===e)})}function V(){$&&$.disconnect();const e=[...document.querySelectorAll(".pd-section")];e.length&&($=new IntersectionObserver(a=>{const i=a.filter(n=>n.isIntersecting).sort((n,o)=>o.intersectionRatio-n.intersectionRatio)[0];i?.target?.id&&L(i.target.id)},{threshold:[.35,.55],rootMargin:"-20% 0px -45% 0px"}),e.forEach(a=>$.observe(a)),L(t.activeSection||"section-detail"))}function l(){const e=B(),{selectedOption:a,addOnTotal:i,itemTotal:n,shipping:o,paymentTotal:h}=G(e),u=k.filter(d=>d.productId===s.id),j=u.length?(u.reduce((d,g)=>d+g.score,0)/u.length).toFixed(1):s.rating.toFixed(1),{list:D,totalPages:q}=U(u),E=e.detailImages;t.detail.imageIndex=Math.min(Math.max(0,t.detail.imageIndex),E.length-1);const H=E[t.detail.imageIndex]||N(s.image),R=Q(s.image),J=Math.round((1-s.price/s.originalPrice)*100);r.detailContent.innerHTML=`
    <section class="pd-top">
      <div class="pd-media">
        <div class="pd-media-stage">
          <img
            src="${H}"
            data-fallback="${R}"
            alt="${s.name}"
            onerror="if(this.dataset.fallback && this.src !== this.dataset.fallback){this.src=this.dataset.fallback;}"
          />
          <button class="pd-gallery-nav prev" data-action="prevImage" aria-label="이전 이미지">‹</button>
          <button class="pd-gallery-nav next" data-action="nextImage" aria-label="다음 이미지">›</button>
        </div>
        <div class="pd-gallery-thumbs">
          ${E.map((d,g)=>`
                <button class="pd-gallery-thumb ${g===t.detail.imageIndex?"active":""}" data-action="selectDetailImage" data-image-index="${g}">
                  <img src="${d}" alt="${s.name} ${g+1}" />
                </button>`).join("")}
        </div>
      </div>

      <div class="pd-info">
        <p class="pd-eyebrow">${s.badges?.join(" · ")||"추천 아이템"}</p>
        <h2>${s.name}</h2>
        <p class="pd-one-line">${s.oneLine||s.description}</p>

        <div class="pd-rating">★ ${j} (${s.reviews.toLocaleString("ko-KR")})</div>

        <div class="pd-price">
          <small>${c(s.originalPrice)}</small>
          <div><span>${J}%</span><strong>${c(s.price)}</strong></div>
        </div>

        <div class="pd-meta-lines">
          <p><strong>배송비</strong><span>${c(e.shippingFee)} ( ${c(e.freeShippingThreshold)} 이상 무료 )</span></p>
          <p><strong>쿠폰</strong><span>${e.couponText}</span></p>
          <p><strong>혜택</strong><span>${e.interestFreeText}</span></p>
          <p><strong>배송안내</strong><span>${e.todayShipText}</span></p>
        </div>

        <div class="pd-select-wrap">
          <h4>구매방식</h4>
          <div class="pd-chip-row">
            ${e.purchaseTypes.map((d,g)=>`<button class="pd-chip ${t.detail.purchaseType===g?"active":""}" data-action="selectPurchaseType" data-index="${g}">${d}</button>`).join("")}
          </div>
          <p class="pd-sub-benefit">${e.subscriptionBenefit}</p>
        </div>

        <div class="pd-select-wrap">
          <h4>${e.optionsLabel}</h4>
          <div class="pd-option-list">
            ${e.options.map(d=>`
                <button class="pd-option ${a.id===d.id?"active":""}" data-action="selectOption" data-option-id="${d.id}">
                  <span>${d.name}</span>
                  <strong>${c(d.price)}</strong>
                </button>`).join("")}
          </div>
        </div>

        <div class="pd-select-wrap">
          <h4>추가구성</h4>
          <div class="pd-addon-list">
            ${e.addOns.map(d=>`
                <button class="pd-addon ${t.detail.addOnIds.has(d.id)?"active":""}" data-action="toggleAddon" data-addon-id="${d.id}">
                  <span>${d.name}</span>
                  <strong>+${c(d.price)}</strong>
                </button>`).join("")}
          </div>
        </div>

        <div class="pd-qty-row">
          <h4>수량</h4>
          <div class="qty-controls">
            <button data-action="decreaseDetailQty">-</button>
            <span>${t.detail.quantity}</span>
            <button data-action="increaseDetailQty">+</button>
          </div>
        </div>

        <div class="pd-total-box">
          <p>상품금액 <strong>${c(n)}</strong></p>
          <p>옵션추가금액 <strong>${c(i*t.detail.quantity)}</strong></p>
          <p>배송비 <strong>${c(o)}</strong></p>
          <p class="final">총 결제예상금액 <strong>${c(h)}</strong></p>
        </div>
      </div>
    </section>

    <section class="pd-tabs">
      <div class="pd-tab-head">
        <button class="pd-tab ${t.activeSection==="section-detail"?"active":""}" data-action="scrollTab" data-target="section-detail">상세정보</button>
        <button class="pd-tab ${t.activeSection==="section-review"?"active":""}" data-action="scrollTab" data-target="section-review">리뷰 (${s.reviews})</button>
      </div>

      <div class="pd-tab-panel active pd-section" id="section-detail">
        <h4>제품 설명</h4>
        <p>${s.description}</p>
        <h4>핵심 성분</h4>
        <ul>${s.ingredients.map(d=>`<li>${d}</li>`).join("")}</ul>
        <h4>섭취 방법</h4>
        <p>${s.intake}</p>
        <h4>추천 대상</h4>
        <p>${s.target}</p>

        <div class="pd-accordion">
          <button class="pd-accordion-head" data-action="toggleSectionOpen" data-section="shipping">
            배송/교환 안내 <span>${t.sectionsOpen.shipping?"−":"+"}</span>
          </button>
          <div class="pd-accordion-body ${t.sectionsOpen.shipping?"open":""}">
            <p>주문/결제 완료 후 평균 1~2일 내 출고됩니다. (주말/공휴일 제외)</p>
            <p>상품 수령 후 7일 이내 교환/반품 접수가 가능합니다.</p>
            <p>단순 변심 반품 시 왕복 배송비는 고객 부담입니다.</p>
          </div>
        </div>

        <div class="pd-accordion">
          <button class="pd-accordion-head" data-action="toggleSectionOpen" data-section="inquiry">
            상품문의 안내 <span>${t.sectionsOpen.inquiry?"−":"+"}</span>
          </button>
          <div class="pd-accordion-body ${t.sectionsOpen.inquiry?"open":""}">
            <p>상품 문의는 고객센터 또는 1:1 문의를 이용해주세요.</p>
            <p>고객센터 운영시간: 평일 10:00 ~ 18:00</p>
          </div>
        </div>
      </div>

      <div class="pd-tab-panel active pd-section" id="section-review">
        ${D.length?D.map(d=>`
                    <article class="pd-review-item">
                      <div><strong>${"★".repeat(d.score)}${"☆".repeat(5-d.score)}</strong><span>${d.user} · ${d.date}</span></div>
                      <p>${d.text}</p>
                    </article>`).join(""):"<p>아직 등록된 리뷰가 없습니다.</p>"}

        <div class="pd-review-pagination">
          <button class="ghost" data-action="reviewPagePrev" ${t.reviewPage<=1?"disabled":""}>이전</button>
          <span>${t.reviewPage} / ${q}</span>
          <button class="ghost" data-action="reviewPageNext" ${t.reviewPage>=q?"disabled":""}>다음</button>
        </div>
      </div>
    </section>

    <div class="pd-floating-cta">
      <button class="ghost" data-action="toggleWish" data-id="${s.id}">${t.wishlist.includes(s.id)?"찜해제":"찜하기"}</button>
      <button class="ghost" data-action="addDetailToCart">장바구니담기</button>
      <button class="primary" data-action="buyNow">바로구매</button>
    </div>
  `,V()}function f(){const e=y();r.cartCount.textContent=t.cart.reduce((i,n)=>i+n.quantity,0),r.cartItems.innerHTML=e.length===0?'<p class="empty">장바구니가 비어 있습니다.</p>':e.map(i=>`<article class="cart-item"><strong>${i.product.name}</strong><p>${c(i.product.price)} x ${i.quantity}</p><div style="display:flex;justify-content:space-between;align-items:center;gap:8px;"><div class="qty-controls"><button data-action="decreaseQty" data-id="${i.product.id}">-</button><span>${i.quantity}</span><button data-action="increaseQty" data-id="${i.product.id}">+</button></div><button class="text-btn" data-action="removeFromCart" data-id="${i.product.id}">삭제</button></div></article>`).join("");const a=F();r.priceSummary.innerHTML=`<div>상품금액 <strong>${c(a.subtotal)}</strong></div><div>배송비 <strong>${c(a.shipping)}</strong></div><div>할인 <strong>${a.discount?"-":""}${c(a.discount)}</strong></div><div style="color:#5d7683;font-size:0.82rem">${a.discountText}</div><div style="font-size:1.04rem">총 결제금액 <strong>${c(a.total)}</strong></div>`}function A(){const e=b.filter(a=>t.wishlist.includes(a.id));r.wishlistCount.textContent=t.wishlist.length,r.wishlistItems.innerHTML=e.length===0?'<p class="empty">찜한 상품이 없습니다.</p>':e.map(a=>`<article class="wish-item"><strong>${a.name}</strong><p>${c(a.price)}</p><div style="display:flex;gap:8px;"><button class="primary" data-action="addToCart" data-id="${a.id}">장바구니 담기</button><button class="text-btn" data-action="toggleWish" data-id="${a.id}">삭제</button></div></article>`).join("")}function T(){if(!t.orders.length){r.ordersList.innerHTML='<p class="empty">아직 주문 내역이 없습니다.</p>';return}r.ordersList.innerHTML=t.orders.slice().reverse().map(e=>`<article class="order-item"><strong>${e.orderId} · ${e.date}</strong><p>${e.items.map(a=>`${a.name} x ${a.quantity}`).join(", ")}</p><p>결제수단: ${W(e.paymentMethod)} · 총액: ${c(e.total)}</p></article>`).join("")}function P(){r.authBtn.textContent=t.user?`${t.user.name}님`:"로그인"}function I(e,a=1){const i=b.find(o=>o.id===e);if(!i)return;const n=t.cart.find(o=>o.productId===e);n?n.quantity=Math.min(n.quantity+a,i.stock):t.cart.push({productId:e,quantity:Math.min(a,i.stock)}),f(),m()}function Y(e){t.wishlist=t.wishlist.includes(e)?t.wishlist.filter(a=>a!==e):[...t.wishlist,e],A(),l(),m()}function w(e){document.getElementById(e).classList.add("open")}function S(e){document.getElementById(e).classList.remove("open")}function v(e){document.getElementById(e).classList.add("open")}function O(e){document.getElementById(e).classList.remove("open")}function C(){return t.user?!0:(v("authModal"),!1)}function X(){document.addEventListener("click",e=>{const a=e.target,i=a.dataset.action;if(i==="selectPurchaseType"&&(t.detail.purchaseType=Number(a.dataset.index),l()),i==="selectOption"&&(t.detail.optionId=a.dataset.optionId,l()),i==="toggleAddon"){const n=a.dataset.addonId;t.detail.addOnIds.has(n)?t.detail.addOnIds.delete(n):t.detail.addOnIds.add(n),l()}if(i==="increaseDetailQty"&&(t.detail.quantity=Math.min(99,t.detail.quantity+1),l()),i==="decreaseDetailQty"&&(t.detail.quantity=Math.max(1,t.detail.quantity-1),l()),i==="prevImage"){const n=B();t.detail.imageIndex=(t.detail.imageIndex-1+n.detailImages.length)%n.detailImages.length,l()}if(i==="nextImage"){const n=B();t.detail.imageIndex=(t.detail.imageIndex+1)%n.detailImages.length,l()}if(i==="selectDetailImage"&&(t.detail.imageIndex=Number(a.dataset.imageIndex||0),l()),i==="scrollTab"){const n=a.dataset.target,o=document.getElementById(n);if(!o)return;t.activeSection=n,L(n),o.scrollIntoView({behavior:"smooth",block:"start"})}if(i==="toggleSectionOpen"){const n=a.dataset.section;t.sectionsOpen[n]=!t.sectionsOpen[n],l()}if(i==="reviewPagePrev"&&(t.reviewPage=Math.max(1,t.reviewPage-1),l()),i==="reviewPageNext"){const n=Math.ceil(k.filter(o=>o.productId===s.id).length/M)||1;t.reviewPage=Math.min(n,t.reviewPage+1),l()}if(i==="addDetailToCart"&&(I(s.id,t.detail.quantity),w("cartDrawer")),i==="buyNow"){if(I(s.id,t.detail.quantity),!y().length||!C())return;v("checkoutModal")}if(i==="addToCart"&&(I(Number(a.dataset.id),1),w("cartDrawer")),i==="toggleWish"&&Y(Number(a.dataset.id||s.id)),i==="removeFromCart"&&(t.cart=t.cart.filter(n=>n.productId!==Number(a.dataset.id)),f(),m()),i==="increaseQty"&&I(Number(a.dataset.id),1),i==="decreaseQty"){const n=t.cart.find(o=>o.productId===Number(a.dataset.id));if(!n)return;n.quantity-=1,n.quantity<=0&&(t.cart=t.cart.filter(o=>o.productId!==Number(a.dataset.id))),f(),m()}a.dataset.close&&(a.dataset.close.includes("Drawer")?S(a.dataset.close):O(a.dataset.close)),a.id==="cartBtn"&&w("cartDrawer"),a.id==="wishlistBtn"&&w("wishlistDrawer"),a.id==="ordersBtn"&&(T(),v("ordersModal")),a.id==="authBtn"&&(t.user&&confirm("로그아웃 하시겠습니까?")?(t.user=null,m(),P()):t.user||v("authModal"))}),document.addEventListener("click",e=>{const a=e.target.closest(".drawer"),i=e.target.closest("#cartBtn, #wishlistBtn");!a&&!i&&(S("cartDrawer"),S("wishlistDrawer"))}),document.querySelectorAll(".modal").forEach(e=>{e.addEventListener("click",a=>{a.target===e&&e.classList.remove("open")})}),document.getElementById("applyCouponBtn").addEventListener("click",()=>{const e=r.couponInput.value.trim().toUpperCase(),a=_[e];if(!a)return alert("사용할 수 없는 쿠폰입니다.");t.coupon=a,f()}),document.getElementById("checkoutBtn").addEventListener("click",()=>{if(!y().length)return alert("장바구니가 비어 있습니다.");C()&&v("checkoutModal")}),r.authForm.addEventListener("submit",e=>{e.preventDefault();const a=r.authEmail.value.trim(),i=r.authPassword.value.trim(),n=r.authName.value.trim();if(!(!a||!i)){if(t.authMode==="signup"){if(!n)return alert("이름을 입력해주세요.");t.user={email:a,name:n}}else t.user={email:a,name:a.split("@")[0]};m(),P(),O("authModal"),r.authForm.reset()}}),r.toggleAuthMode.addEventListener("click",()=>{t.authMode=t.authMode==="login"?"signup":"login";const e=t.authMode==="signup";r.authTitle.textContent=e?"회원가입":"로그인",r.authName.classList.toggle("hidden",!e),r.toggleAuthMode.textContent=e?"로그인 하기":"회원가입 하기"}),r.checkoutForm.addEventListener("submit",e=>{e.preventDefault();const a=Object.fromEntries(new FormData(r.checkoutForm).entries());if(!a.paymentMethod)return alert("결제수단을 선택해주세요.");const i=y();if(!i.length)return;const n=F();t.orders.push({orderId:`SL-${Date.now().toString().slice(-8)}`,date:new Date().toLocaleDateString("ko-KR"),paymentMethod:a.paymentMethod,items:i.map(o=>({name:o.product.name,quantity:o.quantity})),total:n.total}),t.cart=[],t.coupon=null,m(),f(),T(),O("checkoutModal"),S("cartDrawer"),v("ordersModal"),r.checkoutForm.reset()}),r.promoClose.addEventListener("click",()=>{t.promoHidden=!0,r.body.classList.add("promo-hidden"),m()})}function Z(){t.promoHidden&&r.body.classList.add("promo-hidden"),l(),f(),A(),T(),P(),X()}Z();
