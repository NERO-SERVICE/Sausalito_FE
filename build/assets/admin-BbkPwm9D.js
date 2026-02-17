import{m as b,a as N,s as f,g as w,x as D,y as T,z as B,A as L,B as O,C as q,D as $,E as C,F as P,d as R}from"./footer-DLgmIPmE.js";import{c as F}from"./cart-service-LKHAjlVQ.js";import{f as c}from"./store-data-Deux6dsM.js";const M=b({showCart:!0,currentNav:""});N();const H=["PENDING","PAID","FAILED","CANCELED","REFUNDED","PARTIAL_REFUNDED"],k=["UNPAID","READY","APPROVED","CANCELED","FAILED"],U=["READY","PREPARING","SHIPPED","DELIVERED"],_=["OPEN","ANSWERED","CLOSED"],s={user:null,dashboard:null,orders:[],inquiries:[],reviews:[],coupons:[]},a={reloadBtn:document.getElementById("adminReloadBtn"),summary:document.getElementById("adminSummary"),orders:document.getElementById("adminOrders"),orderSearch:document.getElementById("adminOrderSearch"),orderStatus:document.getElementById("adminOrderStatusFilter"),paymentStatus:document.getElementById("adminPaymentStatusFilter"),shippingStatus:document.getElementById("adminShippingStatusFilter"),orderSearchBtn:document.getElementById("adminOrderSearchBtn"),inquiryStatus:document.getElementById("adminInquiryStatusFilter"),inquiries:document.getElementById("adminInquiries"),reviewStatus:document.getElementById("adminReviewStatusFilter"),reviews:document.getElementById("adminReviews"),couponForm:document.getElementById("adminCouponForm"),couponTarget:document.getElementById("couponTarget"),couponEmailField:document.getElementById("couponEmailField"),couponEmail:document.getElementById("couponEmail"),couponName:document.getElementById("couponName"),couponCode:document.getElementById("couponCode"),couponDiscountAmount:document.getElementById("couponDiscountAmount"),couponMinOrderAmount:document.getElementById("couponMinOrderAmount"),couponExpiresAt:document.getElementById("couponExpiresAt"),couponSearch:document.getElementById("adminCouponSearch"),coupons:document.getElementById("adminCoupons")};function x(t){return!!(t?.is_staff??t?.isStaff)}function l(t){if(!t)return"-";const e=new Date(t);if(Number.isNaN(e.getTime()))return"-";const n=e.getFullYear(),r=String(e.getMonth()+1).padStart(2,"0"),o=String(e.getDate()).padStart(2,"0"),p=String(e.getHours()).padStart(2,"0"),g=String(e.getMinutes()).padStart(2,"0");return`${n}.${r}.${o} ${p}:${g}`}function j(t){if(!t)return null;const e=new Date(t);return Number.isNaN(e.getTime())?null:e.toISOString()}function i(t){const e=t||"-";return`<span class="admin-status ${e.toLowerCase()}">${e}</span>`}function d(t,e){return t.map(n=>`<option value="${n}" ${n===e?"selected":""}>${n}</option>`).join("")}function V(){const t=s.dashboard?.summary||{};a.summary.innerHTML=`
    <article>
      <p>총 주문건수</p>
      <strong>${t.totalOrders||0}건</strong>
    </article>
    <article>
      <p>승인 주문건수</p>
      <strong>${t.paidOrders||0}건</strong>
    </article>
    <article>
      <p>누적 결제금액</p>
      <strong>${c(t.totalPaidAmount||0)}</strong>
    </article>
    <article>
      <p>오늘 결제금액</p>
      <strong>${c(t.todayPaidAmount||0)}</strong>
    </article>
    <article>
      <p>배송 대기</p>
      <strong>${t.shippingPendingCount||0}건</strong>
    </article>
    <article>
      <p>배송 중</p>
      <strong>${t.shippingShippedCount||0}건</strong>
    </article>
    <article>
      <p>배송 완료</p>
      <strong>${t.shippingDeliveredCount||0}건</strong>
    </article>
    <article>
      <p>미답변 문의 / 숨김리뷰</p>
      <strong>${t.openInquiryCount||0} / ${t.hiddenReviewCount||0}</strong>
    </article>
  `}function Y(){if(!s.orders.length){a.orders.innerHTML='<p class="empty">조건에 맞는 주문이 없습니다.</p>';return}a.orders.innerHTML=`
    <table class="admin-order-table">
      <thead>
        <tr>
          <th>주문정보</th>
          <th>회원</th>
          <th>결제</th>
          <th>배송</th>
          <th>관리</th>
        </tr>
      </thead>
      <tbody>
        ${s.orders.map(t=>`
            <tr data-order-no="${t.orderNo}">
              <td>
                <strong>${t.orderNo}</strong>
                <p>${l(t.createdAt)} · ${t.itemCount}개</p>
                <p>${t.recipient} (${t.phone})</p>
              </td>
              <td>
                <p>${t.userName||"-"}</p>
                <small>${t.userEmail||"비회원"}</small>
              </td>
              <td>
                <p>${i(t.status)}</p>
                <p>${i(t.paymentStatus)}</p>
                <strong>${c(t.totalAmount)}</strong>
              </td>
              <td>
                <p>${i(t.shippingStatus)}</p>
                <p>${t.courierName||"택배사 미입력"}</p>
                <p>${t.trackingNo||"송장번호 미입력"}</p>
                <small>송장발급 ${l(t.invoiceIssuedAt)}</small>
              </td>
              <td>
                <div class="admin-order-edit-grid">
                  <select data-role="order-status">
                    ${d(H,t.status)}
                  </select>
                  <select data-role="payment-status">
                    ${d(k,t.paymentStatus)}
                  </select>
                  <select data-role="shipping-status">
                    ${d(U,t.shippingStatus)}
                  </select>
                  <input type="text" data-role="courier-name" placeholder="택배사" value="${t.courierName||""}" />
                  <input type="text" data-role="tracking-no" placeholder="송장번호" value="${t.trackingNo||""}" />
                  <div class="admin-inline-actions">
                    <button class="ghost" type="button" data-action="issueInvoice">송장발급</button>
                    <button class="ghost" type="button" data-action="markDelivered">배송완료</button>
                    <button class="primary" type="button" data-action="saveOrder">저장</button>
                  </div>
                </div>
              </td>
            </tr>
          `).join("")}
      </tbody>
    </table>
  `}function G(){if(!s.inquiries.length){a.inquiries.innerHTML='<p class="empty">문의 내역이 없습니다.</p>';return}a.inquiries.innerHTML=s.inquiries.map(t=>`
      <article class="admin-row-card" data-inquiry-id="${t.id}">
        <div class="admin-row-head">
          <div>
            <strong>${t.title}</strong>
            <p>${t.userName||"회원"} · ${t.userEmail||"-"}</p>
          </div>
          ${i(t.status)}
        </div>
        <p class="admin-row-content">${t.content}</p>
        <label>
          <span>답변</span>
          <textarea data-role="answer" rows="3" placeholder="답변을 입력하세요.">${t.answer||""}</textarea>
        </label>
        <div class="admin-inline-actions">
          <select data-role="inquiry-status">
            ${d(_,t.status)}
          </select>
          <button class="primary" type="button" data-action="saveInquiryAnswer">답변 저장</button>
        </div>
      </article>
    `).join("")}function z(){if(!s.reviews.length){a.reviews.innerHTML='<p class="empty">리뷰가 없습니다.</p>';return}a.reviews.innerHTML=s.reviews.map(t=>`
      <article class="admin-row-card" data-review-id="${t.id}">
        <div class="admin-row-head">
          <div>
            <strong>${t.productName}</strong>
            <p>${t.userName||"회원"} · ${t.userEmail||"-"} · ${l(t.createdAt)}</p>
          </div>
          <div>
            ${i(t.status)}
            <span class="admin-score">${"★".repeat(t.score)}${"☆".repeat(5-t.score)}</span>
          </div>
        </div>
        <p class="admin-row-content">${t.content}</p>
        ${t.images.length?`<div class="admin-review-image-grid">
                ${t.images.map((e,n)=>`<img src="${e}" alt="리뷰 이미지 ${n+1}" />`).join("")}
              </div>`:""}
        <div class="admin-inline-actions">
          <button class="ghost" type="button" data-action="hideReview" ${t.status==="HIDDEN"?"disabled":""}>숨기기</button>
          <button class="primary" type="button" data-action="showReview" ${t.status==="VISIBLE"?"disabled":""}>노출</button>
        </div>
      </article>
    `).join("")}function Q(){if(!s.coupons.length){a.coupons.innerHTML='<p class="empty">쿠폰 데이터가 없습니다.</p>';return}a.coupons.innerHTML=`
    <table class="admin-coupon-table">
      <thead>
        <tr>
          <th>회원</th>
          <th>쿠폰</th>
          <th>할인/조건</th>
          <th>상태</th>
          <th>만료</th>
        </tr>
      </thead>
      <tbody>
        ${s.coupons.map(t=>`
            <tr>
              <td>${t.userEmail||"-"}</td>
              <td>
                <strong>${t.name}</strong>
                <p>${t.code}</p>
              </td>
              <td>
                <p>${c(t.discountAmount)}</p>
                <small>${t.minOrderAmount?`${c(t.minOrderAmount)} 이상`:"최소금액 없음"}</small>
              </td>
              <td>${t.isUsed?"사용완료":t.isExpired?"만료":"사용가능"}</td>
              <td>${l(t.expiresAt)}</td>
            </tr>
          `).join("")}
      </tbody>
    </table>
  `}async function W(){const t=await f()||w();let e=0;try{e=await F()}catch{e=0}R(M,{userName:t?.name||t?.email||null,isAdmin:!!(t?.is_staff??t?.isStaff),cartCountValue:e})}async function u(){s.dashboard=await C(),V()}async function m(){s.orders=await T({q:a.orderSearch.value.trim(),status:a.orderStatus.value,paymentStatus:a.paymentStatus.value,shippingStatus:a.shippingStatus.value}),Y()}async function v(){s.inquiries=await B({status:a.inquiryStatus.value}),G()}async function S(){s.reviews=await L({status:a.reviewStatus.value}),z()}async function h(){s.coupons=await P({q:a.couponSearch.value.trim()}),Q()}async function I(){await Promise.all([u(),m(),v(),S(),h(),W()])}async function J(t){const e=t.closest("tr[data-order-no]");if(!e)return;const n=e.dataset.orderNo,r=e.querySelector("[data-role='order-status']")?.value,o=e.querySelector("[data-role='payment-status']")?.value,p=e.querySelector("[data-role='shipping-status']")?.value,g=e.querySelector("[data-role='courier-name']")?.value?.trim()||"",A=e.querySelector("[data-role='tracking-no']")?.value?.trim()||"",E=t.dataset.action,y={status:r,paymentStatus:o,shippingStatus:p,courierName:g,trackingNo:A};E==="issueInvoice"&&(y.issueInvoice=!0),E==="markDelivered"&&(y.markDelivered=!0),await O(n,y),await Promise.all([u(),m()])}async function K(t){const e=t.closest("[data-inquiry-id]");if(!e)return;const n=Number(e.dataset.inquiryId),r=e.querySelector("[data-role='answer']")?.value?.trim(),o=e.querySelector("[data-role='inquiry-status']")?.value;if(!r){alert("답변 내용을 입력해주세요.");return}await q(n,{answer:r,status:o}),await Promise.all([u(),v()])}async function X(t){const e=t.closest("[data-review-id]");if(!e)return;const n=Number(e.dataset.reviewId);t.dataset.action==="hideReview"&&await $(n,!1),t.dataset.action==="showReview"&&await $(n,!0),await Promise.all([u(),S()])}function Z(){a.reloadBtn?.addEventListener("click",async()=>{try{await I()}catch(e){console.error(e),alert(e.message||"새로고침 중 오류가 발생했습니다.")}}),a.orderSearchBtn?.addEventListener("click",async()=>{try{await m()}catch(e){console.error(e),alert(e.message||"주문 조회에 실패했습니다.")}}),[a.orderStatus,a.paymentStatus,a.shippingStatus].forEach(e=>{e?.addEventListener("change",async()=>{try{await m()}catch(n){console.error(n),alert(n.message||"주문 조회에 실패했습니다.")}})}),a.inquiryStatus?.addEventListener("change",async()=>{try{await v()}catch(e){console.error(e),alert(e.message||"문의 목록 조회에 실패했습니다.")}}),a.reviewStatus?.addEventListener("change",async()=>{try{await S()}catch(e){console.error(e),alert(e.message||"리뷰 목록 조회에 실패했습니다.")}}),a.orders?.addEventListener("click",async e=>{const n=e.target.closest("[data-action]");if(n)try{await J(n),alert("주문/배송 정보가 저장되었습니다.")}catch(r){console.error(r),alert(r.message||"주문/배송 정보 업데이트에 실패했습니다.")}}),a.inquiries?.addEventListener("click",async e=>{const n=e.target.closest("[data-action='saveInquiryAnswer']");if(n)try{await K(n),alert("문의 답변이 저장되었습니다.")}catch(r){console.error(r),alert(r.message||"문의 답변 저장에 실패했습니다.")}}),a.reviews?.addEventListener("click",async e=>{const n=e.target.closest("[data-action]");if(n)try{await X(n),alert("리뷰 노출 상태가 반영되었습니다.")}catch(r){console.error(r),alert(r.message||"리뷰 상태 변경에 실패했습니다.")}}),a.couponTarget?.addEventListener("change",()=>{const e=a.couponTarget.value==="EMAIL";a.couponEmailField.classList.toggle("hidden",!e),a.couponEmail.required=e}),a.couponForm?.addEventListener("submit",async e=>{e.preventDefault();try{const n=await D({target:a.couponTarget.value,email:a.couponTarget.value==="EMAIL"?a.couponEmail.value.trim():void 0,name:a.couponName.value.trim(),code:a.couponCode.value.trim(),discountAmount:Number(a.couponDiscountAmount.value||0),minOrderAmount:Number(a.couponMinOrderAmount.value||0),expiresAt:j(a.couponExpiresAt.value)}),r=Number(n?.issued_count??n?.issuedCount??0);alert(`쿠폰 발급 완료: ${r}건`),await Promise.all([u(),h()])}catch(n){console.error(n),alert(n.message||"쿠폰 발급에 실패했습니다.")}});let t=null;a.couponSearch?.addEventListener("input",()=>{t&&clearTimeout(t),t=setTimeout(async()=>{try{await h()}catch(e){console.error(e),alert(e.message||"쿠폰 조회에 실패했습니다.")}},250)})}async function tt(){const t=await f()||w();if(!t){alert("관리자 페이지는 로그인 후 이용할 수 있습니다."),location.href="/pages/login.html";return}if(!x(t)){alert("관리자 권한이 없습니다."),location.href="/pages/home.html";return}s.user=t,Z();try{await I()}catch(e){console.error(e),alert(e.message||"관리자 데이터를 불러오지 못했습니다.")}}tt();
