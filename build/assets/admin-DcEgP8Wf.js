import{m as ie,a as de,s as J,g as K,x as se,y as oe,z as ce,A as le,B as ue,C as me,D as pe,E as ge,F as ye,G as he,H as be,I as ve,J as Ee,K as fe,L as Se,M as Ie,N as $e,O as Ae,P as X,Q as Be,R as qe,S as we,T as Pe,U as Ne,V as Te,W as De,X as W,Y as Re,Z as Le,_ as Ce,$ as Me,d as Oe}from"./footer-L9VA9lT-.js";import{c as Ue}from"./cart-service-B2LqFCB-.js";import{f as m}from"./store-data-Deux6dsM.js";const xe=ie({showCart:!0,currentNav:""});de();const ke=["dashboard","orders","returns","settlements","cs","reviews","products","members","coupons"],Fe=["PENDING","PAID","FAILED","CANCELED","REFUNDED","PARTIAL_REFUNDED"],He=["UNPAID","READY","APPROVED","CANCELED","FAILED"],_e=["READY","PREPARING","SHIPPED","DELIVERED"],je=["REQUESTED","APPROVED","PICKUP_SCHEDULED","RECEIVED","REFUNDING","REFUNDED","REJECTED","CLOSED"],Ge=["PENDING","HOLD","SCHEDULED","PAID"],Z={PENDING:"주문접수",PAID:"주문완료",FAILED:"결제실패",CANCELED:"주문취소",REFUNDED:"전체환불",PARTIAL_REFUNDED:"부분환불"},F={UNPAID:"결제대기",READY:"결제준비",APPROVED:"결제완료",CANCELED:"결제취소",FAILED:"결제실패"},H={READY:"배송준비",PREPARING:"상품준비중",SHIPPED:"배송중",DELIVERED:"배송완료"},_={REQUESTED:"요청",APPROVED:"승인",PICKUP_SCHEDULED:"회수예정",RECEIVED:"회수완료",REFUNDING:"환불처리중",REFUNDED:"환불완료",REJECTED:"반려",CLOSED:"종결"},T={PENDING:"정산대기",HOLD:"정산보류",SCHEDULED:"지급예정",PAID:"지급완료"},j={OPEN:"접수",ANSWERED:"답변완료",CLOSED:"종결"},G={VISIBLE:"노출",HIDDEN:"숨김",DELETED:"삭제"},Ve={...Z,...F,...H,..._,...T,...j,...G},V={DELIVERY:"배송",RETURN_REFUND:"반품/환불",PAYMENT:"결제",ORDER:"주문",PRODUCT:"상품",ETC:"기타"},Y={LOW:"낮음",NORMAL:"보통",HIGH:"높음",URGENT:"긴급"},i={user:null,activeTab:"dashboard",dashboard:null,orders:[],returns:[],settlements:[],inquiries:[],selectedInquiryId:null,expandedInquiryId:null,reviews:[],reviewPage:1,reviewPageSize:10,reviewTotalPages:1,reviewTotalCount:0,managedBanners:[],managedProducts:[],managedUsers:[],coupons:[],staffUsers:[],editingRows:{orders:new Set,returns:new Set,settlements:new Set,banners:new Set,products:new Set,users:new Set}},a={reloadBtn:document.getElementById("adminReloadBtn"),generateSettlementBtn:document.getElementById("adminGenerateSettlementBtn"),notice:document.getElementById("adminActionNotice"),navButtons:Array.from(document.querySelectorAll("[data-tab-btn]")),tabPanels:Array.from(document.querySelectorAll("[data-tab-panel]")),summary:document.getElementById("adminSummary"),dashboardOrders:document.getElementById("adminDashboardOrders"),dashboardReturns:document.getElementById("adminDashboardReturns"),dashboardInquiries:document.getElementById("adminDashboardInquiries"),dashboardSettlements:document.getElementById("adminDashboardSettlements"),dashboardReviews:document.getElementById("adminDashboardReviews"),orders:document.getElementById("adminOrders"),orderSearch:document.getElementById("adminOrderSearch"),orderStatus:document.getElementById("adminOrderStatusFilter"),paymentStatus:document.getElementById("adminPaymentStatusFilter"),shippingStatus:document.getElementById("adminShippingStatusFilter"),orderOpenReturnOnly:document.getElementById("adminOrderOpenReturnOnly"),orderSearchBtn:document.getElementById("adminOrderSearchBtn"),returns:document.getElementById("adminReturns"),returnSearch:document.getElementById("adminReturnSearch"),returnStatus:document.getElementById("adminReturnStatusFilter"),returnSearchBtn:document.getElementById("adminReturnSearchBtn"),returnCreateForm:document.getElementById("adminReturnCreateForm"),returnOrderNo:document.getElementById("returnOrderNo"),returnReasonTitle:document.getElementById("returnReasonTitle"),returnReasonDetail:document.getElementById("returnReasonDetail"),returnRequestedAmount:document.getElementById("returnRequestedAmount"),settlements:document.getElementById("adminSettlements"),settlementSearch:document.getElementById("adminSettlementSearch"),settlementStatus:document.getElementById("adminSettlementStatusFilter"),settlementSearchBtn:document.getElementById("adminSettlementSearchBtn"),inquirySearch:document.getElementById("adminInquirySearch"),inquiryStatus:document.getElementById("adminInquiryStatusFilter"),inquiryCategory:document.getElementById("adminInquiryCategoryFilter"),inquiryPriority:document.getElementById("adminInquiryPriorityFilter"),inquiryOverdueOnly:document.getElementById("adminInquiryOverdueOnly"),inquirySearchBtn:document.getElementById("adminInquirySearchBtn"),inquiries:document.getElementById("adminInquiries"),inquiryEditor:document.getElementById("adminInquiryEditor"),inquiryEditorCloseBtn:document.getElementById("adminInquiryEditorCloseBtn"),inquiryEditorMeta:document.getElementById("adminInquiryEditorMeta"),inquiryEditorStatus:document.getElementById("adminInquiryEditorStatus"),inquiryEditorCategory:document.getElementById("adminInquiryEditorCategory"),inquiryEditorPriority:document.getElementById("adminInquiryEditorPriority"),inquiryEditorAssignedAdmin:document.getElementById("adminInquiryEditorAssignedAdmin"),inquiryEditorSlaDueAt:document.getElementById("adminInquiryEditorSlaDueAt"),inquiryEditorAnswer:document.getElementById("adminInquiryEditorAnswer"),inquiryEditorInternalNote:document.getElementById("adminInquiryEditorInternalNote"),inquiryEditorSaveBtn:document.getElementById("adminInquiryEditorSaveBtn"),inquiryEditorDeleteBtn:document.getElementById("adminInquiryEditorDeleteBtn"),inquiryEditorSavedState:document.getElementById("adminInquiryEditorSavedState"),managedBanners:document.getElementById("adminManagedBanners"),bannerCreateForm:document.getElementById("adminBannerCreateForm"),bannerTitle:document.getElementById("bannerTitle"),bannerSubtitle:document.getElementById("bannerSubtitle"),bannerDescription:document.getElementById("bannerDescription"),bannerCtaText:document.getElementById("bannerCtaText"),bannerLinkUrl:document.getElementById("bannerLinkUrl"),bannerSortOrder:document.getElementById("bannerSortOrder"),bannerIsActive:document.getElementById("bannerIsActive"),bannerImageFile:document.getElementById("bannerImageFile"),managedProducts:document.getElementById("adminManagedProducts"),managedProductSearch:document.getElementById("adminManagedProductSearch"),managedProductActiveFilter:document.getElementById("adminManagedProductActiveFilter"),managedProductSearchBtn:document.getElementById("adminManagedProductSearchBtn"),productCreateForm:document.getElementById("adminProductCreateForm"),productName:document.getElementById("managedProductName"),productOneLine:document.getElementById("managedProductOneLine"),productDescription:document.getElementById("managedProductDescription"),productPrice:document.getElementById("managedProductPrice"),productOriginalPrice:document.getElementById("managedProductOriginalPrice"),productStock:document.getElementById("managedProductStock"),productBadges:document.getElementById("managedProductBadges"),productIsActive:document.getElementById("managedProductIsActive"),productThumbnail:document.getElementById("managedProductThumbnail"),managedUsers:document.getElementById("adminMembers"),memberSearch:document.getElementById("adminMemberSearch"),memberActiveFilter:document.getElementById("adminMemberActiveFilter"),memberStaffFilter:document.getElementById("adminMemberStaffFilter"),memberSearchBtn:document.getElementById("adminMemberSearchBtn"),reviewStatus:document.getElementById("adminReviewStatusFilter"),reviewSort:document.getElementById("adminReviewSortFilter"),reviewSearch:document.getElementById("adminReviewSearch"),reviewSearchBtn:document.getElementById("adminReviewSearchBtn"),reviewPagination:document.getElementById("adminReviewPagination"),reviews:document.getElementById("adminReviews"),couponForm:document.getElementById("adminCouponForm"),couponTarget:document.getElementById("couponTarget"),couponEmailField:document.getElementById("couponEmailField"),couponEmail:document.getElementById("couponEmail"),couponName:document.getElementById("couponName"),couponCode:document.getElementById("couponCode"),couponDiscountAmount:document.getElementById("couponDiscountAmount"),couponMinOrderAmount:document.getElementById("couponMinOrderAmount"),couponExpiresAt:document.getElementById("couponExpiresAt"),couponSearch:document.getElementById("adminCouponSearch"),coupons:document.getElementById("adminCoupons")};let L=null;function Ye(t){return!!(t?.is_staff??t?.isStaff)}function d(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#39;")}function s(t,e="success"){a.notice&&(a.notice.textContent=t,a.notice.classList.remove("hidden","success","error"),a.notice.classList.add(e==="error"?"error":"success"),L&&clearTimeout(L),L=setTimeout(()=>{a.notice.classList.add("hidden"),a.notice.classList.remove("success","error"),a.notice.textContent=""},3200))}function u(t){if(!t)return"-";const e=new Date(t);if(Number.isNaN(e.getTime()))return"-";const n=e.getFullYear(),r=String(e.getMonth()+1).padStart(2,"0"),l=String(e.getDate()).padStart(2,"0"),b=String(e.getHours()).padStart(2,"0"),R=String(e.getMinutes()).padStart(2,"0");return`${n}.${r}.${l} ${b}:${R}`}function ze(t,e=220){const n=String(t||"").trim();if(!n)return"";const r=n.length>e?`${n.slice(0,e)}...`:n;return d(r).replace(/\n/g,"<br />")}function We(t){const e=String(t||"").trim();return e?d(e).replace(/\n/g,"<br />"):""}function p(t,e){const n=i.editingRows?.[t];return n?n.has(String(e)):!1}function o(t,e,n){const r=i.editingRows?.[t];if(!r)return;const l=String(e);if(n){r.clear(),r.add(l);return}r.delete(l)}function S(t){const e=i.editingRows?.[t];e&&e.clear()}function ee(t){if(!t)return null;const e=new Date(t);return Number.isNaN(e.getTime())?null:e.toISOString()}function Qe(t){if(!t)return"";const e=new Date(t);if(Number.isNaN(e.getTime()))return"";const n=e.getFullYear(),r=String(e.getMonth()+1).padStart(2,"0"),l=String(e.getDate()).padStart(2,"0"),b=String(e.getHours()).padStart(2,"0"),R=String(e.getMinutes()).padStart(2,"0");return`${n}-${r}-${l}T${b}:${R}`}function B(t,e=null){return t?e&&e[t]?e[t]:Ve[t]||V[t]||Y[t]||t:"-"}function h(t,e=null){const n=t||"-";return`<span class="admin-status ${String(n).toLowerCase().replace(/[^a-z0-9]+/g,"_")}">${d(B(n,e))}</span>`}function I(t,e,n=null){return t.map(r=>`<option value="${d(r)}" ${r===e?"selected":""}>${d(B(r,n))}</option>`).join("")}function Je(t){const e=['<option value="">미할당</option>'],n=i.staffUsers.map(r=>{const l=`${r.name||"관리자"} (${r.email})`;return`<option value="${r.id}" ${Number(r.id)===Number(t)?"selected":""}>${d(l)}</option>`});return[...e,...n].join("")}function Ke(t){const e=[];return t.postalCode&&e.push(`(${t.postalCode})`),t.roadAddress&&e.push(t.roadAddress),t.detailAddress&&e.push(t.detailAddress),e.join(" ").trim()||"-"}function te(t){return String(t||"").split(",").map(e=>e.trim().toUpperCase()).filter(Boolean)}function N(t,e="success"){a.inquiryEditorSavedState&&(a.inquiryEditorSavedState.textContent=t,a.inquiryEditorSavedState.classList.remove("hidden"),a.inquiryEditorSavedState.style.borderColor=e==="error"?"#fecaca":"#bbf7d0",a.inquiryEditorSavedState.style.background=e==="error"?"#fef2f2":"#f0fdf4",a.inquiryEditorSavedState.style.color=e==="error"?"#991b1b":"#166534")}function z(){a.inquiryEditorSavedState&&(a.inquiryEditorSavedState.classList.add("hidden"),a.inquiryEditorSavedState.textContent="")}function Q(t){ke.includes(t)&&(i.activeTab=t,a.navButtons.forEach(e=>{const n=e.dataset.tabBtn===t;e.classList.toggle("active",n),e.setAttribute("aria-pressed",String(n))}),a.tabPanels.forEach(e=>{const n=e.dataset.tabPanel===t;e.classList.toggle("is-active",n),e.hidden=!n}))}function Xe(){const t=i.dashboard?.summary||{};a.summary.innerHTML=`
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
      <strong>${m(t.totalPaidAmount||0)}</strong>
    </article>
    <article>
      <p>오늘 결제금액</p>
      <strong>${m(t.todayPaidAmount||0)}</strong>
    </article>
    <article>
      <p>반품 진행 / 완료</p>
      <strong>${t.openReturnCount||0} / ${t.completedReturnCount||0}</strong>
    </article>
    <article>
      <p>정산 예정금</p>
      <strong>${m(t.pendingSettlementAmount||0)}</strong>
    </article>
    <article>
      <p>정산 지급완료</p>
      <strong>${m(t.paidSettlementAmount||0)}</strong>
    </article>
    <article>
      <p>CS 미처리 / SLA 지연</p>
      <strong>${t.openInquiryCount||0} / ${t.overdueInquiryCount||0}</strong>
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
      <p>숨김 리뷰</p>
      <strong>${t.hiddenReviewCount||0}건</strong>
    </article>
  `}function Ze(){const t=i.dashboard?.recentOrders||[];if(!t.length){a.dashboardOrders.innerHTML='<p class="empty">최근 주문 데이터가 없습니다.</p>';return}a.dashboardOrders.innerHTML=t.slice(0,8).map(e=>`
      <article class="admin-mini-item">
        <strong>${d(e.orderNo)}</strong>
        <p>${u(e.createdAt)} · ${m(e.totalAmount)}</p>
        <p>${h(e.paymentStatus,F)} ${h(e.shippingStatus,H)}</p>
      </article>
    `).join("")}function et(){const t=i.dashboard?.recentReturns||[];if(!t.length){a.dashboardReturns.innerHTML='<p class="empty">최근 반품/환불 데이터가 없습니다.</p>';return}a.dashboardReturns.innerHTML=t.slice(0,8).map(e=>`
      <article class="admin-mini-item">
        <strong>${d(e.orderNo)}</strong>
        <p>${d(e.userEmail||"-")} · ${m(e.requestedAmount)}</p>
        <p>${h(e.status,_)}</p>
      </article>
    `).join("")}function tt(){const t=i.dashboard?.recentInquiries||[];if(!t.length){a.dashboardInquiries.innerHTML='<p class="empty">최근 CS 데이터가 없습니다.</p>';return}a.dashboardInquiries.innerHTML=t.slice(0,8).map(e=>`
      <article class="admin-mini-item">
        <strong>${d(e.title)}</strong>
        <p>${d(e.userEmail||"-")} · ${u(e.createdAt)}</p>
        <p>${h(e.status,j)} ${h(e.priority,Y)}</p>
      </article>
    `).join("")}function nt(){const t=i.dashboard?.recentSettlements||[];if(!t.length){a.dashboardSettlements.innerHTML='<p class="empty">최근 정산 데이터가 없습니다.</p>';return}a.dashboardSettlements.innerHTML=t.slice(0,8).map(e=>`
      <article class="admin-mini-item">
        <strong>${d(e.orderNo)}</strong>
        <p>${d(e.userEmail||"-")} · ${m(e.settlementAmount)}</p>
        <p>${h(e.status,T)}</p>
      </article>
    `).join("")}function at(){const t=i.dashboard?.recentReviews||[];if(!t.length){a.dashboardReviews.innerHTML='<p class="empty">최근 리뷰 데이터가 없습니다.</p>';return}a.dashboardReviews.innerHTML=t.slice(0,8).map(e=>`
      <article class="admin-mini-item">
        <strong>${d(e.productName)}</strong>
        <p>${d(e.userEmail||"-")} · ${u(e.createdAt)}</p>
        <p>${h(e.status,G)} · 평점 ${e.score}</p>
      </article>
    `).join("")}function rt(){Ze(),et(),tt(),nt(),at()}function C(){if(!i.orders.length){a.orders.innerHTML='<p class="empty">조건에 맞는 주문이 없습니다.</p>';return}a.orders.innerHTML=`
    <div class="admin-excel-wrap">
      <table class="admin-excel-table admin-orders-table">
        <thead>
          <tr>
            <th>작업</th>
            <th>주문번호</th>
            <th>주문일시</th>
            <th>주문자명</th>
            <th>연락처</th>
            <th>배송지</th>
            <th>주문상태</th>
            <th>결제상태</th>
            <th>배송상태</th>
            <th>정산상태</th>
            <th>반품</th>
            <th>택배사(송장표기)</th>
            <th>송장번호</th>
          </tr>
        </thead>
        <tbody>
          ${i.orders.map(t=>{const e=p("orders",t.orderNo),n=e?"":"disabled";return`
              <tr data-order-no="${d(t.orderNo)}" class="${e?"is-editing":"is-readonly"}">
                <td class="admin-cell-actions">
                  <div class="admin-inline-actions">
                    ${e?`
                          <button class="ghost" type="button" data-action="issueInvoice">송장발급</button>
                          <button class="ghost" type="button" data-action="markDelivered">배송완료</button>
                          <button class="primary" type="button" data-action="saveOrder">저장</button>
                          <button class="ghost" type="button" data-action="cancelOrderEdit">취소</button>
                        `:'<button class="primary" type="button" data-action="editOrder">수정</button>'}
                  </div>
                </td>
                <td><strong>${d(t.orderNo)}</strong></td>
                <td>${u(t.createdAt)} (상품 ${t.itemCount}개 / ${m(t.totalAmount)})</td>
                <td>${d(t.userName||t.recipient||"-")}</td>
                <td>${d(t.phone||"-")}</td>
                <td>${d(Ke(t))}</td>
                <td class="admin-cell-select">
                  <select data-role="order-status" ${n}>${I(Fe,t.status,Z)}</select>
                </td>
                <td class="admin-cell-select">
                  <select data-role="payment-status" ${n}>${I(He,t.paymentStatus,F)}</select>
                </td>
                <td class="admin-cell-select">
                  <select data-role="shipping-status" ${n}>${I(_e,t.shippingStatus,H)}</select>
                </td>
                <td>${h(t.settlementStatus||"-",T)}</td>
                <td>${t.returnRequestCount}건 ${t.hasOpenReturn?"(진행중)":""}</td>
                <td>
                  <input type="text" data-role="courier-name" placeholder="고객표시 택배사" value="${d(t.courierName||"")}" ${n} />
                </td>
                <td>
                  <input type="text" data-role="tracking-no" placeholder="송장번호" value="${d(t.trackingNo||"")}" ${n} />
                </td>
              </tr>
            `}).join("")}
        </tbody>
      </table>
    </div>
  `}function M(){if(!i.returns.length){a.returns.innerHTML='<p class="empty">반품/환불 데이터가 없습니다.</p>';return}a.returns.innerHTML=`
    <div class="admin-excel-wrap">
      <table class="admin-excel-table admin-returns-table">
        <thead>
          <tr>
            <th>작업</th>
            <th>주문번호</th>
            <th>회원</th>
            <th>요청사유</th>
            <th>요청금액</th>
            <th>상태</th>
            <th>승인금액</th>
            <th>회수택배사</th>
            <th>회수송장번호</th>
            <th>반려사유</th>
            <th>메모</th>
            <th>요청일시</th>
          </tr>
        </thead>
        <tbody>
          ${i.returns.map(t=>{const e=p("returns",t.id),n=e?"":"disabled";return`
              <tr data-return-id="${t.id}" class="${e?"is-editing":"is-readonly"}">
                <td class="admin-cell-actions">
                  <div class="admin-inline-actions">
                    ${e?`
                          <button class="primary" type="button" data-action="saveReturn">저장</button>
                          <button class="ghost" type="button" data-action="cancelReturnEdit">취소</button>
                        `:'<button class="primary" type="button" data-action="editReturn">수정</button>'}
                    <button class="danger" type="button" data-action="deleteReturn">삭제</button>
                  </div>
                </td>
                <td><strong>${d(t.orderNo)}</strong></td>
                <td>${d(t.userEmail||"-")}</td>
                <td>
                  <p><b>${d(t.reasonTitle)}</b></p>
                  <small>${d(t.reasonDetail||"(상세 사유 없음)")}</small>
                </td>
                <td>${m(t.requestedAmount)}</td>
                <td>
                  <select data-role="return-status" ${n}>${I(je,t.status,_)}</select>
                </td>
                <td>
                  <input type="number" min="0" data-role="approved-amount" value="${t.approvedAmount||0}" ${n} />
                </td>
                <td>
                  <input type="text" data-role="pickup-courier" placeholder="회수 택배사" value="${d(t.pickupCourierName||"")}" ${n} />
                </td>
                <td>
                  <input type="text" data-role="pickup-tracking" placeholder="회수 송장번호" value="${d(t.pickupTrackingNo||"")}" ${n} />
                </td>
                <td>
                  <input type="text" data-role="rejected-reason" placeholder="반려 사유" value="${d(t.rejectedReason||"")}" ${n} />
                </td>
                <td>
                  <input type="text" data-role="admin-note" placeholder="관리 메모" value="${d(t.adminNote||"")}" ${n} />
                </td>
                <td>${u(t.requestedAt)}</td>
              </tr>
            `}).join("")}
        </tbody>
      </table>
    </div>
  `}function O(){if(!i.settlements.length){a.settlements.innerHTML='<p class="empty">정산 데이터가 없습니다.</p>';return}a.settlements.innerHTML=`
    <div class="admin-excel-wrap">
      <table class="admin-excel-table admin-settlements-table">
        <thead>
          <tr>
            <th>작업</th>
            <th>주문번호</th>
            <th>회원</th>
            <th>상태</th>
            <th>총 결제금액</th>
            <th>PG수수료</th>
            <th>플랫폼수수료</th>
            <th>반품차감</th>
            <th>정산금</th>
            <th>지급예정일</th>
            <th>메모</th>
          </tr>
        </thead>
        <tbody>
          ${i.settlements.map(t=>{const e=p("settlements",t.id),n=e?"":"disabled";return`
              <tr data-settlement-id="${t.id}" class="${e?"is-editing":"is-readonly"}">
                <td class="admin-cell-actions">
                  <div class="admin-inline-actions">
                    ${e?`
                          <button class="ghost" type="button" data-action="markSettlementPaid">지급완료</button>
                          <button class="primary" type="button" data-action="saveSettlement">저장</button>
                          <button class="ghost" type="button" data-action="cancelSettlementEdit">취소</button>
                        `:'<button class="primary" type="button" data-action="editSettlement">수정</button>'}
                    <button class="danger" type="button" data-action="deleteSettlement">삭제</button>
                  </div>
                </td>
                <td>
                  <strong>${d(t.orderNo)}</strong>
                  <small>${u(t.orderCreatedAt)}</small>
                </td>
                <td>${d(t.userEmail||"-")}</td>
                <td>
                  <select data-role="settlement-status" ${n}>${I(Ge,t.status,T)}</select>
                </td>
                <td>${m(t.grossAmount)}</td>
                <td><input type="number" data-role="pg-fee" value="${t.pgFee}" ${n} /></td>
                <td><input type="number" data-role="platform-fee" value="${t.platformFee}" ${n} /></td>
                <td><input type="number" data-role="return-deduction" value="${t.returnDeduction}" ${n} /></td>
                <td>
                  <strong>${m(t.settlementAmount)}</strong>
                  <small>지급 ${u(t.paidAt)}</small>
                </td>
                <td><input type="date" data-role="expected-payout-date" value="${d(t.expectedPayoutDate||"")}" ${n} /></td>
                <td><input type="text" data-role="settlement-memo" value="${d(t.memo||"")}" ${n} /></td>
              </tr>
            `}).join("")}
        </tbody>
      </table>
    </div>
  `}function D(){if(!i.inquiries.length){a.inquiries.innerHTML='<p class="empty">문의 내역이 없습니다.</p>';return}a.inquiries.innerHTML=`
    <div class="admin-excel-wrap">
      <table class="admin-excel-table admin-cs-table">
        <thead>
          <tr>
            <th class="admin-cs-col-actions">작업</th>
            <th class="admin-cs-col-id">ID</th>
            <th class="admin-cs-col-member">회원</th>
            <th class="admin-cs-col-title">문의제목</th>
            <th class="admin-cs-col-category">카테고리</th>
            <th class="admin-cs-col-status">상태</th>
            <th class="admin-cs-col-priority">우선순위</th>
            <th class="admin-cs-col-created">등록일시</th>
          </tr>
        </thead>
        <tbody>
          ${i.inquiries.map(t=>{const e=!!String(t.answer||"").trim(),n=Number(t.id)===Number(i.selectedInquiryId),r=e&&Number(t.id)===Number(i.expandedInquiryId),l=e?We(t.answer):"";return`
              <tr class="${n?"is-selected":""}">
                <td class="admin-cs-col-actions">
                  <div class="admin-inline-actions">
                    ${e?`
                          <button class="ghost admin-cs-btn-edit" type="button" data-action="openInquiryEditor" data-inquiry-id="${t.id}">수정</button>
                          <button class="ghost admin-cs-btn-view ${r?"is-open":""}" type="button" data-action="toggleInquiryAnswer" data-inquiry-id="${t.id}">확인</button>
                        `:`<button class="primary admin-cs-btn-answer" type="button" data-action="openInquiryEditor" data-inquiry-id="${t.id}">답변</button>`}
                  </div>
                </td>
                <td class="admin-cs-col-id">${t.id}</td>
                <td class="admin-cs-col-member">
                  <p>${d(t.userName||"회원")}</p>
                  <small>${d(t.userEmail||"-")}</small>
                </td>
                <td class="admin-cs-col-title">
                  <strong>${d(t.title)}</strong>
                  <small>${ze(t.content,180)}</small>
                </td>
                <td class="admin-cs-col-category">${d(B(t.category,V))}</td>
                <td class="admin-cs-col-status">
                  ${h(t.status,j)}
                  ${t.isSlaOverdue?'<span class="admin-status overdue">SLA 지연</span>':""}
                </td>
                <td class="admin-cs-col-priority">${d(B(t.priority,Y))}</td>
                <td class="admin-cs-col-created">${u(t.createdAt)}</td>
              </tr>
              ${r?`
                    <tr class="admin-cs-answer-row">
                      <td colspan="8">
                        <section class="admin-cs-inline-answer">
                          <p class="admin-cs-inline-answer-meta">답변 등록일 ${u(t.answeredAt||t.updatedAt)}</p>
                          <div class="admin-cs-inline-answer-body">${l}</div>
                        </section>
                      </td>
                    </tr>
                  `:""}
            `}).join("")}
        </tbody>
      </table>
    </div>
  `}function it(t){const e=i.inquiries.find(n=>Number(n.id)===Number(t));!e||!String(e.answer||"").trim()||(Number(i.expandedInquiryId)===Number(t)?i.expandedInquiryId=null:i.expandedInquiryId=t,D())}function ne(t){const e=i.inquiries.find(n=>Number(n.id)===Number(t));if(!e){i.selectedInquiryId=null,a.inquiryEditor?.classList.add("hidden");return}if(i.selectedInquiryId=e.id,z(),a.inquiryEditorMeta){const n=`${B(e.category,V)} · ${d(e.userName||e.userEmail||"회원")} · ${u(e.createdAt)}`;a.inquiryEditorMeta.textContent=`${e.title} (${n})`}a.inquiryEditorStatus.value=e.status||"OPEN",a.inquiryEditorCategory.value=e.category||"ETC",a.inquiryEditorPriority.value=e.priority||"NORMAL",a.inquiryEditorAssignedAdmin.innerHTML=Je(e.assignedAdminId),a.inquiryEditorSlaDueAt.value=Qe(e.slaDueAt),a.inquiryEditorAnswer.value=e.answer||"",a.inquiryEditorInternalNote.value=e.internalNote||"",a.inquiryEditorDeleteBtn&&(a.inquiryEditorDeleteBtn.disabled=!e.answer),a.inquiryEditor?.classList.remove("hidden"),D()}function ae(){i.selectedInquiryId=null,a.inquiryEditor&&a.inquiryEditor.classList.add("hidden"),a.inquiryEditorMeta&&(a.inquiryEditorMeta.textContent="문의를 선택하면 답변 입력창이 열립니다."),z(),a.inquiryEditorDeleteBtn&&(a.inquiryEditorDeleteBtn.disabled=!0),D()}function dt(){if(!i.reviews.length){a.reviews.innerHTML='<p class="empty">리뷰가 없습니다.</p>';return}a.reviews.innerHTML=`
    <div class="admin-excel-wrap">
      <table class="admin-excel-table admin-review-table">
        <thead>
          <tr>
            <th>작업</th>
            <th>ID</th>
            <th>상품</th>
            <th>작성자</th>
            <th>별점</th>
            <th>리뷰 내용</th>
            <th>이미지</th>
            <th>상태</th>
            <th>작성일시</th>
          </tr>
        </thead>
        <tbody>
          ${i.reviews.map(t=>`
              <tr data-review-id="${t.id}">
                <td>
                  <div class="admin-inline-actions">
                    <button class="ghost" type="button" data-action="hideReview" ${t.status==="HIDDEN"?"disabled":""}>숨기기</button>
                    <button class="primary" type="button" data-action="showReview" ${t.status==="VISIBLE"?"disabled":""}>노출</button>
                    <button class="danger" type="button" data-action="deleteReview" ${t.status==="DELETED"?"disabled":""}>삭제</button>
                  </div>
                </td>
                <td>${t.id}</td>
                <td>
                  <p><strong>${d(t.productName)}</strong></p>
                  <small>상품ID ${t.productId}</small>
                </td>
                <td>
                  <p>${d(t.userName||"회원")}</p>
                  <small>${d(t.userEmail||"-")}</small>
                </td>
                <td>${t.score} / 5</td>
                <td>
                  <p><b>${d(t.title||"(제목 없음)")}</b></p>
                  <small>${d(t.content)}</small>
                </td>
                <td>
                  ${t.images.length?`<div class="admin-review-image-grid">
                          ${t.images.slice(0,3).map((e,n)=>`<img src="${d(e)}" alt="리뷰 이미지 ${n+1}" />`).join("")}
                        </div>`:"<small>이미지 없음</small>"}
                </td>
                <td>${h(t.status,G)}</td>
                <td>${u(t.createdAt)}</td>
              </tr>
            `).join("")}
        </tbody>
      </table>
    </div>
  `}function st(){if(!a.reviewPagination)return;const t=Math.max(i.reviewTotalPages||1,1),e=Math.min(Math.max(i.reviewPage||1,1),t);if(t<=1){a.reviewPagination.innerHTML="";return}const n=Math.max(1,e-2),r=Math.min(t,n+4),l=[];for(let b=n;b<=r;b+=1)l.push(`
      <button class="ghost ${b===e?"active":""}" type="button" data-action="goReviewPage" data-page="${b}">${b}</button>
    `);a.reviewPagination.innerHTML=`
    <button class="ghost" type="button" data-action="goReviewPage" data-page="${e-1}" ${e<=1?"disabled":""}>이전</button>
    ${l.join("")}
    <button class="ghost" type="button" data-action="goReviewPage" data-page="${e+1}" ${e>=t?"disabled":""}>다음</button>
    <span class="admin-page-summary">총 ${i.reviewTotalCount}건</span>
  `}function ot(){if(!i.coupons.length){a.coupons.innerHTML='<p class="empty">쿠폰 데이터가 없습니다.</p>';return}a.coupons.innerHTML=`
    <div class="admin-excel-wrap">
      <table class="admin-excel-table">
        <thead>
          <tr>
            <th>작업</th>
            <th>회원</th>
            <th>쿠폰</th>
            <th>할인/조건</th>
            <th>상태</th>
            <th>만료</th>
          </tr>
        </thead>
        <tbody>
          ${i.coupons.map(t=>`
              <tr data-coupon-id="${t.id}">
                <td>
                  <button class="danger" type="button" data-action="deleteCoupon" ${t.isUsed?"disabled":""}>삭제</button>
                </td>
                <td>${d(t.userEmail||"-")}</td>
                <td>
                  <strong>${d(t.name)}</strong>
                  <p>${d(t.code)}</p>
                </td>
                <td>
                  <p>${m(t.discountAmount)}</p>
                  <small>${t.minOrderAmount?`${m(t.minOrderAmount)} 이상`:"최소금액 없음"}</small>
                </td>
                <td>${t.isUsed?"사용완료":t.isExpired?"만료":"사용가능"}</td>
                <td>${u(t.expiresAt)}</td>
              </tr>
            `).join("")}
        </tbody>
      </table>
    </div>
  `}function U(){if(!i.managedBanners.length){a.managedBanners.innerHTML='<p class="empty">등록된 배너가 없습니다.</p>';return}a.managedBanners.innerHTML=`
    <div class="admin-excel-wrap">
      <table class="admin-excel-table admin-banners-table">
        <thead>
          <tr>
            <th>작업</th>
            <th>ID</th>
            <th>제목</th>
            <th>서브타이틀</th>
            <th>설명</th>
            <th>CTA</th>
            <th>링크</th>
            <th>순서</th>
            <th>활성</th>
            <th>이미지</th>
          </tr>
        </thead>
        <tbody>
          ${i.managedBanners.map(t=>{const e=p("banners",t.id),n=e?"":"disabled";return`
                <tr data-banner-id="${t.id}" class="${e?"is-editing":"is-readonly"}">
                  <td class="admin-cell-actions">
                    <div class="admin-inline-actions">
                      ${e?`
                            <button class="primary" type="button" data-action="saveBanner">저장</button>
                            <button class="ghost" type="button" data-action="cancelBannerEdit">취소</button>
                          `:'<button class="primary" type="button" data-action="editBanner">수정</button>'}
                      <button class="danger" type="button" data-action="deleteBanner">삭제</button>
                    </div>
                  </td>
                  <td>${t.id}</td>
                  <td><input type="text" data-role="title" value="${d(t.title)}" ${n} /></td>
                  <td><input type="text" data-role="subtitle" value="${d(t.subtitle)}" ${n} /></td>
                  <td><input type="text" data-role="description" value="${d(t.description)}" ${n} /></td>
                  <td><input type="text" data-role="cta-text" value="${d(t.ctaText)}" ${n} /></td>
                  <td><input type="text" data-role="link-url" value="${d(t.linkUrl)}" ${n} /></td>
                  <td><input type="number" data-role="sort-order" min="0" value="${t.sortOrder}" ${n} /></td>
                  <td>
                    <label class="admin-check-inline">
                      <input type="checkbox" data-role="is-active" ${t.isActive?"checked":""} ${n} />
                      <span>활성</span>
                    </label>
                  </td>
                  <td>
                    <div class="admin-image-cell">
                      ${t.imageUrl?`<img class="admin-banner-thumb" src="${d(t.imageUrl)}" alt="배너 ${t.id}" />`:'<span class="empty">이미지 없음</span>'}
                      <input class="admin-file-input" type="file" data-role="image-file" accept="image/*" ${n} />
                    </div>
                  </td>
                </tr>
              `}).join("")}
        </tbody>
      </table>
    </div>
  `}function x(){if(!i.managedProducts.length){a.managedProducts.innerHTML='<p class="empty">등록된 상품이 없습니다.</p>';return}a.managedProducts.innerHTML=`
    <div class="admin-excel-wrap">
      <table class="admin-excel-table admin-managed-products-table">
        <thead>
          <tr>
            <th>작업</th>
            <th>ID</th>
            <th>상품명</th>
            <th>한줄소개</th>
            <th>판매가</th>
            <th>정상가</th>
            <th>재고</th>
            <th>배지</th>
            <th>활성</th>
            <th>썸네일</th>
            <th>설명</th>
          </tr>
        </thead>
        <tbody>
          ${i.managedProducts.map(t=>{const e=p("products",t.id),n=e?"":"disabled";return`
                <tr data-product-id="${t.id}" class="${e?"is-editing":"is-readonly"}">
                  <td class="admin-cell-actions">
                    <div class="admin-inline-actions">
                      ${e?`
                            <button class="primary" type="button" data-action="saveManagedProduct">저장</button>
                            <button class="ghost" type="button" data-action="cancelManagedProductEdit">취소</button>
                          `:'<button class="primary" type="button" data-action="editManagedProduct">수정</button>'}
                      <button class="danger" type="button" data-action="deleteManagedProduct">삭제</button>
                    </div>
                  </td>
                  <td>${t.id}</td>
                  <td><input type="text" data-role="name" value="${d(t.name)}" ${n} /></td>
                  <td><input type="text" data-role="one-line" value="${d(t.oneLine)}" ${n} /></td>
                  <td><input type="number" min="0" data-role="price" value="${t.price}" ${n} /></td>
                  <td><input type="number" min="0" data-role="original-price" value="${t.originalPrice}" ${n} /></td>
                  <td><input type="number" min="0" data-role="stock" value="${t.stock}" ${n} /></td>
                  <td>
                    <input type="text" data-role="badge-types" value="${d(t.badgeTypes.join(","))}" ${n} />
                    <div>
                      ${t.badgeTypes.map(r=>`<span class="admin-badge-chip">${d(r)}</span>`).join("")}
                    </div>
                  </td>
                  <td>
                    <label class="admin-check-inline">
                      <input type="checkbox" data-role="is-active" ${t.isActive?"checked":""} ${n} />
                      <span>활성</span>
                    </label>
                  </td>
                  <td>
                    <div class="admin-image-cell">
                      ${t.thumbnailUrl?`<img class="admin-product-thumb" src="${d(t.thumbnailUrl)}" alt="상품 ${t.id}" />`:'<span class="empty">이미지 없음</span>'}
                      <input class="admin-file-input" type="file" data-role="thumbnail-file" accept="image/*" ${n} />
                    </div>
                  </td>
                  <td><input type="text" data-role="description" value="${d(t.description)}" ${n} /></td>
                </tr>
              `}).join("")}
        </tbody>
      </table>
    </div>
  `}function k(){if(!i.managedUsers.length){a.managedUsers.innerHTML='<p class="empty">조회된 회원이 없습니다.</p>';return}a.managedUsers.innerHTML=`
    <div class="admin-excel-wrap">
      <table class="admin-excel-table admin-members-table">
        <thead>
          <tr>
            <th>작업</th>
            <th>ID</th>
            <th>이메일</th>
            <th>이름</th>
            <th>전화번호</th>
            <th>상태</th>
            <th>권한</th>
            <th>주문/리뷰/문의</th>
            <th>가입일</th>
            <th>최근로그인</th>
          </tr>
        </thead>
        <tbody>
          ${i.managedUsers.map(t=>{const e=p("users",t.id),n=e?"":"disabled";return`
                <tr data-user-id="${t.id}" class="${e?"is-editing":"is-readonly"}">
                  <td class="admin-cell-actions">
                    <div class="admin-inline-actions">
                      ${e?`
                            <button class="primary" type="button" data-action="saveManagedUser">저장</button>
                            <button class="ghost" type="button" data-action="cancelManagedUserEdit">취소</button>
                          `:'<button class="primary" type="button" data-action="editManagedUser">수정</button>'}
                      <button class="danger" type="button" data-action="deactivateManagedUser" ${t.isActive?"":"disabled"}>비활성화</button>
                    </div>
                  </td>
                  <td>${t.id}</td>
                  <td>${d(t.email)}</td>
                  <td><input type="text" data-role="name" value="${d(t.name)}" ${n} /></td>
                  <td><input type="text" data-role="phone" value="${d(t.phone)}" ${n} /></td>
                  <td>
                    <select data-role="is-active" ${n}>
                      <option value="true" ${t.isActive?"selected":""}>활성</option>
                      <option value="false" ${t.isActive?"":"selected"}>비활성</option>
                    </select>
                  </td>
                  <td>
                    <select data-role="is-staff" ${n}>
                      <option value="false" ${t.isStaff?"":"selected"}>일반회원</option>
                      <option value="true" ${t.isStaff?"selected":""}>관리자</option>
                    </select>
                  </td>
                  <td>${t.orderCount} / ${t.reviewCount} / ${t.inquiryCount}</td>
                  <td>${u(t.createdAt)}</td>
                  <td>${u(t.lastLogin)}</td>
                </tr>
              `}).join("")}
        </tbody>
      </table>
    </div>
  `}async function ct(){const t=await J()||K();let e=0;try{e=await Ue()}catch{e=0}Oe(xe,{userName:t?.name||t?.email||null,isAdmin:!!(t?.is_staff??t?.isStaff),cartCountValue:e})}async function c(){i.dashboard=await me(),Xe(),rt()}async function lt(){i.staffUsers=await Me()}async function g(){i.orders=await ge({q:a.orderSearch.value.trim(),status:a.orderStatus.value,paymentStatus:a.paymentStatus.value,shippingStatus:a.shippingStatus.value,hasOpenReturn:a.orderOpenReturnOnly.checked}),S("orders"),C()}async function f(){i.returns=await ye({q:a.returnSearch.value.trim(),status:a.returnStatus.value}),S("returns"),M()}async function y(){i.settlements=await pe({q:a.settlementSearch.value.trim(),status:a.settlementStatus.value}),S("settlements"),O()}async function q(){if(i.inquiries=await he({q:a.inquirySearch.value.trim(),status:a.inquiryStatus.value,category:a.inquiryCategory.value,priority:a.inquiryPriority.value,overdue:a.inquiryOverdueOnly.checked}),i.expandedInquiryId){const t=i.inquiries.find(e=>Number(e.id)===Number(i.expandedInquiryId));(!t||!String(t.answer||"").trim())&&(i.expandedInquiryId=null)}D(),i.selectedInquiryId&&(i.inquiries.some(e=>Number(e.id)===Number(i.selectedInquiryId))?ne(i.selectedInquiryId):ae())}async function $({page:t=i.reviewPage}={}){const e=await be({status:a.reviewStatus.value,sort:a.reviewSort.value,q:a.reviewSearch.value.trim(),page:t,pageSize:i.reviewPageSize});i.reviews=e.items,i.reviewPage=e.page,i.reviewTotalPages=e.totalPages,i.reviewTotalCount=e.count,dt(),st()}async function A(){i.coupons=await Le({q:a.couponSearch.value.trim()}),ot()}async function w(){i.managedBanners=await Be(),S("banners"),U()}async function E(){i.managedProducts=await ve({q:a.managedProductSearch.value.trim(),isActive:a.managedProductActiveFilter.value===""?void 0:a.managedProductActiveFilter.value==="true"}),S("products"),x()}async function P(){i.managedUsers=await Ee({q:a.memberSearch.value.trim(),isActive:a.memberActiveFilter.value===""?void 0:a.memberActiveFilter.value==="true",isStaff:a.memberStaffFilter.value===""?void 0:a.memberStaffFilter.value==="true"}),S("users"),k()}async function re(){await lt(),await Promise.all([c(),g(),f(),y(),q(),$({page:1}),w(),E(),P(),A(),ct()])}async function ut(t){const e=t.closest("tr[data-order-no]");if(!e)return;const n=e.dataset.orderNo,r=t.dataset.action;if(r==="editOrder")return o("orders",n,!0),C(),"edit";if(r==="cancelOrderEdit")return o("orders",n,!1),C(),"cancel";if(!p("orders",n))return"noop";const l={status:e.querySelector("[data-role='order-status']")?.value,paymentStatus:e.querySelector("[data-role='payment-status']")?.value,shippingStatus:e.querySelector("[data-role='shipping-status']")?.value,courierName:e.querySelector("[data-role='courier-name']")?.value?.trim()||"",trackingNo:e.querySelector("[data-role='tracking-no']")?.value?.trim()||""};return r==="issueInvoice"&&(l.issueInvoice=!0),r==="markDelivered"&&(l.markDelivered=!0),await fe(n,l),o("orders",n,!1),await Promise.all([c(),g(),y()]),r}async function mt(t){const e=t.closest("tr[data-return-id]");if(!e)return;const n=Number(e.dataset.returnId),r=t.dataset.action;return r==="editReturn"?(o("returns",n,!0),M(),"edit"):r==="cancelReturnEdit"?(o("returns",n,!1),M(),"cancel"):r==="deleteReturn"?confirm("이 반품/환불 요청을 삭제하시겠습니까?")?(await Se(n),o("returns",n,!1),await Promise.all([c(),f(),g(),y()]),"deleteReturn"):void 0:p("returns",n)?(await Ie(n,{status:e.querySelector("[data-role='return-status']")?.value,approvedAmount:Number(e.querySelector("[data-role='approved-amount']")?.value||0),pickupCourierName:e.querySelector("[data-role='pickup-courier']")?.value?.trim()||"",pickupTrackingNo:e.querySelector("[data-role='pickup-tracking']")?.value?.trim()||"",rejectedReason:e.querySelector("[data-role='rejected-reason']")?.value?.trim()||"",adminNote:e.querySelector("[data-role='admin-note']")?.value?.trim()||""}),o("returns",n,!1),await Promise.all([c(),f(),g(),y()]),"saveReturn"):"noop"}async function pt(t){const e=t.closest("tr[data-settlement-id]");if(!e)return;const n=Number(e.dataset.settlementId),r=t.dataset.action;return r==="editSettlement"?(o("settlements",n,!0),O(),"edit"):r==="cancelSettlementEdit"?(o("settlements",n,!1),O(),"cancel"):r==="deleteSettlement"?confirm("이 정산 레코드를 삭제하시겠습니까? 지급완료 건은 삭제할 수 없습니다.")?(await $e(n),o("settlements",n,!1),await Promise.all([c(),y()]),"deleteSettlement"):void 0:p("settlements",n)?(await Ae(n,{status:e.querySelector("[data-role='settlement-status']")?.value,pgFee:Number(e.querySelector("[data-role='pg-fee']")?.value||0),platformFee:Number(e.querySelector("[data-role='platform-fee']")?.value||0),returnDeduction:Number(e.querySelector("[data-role='return-deduction']")?.value||0),expectedPayoutDate:e.querySelector("[data-role='expected-payout-date']")?.value||null,memo:e.querySelector("[data-role='settlement-memo']")?.value?.trim()||"",markPaid:r==="markSettlementPaid"}),o("settlements",n,!1),await Promise.all([c(),y()]),r):"noop"}async function gt(){if(!i.selectedInquiryId)throw new Error("답변할 문의를 먼저 선택해주세요.");await X(i.selectedInquiryId,{answer:a.inquiryEditorAnswer.value.trim(),status:a.inquiryEditorStatus.value,category:a.inquiryEditorCategory.value,priority:a.inquiryEditorPriority.value,assignedAdminId:Number(a.inquiryEditorAssignedAdmin.value||0)||null,internalNote:a.inquiryEditorInternalNote.value.trim(),slaDueAt:ee(a.inquiryEditorSlaDueAt.value)}),await Promise.all([c(),q()]),N(`저장 완료 · ${u(new Date().toISOString())}`)}async function yt(){if(!i.selectedInquiryId)throw new Error("답변을 삭제할 문의를 먼저 선택해주세요.");confirm("등록된 답변을 삭제하고 문의 상태를 접수로 되돌리시겠습니까?")&&(await X(i.selectedInquiryId,{deleteAnswer:!0,status:"OPEN"}),await Promise.all([c(),q()]),N(`답변 삭제 완료 · ${u(new Date().toISOString())}`))}async function ht(t){const e=t.closest("tr[data-review-id]");if(!e)return;const n=Number(e.dataset.reviewId);if(t.dataset.action==="hideReview"&&await W(n,!1),t.dataset.action==="showReview"&&await W(n,!0),t.dataset.action==="deleteReview"){if(!confirm("리뷰를 삭제 처리하시겠습니까?"))return;await Re(n)}await Promise.all([c(),$({page:i.reviewPage})])}async function bt(t){const e=t.closest("tr[data-coupon-id]");if(!e)return;const n=Number(e.dataset.couponId);if(t.dataset.action==="deleteCoupon"){if(!confirm("해당 쿠폰을 삭제하시겠습니까?"))return;await Ce(n),await Promise.all([c(),A()])}}async function vt(t){const e=t.closest("tr[data-banner-id]");if(!e)return;const n=Number(e.dataset.bannerId),r=t.dataset.action;return r==="editBanner"?(o("banners",n,!0),U(),"edit"):r==="cancelBannerEdit"?(o("banners",n,!1),U(),"cancel"):r==="deleteBanner"?confirm("이 배너를 삭제하시겠습니까?")?(await qe(n),o("banners",n,!1),await Promise.all([w(),c()]),"deleteBanner"):void 0:p("banners",n)?(await we(n,{title:e.querySelector("[data-role='title']")?.value?.trim()||"",subtitle:e.querySelector("[data-role='subtitle']")?.value?.trim()||"",description:e.querySelector("[data-role='description']")?.value?.trim()||"",ctaText:e.querySelector("[data-role='cta-text']")?.value?.trim()||"",linkUrl:e.querySelector("[data-role='link-url']")?.value?.trim()||"",sortOrder:Number(e.querySelector("[data-role='sort-order']")?.value||0),isActive:e.querySelector("[data-role='is-active']")?.checked,imageFile:e.querySelector("[data-role='image-file']")?.files?.[0]||null}),o("banners",n,!1),await Promise.all([w(),c()]),"saveBanner"):"noop"}async function Et(t){const e=t.closest("tr[data-product-id]");if(!e)return;const n=Number(e.dataset.productId),r=t.dataset.action;return r==="editManagedProduct"?(o("products",n,!0),x(),"edit"):r==="cancelManagedProductEdit"?(o("products",n,!1),x(),"cancel"):r==="deleteManagedProduct"?confirm("이 상품을 삭제하시겠습니까?")?(await Pe(n),o("products",n,!1),await Promise.all([E(),c(),g()]),"deleteManagedProduct"):void 0:p("products",n)?(await Ne(n,{name:e.querySelector("[data-role='name']")?.value?.trim()||"",oneLine:e.querySelector("[data-role='one-line']")?.value?.trim()||"",description:e.querySelector("[data-role='description']")?.value?.trim()||"",price:Number(e.querySelector("[data-role='price']")?.value||0),originalPrice:Number(e.querySelector("[data-role='original-price']")?.value||0),stock:Number(e.querySelector("[data-role='stock']")?.value||0),isActive:e.querySelector("[data-role='is-active']")?.checked,badgeTypes:te(e.querySelector("[data-role='badge-types']")?.value||""),thumbnailFile:e.querySelector("[data-role='thumbnail-file']")?.files?.[0]||null}),o("products",n,!1),await Promise.all([E(),c()]),"saveManagedProduct"):"noop"}async function ft(t){const e=t.closest("tr[data-user-id]");if(!e)return;const n=Number(e.dataset.userId),r=t.dataset.action;return r==="editManagedUser"?(o("users",n,!0),k(),"edit"):r==="cancelManagedUserEdit"?(o("users",n,!1),k(),"cancel"):r==="deactivateManagedUser"?confirm("해당 회원을 비활성화하시겠습니까?")?(await Te(n),o("users",n,!1),await Promise.all([P(),c()]),"deactivateManagedUser"):void 0:p("users",n)?(await De(n,{name:e.querySelector("[data-role='name']")?.value?.trim()||"",phone:e.querySelector("[data-role='phone']")?.value?.trim()||"",isActive:e.querySelector("[data-role='is-active']")?.value==="true",isStaff:e.querySelector("[data-role='is-staff']")?.value==="true"}),o("users",n,!1),await Promise.all([P(),c()]),"saveManagedUser"):"noop"}function v(t,e){t?.addEventListener("keydown",async n=>{if(n.key==="Enter"){n.preventDefault();try{await e()}catch(r){console.error(r),s(r.message||"조회 중 오류가 발생했습니다.","error")}}})}function St(){a.navButtons.forEach(t=>{t.addEventListener("click",async()=>{const e=t.dataset.tabBtn;if(Q(e),e==="products")try{await Promise.all([w(),E()])}catch(n){console.error(n),s(n.message||"배너/상품 정보를 불러오지 못했습니다.","error")}})}),Q(i.activeTab)}function It(){St(),a.inquiryEditorDeleteBtn&&(a.inquiryEditorDeleteBtn.disabled=!0),z(),a.reloadBtn?.addEventListener("click",async()=>{try{await re(),s("운영 데이터가 갱신되었습니다.")}catch(e){console.error(e),s(e.message||"새로고침 중 오류가 발생했습니다.","error")}}),a.generateSettlementBtn?.addEventListener("click",async()=>{try{const e=await se({onlyPaidOrders:!0}),n=Number(e?.generated_count??e?.generatedCount??0);s(`정산 레코드 생성/갱신 완료: ${n}건`),await Promise.all([c(),y(),g()])}catch(e){console.error(e),s(e.message||"정산 생성에 실패했습니다.","error")}}),[a.orderSearchBtn,a.orderStatus,a.paymentStatus,a.shippingStatus,a.orderOpenReturnOnly].forEach(e=>{const n=e?.tagName==="BUTTON"?"click":"change";e?.addEventListener(n,async()=>{try{await g()}catch(r){console.error(r),s(r.message||"주문 조회에 실패했습니다.","error")}})}),[a.returnSearchBtn,a.returnStatus].forEach(e=>{const n=e?.tagName==="BUTTON"?"click":"change";e?.addEventListener(n,async()=>{try{await f()}catch(r){console.error(r),s(r.message||"반품 조회에 실패했습니다.","error")}})}),[a.settlementSearchBtn,a.settlementStatus].forEach(e=>{const n=e?.tagName==="BUTTON"?"click":"change";e?.addEventListener(n,async()=>{try{await y()}catch(r){console.error(r),s(r.message||"정산 조회에 실패했습니다.","error")}})}),[a.inquirySearchBtn,a.inquiryStatus,a.inquiryCategory,a.inquiryPriority,a.inquiryOverdueOnly].forEach(e=>{const n=e?.tagName==="BUTTON"?"click":"change";e?.addEventListener(n,async()=>{try{await q()}catch(r){console.error(r),s(r.message||"CS 조회에 실패했습니다.","error")}})}),[a.reviewSearchBtn,a.reviewStatus,a.reviewSort].forEach(e=>{const n=e?.tagName==="BUTTON"?"click":"change";e?.addEventListener(n,async()=>{try{i.reviewPage=1,await $({page:1})}catch(r){console.error(r),s(r.message||"리뷰 조회에 실패했습니다.","error")}})}),[a.managedProductSearchBtn,a.managedProductActiveFilter].forEach(e=>{const n=e?.tagName==="BUTTON"?"click":"change";e?.addEventListener(n,async()=>{try{await E()}catch(r){console.error(r),s(r.message||"상품 조회에 실패했습니다.","error")}})}),[a.memberSearchBtn,a.memberActiveFilter,a.memberStaffFilter].forEach(e=>{const n=e?.tagName==="BUTTON"?"click":"change";e?.addEventListener(n,async()=>{try{await P()}catch(r){console.error(r),s(r.message||"회원 조회에 실패했습니다.","error")}})}),v(a.orderSearch,g),v(a.returnSearch,f),v(a.settlementSearch,y),v(a.inquirySearch,q),v(a.reviewSearch,async()=>{i.reviewPage=1,await $({page:1})}),v(a.managedProductSearch,E),v(a.memberSearch,P),a.orders?.addEventListener("click",async e=>{const n=e.target.closest("[data-action]");if(n)try{const r=await ut(n);if(r==="edit"){s("수정 모드가 활성화되었습니다.");return}if(r==="cancel"){s("수정이 취소되었습니다.");return}if(r==="noop"||!r)return;s("주문/배송 정보가 저장되었습니다.")}catch(r){console.error(r),s(r.message||"주문/배송 정보 업데이트에 실패했습니다.","error")}}),a.returnCreateForm?.addEventListener("submit",async e=>{e.preventDefault();try{await oe({orderNo:a.returnOrderNo.value.trim(),reasonTitle:a.returnReasonTitle.value.trim(),reasonDetail:a.returnReasonDetail.value.trim(),requestedAmount:a.returnRequestedAmount.value?Number(a.returnRequestedAmount.value):void 0}),a.returnCreateForm.reset(),s("반품 요청이 등록되었습니다."),await Promise.all([c(),f(),g(),y()])}catch(n){console.error(n),s(n.message||"반품 요청 등록에 실패했습니다.","error")}}),a.returns?.addEventListener("click",async e=>{const n=e.target.closest("[data-action]");if(n)try{const r=await mt(n);if(r==="edit"){s("수정 모드가 활성화되었습니다.");return}if(r==="cancel"){s("수정이 취소되었습니다.");return}if(r==="noop"||!r)return;s(r==="deleteReturn"?"반품/환불 요청이 삭제되었습니다.":"반품/환불 정보가 저장되었습니다.")}catch(r){console.error(r),s(r.message||"반품/환불 처리에 실패했습니다.","error")}}),a.settlements?.addEventListener("click",async e=>{const n=e.target.closest("[data-action]");if(n)try{const r=await pt(n);if(r==="edit"){s("수정 모드가 활성화되었습니다.");return}if(r==="cancel"){s("수정이 취소되었습니다.");return}if(r==="noop"||!r)return;s(r==="deleteSettlement"?"정산 레코드가 삭제되었습니다.":"정산 정보가 저장되었습니다.")}catch(r){console.error(r),s(r.message||"정산 저장에 실패했습니다.","error")}}),a.inquiries?.addEventListener("click",e=>{const n=e.target.closest("[data-action]");if(!n)return;const r=Number(n.dataset.inquiryId);if(r){if(n.dataset.action==="openInquiryEditor"){ne(r);return}n.dataset.action==="toggleInquiryAnswer"&&it(r)}}),a.inquiryEditorCloseBtn?.addEventListener("click",()=>{ae()}),a.inquiryEditorSaveBtn?.addEventListener("click",async()=>{try{await gt(),s("CS 답변이 저장되었습니다.")}catch(e){console.error(e),N(e.message||"CS 저장에 실패했습니다.","error"),s(e.message||"CS 저장에 실패했습니다.","error")}}),a.inquiryEditorDeleteBtn?.addEventListener("click",async()=>{try{await yt(),s("CS 답변이 삭제되었습니다.")}catch(e){console.error(e),N(e.message||"CS 답변 삭제에 실패했습니다.","error"),s(e.message||"CS 답변 삭제에 실패했습니다.","error")}}),a.bannerCreateForm?.addEventListener("submit",async e=>{e.preventDefault();try{await ce({title:a.bannerTitle.value.trim(),subtitle:a.bannerSubtitle.value.trim(),description:a.bannerDescription.value.trim(),ctaText:a.bannerCtaText.value.trim(),linkUrl:a.bannerLinkUrl.value.trim(),sortOrder:Number(a.bannerSortOrder.value||0),isActive:a.bannerIsActive.checked,imageFile:a.bannerImageFile.files?.[0]||null}),a.bannerCreateForm.reset(),a.bannerIsActive&&(a.bannerIsActive.checked=!0),s("배너가 등록되었습니다."),await Promise.all([w(),c()])}catch(n){console.error(n),s(n.message||"배너 등록에 실패했습니다.","error")}}),a.managedBanners?.addEventListener("click",async e=>{const n=e.target.closest("[data-action]");if(n)try{const r=await vt(n);if(r==="edit"){s("수정 모드가 활성화되었습니다.");return}if(r==="cancel"){s("수정이 취소되었습니다.");return}if(r==="noop"||!r)return;s(r==="deleteBanner"?"배너가 삭제되었습니다.":"배너 정보가 저장되었습니다.")}catch(r){console.error(r),s(r.message||"배너 처리에 실패했습니다.","error")}}),a.productCreateForm?.addEventListener("submit",async e=>{e.preventDefault();try{await le({name:a.productName.value.trim(),oneLine:a.productOneLine.value.trim(),description:a.productDescription.value.trim(),price:Number(a.productPrice.value||0),originalPrice:Number(a.productOriginalPrice.value||0),stock:Number(a.productStock.value||0),isActive:a.productIsActive.checked,badgeTypes:te(a.productBadges.value),thumbnailFile:a.productThumbnail.files?.[0]||null}),a.productCreateForm.reset(),a.productIsActive&&(a.productIsActive.checked=!0),s("상품이 등록되었습니다."),await Promise.all([E(),c(),g()])}catch(n){console.error(n),s(n.message||"상품 등록에 실패했습니다.","error")}}),a.managedProducts?.addEventListener("click",async e=>{const n=e.target.closest("[data-action]");if(n)try{const r=await Et(n);if(r==="edit"){s("수정 모드가 활성화되었습니다.");return}if(r==="cancel"){s("수정이 취소되었습니다.");return}if(r==="noop"||!r)return;s(r==="deleteManagedProduct"?"상품이 삭제되었습니다.":"상품 정보가 저장되었습니다.")}catch(r){console.error(r),s(r.message||"상품 처리에 실패했습니다.","error")}}),a.managedUsers?.addEventListener("click",async e=>{const n=e.target.closest("[data-action]");if(n)try{const r=await ft(n);if(r==="edit"){s("수정 모드가 활성화되었습니다.");return}if(r==="cancel"){s("수정이 취소되었습니다.");return}if(r==="noop"||!r)return;s(r==="deactivateManagedUser"?"회원이 비활성화되었습니다.":"회원 정보가 저장되었습니다.")}catch(r){console.error(r),s(r.message||"회원 처리에 실패했습니다.","error")}}),a.reviews?.addEventListener("click",async e=>{const n=e.target.closest("[data-action]");if(n)try{await ht(n),n.dataset.action==="deleteReview"?s("리뷰가 삭제 처리되었습니다."):s("리뷰 노출 상태가 반영되었습니다.")}catch(r){console.error(r),s(r.message||"리뷰 상태 변경에 실패했습니다.","error")}}),a.reviewPagination?.addEventListener("click",async e=>{const n=e.target.closest("[data-action='goReviewPage']");if(!n)return;const r=Number(n.dataset.page);if(!(!r||r<1||r>i.reviewTotalPages||r===i.reviewPage))try{await $({page:r})}catch(l){console.error(l),s(l.message||"리뷰 페이지 이동에 실패했습니다.","error")}}),a.couponTarget?.addEventListener("change",()=>{const e=a.couponTarget.value==="EMAIL";a.couponEmailField.classList.toggle("hidden",!e),a.couponEmail.required=e}),a.couponForm?.addEventListener("submit",async e=>{e.preventDefault();try{const n=await ue({target:a.couponTarget.value,email:a.couponTarget.value==="EMAIL"?a.couponEmail.value.trim():void 0,name:a.couponName.value.trim(),code:a.couponCode.value.trim(),discountAmount:Number(a.couponDiscountAmount.value||0),minOrderAmount:Number(a.couponMinOrderAmount.value||0),expiresAt:ee(a.couponExpiresAt.value)}),r=Number(n?.issued_count??n?.issuedCount??0);s(`쿠폰 발급 완료: ${r}건`),await Promise.all([c(),A()])}catch(n){console.error(n),s(n.message||"쿠폰 발급에 실패했습니다.","error")}});let t=null;a.couponSearch?.addEventListener("input",()=>{t&&clearTimeout(t),t=setTimeout(async()=>{try{await A()}catch(e){console.error(e),s(e.message||"쿠폰 조회에 실패했습니다.","error")}},250)}),v(a.couponSearch,A),a.coupons?.addEventListener("click",async e=>{const n=e.target.closest("[data-action='deleteCoupon']");if(n)try{await bt(n),s("쿠폰이 삭제되었습니다.")}catch(r){console.error(r),s(r.message||"쿠폰 삭제에 실패했습니다.","error")}})}async function $t(){const t=await J()||K();if(!t){alert("관리자 페이지는 로그인 후 이용할 수 있습니다."),location.href="/pages/login.html";return}if(!Ye(t)){alert("관리자 권한이 없습니다."),location.href="/pages/home.html";return}i.user=t,It();try{await re()}catch(e){console.error(e),s(e.message||"관리자 데이터를 불러오지 못했습니다.","error")}}$t();
