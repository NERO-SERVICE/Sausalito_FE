import{m as gt,a as ht,s as X,g as W,x as bt,y as St,z as vt,A as Et,B as ft,C as $t,D as It,E as At,F as Bt,G as qt,H as Pt,I as wt,J as Tt,K as Nt,L as Dt,M as Lt,N as Ct,O as Rt,P as z,Q as Mt,R as Ot,S as xt,T as kt,U as Ft,V as Y,W as Ut,X as Ht,Y as _t,Z as jt,_ as Gt,d as Vt}from"./footer-DEhz7KPv.js";import{c as Yt}from"./cart-service-Baow9FyR.js";import{f as u}from"./store-data-Deux6dsM.js";const Kt=gt({showCart:!0,currentNav:""});ht();const Xt=["dashboard","orders","returns","settlements","cs","reviews","products","members","coupons"],Wt=["PENDING","PAID","FAILED","CANCELED","REFUNDED","PARTIAL_REFUNDED"],zt=["UNPAID","READY","APPROVED","CANCELED","FAILED"],Qt=["READY","PREPARING","SHIPPED","DELIVERED"],Jt=["REQUESTED","APPROVED","PICKUP_SCHEDULED","RECEIVED","REFUNDING","REFUNDED","REJECTED","CLOSED"],Zt=["PENDING","HOLD","SCHEDULED","PAID"],Q={PENDING:"주문접수",PAID:"주문완료",FAILED:"결제실패",CANCELED:"주문취소",REFUNDED:"전체환불",PARTIAL_REFUNDED:"부분환불"},J={UNPAID:"결제대기",READY:"결제준비",APPROVED:"결제완료",CANCELED:"결제취소",FAILED:"결제실패"},Z={READY:"배송준비",PREPARING:"상품준비중",SHIPPED:"배송중",DELIVERED:"배송완료"},tt={REQUESTED:"요청",APPROVED:"승인",PICKUP_SCHEDULED:"회수예정",RECEIVED:"회수완료",REFUNDING:"환불처리중",REFUNDED:"환불완료",REJECTED:"반려",CLOSED:"종결"},H={PENDING:"정산대기",HOLD:"정산보류",SCHEDULED:"지급예정",PAID:"지급완료"},et={OPEN:"접수",ANSWERED:"답변완료",CLOSED:"종결"},at={VISIBLE:"노출",HIDDEN:"숨김",DELETED:"삭제"},te={...Q,...J,...Z,...tt,...H,...et,...at},_={DELIVERY:"배송",RETURN_REFUND:"반품/환불",PAYMENT:"결제",ORDER:"주문",PRODUCT:"상품",ETC:"기타"},nt={LOW:"낮음",NORMAL:"보통",HIGH:"높음",URGENT:"긴급"},d={user:null,activeTab:"dashboard",dashboard:null,orders:[],returns:[],settlements:[],inquiries:[],selectedInquiryId:null,expandedInquiryId:null,reviews:[],reviewPage:1,reviewPageSize:10,reviewTotalPages:1,reviewTotalCount:0,managedBanners:[],managedProducts:[],productMeta:{badgeOptions:[],categoryOptions:[],taxStatusOptions:[]},managedUsers:[],coupons:[],staffUsers:[],editingRows:{orders:new Set,returns:new Set,settlements:new Set,banners:new Set,products:new Set}},n={reloadBtn:document.getElementById("adminReloadBtn"),generateSettlementBtn:document.getElementById("adminGenerateSettlementBtn"),notice:document.getElementById("adminActionNotice"),navButtons:Array.from(document.querySelectorAll("[data-tab-btn]")),tabPanels:Array.from(document.querySelectorAll("[data-tab-panel]")),summary:document.getElementById("adminSummary"),dashboardMonthly:document.getElementById("adminDashboardMonthly"),dashboardShipping:document.getElementById("adminDashboardShipping"),dashboardReturns:document.getElementById("adminDashboardReturns"),dashboardInquiries:document.getElementById("adminDashboardInquiries"),dashboardSettlements:document.getElementById("adminDashboardSettlements"),orders:document.getElementById("adminOrders"),orderSearch:document.getElementById("adminOrderSearch"),orderStatus:document.getElementById("adminOrderStatusFilter"),paymentStatus:document.getElementById("adminPaymentStatusFilter"),shippingStatus:document.getElementById("adminShippingStatusFilter"),orderOpenReturnOnly:document.getElementById("adminOrderOpenReturnOnly"),orderSearchBtn:document.getElementById("adminOrderSearchBtn"),returns:document.getElementById("adminReturns"),returnSearch:document.getElementById("adminReturnSearch"),returnStatus:document.getElementById("adminReturnStatusFilter"),returnSearchBtn:document.getElementById("adminReturnSearchBtn"),returnCreateForm:document.getElementById("adminReturnCreateForm"),returnOrderNo:document.getElementById("returnOrderNo"),returnReasonTitle:document.getElementById("returnReasonTitle"),returnReasonDetail:document.getElementById("returnReasonDetail"),returnRequestedAmount:document.getElementById("returnRequestedAmount"),settlements:document.getElementById("adminSettlements"),settlementSearch:document.getElementById("adminSettlementSearch"),settlementStatus:document.getElementById("adminSettlementStatusFilter"),settlementSearchBtn:document.getElementById("adminSettlementSearchBtn"),inquirySearch:document.getElementById("adminInquirySearch"),inquiryStatus:document.getElementById("adminInquiryStatusFilter"),inquiryCategory:document.getElementById("adminInquiryCategoryFilter"),inquiryPriority:document.getElementById("adminInquiryPriorityFilter"),inquiryOverdueOnly:document.getElementById("adminInquiryOverdueOnly"),inquirySearchBtn:document.getElementById("adminInquirySearchBtn"),inquiries:document.getElementById("adminInquiries"),inquiryEditor:document.getElementById("adminInquiryEditor"),inquiryEditorCloseBtn:document.getElementById("adminInquiryEditorCloseBtn"),inquiryEditorMeta:document.getElementById("adminInquiryEditorMeta"),inquiryEditorStatus:document.getElementById("adminInquiryEditorStatus"),inquiryEditorCategory:document.getElementById("adminInquiryEditorCategory"),inquiryEditorPriority:document.getElementById("adminInquiryEditorPriority"),inquiryEditorAssignedAdmin:document.getElementById("adminInquiryEditorAssignedAdmin"),inquiryEditorSlaDueAt:document.getElementById("adminInquiryEditorSlaDueAt"),inquiryEditorAnswer:document.getElementById("adminInquiryEditorAnswer"),inquiryEditorInternalNote:document.getElementById("adminInquiryEditorInternalNote"),inquiryEditorSaveBtn:document.getElementById("adminInquiryEditorSaveBtn"),inquiryEditorDeleteBtn:document.getElementById("adminInquiryEditorDeleteBtn"),inquiryEditorSavedState:document.getElementById("adminInquiryEditorSavedState"),managedBanners:document.getElementById("adminManagedBanners"),bannerCreateForm:document.getElementById("adminBannerCreateForm"),bannerTitle:document.getElementById("bannerTitle"),bannerSubtitle:document.getElementById("bannerSubtitle"),bannerDescription:document.getElementById("bannerDescription"),bannerCtaText:document.getElementById("bannerCtaText"),bannerLinkUrl:document.getElementById("bannerLinkUrl"),bannerSortOrder:document.getElementById("bannerSortOrder"),bannerIsActive:document.getElementById("bannerIsActive"),bannerImageFile:document.getElementById("bannerImageFile"),managedProducts:document.getElementById("adminManagedProducts"),managedProductSearch:document.getElementById("adminManagedProductSearch"),managedProductCategoryFilter:document.getElementById("adminManagedProductCategoryFilter"),managedProductActiveFilter:document.getElementById("adminManagedProductActiveFilter"),managedProductSearchBtn:document.getElementById("adminManagedProductSearchBtn"),productCreateForm:document.getElementById("adminProductCreateForm"),productCategoryId:document.getElementById("managedProductCategoryId"),productSku:document.getElementById("managedProductSku"),productName:document.getElementById("managedProductName"),productOneLine:document.getElementById("managedProductOneLine"),productDescription:document.getElementById("managedProductDescription"),productIntake:document.getElementById("managedProductIntake"),productTarget:document.getElementById("managedProductTarget"),productManufacturer:document.getElementById("managedProductManufacturer"),productOriginCountry:document.getElementById("managedProductOriginCountry"),productTaxStatus:document.getElementById("managedProductTaxStatus"),productDeliveryFee:document.getElementById("managedProductDeliveryFee"),productFreeShippingAmount:document.getElementById("managedProductFreeShippingAmount"),productSearchKeywords:document.getElementById("managedProductSearchKeywords"),productReleaseDate:document.getElementById("managedProductReleaseDate"),productDisplayStartAt:document.getElementById("managedProductDisplayStartAt"),productDisplayEndAt:document.getElementById("managedProductDisplayEndAt"),productPrice:document.getElementById("managedProductPrice"),productOriginalPrice:document.getElementById("managedProductOriginalPrice"),productStock:document.getElementById("managedProductStock"),productBadgeGroup:document.getElementById("managedProductBadgeGroup"),productIsActive:document.getElementById("managedProductIsActive"),productThumbnail:document.getElementById("managedProductThumbnail"),productImages:document.getElementById("managedProductImages"),managedUsers:document.getElementById("adminMembers"),memberSearch:document.getElementById("adminMemberSearch"),memberActiveFilter:document.getElementById("adminMemberActiveFilter"),memberStaffFilter:document.getElementById("adminMemberStaffFilter"),memberSearchBtn:document.getElementById("adminMemberSearchBtn"),reviewStatus:document.getElementById("adminReviewStatusFilter"),reviewSort:document.getElementById("adminReviewSortFilter"),reviewSearch:document.getElementById("adminReviewSearch"),reviewSearchBtn:document.getElementById("adminReviewSearchBtn"),reviewPagination:document.getElementById("adminReviewPagination"),reviews:document.getElementById("adminReviews"),couponForm:document.getElementById("adminCouponForm"),couponTarget:document.getElementById("couponTarget"),couponEmailField:document.getElementById("couponEmailField"),couponEmail:document.getElementById("couponEmail"),couponName:document.getElementById("couponName"),couponCode:document.getElementById("couponCode"),couponDiscountAmount:document.getElementById("couponDiscountAmount"),couponMinOrderAmount:document.getElementById("couponMinOrderAmount"),couponExpiresAt:document.getElementById("couponExpiresAt"),couponSearch:document.getElementById("adminCouponSearch"),coupons:document.getElementById("adminCoupons")};let C=null;function ee(t){return!!(t?.is_staff??t?.isStaff)}function i(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#39;")}function o(t,e="success"){n.notice&&(n.notice.textContent=t,n.notice.classList.remove("hidden","success","error"),n.notice.classList.add(e==="error"?"error":"success"),C&&clearTimeout(C),C=setTimeout(()=>{n.notice.classList.add("hidden"),n.notice.classList.remove("success","error"),n.notice.textContent=""},3200))}function p(t){if(!t)return"-";const e=new Date(t);if(Number.isNaN(e.getTime()))return"-";const a=e.getFullYear(),r=String(e.getMonth()+1).padStart(2,"0"),s=String(e.getDate()).padStart(2,"0"),c=String(e.getHours()).padStart(2,"0"),f=String(e.getMinutes()).padStart(2,"0");return`${a}.${r}.${s} ${c}:${f}`}function ae(t,e=220){const a=String(t||"").trim();if(!a)return"";const r=a.length>e?`${a.slice(0,e)}...`:a;return i(r).replace(/\n/g,"<br />")}function ne(t){const e=String(t||"").trim();return e?i(e).replace(/\n/g,"<br />"):""}function h(t,e){const a=d.editingRows?.[t];return a?a.has(String(e)):!1}function m(t,e,a){const r=d.editingRows?.[t];if(!r)return;const s=String(e);if(a){r.clear(),r.add(s);return}r.delete(s)}function w(t){const e=d.editingRows?.[t];e&&e.clear()}function v(t){if(!t)return null;const e=new Date(t);return Number.isNaN(e.getTime())?null:e.toISOString()}function R(t){if(!t)return"";const e=new Date(t);if(Number.isNaN(e.getTime()))return"";const a=e.getFullYear(),r=String(e.getMonth()+1).padStart(2,"0"),s=String(e.getDate()).padStart(2,"0"),c=String(e.getHours()).padStart(2,"0"),f=String(e.getMinutes()).padStart(2,"0");return`${a}-${r}-${s}T${c}:${f}`}function B(t,e=null){return t?e&&e[t]?e[t]:te[t]||_[t]||nt[t]||t:"-"}function j(t,e=null){const a=t||"-";return`<span class="admin-status ${String(a).toLowerCase().replace(/[^a-z0-9]+/g,"_")}">${i(B(a,e))}</span>`}function $(t,e,a=null){return t.map(r=>`<option value="${i(r)}" ${r===e?"selected":""}>${i(B(r,a))}</option>`).join("")}function re(t){const e=['<option value="">미할당</option>'],a=d.staffUsers.map(r=>{const s=`${r.name||"관리자"} (${r.email})`;return`<option value="${r.id}" ${Number(r.id)===Number(t)?"selected":""}>${i(s)}</option>`});return[...e,...a].join("")}function ie(t){if(!t)return"";if(/^\d{4}-\d{2}-\d{2}$/.test(String(t)))return String(t);const e=new Date(t);if(Number.isNaN(e.getTime()))return"";const a=e.getFullYear(),r=String(e.getMonth()+1).padStart(2,"0"),s=String(e.getDate()).padStart(2,"0");return`${a}-${r}-${s}`}function rt(t){return String(t||"").split(",").map(e=>e.trim()).filter(Boolean)}function it(t="",e=!0){const a=[];return e&&a.push('<option value="">선택 안함</option>'),d.productMeta.categoryOptions.forEach(r=>{const s=String(r.id)===String(t)?"selected":"";a.push(`<option value="${r.id}" ${s}>${i(r.name)}</option>`)}),a.join("")}function dt(t="TAXABLE"){return(d.productMeta.taxStatusOptions.length?d.productMeta.taxStatusOptions:[{code:"TAXABLE",label:"과세"},{code:"ZERO",label:"영세"},{code:"EXEMPT",label:"면세"}]).map(a=>`<option value="${i(a.code)}" ${a.code===t?"selected":""}>${i(a.label)}</option>`).join("")}function ot(t=[],e=!1){const a=new Set((t||[]).map(s=>String(s)));return(d.productMeta.badgeOptions.length?d.productMeta.badgeOptions:[{code:"HOT",label:"HOT"},{code:"BESTSELLER",label:"BESTSELLER"},{code:"DISCOUNT",label:"DISCOUNT"},{code:"NEW",label:"NEW"},{code:"RECOMMENDED",label:"RECOMMENDED"}]).map(s=>`
      <label class="admin-check-inline">
        <input type="checkbox" data-role="badge-type" value="${i(s.code)}" ${a.has(s.code)?"checked":""} ${e?"disabled":""} />
        <span>${i(s.label)}</span>
      </label>
    `).join("")}function st(t){return t?Array.from(t.querySelectorAll("input[data-role='badge-type']:checked")).map(e=>String(e.value||"").trim()).filter(Boolean):[]}function T(t={},e={}){return Object.entries(e).map(([a,r])=>`<p><span>${i(r)}</span><strong>${Number(t?.[a]??0)}건</strong></p>`).join("")}function N(t,e="success"){n.inquiryEditorSavedState&&(n.inquiryEditorSavedState.textContent=t,n.inquiryEditorSavedState.classList.remove("hidden"),n.inquiryEditorSavedState.style.borderColor=e==="error"?"#fecaca":"#bbf7d0",n.inquiryEditorSavedState.style.background=e==="error"?"#fef2f2":"#f0fdf4",n.inquiryEditorSavedState.style.color=e==="error"?"#991b1b":"#166534")}function G(){n.inquiryEditorSavedState&&(n.inquiryEditorSavedState.classList.add("hidden"),n.inquiryEditorSavedState.textContent="")}function K(t){Xt.includes(t)&&(d.activeTab=t,n.navButtons.forEach(e=>{const a=e.dataset.tabBtn===t;e.classList.toggle("active",a),e.setAttribute("aria-pressed",String(a))}),n.tabPanels.forEach(e=>{const a=e.dataset.tabPanel===t;e.classList.toggle("is-active",a),e.hidden=!a}))}function de(){const t=d.dashboard?.summary||{};n.summary.innerHTML=`
    <article>
      <p>${i(t.currentMonth||"-")} 주문건수</p>
      <strong>${t.thisMonthOrderCount||0}건</strong>
    </article>
    <article>
      <p>${i(t.currentMonth||"-")} 주문금액</p>
      <strong>${u(t.thisMonthOrderAmount||0)}</strong>
    </article>
    <article>
      <p>${i(t.currentMonth||"-")} 결제완료 주문</p>
      <strong>${t.thisMonthPaidOrderCount||0}건</strong>
    </article>
    <article>
      <p>${i(t.currentMonth||"-")} 결제금액</p>
      <strong>${u(t.thisMonthPaidAmount||0)}</strong>
    </article>
    <article>
      <p>${i(t.currentMonth||"-")} 환불금액</p>
      <strong>${u(t.thisMonthRefundAmount||0)}</strong>
    </article>
    <article>
      <p>${i(t.currentMonth||"-")} 신규회원</p>
      <strong>${t.thisMonthNewUserCount||0}명</strong>
    </article>
    <article>
      <p>${i(t.currentMonth||"-")} CS 문의</p>
      <strong>${t.thisMonthInquiryCount||0}건</strong>
    </article>
    <article>
      <p>${i(t.currentMonth||"-")} 정산 지급완료</p>
      <strong>${u(t.thisMonthPaidSettlementAmount||0)}</strong>
    </article>
    <article>
      <p>진행 주문건</p>
      <strong>${t.openOrderCount||0}건</strong>
    </article>
    <article>
      <p>반품 진행건</p>
      <strong>${t.openReturnCount||0}건</strong>
    </article>
    <article>
      <p>반품 완료건</p>
      <strong>${t.completedReturnCount||0}건</strong>
    </article>
    <article>
      <p>CS 미처리</p>
      <strong>${t.openInquiryCount||0}건</strong>
    </article>
    <article>
      <p>CS SLA 지연</p>
      <strong>${t.overdueInquiryCount||0}건</strong>
    </article>
    <article>
      <p>정산 예정금</p>
      <strong>${u(t.pendingSettlementAmount||0)}</strong>
    </article>
    <article>
      <p>정산 지급완료 누적</p>
      <strong>${u(t.paidSettlementAmount||0)}</strong>
    </article>
  `}function oe(){const t=d.dashboard?.monthlyMetrics||[];if(!t.length){n.dashboardMonthly.innerHTML='<p class="empty">월별 지표 데이터가 없습니다.</p>';return}n.dashboardMonthly.innerHTML=`
    <div class="admin-excel-wrap">
      <table class="admin-excel-table admin-dashboard-monthly-table">
        <thead>
          <tr>
            <th>월</th>
            <th>주문건수</th>
            <th>결제완료 주문</th>
            <th>주문금액</th>
            <th>결제금액</th>
            <th>환불금액</th>
            <th>반품요청건</th>
            <th>신규회원</th>
            <th>CS 문의</th>
            <th>정산지급건</th>
            <th>정산지급금액</th>
          </tr>
        </thead>
        <tbody>
          ${t.map(e=>`
            <tr>
              <td>${i(e.month)}</td>
              <td>${e.orderCount}건</td>
              <td>${e.paidOrderCount}건</td>
              <td>${u(e.orderAmount)}</td>
              <td>${u(e.paidAmount)}</td>
              <td>${u(e.refundAmount)}</td>
              <td>${e.returnRequestCount}건</td>
              <td>${e.newUserCount}명</td>
              <td>${e.inquiryCount}건</td>
              <td>${e.paidSettlementCount}건</td>
              <td>${u(e.paidSettlementAmount)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `}function se(){const t=d.dashboard?.statusSectors||{};n.dashboardShipping.innerHTML=T(t.shipping,{ready:"배송준비",preparing:"상품준비중",shipped:"배송중",delivered:"배송완료"}),n.dashboardReturns.innerHTML=T(t.returns,{requested:"요청",approved:"승인",refunding:"환불처리중",refunded:"환불완료",rejected:"반려"}),n.dashboardInquiries.innerHTML=T(t.inquiries,{open:"접수",answered:"답변완료",closed:"종결"}),n.dashboardSettlements.innerHTML=T(t.settlements,{pending:"정산대기",hold:"정산보류",scheduled:"지급예정",paid:"지급완료"})}function ce(){oe(),se()}function M(){if(!d.orders.length){n.orders.innerHTML='<p class="empty">조건에 맞는 주문이 없습니다.</p>';return}n.orders.innerHTML=`
    <div class="admin-excel-wrap">
      <table class="admin-excel-table admin-orders-table">
        <thead>
          <tr>
            <th>작업</th>
            <th>주문번호</th>
            <th>주문일시</th>
            <th>상품수</th>
            <th>총결제금액</th>
            <th>주문자명</th>
            <th>수령인</th>
            <th>연락처</th>
            <th>우편번호</th>
            <th>도로명주소</th>
            <th>지번주소</th>
            <th>상세주소</th>
            <th>주문상태</th>
            <th>결제상태</th>
            <th>배송상태</th>
            <th>정산상태</th>
            <th>반품요청건</th>
            <th>반품진행</th>
            <th>택배사</th>
            <th>송장번호</th>
          </tr>
        </thead>
        <tbody>
          ${d.orders.map(t=>{const e=h("orders",t.orderNo),a=e?"":"disabled";return`
              <tr data-order-no="${i(t.orderNo)}" class="${e?"is-editing":"is-readonly"}">
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
                <td><strong>${i(t.orderNo)}</strong></td>
                <td>${p(t.createdAt)}</td>
                <td>${t.itemCount}개</td>
                <td>${u(t.totalAmount)}</td>
                <td>${i(t.userName||"-")}</td>
                <td><input type="text" data-role="recipient" value="${i(t.recipient||"")}" ${a} /></td>
                <td><input type="text" data-role="phone" value="${i(t.phone||"")}" ${a} /></td>
                <td><input type="text" data-role="postal-code" value="${i(t.postalCode||"")}" ${a} /></td>
                <td><input type="text" data-role="road-address" value="${i(t.roadAddress||"")}" ${a} /></td>
                <td><input type="text" data-role="jibun-address" value="${i(t.jibunAddress||"")}" ${a} /></td>
                <td><input type="text" data-role="detail-address" value="${i(t.detailAddress||"")}" ${a} /></td>
                <td class="admin-cell-select">
                  <select data-role="order-status" ${a}>${$(Wt,t.status,Q)}</select>
                </td>
                <td class="admin-cell-select">
                  <select data-role="payment-status" ${a}>${$(zt,t.paymentStatus,J)}</select>
                </td>
                <td class="admin-cell-select">
                  <select data-role="shipping-status" ${a}>${$(Qt,t.shippingStatus,Z)}</select>
                </td>
                <td>${j(t.settlementStatus||"-",H)}</td>
                <td>${t.returnRequestCount}건</td>
                <td>${t.hasOpenReturn?"진행중":"-"}</td>
                <td>
                  <input type="text" data-role="courier-name" value="${i(t.courierName||"")}" ${a} />
                </td>
                <td>
                  <input type="text" data-role="tracking-no" value="${i(t.trackingNo||"")}" ${a} />
                </td>
              </tr>
            `}).join("")}
        </tbody>
      </table>
    </div>
  `}function O(){if(!d.returns.length){n.returns.innerHTML='<p class="empty">반품/환불 데이터가 없습니다.</p>';return}n.returns.innerHTML=`
    <div class="admin-excel-wrap">
      <table class="admin-excel-table admin-returns-table">
        <thead>
          <tr>
            <th>작업</th>
            <th>주문번호</th>
            <th>회원</th>
            <th>요청사유</th>
            <th>상세사유</th>
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
          ${d.returns.map(t=>{const e=h("returns",t.id),a=e?"":"disabled";return`
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
                <td><strong>${i(t.orderNo)}</strong></td>
                <td>${i(t.userEmail||"-")}</td>
                <td>${i(t.reasonTitle||"-")}</td>
                <td>${i(t.reasonDetail||"-")}</td>
                <td>${u(t.requestedAmount)}</td>
                <td>
                  <select data-role="return-status" ${a}>${$(Jt,t.status,tt)}</select>
                </td>
                <td>
                  <input type="number" min="0" data-role="approved-amount" value="${t.approvedAmount||0}" ${a} />
                </td>
                <td>
                  <input type="text" data-role="pickup-courier" placeholder="회수 택배사" value="${i(t.pickupCourierName||"")}" ${a} />
                </td>
                <td>
                  <input type="text" data-role="pickup-tracking" placeholder="회수 송장번호" value="${i(t.pickupTrackingNo||"")}" ${a} />
                </td>
                <td>
                  <input type="text" data-role="rejected-reason" placeholder="반려 사유" value="${i(t.rejectedReason||"")}" ${a} />
                </td>
                <td>
                  <input type="text" data-role="admin-note" placeholder="관리 메모" value="${i(t.adminNote||"")}" ${a} />
                </td>
                <td>${p(t.requestedAt)}</td>
              </tr>
            `}).join("")}
        </tbody>
      </table>
    </div>
  `}function x(){if(!d.settlements.length){n.settlements.innerHTML='<p class="empty">정산 데이터가 없습니다.</p>';return}n.settlements.innerHTML=`
    <div class="admin-excel-wrap">
      <table class="admin-excel-table admin-settlements-table">
        <thead>
          <tr>
            <th rowspan="2">작업</th>
            <th rowspan="2">주문번호</th>
            <th rowspan="2">주문일시</th>
            <th rowspan="2">회원</th>
            <th colspan="4">주문 데이터</th>
            <th colspan="3">정산 공제</th>
            <th colspan="5">정산 결과</th>
          </tr>
          <tr>
            <th>주문소계</th>
            <th>배송비</th>
            <th>할인금액</th>
            <th>총결제금액</th>
            <th>PG수수료</th>
            <th>플랫폼수수료</th>
            <th>반품차감</th>
            <th>정산상태</th>
            <th>정산금</th>
            <th>지급예정일</th>
            <th>지급완료일</th>
            <th>메모</th>
          </tr>
        </thead>
        <tbody>
          ${d.settlements.map(t=>{const e=h("settlements",t.id),a=e?"":"disabled";return`
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
                <td><strong>${i(t.orderNo)}</strong></td>
                <td>${p(t.orderCreatedAt)}</td>
                <td>${i(t.userEmail||"-")}</td>
                <td>${u(t.orderSubtotalAmount)}</td>
                <td>${u(t.orderShippingFee)}</td>
                <td>${u(t.orderDiscountAmount)}</td>
                <td>${u(t.orderTotalAmount)}</td>
                <td><input type="number" data-role="pg-fee" value="${t.pgFee}" ${a} /></td>
                <td><input type="number" data-role="platform-fee" value="${t.platformFee}" ${a} /></td>
                <td><input type="number" data-role="return-deduction" value="${t.returnDeduction}" ${a} /></td>
                <td>
                  <select data-role="settlement-status" ${a}>${$(Zt,t.status,H)}</select>
                </td>
                <td>${u(t.settlementAmount)}</td>
                <td><input type="date" data-role="expected-payout-date" value="${i(t.expectedPayoutDate||"")}" ${a} /></td>
                <td>${p(t.paidAt)}</td>
                <td><input type="text" data-role="settlement-memo" value="${i(t.memo||"")}" ${a} /></td>
              </tr>
            `}).join("")}
        </tbody>
      </table>
    </div>
  `}function D(){if(!d.inquiries.length){n.inquiries.innerHTML='<p class="empty">문의 내역이 없습니다.</p>';return}n.inquiries.innerHTML=`
    <div class="admin-excel-wrap">
      <table class="admin-excel-table admin-cs-table">
        <thead>
          <tr>
            <th class="admin-cs-col-actions">작업</th>
            <th class="admin-cs-col-id">ID</th>
            <th class="admin-cs-col-member">회원명</th>
            <th class="admin-cs-col-member-email">회원이메일</th>
            <th class="admin-cs-col-title">문의제목</th>
            <th class="admin-cs-col-content">문의내용</th>
            <th class="admin-cs-col-category">카테고리</th>
            <th class="admin-cs-col-status">상태</th>
            <th class="admin-cs-col-sla">SLA 지연</th>
            <th class="admin-cs-col-priority">우선순위</th>
            <th class="admin-cs-col-created">등록일시</th>
          </tr>
        </thead>
        <tbody>
          ${d.inquiries.map(t=>{const e=!!String(t.answer||"").trim(),a=Number(t.id)===Number(d.selectedInquiryId),r=e&&Number(t.id)===Number(d.expandedInquiryId),s=e?ne(t.answer):"";return`
              <tr class="${a?"is-selected":""}">
                <td class="admin-cs-col-actions">
                  <div class="admin-inline-actions">
                    ${e?`
                          <button class="ghost admin-cs-btn-edit" type="button" data-action="openInquiryEditor" data-inquiry-id="${t.id}">수정</button>
                          <button class="ghost admin-cs-btn-view ${r?"is-open":""}" type="button" data-action="toggleInquiryAnswer" data-inquiry-id="${t.id}">확인</button>
                        `:`<button class="primary admin-cs-btn-answer" type="button" data-action="openInquiryEditor" data-inquiry-id="${t.id}">답변</button>`}
                  </div>
                </td>
                <td class="admin-cs-col-id">${t.id}</td>
                <td class="admin-cs-col-member">${i(t.userName||"회원")}</td>
                <td class="admin-cs-col-member-email">${i(t.userEmail||"-")}</td>
                <td class="admin-cs-col-title">${i(t.title)}</td>
                <td class="admin-cs-col-content">${ae(t.content,180)}</td>
                <td class="admin-cs-col-category">${i(B(t.category,_))}</td>
                <td class="admin-cs-col-status">${j(t.status,et)}</td>
                <td class="admin-cs-col-sla">${t.isSlaOverdue?'<span class="admin-status overdue">지연</span>':"-"}</td>
                <td class="admin-cs-col-priority">${i(B(t.priority,nt))}</td>
                <td class="admin-cs-col-created">${p(t.createdAt)}</td>
              </tr>
              ${r?`
                    <tr class="admin-cs-answer-row">
                      <td colspan="11">
                        <section class="admin-cs-inline-answer">
                          <p class="admin-cs-inline-answer-meta">답변 등록일 ${p(t.answeredAt||t.updatedAt)}</p>
                          <div class="admin-cs-inline-answer-body">${s}</div>
                        </section>
                      </td>
                    </tr>
                  `:""}
            `}).join("")}
        </tbody>
      </table>
    </div>
  `}function ue(t){const e=d.inquiries.find(a=>Number(a.id)===Number(t));!e||!String(e.answer||"").trim()||(Number(d.expandedInquiryId)===Number(t)?d.expandedInquiryId=null:d.expandedInquiryId=t,D())}function ct(t){const e=d.inquiries.find(a=>Number(a.id)===Number(t));if(!e){d.selectedInquiryId=null,n.inquiryEditor?.classList.add("hidden");return}if(d.selectedInquiryId=e.id,G(),n.inquiryEditorMeta){const a=`${B(e.category,_)} · ${i(e.userName||e.userEmail||"회원")} · ${p(e.createdAt)}`;n.inquiryEditorMeta.textContent=`${e.title} (${a})`}n.inquiryEditorStatus.value=e.status||"OPEN",n.inquiryEditorCategory.value=e.category||"ETC",n.inquiryEditorPriority.value=e.priority||"NORMAL",n.inquiryEditorAssignedAdmin.innerHTML=re(e.assignedAdminId),n.inquiryEditorSlaDueAt.value=R(e.slaDueAt),n.inquiryEditorAnswer.value=e.answer||"",n.inquiryEditorInternalNote.value=e.internalNote||"",n.inquiryEditorDeleteBtn&&(n.inquiryEditorDeleteBtn.disabled=!e.answer),n.inquiryEditor?.classList.remove("hidden"),D()}function ut(){d.selectedInquiryId=null,n.inquiryEditor&&n.inquiryEditor.classList.add("hidden"),n.inquiryEditorMeta&&(n.inquiryEditorMeta.textContent="문의를 선택하면 답변 입력창이 열립니다."),G(),n.inquiryEditorDeleteBtn&&(n.inquiryEditorDeleteBtn.disabled=!0),D()}function le(){if(!d.reviews.length){n.reviews.innerHTML='<p class="empty">리뷰가 없습니다.</p>';return}n.reviews.innerHTML=`
    <div class="admin-excel-wrap">
      <table class="admin-excel-table admin-review-table">
        <thead>
          <tr>
            <th>작업</th>
            <th>ID</th>
            <th>상품ID</th>
            <th>상품명</th>
            <th>작성자명</th>
            <th>작성자이메일</th>
            <th>별점</th>
            <th>제목</th>
            <th>내용</th>
            <th>이미지</th>
            <th>상태</th>
            <th>작성일시</th>
          </tr>
        </thead>
        <tbody>
          ${d.reviews.map(t=>`
              <tr data-review-id="${t.id}">
                <td>
                  <div class="admin-inline-actions">
                    <button class="ghost" type="button" data-action="hideReview" ${t.status==="HIDDEN"?"disabled":""}>숨기기</button>
                    <button class="primary" type="button" data-action="showReview" ${t.status==="VISIBLE"?"disabled":""}>노출</button>
                    <button class="danger" type="button" data-action="deleteReview" ${t.status==="DELETED"?"disabled":""}>삭제</button>
                  </div>
                </td>
                <td>${t.id}</td>
                <td>${t.productId}</td>
                <td>${i(t.productName)}</td>
                <td>${i(t.userName||"회원")}</td>
                <td>${i(t.userEmail||"-")}</td>
                <td>${t.score} / 5</td>
                <td>${i(t.title||"(제목 없음)")}</td>
                <td>${i(t.content)}</td>
                <td>
                  ${t.images.length?`<div class="admin-review-image-grid">
                          ${t.images.slice(0,3).map((e,a)=>`<img src="${i(e)}" alt="리뷰 이미지 ${a+1}" />`).join("")}
                        </div>`:"<small>이미지 없음</small>"}
                </td>
                <td>${j(t.status,at)}</td>
                <td>${p(t.createdAt)}</td>
              </tr>
            `).join("")}
        </tbody>
      </table>
    </div>
  `}function me(){if(!n.reviewPagination)return;const t=Math.max(d.reviewTotalPages||1,1),e=Math.min(Math.max(d.reviewPage||1,1),t);if(t<=1){n.reviewPagination.innerHTML="";return}const a=Math.max(1,e-2),r=Math.min(t,a+4),s=[];for(let c=a;c<=r;c+=1)s.push(`
      <button class="ghost ${c===e?"active":""}" type="button" data-action="goReviewPage" data-page="${c}">${c}</button>
    `);n.reviewPagination.innerHTML=`
    <button class="ghost" type="button" data-action="goReviewPage" data-page="${e-1}" ${e<=1?"disabled":""}>이전</button>
    ${s.join("")}
    <button class="ghost" type="button" data-action="goReviewPage" data-page="${e+1}" ${e>=t?"disabled":""}>다음</button>
    <span class="admin-page-summary">총 ${d.reviewTotalCount}건</span>
  `}function pe(){if(!d.coupons.length){n.coupons.innerHTML='<p class="empty">쿠폰 데이터가 없습니다.</p>';return}n.coupons.innerHTML=`
    <div class="admin-excel-wrap">
      <table class="admin-excel-table">
        <thead>
          <tr>
            <th>작업</th>
            <th>회원</th>
            <th>쿠폰명</th>
            <th>쿠폰코드</th>
            <th>할인금액</th>
            <th>최소주문금액</th>
            <th>상태</th>
            <th>만료</th>
          </tr>
        </thead>
        <tbody>
          ${d.coupons.map(t=>`
              <tr data-coupon-id="${t.id}">
                <td>
                  <button class="danger" type="button" data-action="deleteCoupon" ${t.isUsed?"disabled":""}>삭제</button>
                </td>
                <td>${i(t.userEmail||"-")}</td>
                <td>${i(t.name)}</td>
                <td>${i(t.code)}</td>
                <td>${u(t.discountAmount)}</td>
                <td>${t.minOrderAmount?u(t.minOrderAmount):"-"}</td>
                <td>${t.isUsed?"사용완료":t.isExpired?"만료":"사용가능"}</td>
                <td>${p(t.expiresAt)}</td>
              </tr>
            `).join("")}
        </tbody>
      </table>
    </div>
  `}function k(){if(!d.managedBanners.length){n.managedBanners.innerHTML='<p class="empty">등록된 배너가 없습니다.</p>';return}n.managedBanners.innerHTML=`
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
          ${d.managedBanners.map(t=>{const e=h("banners",t.id),a=e?"":"disabled";return`
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
                  <td><input type="text" data-role="title" value="${i(t.title)}" ${a} /></td>
                  <td><input type="text" data-role="subtitle" value="${i(t.subtitle)}" ${a} /></td>
                  <td><input type="text" data-role="description" value="${i(t.description)}" ${a} /></td>
                  <td><input type="text" data-role="cta-text" value="${i(t.ctaText)}" ${a} /></td>
                  <td><input type="text" data-role="link-url" value="${i(t.linkUrl)}" ${a} /></td>
                  <td><input type="number" data-role="sort-order" min="0" value="${t.sortOrder}" ${a} /></td>
                  <td>
                    <label class="admin-check-inline">
                      <input type="checkbox" data-role="is-active" ${t.isActive?"checked":""} ${a} />
                      <span>활성</span>
                    </label>
                  </td>
                  <td>
                    <div class="admin-image-cell">
                      ${t.imageUrl?`<img class="admin-banner-thumb" src="${i(t.imageUrl)}" alt="배너 ${t.id}" />`:'<span class="empty">이미지 없음</span>'}
                      <input class="admin-file-input" type="file" data-role="image-file" accept="image/*" ${a} />
                    </div>
                  </td>
                </tr>
              `}).join("")}
        </tbody>
      </table>
    </div>
  `}function F(){if(!d.managedProducts.length){n.managedProducts.innerHTML='<p class="empty">등록된 상품이 없습니다.</p>';return}n.managedProducts.innerHTML=`
    <div class="admin-excel-wrap">
      <table class="admin-excel-table admin-managed-products-table">
        <thead>
          <tr>
            <th>작업</th>
            <th>ID</th>
            <th>카테고리</th>
            <th>SKU</th>
            <th>상품명</th>
            <th>한줄소개</th>
            <th>제조사</th>
            <th>원산지</th>
            <th>세금구분</th>
            <th>판매가</th>
            <th>정상가</th>
            <th>재고</th>
            <th>배송비</th>
            <th>무료배송기준</th>
            <th>출시일</th>
            <th>노출시작</th>
            <th>노출종료</th>
            <th>검색키워드</th>
            <th>배지</th>
            <th>활성</th>
            <th>썸네일</th>
            <th>추가이미지수</th>
            <th>이미지관리</th>
            <th>복용법</th>
            <th>권장대상</th>
            <th>설명</th>
          </tr>
        </thead>
        <tbody>
          ${d.managedProducts.map(t=>{const e=h("products",t.id),a=e?"":"disabled",r=Array.isArray(t.images)?t.images.filter(c=>c.imageUrl):[],s=r.filter(c=>!c.isThumbnail).length;return`
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
                  <td>
                    <select data-role="category-id" ${a}>${it(t.categoryId||"",!0)}</select>
                  </td>
                  <td><input type="text" data-role="sku" value="${i(t.sku||"")}" ${a} /></td>
                  <td><input type="text" data-role="name" value="${i(t.name)}" ${a} /></td>
                  <td><input type="text" data-role="one-line" value="${i(t.oneLine)}" ${a} /></td>
                  <td><input type="text" data-role="manufacturer" value="${i(t.manufacturer||"")}" ${a} /></td>
                  <td><input type="text" data-role="origin-country" value="${i(t.originCountry||"")}" ${a} /></td>
                  <td>
                    <select data-role="tax-status" ${a}>${dt(t.taxStatus||"TAXABLE")}</select>
                  </td>
                  <td><input type="number" min="0" data-role="price" value="${t.price}" ${a} /></td>
                  <td><input type="number" min="0" data-role="original-price" value="${t.originalPrice}" ${a} /></td>
                  <td><input type="number" min="0" data-role="stock" value="${t.stock}" ${a} /></td>
                  <td><input type="number" min="0" data-role="delivery-fee" value="${t.deliveryFee||0}" ${a} /></td>
                  <td><input type="number" min="0" data-role="free-shipping-amount" value="${t.freeShippingAmount||0}" ${a} /></td>
                  <td><input type="date" data-role="release-date" value="${i(ie(t.releaseDate))}" ${a} /></td>
                  <td><input type="datetime-local" data-role="display-start-at" value="${i(R(t.displayStartAt))}" ${a} /></td>
                  <td><input type="datetime-local" data-role="display-end-at" value="${i(R(t.displayEndAt))}" ${a} /></td>
                  <td><input type="text" data-role="search-keywords" value="${i((t.searchKeywords||[]).join(","))}" ${a} /></td>
                  <td>
                    <div data-role="badge-types" class="admin-badge-checkboxes ${e?"":"is-disabled"}">
                      ${ot(t.badgeTypes||[],!e)}
                    </div>
                  </td>
                  <td>
                    <label class="admin-check-inline">
                      <input type="checkbox" data-role="is-active" ${t.isActive?"checked":""} ${a} />
                      <span>활성</span>
                    </label>
                  </td>
                  <td>
                    <div class="admin-image-cell">
                      ${t.thumbnailUrl?`<img class="admin-product-thumb" src="${i(t.thumbnailUrl)}" alt="상품 ${t.id}" />`:'<span class="empty">이미지 없음</span>'}
                      <input class="admin-file-input" type="file" data-role="thumbnail-file" accept="image/*" ${a} />
                    </div>
                  </td>
                  <td>${s}장</td>
                  <td>
                    <div class="admin-image-cell">
                      ${r.length?`
                            <div class="admin-managed-image-grid">
                              ${r.map(c=>`
                                  <div class="admin-managed-image-item">
                                    <img class="admin-product-thumb" src="${i(c.imageUrl||"")}" alt="상품 이미지 ${c.id}" />
                                    <label class="admin-check-inline">
                                      <input type="radio" name="thumbnail-image-id-${t.id}" data-role="thumbnail-image-id" value="${c.id}" ${c.isThumbnail?"checked":""} ${a} />
                                      <span>대표</span>
                                    </label>
                                    <label class="admin-check-inline">
                                      <input type="checkbox" data-role="delete-image-id" value="${c.id}" ${a} />
                                      <span>삭제</span>
                                    </label>
                                  </div>
                                `).join("")}
                            </div>
                          `:'<span class="empty">등록 이미지 없음</span>'}
                      <input class="admin-file-input" type="file" data-role="image-files" accept="image/*" multiple ${a} />
                    </div>
                  </td>
                  <td><input type="text" data-role="intake" value="${i(t.intake||"")}" ${a} /></td>
                  <td><input type="text" data-role="target" value="${i(t.target||"")}" ${a} /></td>
                  <td><input type="text" data-role="description" value="${i(t.description)}" ${a} /></td>
                </tr>
              `}).join("")}
        </tbody>
      </table>
    </div>
  `}function ye(){if(!d.managedUsers.length){n.managedUsers.innerHTML='<p class="empty">조회된 회원이 없습니다.</p>';return}n.managedUsers.innerHTML=`
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
            <th>주문수</th>
            <th>리뷰수</th>
            <th>문의수</th>
            <th>가입일</th>
            <th>최근로그인</th>
          </tr>
        </thead>
        <tbody>
          ${d.managedUsers.map(t=>`
                <tr data-user-id="${t.id}" class="is-readonly">
                  <td>${t.id}</td>
                  <td>${i(t.email)}</td>
                  <td>${i(t.name||"-")}</td>
                  <td>${i(t.phone||"-")}</td>
                  <td>${t.isActive?"활성":"비활성"}</td>
                  <td>${t.isStaff?"관리자":"일반회원"}</td>
                  <td>${t.orderCount}</td>
                  <td>${t.reviewCount}</td>
                  <td>${t.inquiryCount}</td>
                  <td>${p(t.createdAt)}</td>
                  <td>${p(t.lastLogin)}</td>
                </tr>
              `).join("")}
        </tbody>
      </table>
    </div>
  `}async function ge(){const t=await X()||W();let e=0;try{e=await Yt()}catch{e=0}Vt(Kt,{userName:t?.name||t?.email||null,isAdmin:!!(t?.is_staff??t?.isStaff),cartCountValue:e})}async function l(){d.dashboard=await $t(),de(),ce()}async function he(){d.staffUsers=await jt()}function lt({preserveFilter:t=!0}={}){const e=t?String(n.managedProductCategoryFilter?.value||""):"";n.productCategoryId&&(n.productCategoryId.innerHTML=it("",!0)),n.managedProductCategoryFilter&&(n.managedProductCategoryFilter.innerHTML=`
      <option value="">카테고리 전체</option>
      ${d.productMeta.categoryOptions.map(a=>`<option value="${a.id}">${i(a.name)}</option>`).join("")}
    `,e&&(n.managedProductCategoryFilter.value=e)),n.productTaxStatus&&(n.productTaxStatus.innerHTML=dt("TAXABLE")),n.productBadgeGroup&&(n.productBadgeGroup.innerHTML=ot([],!1))}async function mt(){d.productMeta=await Gt(),lt({preserveFilter:!0})}async function y(){d.orders=await At({q:n.orderSearch.value.trim(),status:n.orderStatus.value,paymentStatus:n.paymentStatus.value,shippingStatus:n.shippingStatus.value,hasOpenReturn:n.orderOpenReturnOnly.checked}),w("orders"),M()}async function E(){d.returns=await Bt({q:n.returnSearch.value.trim(),status:n.returnStatus.value}),w("returns"),O()}async function g(){d.settlements=await It({q:n.settlementSearch.value.trim(),status:n.settlementStatus.value}),w("settlements"),x()}async function q(){if(d.inquiries=await qt({q:n.inquirySearch.value.trim(),status:n.inquiryStatus.value,category:n.inquiryCategory.value,priority:n.inquiryPriority.value,overdue:n.inquiryOverdueOnly.checked}),d.expandedInquiryId){const t=d.inquiries.find(e=>Number(e.id)===Number(d.expandedInquiryId));(!t||!String(t.answer||"").trim())&&(d.expandedInquiryId=null)}D(),d.selectedInquiryId&&(d.inquiries.some(e=>Number(e.id)===Number(d.selectedInquiryId))?ct(d.selectedInquiryId):ut())}async function I({page:t=d.reviewPage}={}){const e=await Pt({status:n.reviewStatus.value,sort:n.reviewSort.value,q:n.reviewSearch.value.trim(),page:t,pageSize:d.reviewPageSize});d.reviews=e.items,d.reviewPage=e.page,d.reviewTotalPages=e.totalPages,d.reviewTotalCount=e.count,le(),me()}async function A(){d.coupons=await Ht({q:n.couponSearch.value.trim()}),pe()}async function P(){d.managedBanners=await Mt(),w("banners"),k()}async function S(){d.managedProducts=await wt({q:n.managedProductSearch.value.trim(),categoryId:n.managedProductCategoryFilter.value||void 0,isActive:n.managedProductActiveFilter.value===""?void 0:n.managedProductActiveFilter.value==="true"}),w("products"),F()}async function U(){d.managedUsers=await Tt({q:n.memberSearch.value.trim(),isActive:n.memberActiveFilter.value===""?void 0:n.memberActiveFilter.value==="true",isStaff:n.memberStaffFilter.value===""?void 0:n.memberStaffFilter.value==="true"}),ye()}async function pt(){await Promise.all([he(),mt()]),await Promise.all([l(),y(),E(),g(),q(),I({page:1}),P(),S(),U(),A(),ge()])}async function be(t){const e=t.closest("tr[data-order-no]");if(!e)return;const a=e.dataset.orderNo,r=t.dataset.action;if(r==="editOrder")return m("orders",a,!0),M(),"edit";if(r==="cancelOrderEdit")return m("orders",a,!1),M(),"cancel";if(!h("orders",a))return"noop";const s={recipient:e.querySelector("[data-role='recipient']")?.value?.trim()||"",phone:e.querySelector("[data-role='phone']")?.value?.trim()||"",postalCode:e.querySelector("[data-role='postal-code']")?.value?.trim()||"",roadAddress:e.querySelector("[data-role='road-address']")?.value?.trim()||"",jibunAddress:e.querySelector("[data-role='jibun-address']")?.value?.trim()||"",detailAddress:e.querySelector("[data-role='detail-address']")?.value?.trim()||"",status:e.querySelector("[data-role='order-status']")?.value,paymentStatus:e.querySelector("[data-role='payment-status']")?.value,shippingStatus:e.querySelector("[data-role='shipping-status']")?.value,courierName:e.querySelector("[data-role='courier-name']")?.value?.trim()||"",trackingNo:e.querySelector("[data-role='tracking-no']")?.value?.trim()||""};return r==="issueInvoice"&&(s.issueInvoice=!0),r==="markDelivered"&&(s.markDelivered=!0),await Nt(a,s),m("orders",a,!1),await Promise.all([l(),y(),g()]),r}async function Se(t){const e=t.closest("tr[data-return-id]");if(!e)return;const a=Number(e.dataset.returnId),r=t.dataset.action;return r==="editReturn"?(m("returns",a,!0),O(),"edit"):r==="cancelReturnEdit"?(m("returns",a,!1),O(),"cancel"):r==="deleteReturn"?confirm("이 반품/환불 요청을 삭제하시겠습니까?")?(await Dt(a),m("returns",a,!1),await Promise.all([l(),E(),y(),g()]),"deleteReturn"):void 0:h("returns",a)?(await Lt(a,{status:e.querySelector("[data-role='return-status']")?.value,approvedAmount:Number(e.querySelector("[data-role='approved-amount']")?.value||0),pickupCourierName:e.querySelector("[data-role='pickup-courier']")?.value?.trim()||"",pickupTrackingNo:e.querySelector("[data-role='pickup-tracking']")?.value?.trim()||"",rejectedReason:e.querySelector("[data-role='rejected-reason']")?.value?.trim()||"",adminNote:e.querySelector("[data-role='admin-note']")?.value?.trim()||""}),m("returns",a,!1),await Promise.all([l(),E(),y(),g()]),"saveReturn"):"noop"}async function ve(t){const e=t.closest("tr[data-settlement-id]");if(!e)return;const a=Number(e.dataset.settlementId),r=t.dataset.action;return r==="editSettlement"?(m("settlements",a,!0),x(),"edit"):r==="cancelSettlementEdit"?(m("settlements",a,!1),x(),"cancel"):r==="deleteSettlement"?confirm("이 정산 레코드를 삭제하시겠습니까? 지급완료 건은 삭제할 수 없습니다.")?(await Ct(a),m("settlements",a,!1),await Promise.all([l(),g()]),"deleteSettlement"):void 0:h("settlements",a)?(await Rt(a,{status:e.querySelector("[data-role='settlement-status']")?.value,pgFee:Number(e.querySelector("[data-role='pg-fee']")?.value||0),platformFee:Number(e.querySelector("[data-role='platform-fee']")?.value||0),returnDeduction:Number(e.querySelector("[data-role='return-deduction']")?.value||0),expectedPayoutDate:e.querySelector("[data-role='expected-payout-date']")?.value||null,memo:e.querySelector("[data-role='settlement-memo']")?.value?.trim()||"",markPaid:r==="markSettlementPaid"}),m("settlements",a,!1),await Promise.all([l(),g()]),r):"noop"}async function Ee(){if(!d.selectedInquiryId)throw new Error("답변할 문의를 먼저 선택해주세요.");await z(d.selectedInquiryId,{answer:n.inquiryEditorAnswer.value.trim(),status:n.inquiryEditorStatus.value,category:n.inquiryEditorCategory.value,priority:n.inquiryEditorPriority.value,assignedAdminId:Number(n.inquiryEditorAssignedAdmin.value||0)||null,internalNote:n.inquiryEditorInternalNote.value.trim(),slaDueAt:v(n.inquiryEditorSlaDueAt.value)}),await Promise.all([l(),q()]),N(`저장 완료 · ${p(new Date().toISOString())}`)}async function fe(){if(!d.selectedInquiryId)throw new Error("답변을 삭제할 문의를 먼저 선택해주세요.");confirm("등록된 답변을 삭제하고 문의 상태를 접수로 되돌리시겠습니까?")&&(await z(d.selectedInquiryId,{deleteAnswer:!0,status:"OPEN"}),await Promise.all([l(),q()]),N(`답변 삭제 완료 · ${p(new Date().toISOString())}`))}async function $e(t){const e=t.closest("tr[data-review-id]");if(!e)return;const a=Number(e.dataset.reviewId);if(t.dataset.action==="hideReview"&&await Y(a,!1),t.dataset.action==="showReview"&&await Y(a,!0),t.dataset.action==="deleteReview"){if(!confirm("리뷰를 삭제 처리하시겠습니까?"))return;await Ut(a)}await Promise.all([l(),I({page:d.reviewPage})])}async function Ie(t){const e=t.closest("tr[data-coupon-id]");if(!e)return;const a=Number(e.dataset.couponId);if(t.dataset.action==="deleteCoupon"){if(!confirm("해당 쿠폰을 삭제하시겠습니까?"))return;await _t(a),await Promise.all([l(),A()])}}async function Ae(t){const e=t.closest("tr[data-banner-id]");if(!e)return;const a=Number(e.dataset.bannerId),r=t.dataset.action;return r==="editBanner"?(m("banners",a,!0),k(),"edit"):r==="cancelBannerEdit"?(m("banners",a,!1),k(),"cancel"):r==="deleteBanner"?confirm("이 배너를 삭제하시겠습니까?")?(await Ot(a),m("banners",a,!1),await Promise.all([P(),l()]),"deleteBanner"):void 0:h("banners",a)?(await xt(a,{title:e.querySelector("[data-role='title']")?.value?.trim()||"",subtitle:e.querySelector("[data-role='subtitle']")?.value?.trim()||"",description:e.querySelector("[data-role='description']")?.value?.trim()||"",ctaText:e.querySelector("[data-role='cta-text']")?.value?.trim()||"",linkUrl:e.querySelector("[data-role='link-url']")?.value?.trim()||"",sortOrder:Number(e.querySelector("[data-role='sort-order']")?.value||0),isActive:e.querySelector("[data-role='is-active']")?.checked,imageFile:e.querySelector("[data-role='image-file']")?.files?.[0]||null}),m("banners",a,!1),await Promise.all([P(),l()]),"saveBanner"):"noop"}async function Be(t){const e=t.closest("tr[data-product-id]");if(!e)return;const a=Number(e.dataset.productId),r=t.dataset.action;if(r==="editManagedProduct")return m("products",a,!0),F(),"edit";if(r==="cancelManagedProductEdit")return m("products",a,!1),F(),"cancel";if(r==="deleteManagedProduct")return confirm("이 상품을 삭제하시겠습니까?")?(await kt(a),m("products",a,!1),await Promise.all([S(),l(),y()]),"deleteManagedProduct"):void 0;if(!h("products",a))return"noop";const s=st(e.querySelector("[data-role='badge-types']")),c=Array.from(e.querySelectorAll("input[data-role='delete-image-id']:checked")).map(L=>Number(L.value||0)).filter(L=>L>0),f=Number(e.querySelector("input[data-role='thumbnail-image-id']:checked")?.value||0)||void 0,yt=Array.from(e.querySelector("[data-role='image-files']")?.files||[]),V=e.querySelector("[data-role='category-id']")?.value||"";return await Ft(a,{categoryId:V?Number(V):null,sku:e.querySelector("[data-role='sku']")?.value?.trim()||"",name:e.querySelector("[data-role='name']")?.value?.trim()||"",oneLine:e.querySelector("[data-role='one-line']")?.value?.trim()||"",description:e.querySelector("[data-role='description']")?.value?.trim()||"",intake:e.querySelector("[data-role='intake']")?.value?.trim()||"",target:e.querySelector("[data-role='target']")?.value?.trim()||"",manufacturer:e.querySelector("[data-role='manufacturer']")?.value?.trim()||"",originCountry:e.querySelector("[data-role='origin-country']")?.value?.trim()||"",taxStatus:e.querySelector("[data-role='tax-status']")?.value||"TAXABLE",deliveryFee:Number(e.querySelector("[data-role='delivery-fee']")?.value||0),freeShippingAmount:Number(e.querySelector("[data-role='free-shipping-amount']")?.value||0),searchKeywords:rt(e.querySelector("[data-role='search-keywords']")?.value||""),releaseDate:e.querySelector("[data-role='release-date']")?.value||"",displayStartAt:v(e.querySelector("[data-role='display-start-at']")?.value||""),displayEndAt:v(e.querySelector("[data-role='display-end-at']")?.value||""),price:Number(e.querySelector("[data-role='price']")?.value||0),originalPrice:Number(e.querySelector("[data-role='original-price']")?.value||0),stock:Number(e.querySelector("[data-role='stock']")?.value||0),isActive:e.querySelector("[data-role='is-active']")?.checked,badgeTypes:s,thumbnailFile:e.querySelector("[data-role='thumbnail-file']")?.files?.[0]||null,imageFiles:yt,deleteImageIds:c,thumbnailImageId:f}),m("products",a,!1),await Promise.all([S(),l()]),"saveManagedProduct"}function b(t,e){t?.addEventListener("keydown",async a=>{if(a.key==="Enter"){a.preventDefault();try{await e()}catch(r){console.error(r),o(r.message||"조회 중 오류가 발생했습니다.","error")}}})}function qe(){n.navButtons.forEach(t=>{t.addEventListener("click",async()=>{const e=t.dataset.tabBtn;if(K(e),e==="products")try{await mt(),await Promise.all([P(),S()])}catch(a){console.error(a),o(a.message||"배너/상품 정보를 불러오지 못했습니다.","error")}})}),K(d.activeTab)}function Pe(){qe(),n.inquiryEditorDeleteBtn&&(n.inquiryEditorDeleteBtn.disabled=!0),G(),n.reloadBtn?.addEventListener("click",async()=>{try{await pt(),o("운영 데이터가 갱신되었습니다.")}catch(e){console.error(e),o(e.message||"새로고침 중 오류가 발생했습니다.","error")}}),n.generateSettlementBtn?.addEventListener("click",async()=>{try{const e=await bt({onlyPaidOrders:!0}),a=Number(e?.generated_count??e?.generatedCount??0);o(`정산 레코드 생성/갱신 완료: ${a}건`),await Promise.all([l(),g(),y()])}catch(e){console.error(e),o(e.message||"정산 생성에 실패했습니다.","error")}}),[n.orderSearchBtn,n.orderStatus,n.paymentStatus,n.shippingStatus,n.orderOpenReturnOnly].forEach(e=>{const a=e?.tagName==="BUTTON"?"click":"change";e?.addEventListener(a,async()=>{try{await y()}catch(r){console.error(r),o(r.message||"주문 조회에 실패했습니다.","error")}})}),[n.returnSearchBtn,n.returnStatus].forEach(e=>{const a=e?.tagName==="BUTTON"?"click":"change";e?.addEventListener(a,async()=>{try{await E()}catch(r){console.error(r),o(r.message||"반품 조회에 실패했습니다.","error")}})}),[n.settlementSearchBtn,n.settlementStatus].forEach(e=>{const a=e?.tagName==="BUTTON"?"click":"change";e?.addEventListener(a,async()=>{try{await g()}catch(r){console.error(r),o(r.message||"정산 조회에 실패했습니다.","error")}})}),[n.inquirySearchBtn,n.inquiryStatus,n.inquiryCategory,n.inquiryPriority,n.inquiryOverdueOnly].forEach(e=>{const a=e?.tagName==="BUTTON"?"click":"change";e?.addEventListener(a,async()=>{try{await q()}catch(r){console.error(r),o(r.message||"CS 조회에 실패했습니다.","error")}})}),[n.reviewSearchBtn,n.reviewStatus,n.reviewSort].forEach(e=>{const a=e?.tagName==="BUTTON"?"click":"change";e?.addEventListener(a,async()=>{try{d.reviewPage=1,await I({page:1})}catch(r){console.error(r),o(r.message||"리뷰 조회에 실패했습니다.","error")}})}),[n.managedProductSearchBtn,n.managedProductCategoryFilter,n.managedProductActiveFilter].forEach(e=>{const a=e?.tagName==="BUTTON"?"click":"change";e?.addEventListener(a,async()=>{try{await S()}catch(r){console.error(r),o(r.message||"상품 조회에 실패했습니다.","error")}})}),[n.memberSearchBtn,n.memberActiveFilter,n.memberStaffFilter].forEach(e=>{const a=e?.tagName==="BUTTON"?"click":"change";e?.addEventListener(a,async()=>{try{await U()}catch(r){console.error(r),o(r.message||"회원 조회에 실패했습니다.","error")}})}),b(n.orderSearch,y),b(n.returnSearch,E),b(n.settlementSearch,g),b(n.inquirySearch,q),b(n.reviewSearch,async()=>{d.reviewPage=1,await I({page:1})}),b(n.managedProductSearch,S),b(n.memberSearch,U),n.orders?.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(a)try{const r=await be(a);if(r==="edit"){o("수정 모드가 활성화되었습니다.");return}if(r==="cancel"){o("수정이 취소되었습니다.");return}if(r==="noop"||!r)return;o("주문/배송 정보가 저장되었습니다.")}catch(r){console.error(r),o(r.message||"주문/배송 정보 업데이트에 실패했습니다.","error")}}),n.returnCreateForm?.addEventListener("submit",async e=>{e.preventDefault();try{await St({orderNo:n.returnOrderNo.value.trim(),reasonTitle:n.returnReasonTitle.value.trim(),reasonDetail:n.returnReasonDetail.value.trim(),requestedAmount:n.returnRequestedAmount.value?Number(n.returnRequestedAmount.value):void 0}),n.returnCreateForm.reset(),o("반품 요청이 등록되었습니다."),await Promise.all([l(),E(),y(),g()])}catch(a){console.error(a),o(a.message||"반품 요청 등록에 실패했습니다.","error")}}),n.returns?.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(a)try{const r=await Se(a);if(r==="edit"){o("수정 모드가 활성화되었습니다.");return}if(r==="cancel"){o("수정이 취소되었습니다.");return}if(r==="noop"||!r)return;o(r==="deleteReturn"?"반품/환불 요청이 삭제되었습니다.":"반품/환불 정보가 저장되었습니다.")}catch(r){console.error(r),o(r.message||"반품/환불 처리에 실패했습니다.","error")}}),n.settlements?.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(a)try{const r=await ve(a);if(r==="edit"){o("수정 모드가 활성화되었습니다.");return}if(r==="cancel"){o("수정이 취소되었습니다.");return}if(r==="noop"||!r)return;o(r==="deleteSettlement"?"정산 레코드가 삭제되었습니다.":"정산 정보가 저장되었습니다.")}catch(r){console.error(r),o(r.message||"정산 저장에 실패했습니다.","error")}}),n.inquiries?.addEventListener("click",e=>{const a=e.target.closest("[data-action]");if(!a)return;const r=Number(a.dataset.inquiryId);if(r){if(a.dataset.action==="openInquiryEditor"){ct(r);return}a.dataset.action==="toggleInquiryAnswer"&&ue(r)}}),n.inquiryEditorCloseBtn?.addEventListener("click",()=>{ut()}),n.inquiryEditorSaveBtn?.addEventListener("click",async()=>{try{await Ee(),o("CS 답변이 저장되었습니다.")}catch(e){console.error(e),N(e.message||"CS 저장에 실패했습니다.","error"),o(e.message||"CS 저장에 실패했습니다.","error")}}),n.inquiryEditorDeleteBtn?.addEventListener("click",async()=>{try{await fe(),o("CS 답변이 삭제되었습니다.")}catch(e){console.error(e),N(e.message||"CS 답변 삭제에 실패했습니다.","error"),o(e.message||"CS 답변 삭제에 실패했습니다.","error")}}),n.bannerCreateForm?.addEventListener("submit",async e=>{e.preventDefault();try{await vt({title:n.bannerTitle.value.trim(),subtitle:n.bannerSubtitle.value.trim(),description:n.bannerDescription.value.trim(),ctaText:n.bannerCtaText.value.trim(),linkUrl:n.bannerLinkUrl.value.trim(),sortOrder:Number(n.bannerSortOrder.value||0),isActive:n.bannerIsActive.checked,imageFile:n.bannerImageFile.files?.[0]||null}),n.bannerCreateForm.reset(),n.bannerIsActive&&(n.bannerIsActive.checked=!0),o("배너가 등록되었습니다."),await Promise.all([P(),l()])}catch(a){console.error(a),o(a.message||"배너 등록에 실패했습니다.","error")}}),n.managedBanners?.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(a)try{const r=await Ae(a);if(r==="edit"){o("수정 모드가 활성화되었습니다.");return}if(r==="cancel"){o("수정이 취소되었습니다.");return}if(r==="noop"||!r)return;o(r==="deleteBanner"?"배너가 삭제되었습니다.":"배너 정보가 저장되었습니다.")}catch(r){console.error(r),o(r.message||"배너 처리에 실패했습니다.","error")}}),n.productCreateForm?.addEventListener("submit",async e=>{e.preventDefault();try{await Et({categoryId:n.productCategoryId.value?Number(n.productCategoryId.value):null,sku:n.productSku.value.trim(),name:n.productName.value.trim(),oneLine:n.productOneLine.value.trim(),description:n.productDescription.value.trim(),intake:n.productIntake.value.trim(),target:n.productTarget.value.trim(),manufacturer:n.productManufacturer.value.trim(),originCountry:n.productOriginCountry.value.trim(),taxStatus:n.productTaxStatus.value||"TAXABLE",deliveryFee:Number(n.productDeliveryFee.value||0),freeShippingAmount:Number(n.productFreeShippingAmount.value||0),searchKeywords:rt(n.productSearchKeywords.value),releaseDate:n.productReleaseDate.value||"",displayStartAt:v(n.productDisplayStartAt.value),displayEndAt:v(n.productDisplayEndAt.value),price:Number(n.productPrice.value||0),originalPrice:Number(n.productOriginalPrice.value||0),stock:Number(n.productStock.value||0),isActive:n.productIsActive.checked,badgeTypes:st(n.productBadgeGroup),thumbnailFile:n.productThumbnail.files?.[0]||null,imageFiles:Array.from(n.productImages.files||[])}),n.productCreateForm.reset(),n.productIsActive&&(n.productIsActive.checked=!0),lt(),o("상품이 등록되었습니다."),await Promise.all([S(),l(),y()])}catch(a){console.error(a),o(a.message||"상품 등록에 실패했습니다.","error")}}),n.managedProducts?.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(a)try{const r=await Be(a);if(r==="edit"){o("수정 모드가 활성화되었습니다.");return}if(r==="cancel"){o("수정이 취소되었습니다.");return}if(r==="noop"||!r)return;o(r==="deleteManagedProduct"?"상품이 삭제되었습니다.":"상품 정보가 저장되었습니다.")}catch(r){console.error(r),o(r.message||"상품 처리에 실패했습니다.","error")}}),n.reviews?.addEventListener("click",async e=>{const a=e.target.closest("[data-action]");if(a)try{await $e(a),a.dataset.action==="deleteReview"?o("리뷰가 삭제 처리되었습니다."):o("리뷰 노출 상태가 반영되었습니다.")}catch(r){console.error(r),o(r.message||"리뷰 상태 변경에 실패했습니다.","error")}}),n.reviewPagination?.addEventListener("click",async e=>{const a=e.target.closest("[data-action='goReviewPage']");if(!a)return;const r=Number(a.dataset.page);if(!(!r||r<1||r>d.reviewTotalPages||r===d.reviewPage))try{await I({page:r})}catch(s){console.error(s),o(s.message||"리뷰 페이지 이동에 실패했습니다.","error")}}),n.couponTarget?.addEventListener("change",()=>{const e=n.couponTarget.value==="EMAIL";n.couponEmailField.classList.toggle("hidden",!e),n.couponEmail.required=e}),n.couponForm?.addEventListener("submit",async e=>{e.preventDefault();try{const a=await ft({target:n.couponTarget.value,email:n.couponTarget.value==="EMAIL"?n.couponEmail.value.trim():void 0,name:n.couponName.value.trim(),code:n.couponCode.value.trim(),discountAmount:Number(n.couponDiscountAmount.value||0),minOrderAmount:Number(n.couponMinOrderAmount.value||0),expiresAt:v(n.couponExpiresAt.value)}),r=Number(a?.issued_count??a?.issuedCount??0);o(`쿠폰 발급 완료: ${r}건`),await Promise.all([l(),A()])}catch(a){console.error(a),o(a.message||"쿠폰 발급에 실패했습니다.","error")}});let t=null;n.couponSearch?.addEventListener("input",()=>{t&&clearTimeout(t),t=setTimeout(async()=>{try{await A()}catch(e){console.error(e),o(e.message||"쿠폰 조회에 실패했습니다.","error")}},250)}),b(n.couponSearch,A),n.coupons?.addEventListener("click",async e=>{const a=e.target.closest("[data-action='deleteCoupon']");if(a)try{await Ie(a),o("쿠폰이 삭제되었습니다.")}catch(r){console.error(r),o(r.message||"쿠폰 삭제에 실패했습니다.","error")}})}async function we(){const t=await X()||W();if(!t){alert("관리자 페이지는 로그인 후 이용할 수 있습니다."),location.href="/pages/login.html";return}if(!ee(t)){alert("관리자 권한이 없습니다."),location.href="/pages/home.html";return}d.user=t,Pe();try{await pt()}catch(e){console.error(e),o(e.message||"관리자 데이터를 불러오지 못했습니다.","error")}}we();
