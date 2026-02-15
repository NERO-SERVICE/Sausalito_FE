import{p as m,S as l,r as L,f as d,a as S}from"./store-data-v-oMD0dP.js";const x=Number(new URLSearchParams(window.location.search).get("id")),s=m.find(e=>e.id===x)||m[0],a={cart:JSON.parse(localStorage.getItem(l.cart)||"[]"),wishlist:JSON.parse(localStorage.getItem(l.wishlist)||"[]"),orders:JSON.parse(localStorage.getItem(l.orders)||"[]"),user:JSON.parse(localStorage.getItem(l.user)||"null"),promoHidden:JSON.parse(localStorage.getItem(l.promoHidden)||"false"),authMode:"login",coupon:null},C={WELCOME20:{type:"percent",value:20,label:"신규회원 20%"},FREESHIP:{type:"shipping",value:3e3,label:"배송비 무료"}},n={body:document.body,promoClose:document.getElementById("promoClose"),detailContent:document.getElementById("detailContent"),relatedProducts:document.getElementById("relatedProducts"),cartCount:document.getElementById("cartCount"),wishlistCount:document.getElementById("wishlistCount"),cartItems:document.getElementById("cartItems"),wishlistItems:document.getElementById("wishlistItems"),priceSummary:document.getElementById("priceSummary"),couponInput:document.getElementById("couponInput"),authBtn:document.getElementById("authBtn"),authTitle:document.getElementById("authTitle"),authForm:document.getElementById("authForm"),authEmail:document.getElementById("authEmail"),authPassword:document.getElementById("authPassword"),authName:document.getElementById("authName"),toggleAuthMode:document.getElementById("toggleAuthMode"),checkoutForm:document.getElementById("checkoutForm"),ordersList:document.getElementById("ordersList")};function c(){localStorage.setItem(l.cart,JSON.stringify(a.cart)),localStorage.setItem(l.wishlist,JSON.stringify(a.wishlist)),localStorage.setItem(l.orders,JSON.stringify(a.orders)),localStorage.setItem(l.user,JSON.stringify(a.user)),localStorage.setItem(l.promoHidden,JSON.stringify(a.promoHidden))}function h(){return a.cart.map(e=>{const t=m.find(i=>i.id===e.productId);return t?{...e,product:t}:null}).filter(Boolean)}function I(){const t=h().reduce((M,b)=>M+b.product.price*b.quantity,0),i=t>0&&t<3e4?3e3:0;let o=0,r="-";return a.coupon?.type==="percent"&&(o=Math.floor(t*a.coupon.value/100),r=`${a.coupon.label} (-${d(o)})`),a.coupon?.type==="shipping"&&(o=Math.min(i,a.coupon.value),r=`${a.coupon.label} (-${d(o)})`),{subtotal:t,shipping:i,discount:o,total:Math.max(0,t+i-o),discountText:r}}function E(){const e=L.filter(t=>t.productId===s.id).sort((t,i)=>i.helpful-t.helpful).slice(0,3);n.detailContent.innerHTML=`
    <div class="detail-grid">
      <div>
        <div class="product-thumb" style="height:300px;font-size:3.4rem;">${s.emoji}</div>
        <div class="detail-sections">
          <article class="detail-box">
            <h4>핵심 성분</h4>
            <ul>${s.ingredients.map(t=>`<li>${t}</li>`).join("")}</ul>
          </article>
          <article class="detail-box">
            <h4>섭취 방법</h4>
            <p>${s.intake}</p>
          </article>
          <article class="detail-box">
            <h4>추천 대상</h4>
            <p>${s.target}</p>
          </article>
        </div>
      </div>
      <div>
        <span class="badge">BEST PICK</span>
        <h2 style="margin-top:8px;">${s.name}</h2>
        <p style="color:#5d7683;line-height:1.55;">${s.description}</p>
        <p>리뷰 ${s.reviews}개 · 평점 ${s.rating} / 5</p>
        <div style="display:flex;gap:8px;align-items:center;margin-top:10px;">
          <strong style="font-size:1.4rem;">${d(s.price)}</strong>
          <small style="text-decoration:line-through;color:#5d7683;">${d(s.originalPrice)}</small>
        </div>
        <div style="display:flex;gap:8px;margin-top:14px;">
          <button class="primary" data-action="addToCart" data-id="${s.id}">장바구니 담기</button>
          <button class="ghost" data-action="toggleWish" data-id="${s.id}">${a.wishlist.includes(s.id)?"찜 해제":"찜하기"}</button>
        </div>

        <div class="detail-sections">
          <article class="detail-box">
            <h4>주의사항</h4>
            <ul>${s.cautions.map(t=>`<li>${t}</li>`).join("")}</ul>
          </article>
          <article class="detail-box">
            <h4>자주 묻는 질문</h4>
            <ul>${s.faq.map(t=>`<li><strong>Q.</strong> ${t.q}<br/><strong>A.</strong> ${t.a}</li>`).join("")}</ul>
          </article>
          <article class="detail-box">
            <h4>실구매 리뷰</h4>
            <ul>${e.length?e.map(t=>`<li><strong>${"★".repeat(t.score)}</strong> ${t.text} <small>(${t.user})</small></li>`).join(""):"<li>아직 등록된 리뷰가 없습니다.</li>"}</ul>
          </article>
        </div>
      </div>
    </div>
  `}function k(){const e=m.filter(t=>t.id!==s.id).slice(0,4);n.relatedProducts.innerHTML=e.map(t=>N(t)).join("")}function N(e){const t=Math.round((1-e.price/e.originalPrice)*100),i=e.reviews.toLocaleString("ko-KR");return`
    <a class="product-card product-card-link" href="detail.html?id=${e.id}" aria-label="${e.name} 상세페이지로 이동">
      <div class="product-thumb">
        <div class="product-badges">
          ${(e.badges||[]).slice(0,2).map(o=>`<span class="product-badge">${o}</span>`).join("")}
        </div>
        ${e.emoji}
      </div>
      <div class="product-meta">
        <h4>${e.name}</h4>
        <p>${e.oneLine||e.description}</p>
      </div>
      <div class="price-stack">
        <small class="old-price">${d(e.originalPrice)}</small>
        <div class="new-price-row">
          <span class="discount-rate">${t}%</span>
          <strong class="new-price">${d(e.price)}</strong>
        </div>
      </div>
      <div class="review-count">리뷰 (${i})</div>
    </a>
  `}function u(){const e=h();n.cartCount.textContent=a.cart.reduce((i,o)=>i+o.quantity,0),n.cartItems.innerHTML=e.length===0?'<p class="empty">장바구니가 비어 있습니다.</p>':e.map(i=>`<article class="cart-item"><strong>${i.product.name}</strong><p>${d(i.product.price)} x ${i.quantity}</p><div style="display:flex;justify-content:space-between;align-items:center;gap:8px;"><div class="qty-controls"><button data-action="decreaseQty" data-id="${i.product.id}">-</button><span>${i.quantity}</span><button data-action="increaseQty" data-id="${i.product.id}">+</button></div><button class="text-btn" data-action="removeFromCart" data-id="${i.product.id}">삭제</button></div></article>`).join("");const t=I();n.priceSummary.innerHTML=`<div>상품금액 <strong>${d(t.subtotal)}</strong></div><div>배송비 <strong>${d(t.shipping)}</strong></div><div>할인 <strong>${t.discount?"-":""}${d(t.discount)}</strong></div><div style="color:#5d7683;font-size:0.82rem">${t.discountText}</div><div style="font-size:1.04rem">총 결제금액 <strong>${d(t.total)}</strong></div>`}function B(){const e=m.filter(t=>a.wishlist.includes(t.id));n.wishlistCount.textContent=a.wishlist.length,n.wishlistItems.innerHTML=e.length===0?'<p class="empty">찜한 상품이 없습니다.</p>':e.map(t=>`<article class="wish-item"><strong>${t.name}</strong><p>${d(t.price)}</p><div style="display:flex;gap:8px;"><button class="primary" data-action="addToCart" data-id="${t.id}">장바구니 담기</button><button class="text-btn" data-action="toggleWish" data-id="${t.id}">삭제</button></div></article>`).join("")}function v(){if(!a.orders.length){n.ordersList.innerHTML='<p class="empty">아직 주문 내역이 없습니다.</p>';return}n.ordersList.innerHTML=a.orders.slice().reverse().map(e=>`<article class="order-item"><strong>${e.orderId} · ${e.date}</strong><p>${e.items.map(t=>`${t.name} x ${t.quantity}`).join(", ")}</p><p>결제수단: ${S(e.paymentMethod)} · 총액: ${d(e.total)}</p></article>`).join("")}function $(){n.authBtn.textContent=a.user?`${a.user.name}님`:"로그인"}function w(e,t=1){const i=m.find(r=>r.id===e);if(!i)return;const o=a.cart.find(r=>r.productId===e);o?o.quantity=Math.min(o.quantity+t,i.stock):a.cart.push({productId:e,quantity:Math.min(t,i.stock)}),u(),c()}function D(e){a.wishlist=a.wishlist.includes(e)?a.wishlist.filter(t=>t!==e):[...a.wishlist,e],B(),E(),c()}function f(e){document.getElementById(e).classList.add("open")}function g(e){document.getElementById(e).classList.remove("open")}function p(e){document.getElementById(e).classList.add("open")}function y(e){document.getElementById(e).classList.remove("open")}function T(){return a.user?!0:(p("authModal"),!1)}function q(){document.addEventListener("click",e=>{const t=e.target,i=t.dataset.action;if(i==="addToCart"&&(w(Number(t.dataset.id),1),f("cartDrawer")),i==="toggleWish"&&D(Number(t.dataset.id)),i==="removeFromCart"&&(a.cart=a.cart.filter(o=>o.productId!==Number(t.dataset.id)),u(),c()),i==="increaseQty"&&w(Number(t.dataset.id),1),i==="decreaseQty"){const o=a.cart.find(r=>r.productId===Number(t.dataset.id));if(!o)return;o.quantity-=1,o.quantity<=0&&(a.cart=a.cart.filter(r=>r.productId!==Number(t.dataset.id))),u(),c()}t.dataset.close&&(t.dataset.close.includes("Drawer")?g(t.dataset.close):y(t.dataset.close)),t.id==="cartBtn"&&f("cartDrawer"),t.id==="wishlistBtn"&&f("wishlistDrawer"),t.id==="ordersBtn"&&(v(),p("ordersModal")),t.id==="authBtn"&&(a.user&&confirm("로그아웃 하시겠습니까?")?(a.user=null,c(),$()):a.user||p("authModal"))}),document.addEventListener("click",e=>{const t=e.target.closest(".drawer"),i=e.target.closest("#cartBtn, #wishlistBtn");!t&&!i&&(g("cartDrawer"),g("wishlistDrawer"))}),document.querySelectorAll(".modal").forEach(e=>{e.addEventListener("click",t=>{t.target===e&&e.classList.remove("open")})}),document.getElementById("applyCouponBtn").addEventListener("click",()=>{const e=n.couponInput.value.trim().toUpperCase(),t=C[e];if(!t)return alert("사용할 수 없는 쿠폰입니다.");a.coupon=t,u()}),document.getElementById("checkoutBtn").addEventListener("click",()=>{if(!h().length)return alert("장바구니가 비어 있습니다.");T()&&p("checkoutModal")}),n.authForm.addEventListener("submit",e=>{e.preventDefault();const t=n.authEmail.value.trim(),i=n.authPassword.value.trim(),o=n.authName.value.trim();if(!(!t||!i)){if(a.authMode==="signup"){if(!o)return alert("이름을 입력해주세요.");a.user={email:t,name:o}}else a.user={email:t,name:t.split("@")[0]};c(),$(),y("authModal"),n.authForm.reset()}}),n.toggleAuthMode.addEventListener("click",()=>{a.authMode=a.authMode==="login"?"signup":"login";const e=a.authMode==="signup";n.authTitle.textContent=e?"회원가입":"로그인",n.authName.classList.toggle("hidden",!e),n.toggleAuthMode.textContent=e?"로그인 하기":"회원가입 하기"}),n.checkoutForm.addEventListener("submit",e=>{e.preventDefault();const t=Object.fromEntries(new FormData(n.checkoutForm).entries());if(!t.paymentMethod)return alert("결제수단을 선택해주세요.");const i=h();if(!i.length)return;const o=I();a.orders.push({orderId:`SL-${Date.now().toString().slice(-8)}`,date:new Date().toLocaleDateString("ko-KR"),paymentMethod:t.paymentMethod,items:i.map(r=>({name:r.product.name,quantity:r.quantity})),total:o.total}),a.cart=[],a.coupon=null,c(),u(),v(),y("checkoutModal"),g("cartDrawer"),p("ordersModal"),n.checkoutForm.reset()}),n.promoClose.addEventListener("click",()=>{a.promoHidden=!0,n.body.classList.add("promo-hidden"),c()})}function j(){a.promoHidden&&n.body.classList.add("promo-hidden"),E(),k(),u(),B(),v(),$(),q()}j();
