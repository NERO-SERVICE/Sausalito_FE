import{p as b,S as u,r as H,b as C,c as q,f as c,a as A,d as T}from"./store-data-Dcg6pZ0G.js";const R=Number(new URLSearchParams(window.location.search).get("id")),s=b.find(t=>t.id===R)||b[0],a={cart:JSON.parse(localStorage.getItem(u.cart)||"[]"),wishlist:JSON.parse(localStorage.getItem(u.wishlist)||"[]"),orders:JSON.parse(localStorage.getItem(u.orders)||"[]"),user:JSON.parse(localStorage.getItem(u.user)||"null"),promoHidden:JSON.parse(localStorage.getItem(u.promoHidden)||"false"),authMode:"login",coupon:null,activeSection:"section-detail",detail:{purchaseType:0,optionId:null,addOnIds:new Set,quantity:1,imageIndex:0}};let $=null;const J={WELCOME20:{type:"percent",value:20,label:"신규회원 20%"},FREESHIP:{type:"shipping",value:3e3,label:"배송비 무료"}},d={body:document.body,promoClose:document.getElementById("promoClose"),detailContent:document.getElementById("detailContent"),relatedProducts:document.getElementById("relatedProducts"),cartCount:document.getElementById("cartCount"),wishlistCount:document.getElementById("wishlistCount"),cartItems:document.getElementById("cartItems"),wishlistItems:document.getElementById("wishlistItems"),priceSummary:document.getElementById("priceSummary"),couponInput:document.getElementById("couponInput"),authBtn:document.getElementById("authBtn"),authTitle:document.getElementById("authTitle"),authForm:document.getElementById("authForm"),authEmail:document.getElementById("authEmail"),authPassword:document.getElementById("authPassword"),authName:document.getElementById("authName"),toggleAuthMode:document.getElementById("toggleAuthMode"),checkoutForm:document.getElementById("checkoutForm"),ordersList:document.getElementById("ordersList")};function Q(){const t=T[s.id]||T.default,e=[{id:`${s.id}-base`,name:"기본 구성",price:s.price},{id:`${s.id}-double`,name:"더블 구성 (약 2개월)",price:Math.round(s.price*1.9)},{id:`${s.id}-triple`,name:"트리플 구성 (약 3개월)",price:Math.round(s.price*2.7)}];return{...T.default,...t,options:t.options?.length?t.options:e,detailImages:t.detailImages?.length?t.detailImages:[C(s.image),"/dist/img/products/p4.svg","/dist/img/products/p5.svg"]}}function W(t){return a.detail.optionId||(a.detail.optionId=t.options[0].id),t.options.find(e=>e.id===a.detail.optionId)||t.options[0]}function K(t){const e=W(t),i=t.addOns.filter(l=>a.detail.addOnIds.has(l.id)).reduce((l,E)=>l+E.price,0),n=(e.price+i)*a.detail.quantity,o=n>=t.freeShippingThreshold?0:t.shippingFee,m=n+o;return{selectedOption:e,addOnTotal:i,itemTotal:n,shipping:o,paymentTotal:m}}function g(){localStorage.setItem(u.cart,JSON.stringify(a.cart)),localStorage.setItem(u.wishlist,JSON.stringify(a.wishlist)),localStorage.setItem(u.orders,JSON.stringify(a.orders)),localStorage.setItem(u.user,JSON.stringify(a.user)),localStorage.setItem(u.promoHidden,JSON.stringify(a.promoHidden))}function y(){return a.cart.map(t=>{const e=b.find(i=>i.id===t.productId);return e?{...t,product:e}:null}).filter(Boolean)}function O(){const e=y().reduce((m,l)=>m+l.product.price*l.quantity,0),i=e>0&&e<3e4?3e3:0;let n=0,o="-";return a.coupon?.type==="percent"&&(n=Math.floor(e*a.coupon.value/100),o=`${a.coupon.label} (-${c(n)})`),a.coupon?.type==="shipping"&&(n=Math.min(i,a.coupon.value),o=`${a.coupon.label} (-${c(n)})`),{subtotal:e,shipping:i,discount:n,total:Math.max(0,e+i-n),discountText:o}}function h(){const t=Q(),{selectedOption:e,addOnTotal:i,itemTotal:n,shipping:o,paymentTotal:m}=K(t),l=H.filter(r=>r.productId===s.id),E=l.length?(l.reduce((r,p)=>r+p.score,0)/l.length).toFixed(1):s.rating.toFixed(1),M=t.detailImages;a.detail.imageIndex=Math.min(a.detail.imageIndex,M.length-1),a.detail.imageIndex<0&&(a.detail.imageIndex=0);const F=M[a.detail.imageIndex]||C(s.image),P=q(s.image),j=Math.round((1-s.price/s.originalPrice)*100);d.detailContent.innerHTML=`
    <section class="pd-top">
      <div class="pd-media">
        <img
          src="${F}"
          data-fallback="${P}"
          alt="${s.name}"
          onerror="if(this.dataset.fallback && this.src !== this.dataset.fallback){this.src=this.dataset.fallback;}"
        />
        <div class="pd-gallery-thumbs">
          ${M.map((r,p)=>`
              <button
                class="pd-gallery-thumb ${p===a.detail.imageIndex?"active":""}"
                data-action="selectDetailImage"
                data-image-index="${p}"
                aria-label="${p+1}번 이미지 보기"
              ><img src="${r}" alt="${s.name} 썸네일 ${p+1}" /></button>`).join("")}
        </div>
      </div>
      <div class="pd-info">
        <p class="pd-eyebrow">${s.badges?.join(" · ")||"추천 아이템"}</p>
        <h2>${s.name}</h2>
        <p class="pd-one-line">${s.oneLine||s.description}</p>

        <div class="pd-rating">★ ${E} (${s.reviews.toLocaleString("ko-KR")})</div>

        <div class="pd-price">
          <small>${c(s.originalPrice)}</small>
          <div><span>${j}%</span><strong>${c(s.price)}</strong></div>
        </div>

        <div class="pd-meta-lines">
          <p><strong>배송비</strong><span>${c(t.shippingFee)} ( ${c(t.freeShippingThreshold)} 이상 무료 )</span></p>
          <p><strong>쿠폰</strong><span>${t.couponText}</span></p>
          <p><strong>혜택</strong><span>${t.interestFreeText}</span></p>
          <p><strong>배송안내</strong><span>${t.todayShipText}</span></p>
        </div>

        <div class="pd-select-wrap">
          <h4>구매방식</h4>
          <div class="pd-chip-row">
            ${t.purchaseTypes.map((r,p)=>`<button class="pd-chip ${a.detail.purchaseType===p?"active":""}" data-action="selectPurchaseType" data-index="${p}">${r}</button>`).join("")}
          </div>
          <p class="pd-sub-benefit">${t.subscriptionBenefit}</p>
        </div>

        <div class="pd-select-wrap">
          <h4>${t.optionsLabel}</h4>
          <div class="pd-option-list">
            ${t.options.map(r=>`
                <button class="pd-option ${e.id===r.id?"active":""}" data-action="selectOption" data-option-id="${r.id}">
                  <span>${r.name}</span>
                  <strong>${c(r.price)}</strong>
                </button>`).join("")}
          </div>
        </div>

        <div class="pd-select-wrap">
          <h4>추가구성</h4>
          <div class="pd-addon-list">
            ${t.addOns.map(r=>`
                <button class="pd-addon ${a.detail.addOnIds.has(r.id)?"active":""}" data-action="toggleAddon" data-addon-id="${r.id}">
                  <span>${r.name}</span>
                  <strong>+${c(r.price)}</strong>
                </button>`).join("")}
          </div>
        </div>

        <div class="pd-qty-row">
          <h4>수량</h4>
          <div class="qty-controls">
            <button data-action="decreaseDetailQty">-</button>
            <span>${a.detail.quantity}</span>
            <button data-action="increaseDetailQty">+</button>
          </div>
        </div>

        <div class="pd-total-box">
          <p>상품금액 <strong>${c(n)}</strong></p>
          <p>옵션추가금액 <strong>${c(i*a.detail.quantity)}</strong></p>
          <p>배송비 <strong>${c(o)}</strong></p>
          <p class="final">총 결제예상금액 <strong>${c(m)}</strong></p>
        </div>

        <div class="pd-actions">
          <button class="ghost" data-action="toggleWish" data-id="${s.id}">${a.wishlist.includes(s.id)?"찜 해제":"찜하기"}</button>
          <button class="primary" data-action="addDetailToCart">장바구니 담기</button>
          <button class="primary" data-action="buyNow">바로 구매</button>
        </div>
      </div>
    </section>

    <section class="pd-tabs">
      <div class="pd-tab-head">
        <button class="pd-tab ${a.activeSection==="section-detail"?"active":""}" data-action="scrollTab" data-target="section-detail">상세정보</button>
        <button class="pd-tab ${a.activeSection==="section-review"?"active":""}" data-action="scrollTab" data-target="section-review">리뷰 (${s.reviews})</button>
        <button class="pd-tab ${a.activeSection==="section-shipping"?"active":""}" data-action="scrollTab" data-target="section-shipping">배송/교환</button>
        <button class="pd-tab ${a.activeSection==="section-inquiry"?"active":""}" data-action="scrollTab" data-target="section-inquiry">상품문의 (${t.inquiryCount})</button>
      </div>

      <div class="pd-tab-panel active pd-section" id="section-detail">
        <h4>제품 설명</h4>
        <p>${s.description}</p>
        <h4>핵심 성분</h4>
        <ul>${s.ingredients.map(r=>`<li>${r}</li>`).join("")}</ul>
        <h4>섭취 방법</h4>
        <p>${s.intake}</p>
        <h4>추천 대상</h4>
        <p>${s.target}</p>
      </div>

      <div class="pd-tab-panel active pd-section" id="section-review">
        ${l.length?l.slice(0,8).map(r=>`
                  <article class="pd-review-item">
                    <div><strong>${"★".repeat(r.score)}${"☆".repeat(5-r.score)}</strong><span>${r.user} · ${r.date}</span></div>
                    <p>${r.text}</p>
                  </article>`).join(""):"<p>아직 등록된 리뷰가 없습니다.</p>"}
      </div>

      <div class="pd-tab-panel active pd-section" id="section-shipping">
        <h4>배송 안내</h4>
        <p>주문/결제 완료 후 평균 1~2일 내 출고됩니다. (주말/공휴일 제외)</p>
        <h4>교환/반품 안내</h4>
        <p>상품 수령 후 7일 이내 교환/반품 접수가 가능합니다.</p>
        <p>단순 변심 반품 시 왕복 배송비는 고객 부담입니다.</p>
      </div>

      <div class="pd-tab-panel active pd-section" id="section-inquiry">
        <p>상품 문의는 고객센터 또는 1:1 문의를 이용해주세요.</p>
        <p>고객센터 운영시간: 평일 10:00 ~ 18:00</p>
      </div>
    </section>

    <div class="pd-floating-cta">
      <div class="pd-floating-total">
        총 <strong>${c(m)}</strong>
      </div>
      <button class="ghost" data-action="addDetailToCart">장바구니</button>
      <button class="primary" data-action="buyNow">구매하기</button>
    </div>
  `,z()}function L(t){a.activeSection=t,document.querySelectorAll(".pd-tab").forEach(e=>{e.classList.toggle("active",e.dataset.target===t)})}function z(){$&&$.disconnect();const t=[...document.querySelectorAll(".pd-section")];t.length&&($=new IntersectionObserver(e=>{const i=e.filter(n=>n.isIntersecting).sort((n,o)=>o.intersectionRatio-n.intersectionRatio)[0];i?.target?.id&&L(i.target.id)},{root:null,threshold:[.25,.4,.6],rootMargin:"-20% 0px -50% 0px"}),t.forEach(e=>$.observe(e)),L(a.activeSection||t[0].id))}function U(){const t=b.filter(e=>e.id!==s.id).slice(0,4);d.relatedProducts.innerHTML=t.map(e=>G(e)).join("")}function G(t){const e=Math.round((1-t.price/t.originalPrice)*100),i=t.reviews.toLocaleString("ko-KR"),n=C(t.image),o=q(t.image);return`
    <a class="product-card product-card-link" href="detail.html?id=${t.id}" aria-label="${t.name} 상세페이지로 이동">
      <div class="product-thumb">
        <div class="product-badges">
          ${(t.badges||[]).slice(0,2).map(m=>`<span class="product-badge">${m}</span>`).join("")}
        </div>
        <img
          src="${n}"
          data-fallback="${o}"
          alt="${t.name}"
          loading="lazy"
          onerror="if(this.dataset.fallback && this.src !== this.dataset.fallback){this.src=this.dataset.fallback;}"
        />
      </div>
      <div class="product-meta">
        <h4>${t.name}</h4>
        <p>${t.oneLine||t.description}</p>
      </div>
      <div class="price-stack">
        <small class="old-price">${c(t.originalPrice)}</small>
        <div class="new-price-row">
          <span class="discount-rate">${e}%</span>
          <strong class="new-price">${c(t.price)}</strong>
        </div>
      </div>
      <div class="review-count">리뷰 (${i})</div>
    </a>
  `}function f(){const t=y();d.cartCount.textContent=a.cart.reduce((i,n)=>i+n.quantity,0),d.cartItems.innerHTML=t.length===0?'<p class="empty">장바구니가 비어 있습니다.</p>':t.map(i=>`<article class="cart-item"><strong>${i.product.name}</strong><p>${c(i.product.price)} x ${i.quantity}</p><div style="display:flex;justify-content:space-between;align-items:center;gap:8px;"><div class="qty-controls"><button data-action="decreaseQty" data-id="${i.product.id}">-</button><span>${i.quantity}</span><button data-action="increaseQty" data-id="${i.product.id}">+</button></div><button class="text-btn" data-action="removeFromCart" data-id="${i.product.id}">삭제</button></div></article>`).join("");const e=O();d.priceSummary.innerHTML=`<div>상품금액 <strong>${c(e.subtotal)}</strong></div><div>배송비 <strong>${c(e.shipping)}</strong></div><div>할인 <strong>${e.discount?"-":""}${c(e.discount)}</strong></div><div style="color:#5d7683;font-size:0.82rem">${e.discountText}</div><div style="font-size:1.04rem">총 결제금액 <strong>${c(e.total)}</strong></div>`}function N(){const t=b.filter(e=>a.wishlist.includes(e.id));d.wishlistCount.textContent=a.wishlist.length,d.wishlistItems.innerHTML=t.length===0?'<p class="empty">찜한 상품이 없습니다.</p>':t.map(e=>`<article class="wish-item"><strong>${e.name}</strong><p>${c(e.price)}</p><div style="display:flex;gap:8px;"><button class="primary" data-action="addToCart" data-id="${e.id}">장바구니 담기</button><button class="text-btn" data-action="toggleWish" data-id="${e.id}">삭제</button></div></article>`).join("")}function k(){if(!a.orders.length){d.ordersList.innerHTML='<p class="empty">아직 주문 내역이 없습니다.</p>';return}d.ordersList.innerHTML=a.orders.slice().reverse().map(t=>`<article class="order-item"><strong>${t.orderId} · ${t.date}</strong><p>${t.items.map(e=>`${e.name} x ${e.quantity}`).join(", ")}</p><p>결제수단: ${A(t.paymentMethod)} · 총액: ${c(t.total)}</p></article>`).join("")}function x(){d.authBtn.textContent=a.user?`${a.user.name}님`:"로그인"}function I(t,e=1){const i=b.find(o=>o.id===t);if(!i)return;const n=a.cart.find(o=>o.productId===t);n?n.quantity=Math.min(n.quantity+e,i.stock):a.cart.push({productId:t,quantity:Math.min(e,i.stock)}),f(),g()}function V(t){a.wishlist=a.wishlist.includes(t)?a.wishlist.filter(e=>e!==t):[...a.wishlist,t],N(),h(),g()}function w(t){document.getElementById(t).classList.add("open")}function S(t){document.getElementById(t).classList.remove("open")}function v(t){document.getElementById(t).classList.add("open")}function B(t){document.getElementById(t).classList.remove("open")}function D(){return a.user?!0:(v("authModal"),!1)}function Y(){document.addEventListener("click",t=>{const e=t.target,i=e.dataset.action;if(i==="selectPurchaseType"&&(a.detail.purchaseType=Number(e.dataset.index),h()),i==="selectOption"&&(a.detail.optionId=e.dataset.optionId,h()),i==="toggleAddon"){const n=e.dataset.addonId;a.detail.addOnIds.has(n)?a.detail.addOnIds.delete(n):a.detail.addOnIds.add(n),h()}if(i==="increaseDetailQty"&&(a.detail.quantity=Math.min(99,a.detail.quantity+1),h()),i==="decreaseDetailQty"&&(a.detail.quantity=Math.max(1,a.detail.quantity-1),h()),i==="selectDetailImage"&&(a.detail.imageIndex=Number(e.dataset.imageIndex||0),h()),i==="addDetailToCart"&&(I(s.id,a.detail.quantity),w("cartDrawer")),i==="buyNow"){if(I(s.id,a.detail.quantity),!y().length||!D())return;v("checkoutModal")}if(i==="scrollTab"){const n=e.dataset.target,o=document.getElementById(n);if(!o)return;a.activeSection=n,L(n),o.scrollIntoView({behavior:"smooth",block:"start"})}if(i==="addToCart"&&(I(Number(e.dataset.id),1),w("cartDrawer")),i==="toggleWish"&&V(Number(e.dataset.id||s.id)),i==="removeFromCart"&&(a.cart=a.cart.filter(n=>n.productId!==Number(e.dataset.id)),f(),g()),i==="increaseQty"&&I(Number(e.dataset.id),1),i==="decreaseQty"){const n=a.cart.find(o=>o.productId===Number(e.dataset.id));if(!n)return;n.quantity-=1,n.quantity<=0&&(a.cart=a.cart.filter(o=>o.productId!==Number(e.dataset.id))),f(),g()}e.dataset.close&&(e.dataset.close.includes("Drawer")?S(e.dataset.close):B(e.dataset.close)),e.id==="cartBtn"&&w("cartDrawer"),e.id==="wishlistBtn"&&w("wishlistDrawer"),e.id==="ordersBtn"&&(k(),v("ordersModal")),e.id==="authBtn"&&(a.user&&confirm("로그아웃 하시겠습니까?")?(a.user=null,g(),x()):a.user||v("authModal"))}),document.addEventListener("click",t=>{const e=t.target.closest(".drawer"),i=t.target.closest("#cartBtn, #wishlistBtn");!e&&!i&&(S("cartDrawer"),S("wishlistDrawer"))}),document.querySelectorAll(".modal").forEach(t=>{t.addEventListener("click",e=>{e.target===t&&t.classList.remove("open")})}),document.getElementById("applyCouponBtn").addEventListener("click",()=>{const t=d.couponInput.value.trim().toUpperCase(),e=J[t];if(!e)return alert("사용할 수 없는 쿠폰입니다.");a.coupon=e,f()}),document.getElementById("checkoutBtn").addEventListener("click",()=>{if(!y().length)return alert("장바구니가 비어 있습니다.");D()&&v("checkoutModal")}),d.authForm.addEventListener("submit",t=>{t.preventDefault();const e=d.authEmail.value.trim(),i=d.authPassword.value.trim(),n=d.authName.value.trim();if(!(!e||!i)){if(a.authMode==="signup"){if(!n)return alert("이름을 입력해주세요.");a.user={email:e,name:n}}else a.user={email:e,name:e.split("@")[0]};g(),x(),B("authModal"),d.authForm.reset()}}),d.toggleAuthMode.addEventListener("click",()=>{a.authMode=a.authMode==="login"?"signup":"login";const t=a.authMode==="signup";d.authTitle.textContent=t?"회원가입":"로그인",d.authName.classList.toggle("hidden",!t),d.toggleAuthMode.textContent=t?"로그인 하기":"회원가입 하기"}),d.checkoutForm.addEventListener("submit",t=>{t.preventDefault();const e=Object.fromEntries(new FormData(d.checkoutForm).entries());if(!e.paymentMethod)return alert("결제수단을 선택해주세요.");const i=y();if(!i.length)return;const n=O();a.orders.push({orderId:`SL-${Date.now().toString().slice(-8)}`,date:new Date().toLocaleDateString("ko-KR"),paymentMethod:e.paymentMethod,items:i.map(o=>({name:o.product.name,quantity:o.quantity})),total:n.total}),a.cart=[],a.coupon=null,g(),f(),k(),B("checkoutModal"),S("cartDrawer"),v("ordersModal"),d.checkoutForm.reset()}),d.promoClose.addEventListener("click",()=>{a.promoHidden=!0,d.body.classList.add("promo-hidden"),g()})}function _(){a.promoHidden&&d.body.classList.add("promo-hidden"),h(),U(),f(),N(),k(),x(),Y()}_();
