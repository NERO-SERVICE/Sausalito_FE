import{p as m,S as d,r as k,b as E,c as B,f as l,a as C}from"./store-data-CSIjrcqu.js";const x=Number(new URLSearchParams(window.location.search).get("id")),o=m.find(t=>t.id===x)||m[0],a={cart:JSON.parse(localStorage.getItem(d.cart)||"[]"),wishlist:JSON.parse(localStorage.getItem(d.wishlist)||"[]"),orders:JSON.parse(localStorage.getItem(d.orders)||"[]"),user:JSON.parse(localStorage.getItem(d.user)||"null"),promoHidden:JSON.parse(localStorage.getItem(d.promoHidden)||"false"),authMode:"login",coupon:null},N={WELCOME20:{type:"percent",value:20,label:"신규회원 20%"},FREESHIP:{type:"shipping",value:3e3,label:"배송비 무료"}},s={body:document.body,promoClose:document.getElementById("promoClose"),detailContent:document.getElementById("detailContent"),relatedProducts:document.getElementById("relatedProducts"),cartCount:document.getElementById("cartCount"),wishlistCount:document.getElementById("wishlistCount"),cartItems:document.getElementById("cartItems"),wishlistItems:document.getElementById("wishlistItems"),priceSummary:document.getElementById("priceSummary"),couponInput:document.getElementById("couponInput"),authBtn:document.getElementById("authBtn"),authTitle:document.getElementById("authTitle"),authForm:document.getElementById("authForm"),authEmail:document.getElementById("authEmail"),authPassword:document.getElementById("authPassword"),authName:document.getElementById("authName"),toggleAuthMode:document.getElementById("toggleAuthMode"),checkoutForm:document.getElementById("checkoutForm"),ordersList:document.getElementById("ordersList")};function c(){localStorage.setItem(d.cart,JSON.stringify(a.cart)),localStorage.setItem(d.wishlist,JSON.stringify(a.wishlist)),localStorage.setItem(d.orders,JSON.stringify(a.orders)),localStorage.setItem(d.user,JSON.stringify(a.user)),localStorage.setItem(d.promoHidden,JSON.stringify(a.promoHidden))}function h(){return a.cart.map(t=>{const e=m.find(n=>n.id===t.productId);return e?{...t,product:e}:null}).filter(Boolean)}function M(){const e=h().reduce((f,I)=>f+I.product.price*I.quantity,0),n=e>0&&e<3e4?3e3:0;let i=0,r="-";return a.coupon?.type==="percent"&&(i=Math.floor(e*a.coupon.value/100),r=`${a.coupon.label} (-${l(i)})`),a.coupon?.type==="shipping"&&(i=Math.min(n,a.coupon.value),r=`${a.coupon.label} (-${l(i)})`),{subtotal:e,shipping:n,discount:i,total:Math.max(0,e+n-i),discountText:r}}function S(){const t=k.filter(i=>i.productId===o.id).sort((i,r)=>r.helpful-i.helpful).slice(0,3),e=E(o.image),n=B(o.image);s.detailContent.innerHTML=`
    <div class="detail-grid">
      <div>
        <div class="product-thumb detail-thumb">
          <img
            src="${e}"
            data-fallback="${n}"
            alt="${o.name}"
            onerror="if(this.dataset.fallback && this.src !== this.dataset.fallback){this.src=this.dataset.fallback;}"
          />
        </div>
        <div class="detail-sections">
          <article class="detail-box">
            <h4>핵심 성분</h4>
            <ul>${o.ingredients.map(i=>`<li>${i}</li>`).join("")}</ul>
          </article>
          <article class="detail-box">
            <h4>섭취 방법</h4>
            <p>${o.intake}</p>
          </article>
          <article class="detail-box">
            <h4>추천 대상</h4>
            <p>${o.target}</p>
          </article>
        </div>
      </div>
      <div>
        <span class="badge">BEST PICK</span>
        <h2 style="margin-top:8px;">${o.name}</h2>
        <p style="color:#5d7683;line-height:1.55;">${o.description}</p>
        <p>리뷰 ${o.reviews}개 · 평점 ${o.rating} / 5</p>
        <div style="display:flex;gap:8px;align-items:center;margin-top:10px;">
          <strong style="font-size:1.4rem;">${l(o.price)}</strong>
          <small style="text-decoration:line-through;color:#5d7683;">${l(o.originalPrice)}</small>
        </div>
        <div style="display:flex;gap:8px;margin-top:14px;">
          <button class="primary" data-action="addToCart" data-id="${o.id}">장바구니 담기</button>
          <button class="ghost" data-action="toggleWish" data-id="${o.id}">${a.wishlist.includes(o.id)?"찜 해제":"찜하기"}</button>
        </div>

        <div class="detail-sections">
          <article class="detail-box">
            <h4>주의사항</h4>
            <ul>${o.cautions.map(i=>`<li>${i}</li>`).join("")}</ul>
          </article>
          <article class="detail-box">
            <h4>자주 묻는 질문</h4>
            <ul>${o.faq.map(i=>`<li><strong>Q.</strong> ${i.q}<br/><strong>A.</strong> ${i.a}</li>`).join("")}</ul>
          </article>
          <article class="detail-box">
            <h4>실구매 리뷰</h4>
            <ul>${t.length?t.map(i=>`<li><strong>${"★".repeat(i.score)}</strong> ${i.text} <small>(${i.user})</small></li>`).join(""):"<li>아직 등록된 리뷰가 없습니다.</li>"}</ul>
          </article>
        </div>
      </div>
    </div>
  `}function D(){const t=m.filter(e=>e.id!==o.id).slice(0,4);s.relatedProducts.innerHTML=t.map(e=>T(e)).join("")}function T(t){const e=Math.round((1-t.price/t.originalPrice)*100),n=t.reviews.toLocaleString("ko-KR"),i=E(t.image),r=B(t.image);return`
    <a class="product-card product-card-link" href="detail.html?id=${t.id}" aria-label="${t.name} 상세페이지로 이동">
      <div class="product-thumb">
        <div class="product-badges">
          ${(t.badges||[]).slice(0,2).map(f=>`<span class="product-badge">${f}</span>`).join("")}
        </div>
        <img
          src="${i}"
          data-fallback="${r}"
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
        <small class="old-price">${l(t.originalPrice)}</small>
        <div class="new-price-row">
          <span class="discount-rate">${e}%</span>
          <strong class="new-price">${l(t.price)}</strong>
        </div>
      </div>
      <div class="review-count">리뷰 (${n})</div>
    </a>
  `}function u(){const t=h();s.cartCount.textContent=a.cart.reduce((n,i)=>n+i.quantity,0),s.cartItems.innerHTML=t.length===0?'<p class="empty">장바구니가 비어 있습니다.</p>':t.map(n=>`<article class="cart-item"><strong>${n.product.name}</strong><p>${l(n.product.price)} x ${n.quantity}</p><div style="display:flex;justify-content:space-between;align-items:center;gap:8px;"><div class="qty-controls"><button data-action="decreaseQty" data-id="${n.product.id}">-</button><span>${n.quantity}</span><button data-action="increaseQty" data-id="${n.product.id}">+</button></div><button class="text-btn" data-action="removeFromCart" data-id="${n.product.id}">삭제</button></div></article>`).join("");const e=M();s.priceSummary.innerHTML=`<div>상품금액 <strong>${l(e.subtotal)}</strong></div><div>배송비 <strong>${l(e.shipping)}</strong></div><div>할인 <strong>${e.discount?"-":""}${l(e.discount)}</strong></div><div style="color:#5d7683;font-size:0.82rem">${e.discountText}</div><div style="font-size:1.04rem">총 결제금액 <strong>${l(e.total)}</strong></div>`}function L(){const t=m.filter(e=>a.wishlist.includes(e.id));s.wishlistCount.textContent=a.wishlist.length,s.wishlistItems.innerHTML=t.length===0?'<p class="empty">찜한 상품이 없습니다.</p>':t.map(e=>`<article class="wish-item"><strong>${e.name}</strong><p>${l(e.price)}</p><div style="display:flex;gap:8px;"><button class="primary" data-action="addToCart" data-id="${e.id}">장바구니 담기</button><button class="text-btn" data-action="toggleWish" data-id="${e.id}">삭제</button></div></article>`).join("")}function $(){if(!a.orders.length){s.ordersList.innerHTML='<p class="empty">아직 주문 내역이 없습니다.</p>';return}s.ordersList.innerHTML=a.orders.slice().reverse().map(t=>`<article class="order-item"><strong>${t.orderId} · ${t.date}</strong><p>${t.items.map(e=>`${e.name} x ${e.quantity}`).join(", ")}</p><p>결제수단: ${C(t.paymentMethod)} · 총액: ${l(t.total)}</p></article>`).join("")}function b(){s.authBtn.textContent=a.user?`${a.user.name}님`:"로그인"}function w(t,e=1){const n=m.find(r=>r.id===t);if(!n)return;const i=a.cart.find(r=>r.productId===t);i?i.quantity=Math.min(i.quantity+e,n.stock):a.cart.push({productId:t,quantity:Math.min(e,n.stock)}),u(),c()}function F(t){a.wishlist=a.wishlist.includes(t)?a.wishlist.filter(e=>e!==t):[...a.wishlist,t],L(),S(),c()}function y(t){document.getElementById(t).classList.add("open")}function g(t){document.getElementById(t).classList.remove("open")}function p(t){document.getElementById(t).classList.add("open")}function v(t){document.getElementById(t).classList.remove("open")}function P(){return a.user?!0:(p("authModal"),!1)}function q(){document.addEventListener("click",t=>{const e=t.target,n=e.dataset.action;if(n==="addToCart"&&(w(Number(e.dataset.id),1),y("cartDrawer")),n==="toggleWish"&&F(Number(e.dataset.id)),n==="removeFromCart"&&(a.cart=a.cart.filter(i=>i.productId!==Number(e.dataset.id)),u(),c()),n==="increaseQty"&&w(Number(e.dataset.id),1),n==="decreaseQty"){const i=a.cart.find(r=>r.productId===Number(e.dataset.id));if(!i)return;i.quantity-=1,i.quantity<=0&&(a.cart=a.cart.filter(r=>r.productId!==Number(e.dataset.id))),u(),c()}e.dataset.close&&(e.dataset.close.includes("Drawer")?g(e.dataset.close):v(e.dataset.close)),e.id==="cartBtn"&&y("cartDrawer"),e.id==="wishlistBtn"&&y("wishlistDrawer"),e.id==="ordersBtn"&&($(),p("ordersModal")),e.id==="authBtn"&&(a.user&&confirm("로그아웃 하시겠습니까?")?(a.user=null,c(),b()):a.user||p("authModal"))}),document.addEventListener("click",t=>{const e=t.target.closest(".drawer"),n=t.target.closest("#cartBtn, #wishlistBtn");!e&&!n&&(g("cartDrawer"),g("wishlistDrawer"))}),document.querySelectorAll(".modal").forEach(t=>{t.addEventListener("click",e=>{e.target===t&&t.classList.remove("open")})}),document.getElementById("applyCouponBtn").addEventListener("click",()=>{const t=s.couponInput.value.trim().toUpperCase(),e=N[t];if(!e)return alert("사용할 수 없는 쿠폰입니다.");a.coupon=e,u()}),document.getElementById("checkoutBtn").addEventListener("click",()=>{if(!h().length)return alert("장바구니가 비어 있습니다.");P()&&p("checkoutModal")}),s.authForm.addEventListener("submit",t=>{t.preventDefault();const e=s.authEmail.value.trim(),n=s.authPassword.value.trim(),i=s.authName.value.trim();if(!(!e||!n)){if(a.authMode==="signup"){if(!i)return alert("이름을 입력해주세요.");a.user={email:e,name:i}}else a.user={email:e,name:e.split("@")[0]};c(),b(),v("authModal"),s.authForm.reset()}}),s.toggleAuthMode.addEventListener("click",()=>{a.authMode=a.authMode==="login"?"signup":"login";const t=a.authMode==="signup";s.authTitle.textContent=t?"회원가입":"로그인",s.authName.classList.toggle("hidden",!t),s.toggleAuthMode.textContent=t?"로그인 하기":"회원가입 하기"}),s.checkoutForm.addEventListener("submit",t=>{t.preventDefault();const e=Object.fromEntries(new FormData(s.checkoutForm).entries());if(!e.paymentMethod)return alert("결제수단을 선택해주세요.");const n=h();if(!n.length)return;const i=M();a.orders.push({orderId:`SL-${Date.now().toString().slice(-8)}`,date:new Date().toLocaleDateString("ko-KR"),paymentMethod:e.paymentMethod,items:n.map(r=>({name:r.product.name,quantity:r.quantity})),total:i.total}),a.cart=[],a.coupon=null,c(),u(),$(),v("checkoutModal"),g("cartDrawer"),p("ordersModal"),s.checkoutForm.reset()}),s.promoClose.addEventListener("click",()=>{a.promoHidden=!0,s.body.classList.add("promo-hidden"),c()})}function H(){a.promoHidden&&s.body.classList.add("promo-hidden"),S(),D(),u(),L(),$(),b(),q()}H();
