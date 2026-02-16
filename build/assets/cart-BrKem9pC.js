import{m as l,g as p,s as g}from"./header-Bv8tAKev.js";import{g as d,u as i,e as y,f as o,i as f}from"./cart-service-BM7B5bfh.js";const v=l({showCart:!1,currentNav:"shop"}),c={cartList:document.getElementById("cartList"),cartSummary:document.getElementById("cartSummary")};function u(){const r=d();r.length?c.cartList.innerHTML=r.map(t=>`
        <article class="cart-item">
          <strong>${t.product.name}</strong>
          <p>${o(t.product.price)} x ${t.quantity}</p>
          <div class="qty-controls">
            <button data-action="decrease" data-id="${t.product.id}">-</button>
            <span>${t.quantity}</span>
            <button data-action="increase" data-id="${t.product.id}">+</button>
          </div>
          <button class="text-btn" data-action="remove" data-id="${t.product.id}">삭제</button>
        </article>`).join(""):c.cartList.innerHTML='<p class="empty">장바구니가 비어 있습니다.</p>';const a=f();c.cartSummary.innerHTML=`
    <div>상품금액 <strong>${o(a.subtotal)}</strong></div>
    <div>배송비 <strong>${o(a.shipping)}</strong></div>
    <div>총 결제금액 <strong>${o(a.total)}</strong></div>
    <button class="primary" id="checkoutBtn">구매하기</button>
  `;const e=document.getElementById("checkoutBtn");e&&e.addEventListener("click",()=>{alert("결제 API 연동 예정 영역입니다.")});const n=p();g(v,{userName:n?.name||null})}document.addEventListener("click",r=>{const a=r.target.closest("[data-action]");if(!a)return;const e=Number(a.dataset.id),n=a.dataset.action,s=d().find(m=>m.product.id===e);n==="increase"&&s&&i(e,s.quantity+1),n==="decrease"&&s&&i(e,s.quantity-1),n==="remove"&&y(e),u()});u();
