import{m as K,a as X,s as _,g as j,x as Z,y as ee,z as te,A as ae,B as ne,C as re,D as ie,E as de,F as se,G as oe,H as ce,I as le,J as ue,K as me,L as pe,M as ye,N as ge,O as he,P as G,Q as ve,R as Ee,S as Se,T as be,U as fe,V as Ie,W as Ae,X as F,Y as $e,Z as Be,_ as qe,$ as Pe,d as Ne}from"./footer-Dk4wiJfZ.js";import{c as we}from"./cart-service-CM3DWS-R.js";import{f as l}from"./store-data-Deux6dsM.js";const Te=K({showCart:!0,currentNav:""});X();const De=["dashboard","orders","returns","settlements","cs","reviews","products","members","coupons"],Le=["PENDING","PAID","FAILED","CANCELED","REFUNDED","PARTIAL_REFUNDED"],Re=["UNPAID","READY","APPROVED","CANCELED","FAILED"],Ce=["READY","PREPARING","SHIPPED","DELIVERED"],Oe=["REQUESTED","APPROVED","PICKUP_SCHEDULED","RECEIVED","REFUNDING","REFUNDED","REJECTED","CLOSED"],Me=["PENDING","HOLD","SCHEDULED","PAID"],V={PENDING:"주문접수",PAID:"주문완료",FAILED:"결제실패",CANCELED:"주문취소",REFUNDED:"전체환불",PARTIAL_REFUNDED:"부분환불"},T={UNPAID:"결제대기",READY:"결제준비",APPROVED:"결제완료",CANCELED:"결제취소",FAILED:"결제실패"},D={READY:"배송준비",PREPARING:"상품준비중",SHIPPED:"배송중",DELIVERED:"배송완료"},L={REQUESTED:"요청",APPROVED:"승인",PICKUP_SCHEDULED:"회수예정",RECEIVED:"회수완료",REFUNDING:"환불처리중",REFUNDED:"환불완료",REJECTED:"반려",CLOSED:"종결"},P={PENDING:"정산대기",HOLD:"정산보류",SCHEDULED:"지급예정",PAID:"지급완료"},R={OPEN:"접수",ANSWERED:"답변완료",CLOSED:"종결"},C={VISIBLE:"노출",HIDDEN:"숨김",DELETED:"삭제"},Ue={...V,...T,...D,...L,...P,...R,...C},O={DELIVERY:"배송",RETURN_REFUND:"반품/환불",PAYMENT:"결제",ORDER:"주문",PRODUCT:"상품",ETC:"기타"},M={LOW:"낮음",NORMAL:"보통",HIGH:"높음",URGENT:"긴급"},i={user:null,activeTab:"dashboard",dashboard:null,orders:[],returns:[],settlements:[],inquiries:[],selectedInquiryId:null,reviews:[],reviewPage:1,reviewPageSize:10,reviewTotalPages:1,reviewTotalCount:0,managedBanners:[],managedProducts:[],managedUsers:[],coupons:[],staffUsers:[]},a={reloadBtn:document.getElementById("adminReloadBtn"),generateSettlementBtn:document.getElementById("adminGenerateSettlementBtn"),notice:document.getElementById("adminActionNotice"),navButtons:Array.from(document.querySelectorAll("[data-tab-btn]")),tabPanels:Array.from(document.querySelectorAll("[data-tab-panel]")),summary:document.getElementById("adminSummary"),dashboardOrders:document.getElementById("adminDashboardOrders"),dashboardReturns:document.getElementById("adminDashboardReturns"),dashboardInquiries:document.getElementById("adminDashboardInquiries"),dashboardSettlements:document.getElementById("adminDashboardSettlements"),dashboardReviews:document.getElementById("adminDashboardReviews"),orders:document.getElementById("adminOrders"),orderSearch:document.getElementById("adminOrderSearch"),orderStatus:document.getElementById("adminOrderStatusFilter"),paymentStatus:document.getElementById("adminPaymentStatusFilter"),shippingStatus:document.getElementById("adminShippingStatusFilter"),orderOpenReturnOnly:document.getElementById("adminOrderOpenReturnOnly"),orderSearchBtn:document.getElementById("adminOrderSearchBtn"),returns:document.getElementById("adminReturns"),returnSearch:document.getElementById("adminReturnSearch"),returnStatus:document.getElementById("adminReturnStatusFilter"),returnSearchBtn:document.getElementById("adminReturnSearchBtn"),returnCreateForm:document.getElementById("adminReturnCreateForm"),returnOrderNo:document.getElementById("returnOrderNo"),returnReasonTitle:document.getElementById("returnReasonTitle"),returnReasonDetail:document.getElementById("returnReasonDetail"),returnRequestedAmount:document.getElementById("returnRequestedAmount"),settlements:document.getElementById("adminSettlements"),settlementSearch:document.getElementById("adminSettlementSearch"),settlementStatus:document.getElementById("adminSettlementStatusFilter"),settlementSearchBtn:document.getElementById("adminSettlementSearchBtn"),inquirySearch:document.getElementById("adminInquirySearch"),inquiryStatus:document.getElementById("adminInquiryStatusFilter"),inquiryCategory:document.getElementById("adminInquiryCategoryFilter"),inquiryPriority:document.getElementById("adminInquiryPriorityFilter"),inquiryOverdueOnly:document.getElementById("adminInquiryOverdueOnly"),inquirySearchBtn:document.getElementById("adminInquirySearchBtn"),inquiries:document.getElementById("adminInquiries"),inquiryEditor:document.getElementById("adminInquiryEditor"),inquiryEditorCloseBtn:document.getElementById("adminInquiryEditorCloseBtn"),inquiryEditorMeta:document.getElementById("adminInquiryEditorMeta"),inquiryEditorStatus:document.getElementById("adminInquiryEditorStatus"),inquiryEditorCategory:document.getElementById("adminInquiryEditorCategory"),inquiryEditorPriority:document.getElementById("adminInquiryEditorPriority"),inquiryEditorAssignedAdmin:document.getElementById("adminInquiryEditorAssignedAdmin"),inquiryEditorSlaDueAt:document.getElementById("adminInquiryEditorSlaDueAt"),inquiryEditorAnswer:document.getElementById("adminInquiryEditorAnswer"),inquiryEditorInternalNote:document.getElementById("adminInquiryEditorInternalNote"),inquiryEditorSaveBtn:document.getElementById("adminInquiryEditorSaveBtn"),inquiryEditorDeleteBtn:document.getElementById("adminInquiryEditorDeleteBtn"),inquiryEditorSavedState:document.getElementById("adminInquiryEditorSavedState"),managedBanners:document.getElementById("adminManagedBanners"),bannerCreateForm:document.getElementById("adminBannerCreateForm"),bannerTitle:document.getElementById("bannerTitle"),bannerSubtitle:document.getElementById("bannerSubtitle"),bannerDescription:document.getElementById("bannerDescription"),bannerCtaText:document.getElementById("bannerCtaText"),bannerLinkUrl:document.getElementById("bannerLinkUrl"),bannerSortOrder:document.getElementById("bannerSortOrder"),bannerIsActive:document.getElementById("bannerIsActive"),bannerImageFile:document.getElementById("bannerImageFile"),managedProducts:document.getElementById("adminManagedProducts"),managedProductSearch:document.getElementById("adminManagedProductSearch"),managedProductActiveFilter:document.getElementById("adminManagedProductActiveFilter"),managedProductSearchBtn:document.getElementById("adminManagedProductSearchBtn"),productCreateForm:document.getElementById("adminProductCreateForm"),productName:document.getElementById("managedProductName"),productOneLine:document.getElementById("managedProductOneLine"),productDescription:document.getElementById("managedProductDescription"),productPrice:document.getElementById("managedProductPrice"),productOriginalPrice:document.getElementById("managedProductOriginalPrice"),productStock:document.getElementById("managedProductStock"),productBadges:document.getElementById("managedProductBadges"),productIsActive:document.getElementById("managedProductIsActive"),productThumbnail:document.getElementById("managedProductThumbnail"),managedUsers:document.getElementById("adminMembers"),memberSearch:document.getElementById("adminMemberSearch"),memberActiveFilter:document.getElementById("adminMemberActiveFilter"),memberStaffFilter:document.getElementById("adminMemberStaffFilter"),memberSearchBtn:document.getElementById("adminMemberSearchBtn"),reviewStatus:document.getElementById("adminReviewStatusFilter"),reviewSort:document.getElementById("adminReviewSortFilter"),reviewSearch:document.getElementById("adminReviewSearch"),reviewSearchBtn:document.getElementById("adminReviewSearchBtn"),reviewPagination:document.getElementById("adminReviewPagination"),reviews:document.getElementById("adminReviews"),couponForm:document.getElementById("adminCouponForm"),couponTarget:document.getElementById("couponTarget"),couponEmailField:document.getElementById("couponEmailField"),couponEmail:document.getElementById("couponEmail"),couponName:document.getElementById("couponName"),couponCode:document.getElementById("couponCode"),couponDiscountAmount:document.getElementById("couponDiscountAmount"),couponMinOrderAmount:document.getElementById("couponMinOrderAmount"),couponExpiresAt:document.getElementById("couponExpiresAt"),couponSearch:document.getElementById("adminCouponSearch"),coupons:document.getElementById("adminCoupons")};let w=null;function ke(e){return!!(e?.is_staff??e?.isStaff)}function d(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#39;")}function s(e,t="success"){a.notice&&(a.notice.textContent=e,a.notice.classList.remove("hidden","success","error"),a.notice.classList.add(t==="error"?"error":"success"),w&&clearTimeout(w),w=setTimeout(()=>{a.notice.classList.add("hidden"),a.notice.classList.remove("success","error"),a.notice.textContent=""},3200))}function c(e){if(!e)return"-";const t=new Date(e);if(Number.isNaN(t.getTime()))return"-";const n=t.getFullYear(),r=String(t.getMonth()+1).padStart(2,"0"),u=String(t.getDate()).padStart(2,"0"),g=String(t.getHours()).padStart(2,"0"),N=String(t.getMinutes()).padStart(2,"0");return`${n}.${r}.${u} ${g}:${N}`}function x(e,t=220){const n=String(e||"").trim();if(!n)return"";const r=n.length>t?`${n.slice(0,t)}...`:n;return d(r).replace(/\n/g,"<br />")}function Y(e){if(!e)return null;const t=new Date(e);return Number.isNaN(t.getTime())?null:t.toISOString()}function Fe(e){if(!e)return"";const t=new Date(e);if(Number.isNaN(t.getTime()))return"";const n=t.getFullYear(),r=String(t.getMonth()+1).padStart(2,"0"),u=String(t.getDate()).padStart(2,"0"),g=String(t.getHours()).padStart(2,"0"),N=String(t.getMinutes()).padStart(2,"0");return`${n}-${r}-${u}T${g}:${N}`}function I(e,t=null){return e?t&&t[e]?t[e]:Ue[e]||O[e]||M[e]||e:"-"}function y(e,t=null){const n=e||"-";return`<span class="admin-status ${String(n).toLowerCase().replace(/[^a-z0-9]+/g,"_")}">${d(I(n,t))}</span>`}function S(e,t,n=null){return e.map(r=>`<option value="${d(r)}" ${r===t?"selected":""}>${d(I(r,n))}</option>`).join("")}function xe(e){const t=['<option value="">미할당</option>'],n=i.staffUsers.map(r=>{const u=`${r.name||"관리자"} (${r.email})`;return`<option value="${r.id}" ${Number(r.id)===Number(e)?"selected":""}>${d(u)}</option>`});return[...t,...n].join("")}function He(e){const t=[];return e.postalCode&&t.push(`(${e.postalCode})`),e.roadAddress&&t.push(e.roadAddress),e.detailAddress&&t.push(e.detailAddress),t.join(" ").trim()||"-"}function z(e){return String(e||"").split(",").map(t=>t.trim().toUpperCase()).filter(Boolean)}function q(e,t="success"){a.inquiryEditorSavedState&&(a.inquiryEditorSavedState.textContent=e,a.inquiryEditorSavedState.classList.remove("hidden"),a.inquiryEditorSavedState.style.borderColor=t==="error"?"#fecaca":"#bbf7d0",a.inquiryEditorSavedState.style.background=t==="error"?"#fef2f2":"#f0fdf4",a.inquiryEditorSavedState.style.color=t==="error"?"#991b1b":"#166534")}function U(){a.inquiryEditorSavedState&&(a.inquiryEditorSavedState.classList.add("hidden"),a.inquiryEditorSavedState.textContent="")}function H(e){De.includes(e)&&(i.activeTab=e,a.navButtons.forEach(t=>{const n=t.dataset.tabBtn===e;t.classList.toggle("active",n),t.setAttribute("aria-pressed",String(n))}),a.tabPanels.forEach(t=>{const n=t.dataset.tabPanel===e;t.classList.toggle("is-active",n),t.hidden=!n}))}function _e(){const e=i.dashboard?.summary||{};a.summary.innerHTML=`
    <article>
      <p>총 주문건수</p>
      <strong>${e.totalOrders||0}건</strong>
    </article>
    <article>
      <p>승인 주문건수</p>
      <strong>${e.paidOrders||0}건</strong>
    </article>
    <article>
      <p>누적 결제금액</p>
      <strong>${l(e.totalPaidAmount||0)}</strong>
    </article>
    <article>
      <p>오늘 결제금액</p>
      <strong>${l(e.todayPaidAmount||0)}</strong>
    </article>
    <article>
      <p>반품 진행 / 완료</p>
      <strong>${e.openReturnCount||0} / ${e.completedReturnCount||0}</strong>
    </article>
    <article>
      <p>정산 예정금</p>
      <strong>${l(e.pendingSettlementAmount||0)}</strong>
    </article>
    <article>
      <p>정산 지급완료</p>
      <strong>${l(e.paidSettlementAmount||0)}</strong>
    </article>
    <article>
      <p>CS 미처리 / SLA 지연</p>
      <strong>${e.openInquiryCount||0} / ${e.overdueInquiryCount||0}</strong>
    </article>
    <article>
      <p>배송 대기</p>
      <strong>${e.shippingPendingCount||0}건</strong>
    </article>
    <article>
      <p>배송 중</p>
      <strong>${e.shippingShippedCount||0}건</strong>
    </article>
    <article>
      <p>배송 완료</p>
      <strong>${e.shippingDeliveredCount||0}건</strong>
    </article>
    <article>
      <p>숨김 리뷰</p>
      <strong>${e.hiddenReviewCount||0}건</strong>
    </article>
  `}function je(){const e=i.dashboard?.recentOrders||[];if(!e.length){a.dashboardOrders.innerHTML='<p class="empty">최근 주문 데이터가 없습니다.</p>';return}a.dashboardOrders.innerHTML=e.slice(0,8).map(t=>`
      <article class="admin-mini-item">
        <strong>${d(t.orderNo)}</strong>
        <p>${c(t.createdAt)} · ${l(t.totalAmount)}</p>
        <p>${y(t.paymentStatus,T)} ${y(t.shippingStatus,D)}</p>
      </article>
    `).join("")}function Ge(){const e=i.dashboard?.recentReturns||[];if(!e.length){a.dashboardReturns.innerHTML='<p class="empty">최근 반품/환불 데이터가 없습니다.</p>';return}a.dashboardReturns.innerHTML=e.slice(0,8).map(t=>`
      <article class="admin-mini-item">
        <strong>${d(t.orderNo)}</strong>
        <p>${d(t.userEmail||"-")} · ${l(t.requestedAmount)}</p>
        <p>${y(t.status,L)}</p>
      </article>
    `).join("")}function Ve(){const e=i.dashboard?.recentInquiries||[];if(!e.length){a.dashboardInquiries.innerHTML='<p class="empty">최근 CS 데이터가 없습니다.</p>';return}a.dashboardInquiries.innerHTML=e.slice(0,8).map(t=>`
      <article class="admin-mini-item">
        <strong>${d(t.title)}</strong>
        <p>${d(t.userEmail||"-")} · ${c(t.createdAt)}</p>
        <p>${y(t.status,R)} ${y(t.priority,M)}</p>
      </article>
    `).join("")}function Ye(){const e=i.dashboard?.recentSettlements||[];if(!e.length){a.dashboardSettlements.innerHTML='<p class="empty">최근 정산 데이터가 없습니다.</p>';return}a.dashboardSettlements.innerHTML=e.slice(0,8).map(t=>`
      <article class="admin-mini-item">
        <strong>${d(t.orderNo)}</strong>
        <p>${d(t.userEmail||"-")} · ${l(t.settlementAmount)}</p>
        <p>${y(t.status,P)}</p>
      </article>
    `).join("")}function ze(){const e=i.dashboard?.recentReviews||[];if(!e.length){a.dashboardReviews.innerHTML='<p class="empty">최근 리뷰 데이터가 없습니다.</p>';return}a.dashboardReviews.innerHTML=e.slice(0,8).map(t=>`
      <article class="admin-mini-item">
        <strong>${d(t.productName)}</strong>
        <p>${d(t.userEmail||"-")} · ${c(t.createdAt)}</p>
        <p>${y(t.status,C)} · 평점 ${t.score}</p>
      </article>
    `).join("")}function We(){je(),Ge(),Ve(),Ye(),ze()}function Qe(){if(!i.orders.length){a.orders.innerHTML='<p class="empty">조건에 맞는 주문이 없습니다.</p>';return}a.orders.innerHTML=`
    <div class="admin-excel-wrap">
      <table class="admin-excel-table admin-orders-table">
        <thead>
          <tr>
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
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          ${i.orders.map(e=>`
              <tr data-order-no="${d(e.orderNo)}">
                <td><strong>${d(e.orderNo)}</strong></td>
                <td>${c(e.createdAt)} (상품 ${e.itemCount}개 / ${l(e.totalAmount)})</td>
                <td>${d(e.userName||e.recipient||"-")}</td>
                <td>${d(e.phone||"-")}</td>
                <td>${d(He(e))}</td>
                <td class="admin-cell-select">
                  <select data-role="order-status">${S(Le,e.status,V)}</select>
                </td>
                <td class="admin-cell-select">
                  <select data-role="payment-status">${S(Re,e.paymentStatus,T)}</select>
                </td>
                <td class="admin-cell-select">
                  <select data-role="shipping-status">${S(Ce,e.shippingStatus,D)}</select>
                </td>
                <td>${y(e.settlementStatus||"-",P)}</td>
                <td>${e.returnRequestCount}건 ${e.hasOpenReturn?"(진행중)":""}</td>
                <td>
                  <input type="text" data-role="courier-name" placeholder="고객표시 택배사" value="${d(e.courierName||"")}" />
                </td>
                <td>
                  <input type="text" data-role="tracking-no" placeholder="송장번호" value="${d(e.trackingNo||"")}" />
                </td>
                <td class="admin-cell-actions">
                  <div class="admin-inline-actions">
                    <button class="ghost" type="button" data-action="issueInvoice">송장발급</button>
                    <button class="ghost" type="button" data-action="markDelivered">배송완료</button>
                    <button class="primary" type="button" data-action="saveOrder">저장</button>
                  </div>
                </td>
              </tr>
            `).join("")}
        </tbody>
      </table>
    </div>
  `}function Je(){if(!i.returns.length){a.returns.innerHTML='<p class="empty">반품/환불 데이터가 없습니다.</p>';return}a.returns.innerHTML=`
    <div class="admin-excel-wrap">
      <table class="admin-excel-table admin-returns-table">
        <thead>
          <tr>
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
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          ${i.returns.map(e=>`
              <tr data-return-id="${e.id}">
                <td><strong>${d(e.orderNo)}</strong></td>
                <td>${d(e.userEmail||"-")}</td>
                <td>
                  <p><b>${d(e.reasonTitle)}</b></p>
                  <small>${d(e.reasonDetail||"(상세 사유 없음)")}</small>
                </td>
                <td>${l(e.requestedAmount)}</td>
                <td>
                  <select data-role="return-status">${S(Oe,e.status,L)}</select>
                </td>
                <td>
                  <input type="number" min="0" data-role="approved-amount" value="${e.approvedAmount||0}" />
                </td>
                <td>
                  <input type="text" data-role="pickup-courier" placeholder="회수 택배사" value="${d(e.pickupCourierName||"")}" />
                </td>
                <td>
                  <input type="text" data-role="pickup-tracking" placeholder="회수 송장번호" value="${d(e.pickupTrackingNo||"")}" />
                </td>
                <td>
                  <input type="text" data-role="rejected-reason" placeholder="반려 사유" value="${d(e.rejectedReason||"")}" />
                </td>
                <td>
                  <input type="text" data-role="admin-note" placeholder="관리 메모" value="${d(e.adminNote||"")}" />
                </td>
                <td>${c(e.requestedAt)}</td>
                <td class="admin-cell-actions">
                  <div class="admin-inline-actions">
                    <button class="primary" type="button" data-action="saveReturn">저장</button>
                    <button class="danger" type="button" data-action="deleteReturn">삭제</button>
                  </div>
                </td>
              </tr>
            `).join("")}
        </tbody>
      </table>
    </div>
  `}function Ke(){if(!i.settlements.length){a.settlements.innerHTML='<p class="empty">정산 데이터가 없습니다.</p>';return}a.settlements.innerHTML=`
    <div class="admin-excel-wrap">
      <table class="admin-excel-table admin-settlements-table">
        <thead>
          <tr>
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
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          ${i.settlements.map(e=>`
              <tr data-settlement-id="${e.id}">
                <td>
                  <strong>${d(e.orderNo)}</strong>
                  <small>${c(e.orderCreatedAt)}</small>
                </td>
                <td>${d(e.userEmail||"-")}</td>
                <td>
                  <select data-role="settlement-status">${S(Me,e.status,P)}</select>
                </td>
                <td>${l(e.grossAmount)}</td>
                <td><input type="number" data-role="pg-fee" value="${e.pgFee}" /></td>
                <td><input type="number" data-role="platform-fee" value="${e.platformFee}" /></td>
                <td><input type="number" data-role="return-deduction" value="${e.returnDeduction}" /></td>
                <td>
                  <strong>${l(e.settlementAmount)}</strong>
                  <small>지급 ${c(e.paidAt)}</small>
                </td>
                <td><input type="date" data-role="expected-payout-date" value="${d(e.expectedPayoutDate||"")}" /></td>
                <td><input type="text" data-role="settlement-memo" value="${d(e.memo||"")}" /></td>
                <td class="admin-cell-actions">
                  <div class="admin-inline-actions">
                    <button class="ghost" type="button" data-action="markSettlementPaid">지급완료</button>
                    <button class="primary" type="button" data-action="saveSettlement">저장</button>
                    <button class="danger" type="button" data-action="deleteSettlement">삭제</button>
                  </div>
                </td>
              </tr>
            `).join("")}
        </tbody>
      </table>
    </div>
  `}function k(){if(!i.inquiries.length){a.inquiries.innerHTML='<p class="empty">문의 내역이 없습니다.</p>';return}a.inquiries.innerHTML=`
    <div class="admin-excel-wrap">
      <table class="admin-excel-table admin-cs-table">
        <thead>
          <tr>
            <th class="admin-cs-col-id">ID</th>
            <th class="admin-cs-col-member">회원</th>
            <th class="admin-cs-col-title">문의제목</th>
            <th class="admin-cs-col-category">카테고리</th>
            <th class="admin-cs-col-status">상태</th>
            <th class="admin-cs-col-priority">우선순위</th>
            <th class="admin-cs-col-created">등록일시</th>
            <th class="admin-cs-col-actions">작업</th>
          </tr>
        </thead>
        <tbody>
          ${i.inquiries.map(e=>`
              <tr class="${Number(e.id)===Number(i.selectedInquiryId)?"is-selected":""}">
                <td class="admin-cs-col-id">${e.id}</td>
                <td class="admin-cs-col-member">
                  <p>${d(e.userName||"회원")}</p>
                  <small>${d(e.userEmail||"-")}</small>
                </td>
                <td class="admin-cs-col-title">
                  <strong>${d(e.title)}</strong>
                  <small>${x(e.content,180)}</small>
                  ${e.answer?`<small class="admin-cs-answer-preview"><b>답변</b> ${x(e.answer,260)}</small>`:""}
                </td>
                <td class="admin-cs-col-category">${d(I(e.category,O))}</td>
                <td class="admin-cs-col-status">
                  ${y(e.status,R)}
                  ${e.isSlaOverdue?'<span class="admin-status overdue">SLA 지연</span>':""}
                </td>
                <td class="admin-cs-col-priority">${d(I(e.priority,M))}</td>
                <td class="admin-cs-col-created">${c(e.createdAt)}</td>
                <td class="admin-cs-col-actions">
                  <div class="admin-inline-actions">
                    <button class="primary" type="button" data-action="openInquiryEditor" data-inquiry-id="${e.id}">답변하기</button>
                    <button class="ghost" type="button" data-action="openInquiryEditor" data-inquiry-id="${e.id}">수정하기</button>
                  </div>
                </td>
              </tr>
            `).join("")}
        </tbody>
      </table>
    </div>
  `}function W(e){const t=i.inquiries.find(n=>Number(n.id)===Number(e));if(!t){i.selectedInquiryId=null,a.inquiryEditor?.classList.add("hidden");return}if(i.selectedInquiryId=t.id,U(),a.inquiryEditorMeta){const n=`${I(t.category,O)} · ${d(t.userName||t.userEmail||"회원")} · ${c(t.createdAt)}`;a.inquiryEditorMeta.textContent=`${t.title} (${n})`}a.inquiryEditorStatus.value=t.status||"OPEN",a.inquiryEditorCategory.value=t.category||"ETC",a.inquiryEditorPriority.value=t.priority||"NORMAL",a.inquiryEditorAssignedAdmin.innerHTML=xe(t.assignedAdminId),a.inquiryEditorSlaDueAt.value=Fe(t.slaDueAt),a.inquiryEditorAnswer.value=t.answer||"",a.inquiryEditorInternalNote.value=t.internalNote||"",a.inquiryEditorDeleteBtn&&(a.inquiryEditorDeleteBtn.disabled=!t.answer),a.inquiryEditor?.classList.remove("hidden"),k()}function Q(){i.selectedInquiryId=null,a.inquiryEditor&&a.inquiryEditor.classList.add("hidden"),a.inquiryEditorMeta&&(a.inquiryEditorMeta.textContent="문의를 선택하면 답변 입력창이 열립니다."),U(),a.inquiryEditorDeleteBtn&&(a.inquiryEditorDeleteBtn.disabled=!0),k()}function Xe(){if(!i.reviews.length){a.reviews.innerHTML='<p class="empty">리뷰가 없습니다.</p>';return}a.reviews.innerHTML=`
    <div class="admin-excel-wrap">
      <table class="admin-excel-table admin-review-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>상품</th>
            <th>작성자</th>
            <th>별점</th>
            <th>리뷰 내용</th>
            <th>이미지</th>
            <th>상태</th>
            <th>작성일시</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          ${i.reviews.map(e=>`
              <tr data-review-id="${e.id}">
                <td>${e.id}</td>
                <td>
                  <p><strong>${d(e.productName)}</strong></p>
                  <small>상품ID ${e.productId}</small>
                </td>
                <td>
                  <p>${d(e.userName||"회원")}</p>
                  <small>${d(e.userEmail||"-")}</small>
                </td>
                <td>${e.score} / 5</td>
                <td>
                  <p><b>${d(e.title||"(제목 없음)")}</b></p>
                  <small>${d(e.content)}</small>
                </td>
                <td>
                  ${e.images.length?`<div class="admin-review-image-grid">
                          ${e.images.slice(0,3).map((t,n)=>`<img src="${d(t)}" alt="리뷰 이미지 ${n+1}" />`).join("")}
                        </div>`:"<small>이미지 없음</small>"}
                </td>
                <td>${y(e.status,C)}</td>
                <td>${c(e.createdAt)}</td>
                <td>
                  <div class="admin-inline-actions">
                    <button class="ghost" type="button" data-action="hideReview" ${e.status==="HIDDEN"?"disabled":""}>숨기기</button>
                    <button class="primary" type="button" data-action="showReview" ${e.status==="VISIBLE"?"disabled":""}>노출</button>
                    <button class="danger" type="button" data-action="deleteReview" ${e.status==="DELETED"?"disabled":""}>삭제</button>
                  </div>
                </td>
              </tr>
            `).join("")}
        </tbody>
      </table>
    </div>
  `}function Ze(){if(!a.reviewPagination)return;const e=Math.max(i.reviewTotalPages||1,1),t=Math.min(Math.max(i.reviewPage||1,1),e);if(e<=1){a.reviewPagination.innerHTML="";return}const n=Math.max(1,t-2),r=Math.min(e,n+4),u=[];for(let g=n;g<=r;g+=1)u.push(`
      <button class="ghost ${g===t?"active":""}" type="button" data-action="goReviewPage" data-page="${g}">${g}</button>
    `);a.reviewPagination.innerHTML=`
    <button class="ghost" type="button" data-action="goReviewPage" data-page="${t-1}" ${t<=1?"disabled":""}>이전</button>
    ${u.join("")}
    <button class="ghost" type="button" data-action="goReviewPage" data-page="${t+1}" ${t>=e?"disabled":""}>다음</button>
    <span class="admin-page-summary">총 ${i.reviewTotalCount}건</span>
  `}function et(){if(!i.coupons.length){a.coupons.innerHTML='<p class="empty">쿠폰 데이터가 없습니다.</p>';return}a.coupons.innerHTML=`
    <div class="admin-excel-wrap">
      <table class="admin-excel-table">
        <thead>
          <tr>
            <th>회원</th>
            <th>쿠폰</th>
            <th>할인/조건</th>
            <th>상태</th>
            <th>만료</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          ${i.coupons.map(e=>`
              <tr data-coupon-id="${e.id}">
                <td>${d(e.userEmail||"-")}</td>
                <td>
                  <strong>${d(e.name)}</strong>
                  <p>${d(e.code)}</p>
                </td>
                <td>
                  <p>${l(e.discountAmount)}</p>
                  <small>${e.minOrderAmount?`${l(e.minOrderAmount)} 이상`:"최소금액 없음"}</small>
                </td>
                <td>${e.isUsed?"사용완료":e.isExpired?"만료":"사용가능"}</td>
                <td>${c(e.expiresAt)}</td>
                <td>
                  <button class="danger" type="button" data-action="deleteCoupon" ${e.isUsed?"disabled":""}>삭제</button>
                </td>
              </tr>
            `).join("")}
        </tbody>
      </table>
    </div>
  `}function tt(){if(!i.managedBanners.length){a.managedBanners.innerHTML='<p class="empty">등록된 배너가 없습니다.</p>';return}a.managedBanners.innerHTML=`
    <div class="admin-excel-wrap">
      <table class="admin-excel-table admin-banners-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>제목</th>
            <th>서브타이틀</th>
            <th>설명</th>
            <th>CTA</th>
            <th>링크</th>
            <th>순서</th>
            <th>활성</th>
            <th>이미지</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          ${i.managedBanners.map(e=>`
                <tr data-banner-id="${e.id}">
                  <td>${e.id}</td>
                  <td><input type="text" data-role="title" value="${d(e.title)}" /></td>
                  <td><input type="text" data-role="subtitle" value="${d(e.subtitle)}" /></td>
                  <td><input type="text" data-role="description" value="${d(e.description)}" /></td>
                  <td><input type="text" data-role="cta-text" value="${d(e.ctaText)}" /></td>
                  <td><input type="text" data-role="link-url" value="${d(e.linkUrl)}" /></td>
                  <td><input type="number" data-role="sort-order" min="0" value="${e.sortOrder}" /></td>
                  <td>
                    <label class="admin-check-inline">
                      <input type="checkbox" data-role="is-active" ${e.isActive?"checked":""} />
                      <span>활성</span>
                    </label>
                  </td>
                  <td>
                    <div class="admin-image-cell">
                      ${e.imageUrl?`<img class="admin-banner-thumb" src="${d(e.imageUrl)}" alt="배너 ${e.id}" />`:'<span class="empty">이미지 없음</span>'}
                      <input class="admin-file-input" type="file" data-role="image-file" accept="image/*" />
                    </div>
                  </td>
                  <td class="admin-cell-actions">
                    <div class="admin-inline-actions">
                      <button class="primary" type="button" data-action="saveBanner">저장</button>
                      <button class="danger" type="button" data-action="deleteBanner">삭제</button>
                    </div>
                  </td>
                </tr>
              `).join("")}
        </tbody>
      </table>
    </div>
  `}function at(){if(!i.managedProducts.length){a.managedProducts.innerHTML='<p class="empty">등록된 상품이 없습니다.</p>';return}a.managedProducts.innerHTML=`
    <div class="admin-excel-wrap">
      <table class="admin-excel-table admin-managed-products-table">
        <thead>
          <tr>
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
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          ${i.managedProducts.map(e=>`
                <tr data-product-id="${e.id}">
                  <td>${e.id}</td>
                  <td><input type="text" data-role="name" value="${d(e.name)}" /></td>
                  <td><input type="text" data-role="one-line" value="${d(e.oneLine)}" /></td>
                  <td><input type="number" min="0" data-role="price" value="${e.price}" /></td>
                  <td><input type="number" min="0" data-role="original-price" value="${e.originalPrice}" /></td>
                  <td><input type="number" min="0" data-role="stock" value="${e.stock}" /></td>
                  <td>
                    <input type="text" data-role="badge-types" value="${d(e.badgeTypes.join(","))}" />
                    <div>
                      ${e.badgeTypes.map(t=>`<span class="admin-badge-chip">${d(t)}</span>`).join("")}
                    </div>
                  </td>
                  <td>
                    <label class="admin-check-inline">
                      <input type="checkbox" data-role="is-active" ${e.isActive?"checked":""} />
                      <span>활성</span>
                    </label>
                  </td>
                  <td>
                    <div class="admin-image-cell">
                      ${e.thumbnailUrl?`<img class="admin-product-thumb" src="${d(e.thumbnailUrl)}" alt="상품 ${e.id}" />`:'<span class="empty">이미지 없음</span>'}
                      <input class="admin-file-input" type="file" data-role="thumbnail-file" accept="image/*" />
                    </div>
                  </td>
                  <td><input type="text" data-role="description" value="${d(e.description)}" /></td>
                  <td class="admin-cell-actions">
                    <div class="admin-inline-actions">
                      <button class="primary" type="button" data-action="saveManagedProduct">저장</button>
                      <button class="danger" type="button" data-action="deleteManagedProduct">삭제</button>
                    </div>
                  </td>
                </tr>
              `).join("")}
        </tbody>
      </table>
    </div>
  `}function nt(){if(!i.managedUsers.length){a.managedUsers.innerHTML='<p class="empty">조회된 회원이 없습니다.</p>';return}a.managedUsers.innerHTML=`
    <div class="admin-excel-wrap">
      <table class="admin-excel-table admin-members-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>이메일</th>
            <th>이름</th>
            <th>전화번호</th>
            <th>상태</th>
            <th>권한</th>
            <th>주문/리뷰/문의</th>
            <th>가입일</th>
            <th>최근로그인</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          ${i.managedUsers.map(e=>`
                <tr data-user-id="${e.id}">
                  <td>${e.id}</td>
                  <td>${d(e.email)}</td>
                  <td><input type="text" data-role="name" value="${d(e.name)}" /></td>
                  <td><input type="text" data-role="phone" value="${d(e.phone)}" /></td>
                  <td>
                    <select data-role="is-active">
                      <option value="true" ${e.isActive?"selected":""}>활성</option>
                      <option value="false" ${e.isActive?"":"selected"}>비활성</option>
                    </select>
                  </td>
                  <td>
                    <select data-role="is-staff">
                      <option value="false" ${e.isStaff?"":"selected"}>일반회원</option>
                      <option value="true" ${e.isStaff?"selected":""}>관리자</option>
                    </select>
                  </td>
                  <td>${e.orderCount} / ${e.reviewCount} / ${e.inquiryCount}</td>
                  <td>${c(e.createdAt)}</td>
                  <td>${c(e.lastLogin)}</td>
                  <td class="admin-cell-actions">
                    <div class="admin-inline-actions">
                      <button class="primary" type="button" data-action="saveManagedUser">저장</button>
                      <button class="danger" type="button" data-action="deactivateManagedUser" ${e.isActive?"":"disabled"}>비활성화</button>
                    </div>
                  </td>
                </tr>
              `).join("")}
        </tbody>
      </table>
    </div>
  `}async function rt(){const e=await _()||j();let t=0;try{t=await we()}catch{t=0}Ne(Te,{userName:e?.name||e?.email||null,isAdmin:!!(e?.is_staff??e?.isStaff),cartCountValue:t})}async function o(){i.dashboard=await re(),_e(),We()}async function it(){i.staffUsers=await Pe()}async function m(){i.orders=await de({q:a.orderSearch.value.trim(),status:a.orderStatus.value,paymentStatus:a.paymentStatus.value,shippingStatus:a.shippingStatus.value,hasOpenReturn:a.orderOpenReturnOnly.checked}),Qe()}async function E(){i.returns=await se({q:a.returnSearch.value.trim(),status:a.returnStatus.value}),Je()}async function p(){i.settlements=await ie({q:a.settlementSearch.value.trim(),status:a.settlementStatus.value}),Ke()}async function A(){i.inquiries=await oe({q:a.inquirySearch.value.trim(),status:a.inquiryStatus.value,category:a.inquiryCategory.value,priority:a.inquiryPriority.value,overdue:a.inquiryOverdueOnly.checked}),k(),i.selectedInquiryId&&(i.inquiries.some(t=>Number(t.id)===Number(i.selectedInquiryId))?W(i.selectedInquiryId):Q())}async function b({page:e=i.reviewPage}={}){const t=await ce({status:a.reviewStatus.value,sort:a.reviewSort.value,q:a.reviewSearch.value.trim(),page:e,pageSize:i.reviewPageSize});i.reviews=t.items,i.reviewPage=t.page,i.reviewTotalPages=t.totalPages,i.reviewTotalCount=t.count,Xe(),Ze()}async function f(){i.coupons=await Be({q:a.couponSearch.value.trim()}),et()}async function $(){i.managedBanners=await ve(),tt()}async function v(){i.managedProducts=await le({q:a.managedProductSearch.value.trim(),isActive:a.managedProductActiveFilter.value===""?void 0:a.managedProductActiveFilter.value==="true"}),at()}async function B(){i.managedUsers=await ue({q:a.memberSearch.value.trim(),isActive:a.memberActiveFilter.value===""?void 0:a.memberActiveFilter.value==="true",isStaff:a.memberStaffFilter.value===""?void 0:a.memberStaffFilter.value==="true"}),nt()}async function J(){await it(),await Promise.all([o(),m(),E(),p(),A(),b({page:1}),$(),v(),B(),f(),rt()])}async function dt(e){const t=e.closest("tr[data-order-no]");if(!t)return;const n=t.dataset.orderNo,r={status:t.querySelector("[data-role='order-status']")?.value,paymentStatus:t.querySelector("[data-role='payment-status']")?.value,shippingStatus:t.querySelector("[data-role='shipping-status']")?.value,courierName:t.querySelector("[data-role='courier-name']")?.value?.trim()||"",trackingNo:t.querySelector("[data-role='tracking-no']")?.value?.trim()||""};e.dataset.action==="issueInvoice"&&(r.issueInvoice=!0),e.dataset.action==="markDelivered"&&(r.markDelivered=!0),await me(n,r),await Promise.all([o(),m(),p()])}async function st(e){const t=e.closest("tr[data-return-id]");if(!t)return;const n=Number(t.dataset.returnId);if(e.dataset.action==="deleteReturn"){if(!confirm("이 반품/환불 요청을 삭제하시겠습니까?"))return;await pe(n),await Promise.all([o(),E(),m(),p()]);return}await ye(n,{status:t.querySelector("[data-role='return-status']")?.value,approvedAmount:Number(t.querySelector("[data-role='approved-amount']")?.value||0),pickupCourierName:t.querySelector("[data-role='pickup-courier']")?.value?.trim()||"",pickupTrackingNo:t.querySelector("[data-role='pickup-tracking']")?.value?.trim()||"",rejectedReason:t.querySelector("[data-role='rejected-reason']")?.value?.trim()||"",adminNote:t.querySelector("[data-role='admin-note']")?.value?.trim()||""}),await Promise.all([o(),E(),m(),p()])}async function ot(e){const t=e.closest("tr[data-settlement-id]");if(!t)return;const n=Number(t.dataset.settlementId);if(e.dataset.action==="deleteSettlement"){if(!confirm("이 정산 레코드를 삭제하시겠습니까? 지급완료 건은 삭제할 수 없습니다."))return;await ge(n),await Promise.all([o(),p()]);return}await he(n,{status:t.querySelector("[data-role='settlement-status']")?.value,pgFee:Number(t.querySelector("[data-role='pg-fee']")?.value||0),platformFee:Number(t.querySelector("[data-role='platform-fee']")?.value||0),returnDeduction:Number(t.querySelector("[data-role='return-deduction']")?.value||0),expectedPayoutDate:t.querySelector("[data-role='expected-payout-date']")?.value||null,memo:t.querySelector("[data-role='settlement-memo']")?.value?.trim()||"",markPaid:e.dataset.action==="markSettlementPaid"}),await Promise.all([o(),p()])}async function ct(){if(!i.selectedInquiryId)throw new Error("답변할 문의를 먼저 선택해주세요.");await G(i.selectedInquiryId,{answer:a.inquiryEditorAnswer.value.trim(),status:a.inquiryEditorStatus.value,category:a.inquiryEditorCategory.value,priority:a.inquiryEditorPriority.value,assignedAdminId:Number(a.inquiryEditorAssignedAdmin.value||0)||null,internalNote:a.inquiryEditorInternalNote.value.trim(),slaDueAt:Y(a.inquiryEditorSlaDueAt.value)}),await Promise.all([o(),A()]),q(`저장 완료 · ${c(new Date().toISOString())}`)}async function lt(){if(!i.selectedInquiryId)throw new Error("답변을 삭제할 문의를 먼저 선택해주세요.");confirm("등록된 답변을 삭제하고 문의 상태를 접수로 되돌리시겠습니까?")&&(await G(i.selectedInquiryId,{deleteAnswer:!0,status:"OPEN"}),await Promise.all([o(),A()]),q(`답변 삭제 완료 · ${c(new Date().toISOString())}`))}async function ut(e){const t=e.closest("tr[data-review-id]");if(!t)return;const n=Number(t.dataset.reviewId);if(e.dataset.action==="hideReview"&&await F(n,!1),e.dataset.action==="showReview"&&await F(n,!0),e.dataset.action==="deleteReview"){if(!confirm("리뷰를 삭제 처리하시겠습니까?"))return;await $e(n)}await Promise.all([o(),b({page:i.reviewPage})])}async function mt(e){const t=e.closest("tr[data-coupon-id]");if(!t)return;const n=Number(t.dataset.couponId);if(e.dataset.action==="deleteCoupon"){if(!confirm("해당 쿠폰을 삭제하시겠습니까?"))return;await qe(n),await Promise.all([o(),f()])}}async function pt(e){const t=e.closest("tr[data-banner-id]");if(!t)return;const n=Number(t.dataset.bannerId);if(e.dataset.action==="deleteBanner"){if(!confirm("이 배너를 삭제하시겠습니까?"))return;await Ee(n),await Promise.all([$(),o()]);return}await Se(n,{title:t.querySelector("[data-role='title']")?.value?.trim()||"",subtitle:t.querySelector("[data-role='subtitle']")?.value?.trim()||"",description:t.querySelector("[data-role='description']")?.value?.trim()||"",ctaText:t.querySelector("[data-role='cta-text']")?.value?.trim()||"",linkUrl:t.querySelector("[data-role='link-url']")?.value?.trim()||"",sortOrder:Number(t.querySelector("[data-role='sort-order']")?.value||0),isActive:t.querySelector("[data-role='is-active']")?.checked,imageFile:t.querySelector("[data-role='image-file']")?.files?.[0]||null}),await Promise.all([$(),o()])}async function yt(e){const t=e.closest("tr[data-product-id]");if(!t)return;const n=Number(t.dataset.productId);if(e.dataset.action==="deleteManagedProduct"){if(!confirm("이 상품을 삭제하시겠습니까?"))return;await be(n),await Promise.all([v(),o(),m()]);return}await fe(n,{name:t.querySelector("[data-role='name']")?.value?.trim()||"",oneLine:t.querySelector("[data-role='one-line']")?.value?.trim()||"",description:t.querySelector("[data-role='description']")?.value?.trim()||"",price:Number(t.querySelector("[data-role='price']")?.value||0),originalPrice:Number(t.querySelector("[data-role='original-price']")?.value||0),stock:Number(t.querySelector("[data-role='stock']")?.value||0),isActive:t.querySelector("[data-role='is-active']")?.checked,badgeTypes:z(t.querySelector("[data-role='badge-types']")?.value||""),thumbnailFile:t.querySelector("[data-role='thumbnail-file']")?.files?.[0]||null}),await Promise.all([v(),o()])}async function gt(e){const t=e.closest("tr[data-user-id]");if(!t)return;const n=Number(t.dataset.userId);if(e.dataset.action==="deactivateManagedUser"){if(!confirm("해당 회원을 비활성화하시겠습니까?"))return;await Ie(n),await Promise.all([B(),o()]);return}await Ae(n,{name:t.querySelector("[data-role='name']")?.value?.trim()||"",phone:t.querySelector("[data-role='phone']")?.value?.trim()||"",isActive:t.querySelector("[data-role='is-active']")?.value==="true",isStaff:t.querySelector("[data-role='is-staff']")?.value==="true"}),await Promise.all([B(),o()])}function h(e,t){e?.addEventListener("keydown",async n=>{if(n.key==="Enter"){n.preventDefault();try{await t()}catch(r){console.error(r),s(r.message||"조회 중 오류가 발생했습니다.","error")}}})}function ht(){a.navButtons.forEach(e=>{e.addEventListener("click",async()=>{const t=e.dataset.tabBtn;if(H(t),t==="products")try{await Promise.all([$(),v()])}catch(n){console.error(n),s(n.message||"배너/상품 정보를 불러오지 못했습니다.","error")}})}),H(i.activeTab)}function vt(){ht(),a.inquiryEditorDeleteBtn&&(a.inquiryEditorDeleteBtn.disabled=!0),U(),a.reloadBtn?.addEventListener("click",async()=>{try{await J(),s("운영 데이터가 갱신되었습니다.")}catch(t){console.error(t),s(t.message||"새로고침 중 오류가 발생했습니다.","error")}}),a.generateSettlementBtn?.addEventListener("click",async()=>{try{const t=await Z({onlyPaidOrders:!0}),n=Number(t?.generated_count??t?.generatedCount??0);s(`정산 레코드 생성/갱신 완료: ${n}건`),await Promise.all([o(),p(),m()])}catch(t){console.error(t),s(t.message||"정산 생성에 실패했습니다.","error")}}),[a.orderSearchBtn,a.orderStatus,a.paymentStatus,a.shippingStatus,a.orderOpenReturnOnly].forEach(t=>{const n=t?.tagName==="BUTTON"?"click":"change";t?.addEventListener(n,async()=>{try{await m()}catch(r){console.error(r),s(r.message||"주문 조회에 실패했습니다.","error")}})}),[a.returnSearchBtn,a.returnStatus].forEach(t=>{const n=t?.tagName==="BUTTON"?"click":"change";t?.addEventListener(n,async()=>{try{await E()}catch(r){console.error(r),s(r.message||"반품 조회에 실패했습니다.","error")}})}),[a.settlementSearchBtn,a.settlementStatus].forEach(t=>{const n=t?.tagName==="BUTTON"?"click":"change";t?.addEventListener(n,async()=>{try{await p()}catch(r){console.error(r),s(r.message||"정산 조회에 실패했습니다.","error")}})}),[a.inquirySearchBtn,a.inquiryStatus,a.inquiryCategory,a.inquiryPriority,a.inquiryOverdueOnly].forEach(t=>{const n=t?.tagName==="BUTTON"?"click":"change";t?.addEventListener(n,async()=>{try{await A()}catch(r){console.error(r),s(r.message||"CS 조회에 실패했습니다.","error")}})}),[a.reviewSearchBtn,a.reviewStatus,a.reviewSort].forEach(t=>{const n=t?.tagName==="BUTTON"?"click":"change";t?.addEventListener(n,async()=>{try{i.reviewPage=1,await b({page:1})}catch(r){console.error(r),s(r.message||"리뷰 조회에 실패했습니다.","error")}})}),[a.managedProductSearchBtn,a.managedProductActiveFilter].forEach(t=>{const n=t?.tagName==="BUTTON"?"click":"change";t?.addEventListener(n,async()=>{try{await v()}catch(r){console.error(r),s(r.message||"상품 조회에 실패했습니다.","error")}})}),[a.memberSearchBtn,a.memberActiveFilter,a.memberStaffFilter].forEach(t=>{const n=t?.tagName==="BUTTON"?"click":"change";t?.addEventListener(n,async()=>{try{await B()}catch(r){console.error(r),s(r.message||"회원 조회에 실패했습니다.","error")}})}),h(a.orderSearch,m),h(a.returnSearch,E),h(a.settlementSearch,p),h(a.inquirySearch,A),h(a.reviewSearch,async()=>{i.reviewPage=1,await b({page:1})}),h(a.managedProductSearch,v),h(a.memberSearch,B),a.orders?.addEventListener("click",async t=>{const n=t.target.closest("[data-action]");if(n)try{await dt(n),s("주문/배송 정보가 저장되었습니다.")}catch(r){console.error(r),s(r.message||"주문/배송 정보 업데이트에 실패했습니다.","error")}}),a.returnCreateForm?.addEventListener("submit",async t=>{t.preventDefault();try{await ee({orderNo:a.returnOrderNo.value.trim(),reasonTitle:a.returnReasonTitle.value.trim(),reasonDetail:a.returnReasonDetail.value.trim(),requestedAmount:a.returnRequestedAmount.value?Number(a.returnRequestedAmount.value):void 0}),a.returnCreateForm.reset(),s("반품 요청이 등록되었습니다."),await Promise.all([o(),E(),m(),p()])}catch(n){console.error(n),s(n.message||"반품 요청 등록에 실패했습니다.","error")}}),a.returns?.addEventListener("click",async t=>{const n=t.target.closest("[data-action]");if(n)try{await st(n),n.dataset.action==="deleteReturn"?s("반품/환불 요청이 삭제되었습니다."):s("반품/환불 정보가 저장되었습니다.")}catch(r){console.error(r),s(r.message||"반품/환불 처리에 실패했습니다.","error")}}),a.settlements?.addEventListener("click",async t=>{const n=t.target.closest("[data-action]");if(n)try{await ot(n),n.dataset.action==="deleteSettlement"?s("정산 레코드가 삭제되었습니다."):s("정산 정보가 저장되었습니다.")}catch(r){console.error(r),s(r.message||"정산 저장에 실패했습니다.","error")}}),a.inquiries?.addEventListener("click",t=>{const n=t.target.closest("[data-action='openInquiryEditor']");if(!n)return;const r=Number(n.dataset.inquiryId);r&&W(r)}),a.inquiryEditorCloseBtn?.addEventListener("click",()=>{Q()}),a.inquiryEditorSaveBtn?.addEventListener("click",async()=>{try{await ct(),s("CS 답변이 저장되었습니다.")}catch(t){console.error(t),q(t.message||"CS 저장에 실패했습니다.","error"),s(t.message||"CS 저장에 실패했습니다.","error")}}),a.inquiryEditorDeleteBtn?.addEventListener("click",async()=>{try{await lt(),s("CS 답변이 삭제되었습니다.")}catch(t){console.error(t),q(t.message||"CS 답변 삭제에 실패했습니다.","error"),s(t.message||"CS 답변 삭제에 실패했습니다.","error")}}),a.bannerCreateForm?.addEventListener("submit",async t=>{t.preventDefault();try{await te({title:a.bannerTitle.value.trim(),subtitle:a.bannerSubtitle.value.trim(),description:a.bannerDescription.value.trim(),ctaText:a.bannerCtaText.value.trim(),linkUrl:a.bannerLinkUrl.value.trim(),sortOrder:Number(a.bannerSortOrder.value||0),isActive:a.bannerIsActive.checked,imageFile:a.bannerImageFile.files?.[0]||null}),a.bannerCreateForm.reset(),a.bannerIsActive&&(a.bannerIsActive.checked=!0),s("배너가 등록되었습니다."),await Promise.all([$(),o()])}catch(n){console.error(n),s(n.message||"배너 등록에 실패했습니다.","error")}}),a.managedBanners?.addEventListener("click",async t=>{const n=t.target.closest("[data-action]");if(n)try{await pt(n),s(n.dataset.action==="deleteBanner"?"배너가 삭제되었습니다.":"배너 정보가 저장되었습니다.")}catch(r){console.error(r),s(r.message||"배너 처리에 실패했습니다.","error")}}),a.productCreateForm?.addEventListener("submit",async t=>{t.preventDefault();try{await ae({name:a.productName.value.trim(),oneLine:a.productOneLine.value.trim(),description:a.productDescription.value.trim(),price:Number(a.productPrice.value||0),originalPrice:Number(a.productOriginalPrice.value||0),stock:Number(a.productStock.value||0),isActive:a.productIsActive.checked,badgeTypes:z(a.productBadges.value),thumbnailFile:a.productThumbnail.files?.[0]||null}),a.productCreateForm.reset(),a.productIsActive&&(a.productIsActive.checked=!0),s("상품이 등록되었습니다."),await Promise.all([v(),o(),m()])}catch(n){console.error(n),s(n.message||"상품 등록에 실패했습니다.","error")}}),a.managedProducts?.addEventListener("click",async t=>{const n=t.target.closest("[data-action]");if(n)try{await yt(n),s(n.dataset.action==="deleteManagedProduct"?"상품이 삭제되었습니다.":"상품 정보가 저장되었습니다.")}catch(r){console.error(r),s(r.message||"상품 처리에 실패했습니다.","error")}}),a.managedUsers?.addEventListener("click",async t=>{const n=t.target.closest("[data-action]");if(n)try{await gt(n),s(n.dataset.action==="deactivateManagedUser"?"회원이 비활성화되었습니다.":"회원 정보가 저장되었습니다.")}catch(r){console.error(r),s(r.message||"회원 처리에 실패했습니다.","error")}}),a.reviews?.addEventListener("click",async t=>{const n=t.target.closest("[data-action]");if(n)try{await ut(n),n.dataset.action==="deleteReview"?s("리뷰가 삭제 처리되었습니다."):s("리뷰 노출 상태가 반영되었습니다.")}catch(r){console.error(r),s(r.message||"리뷰 상태 변경에 실패했습니다.","error")}}),a.reviewPagination?.addEventListener("click",async t=>{const n=t.target.closest("[data-action='goReviewPage']");if(!n)return;const r=Number(n.dataset.page);if(!(!r||r<1||r>i.reviewTotalPages||r===i.reviewPage))try{await b({page:r})}catch(u){console.error(u),s(u.message||"리뷰 페이지 이동에 실패했습니다.","error")}}),a.couponTarget?.addEventListener("change",()=>{const t=a.couponTarget.value==="EMAIL";a.couponEmailField.classList.toggle("hidden",!t),a.couponEmail.required=t}),a.couponForm?.addEventListener("submit",async t=>{t.preventDefault();try{const n=await ne({target:a.couponTarget.value,email:a.couponTarget.value==="EMAIL"?a.couponEmail.value.trim():void 0,name:a.couponName.value.trim(),code:a.couponCode.value.trim(),discountAmount:Number(a.couponDiscountAmount.value||0),minOrderAmount:Number(a.couponMinOrderAmount.value||0),expiresAt:Y(a.couponExpiresAt.value)}),r=Number(n?.issued_count??n?.issuedCount??0);s(`쿠폰 발급 완료: ${r}건`),await Promise.all([o(),f()])}catch(n){console.error(n),s(n.message||"쿠폰 발급에 실패했습니다.","error")}});let e=null;a.couponSearch?.addEventListener("input",()=>{e&&clearTimeout(e),e=setTimeout(async()=>{try{await f()}catch(t){console.error(t),s(t.message||"쿠폰 조회에 실패했습니다.","error")}},250)}),h(a.couponSearch,f),a.coupons?.addEventListener("click",async t=>{const n=t.target.closest("[data-action='deleteCoupon']");if(n)try{await mt(n),s("쿠폰이 삭제되었습니다.")}catch(r){console.error(r),s(r.message||"쿠폰 삭제에 실패했습니다.","error")}})}async function Et(){const e=await _()||j();if(!e){alert("관리자 페이지는 로그인 후 이용할 수 있습니다."),location.href="/pages/login.html";return}if(!ke(e)){alert("관리자 권한이 없습니다."),location.href="/pages/home.html";return}i.user=e,vt();try{await J()}catch(t){console.error(t),s(t.message||"관리자 데이터를 불러오지 못했습니다.","error")}}Et();
