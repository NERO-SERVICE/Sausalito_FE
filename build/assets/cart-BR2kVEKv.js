import{m as y,a as f,s as m,g as l,d as g}from"./footer-CuxST7fX.js";import{u as d,r as h,f as v}from"./cart-service-BQgjICxU.js";import{f as i}from"./store-data-Deux6dsM.js";const L=y({showCart:!1,currentNav:"shop"});f();const e={cart:{items:[],subtotal:0,shipping:0,total:0}},n={cartList:document.getElementById("cartList"),cartSummary:document.getElementById("cartSummary")};async function u(){const r=await m()||l();g(L,{userName:r?.name||null})}function b(){const r=e.cart.items;r.length?n.cartList.innerHTML=r.map(t=>`
        <article class="cart-item">
          <strong>${t.product.name}</strong>
          <p>${i(t.lineTotal)} (${t.quantity}개)</p>
          ${t.option?`<small>옵션: ${t.option.name}</small>`:""}
          <div class="qty-controls">
            <button data-action="decrease" data-id="${t.id}">-</button>
            <span>${t.quantity}</span>
            <button data-action="increase" data-id="${t.id}">+</button>
          </div>
          <button class="text-btn" data-action="remove" data-id="${t.id}">삭제</button>
        </article>`).join(""):n.cartList.innerHTML='<p class="empty">장바구니가 비어 있습니다.</p>',n.cartSummary.innerHTML=`
    <div>상품금액 <strong>${i(e.cart.subtotal)}</strong></div>
    <div>배송비 <strong>${i(e.cart.shipping)}</strong></div>
    <div>총 결제금액 <strong>${i(e.cart.total)}</strong></div>
    <button class="primary" id="checkoutBtn">구매하기</button>
  `;const a=document.getElementById("checkoutBtn");a&&a.addEventListener("click",()=>{alert("주문/결제 API는 준비되어 있습니다. 현재 화면은 주문서 입력 UI가 없어 결제 연결 전 단계입니다.")})}async function p(){if(!(await m()||l())){n.cartList.innerHTML='<p class="empty">장바구니는 로그인 후 이용할 수 있습니다.</p>',n.cartSummary.innerHTML='<a class="primary" href="/pages/login.html">로그인하러 가기</a>',await u();return}try{e.cart=await v(),await u(),b()}catch(a){console.error(a),n.cartList.innerHTML='<p class="empty">장바구니 데이터를 불러오지 못했습니다.</p>'}}document.addEventListener("click",async r=>{const a=r.target.closest("[data-action]");if(!a)return;const t=Number(a.dataset.id),c=a.dataset.action,o=e.cart.items.find(s=>s.id===t);if(o)try{c==="increase"&&await d(t,o.quantity+1),c==="decrease"&&await d(t,o.quantity-1),c==="remove"&&await h(t),await p()}catch(s){console.error(s),alert(s.message||"장바구니 수정에 실패했습니다.")}});p();
