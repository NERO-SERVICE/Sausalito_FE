import{m as E,a as b,s as S,g as D,v as A,w as L,d as T}from"./footer-CX_4Vxnh.js";import{c as R}from"./cart-service-BJL0NQK-.js";import{f as d}from"./store-data-Deux6dsM.js";const F=E({showCart:!0,currentNav:""});b();const l={dashboard:{title:"마이쇼핑 홈",description:"총 주문/혜택/진행현황을 한눈에 확인하세요."},orders:{title:"주문내역조회",description:"기간별 주문내역과 처리 상태를 조회할 수 있습니다."},claims:{title:"취소/반품/교환내역",description:"취소/반품/교환 관련 주문 이력을 확인합니다."},coupons:{title:"쿠폰내역",description:"보유 쿠폰의 할인 정보와 사용 가능 기간을 확인하세요."}},s={user:null,dashboard:null,orders:[],activeSection:"dashboard"},r={sidebarGreeting:document.getElementById("myshopSidebarGreeting"),sectionTitle:document.getElementById("myshopSectionTitle"),sectionDescription:document.getElementById("myshopSectionDescription"),navLinks:Array.from(document.querySelectorAll("[data-section-link]")),sections:Array.from(document.querySelectorAll("[data-section]")),kpi:document.getElementById("myshopKpi"),orderStage:document.getElementById("myshopOrderStage"),orderStatusFilter:document.getElementById("myshopOrderStatusFilter"),orderRangeFilter:document.getElementById("myshopOrderRangeFilter"),orderTable:document.getElementById("myshopOrderTable"),claimStatusFilter:document.getElementById("myshopClaimStatusFilter"),claimRangeFilter:document.getElementById("myshopClaimRangeFilter"),claimTable:document.getElementById("myshopClaimTable"),couponTable:document.getElementById("myshopCouponTable")};function c(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function u(t){if(!t)return"-";const e=new Date(t);if(Number.isNaN(e.getTime()))return"-";const n=e.getFullYear(),a=String(e.getMonth()+1).padStart(2,"0"),i=String(e.getDate()).padStart(2,"0");return`${n}.${a}.${i}`}function N(t){const e=new Date;return t==="today"?(e.setHours(0,0,0,0),e):t==="1m"?(e.setMonth(e.getMonth()-1),e):t==="3m"?(e.setMonth(e.getMonth()-3),e):(e.setMonth(e.getMonth()-6),e)}function m(t,e){const n=new Date(t);if(Number.isNaN(n.getTime()))return!1;const a=N(e);return n>=a}function o(t){return t.status==="CANCELED"?"주문취소":t.status==="REFUNDED"||t.status==="PARTIAL_REFUNDED"?"환불완료":t.paymentStatus==="UNPAID"||t.paymentStatus==="READY"?"입금전":t.shippingStatus==="SHIPPED"?"배송중":t.shippingStatus==="DELIVERED"?"배송완료":t.shippingStatus==="READY"||t.shippingStatus==="PREPARING"?"배송준비중":t.status==="FAILED"||t.paymentStatus==="FAILED"?"결제실패":t.paymentStatus==="APPROVED"?"결제완료":"주문접수"}function p(t){const e=o(t);return e==="입금전"||e==="배송준비중"||e==="배송중"||e==="배송완료"?e:t.status==="FAILED"||t.paymentStatus==="FAILED"?"결제실패":t.status==="PAID"?"결제완료":t.status==="CANCELED"?"주문취소":t.status==="REFUNDED"||t.status==="PARTIAL_REFUNDED"?"환불완료":t.status==="PENDING"?"주문접수":t.status||"-"}function C(t,e){return e==="ALL"?!0:e==="PREPARING"?o(t)==="배송준비중":e==="SHIPPED"?o(t)==="배송중":e==="DELIVERED"?o(t)==="배송완료":e==="PENDING"?o(t)==="입금전":e==="REFUNDED"?t.status==="REFUNDED"||t.status==="PARTIAL_REFUNDED":t.status===e||t.paymentStatus===e}function v(t){return t.status==="CANCELED"?"CANCEL":t.status==="REFUNDED"||t.status==="PARTIAL_REFUNDED"?"RETURN":""}function I(t){return t==="CANCEL"?"취소":t==="RETURN"?"반품/환불":"교환"}function h(){r.navLinks.forEach(e=>{const n=e.dataset.sectionLink;e.classList.toggle("is-active",n===s.activeSection)}),r.sections.forEach(e=>{const n=e.dataset.section===s.activeSection;e.hidden=!n});const t=l[s.activeSection]||l.dashboard;r.sectionTitle.textContent=t.title,r.sectionDescription.textContent=t.description}function $(t,e=!0){if(l[t]&&(s.activeSection=t,h(),e)){const n=new URL(location.href);n.searchParams.set("tab",t),history.replaceState({},"",n.toString())}}function P(){const t=s.dashboard?.shopping?.summary||{pointBalance:0,couponCount:0,orderCount:0};r.kpi.innerHTML=`
    <article>
      <p>총 적립금</p>
      <strong>${d(t.pointBalance)}</strong>
    </article>
    <article>
      <p>쿠폰(개수)</p>
      <strong>${t.couponCount}장</strong>
    </article>
    <article>
      <p>총주문(횟수)</p>
      <strong>${t.orderCount}회</strong>
    </article>
  `}function w(){const t={beforePayment:0,preparing:0,shipping:0,delivered:0};s.orders.forEach(e=>{const n=o(e);n==="입금전"&&(t.beforePayment+=1),n==="배송준비중"&&(t.preparing+=1),n==="배송중"&&(t.shipping+=1),n==="배송완료"&&(t.delivered+=1)}),r.orderStage.innerHTML=`
    <article><p>입금전</p><strong>${t.beforePayment}</strong></article>
    <article><p>배송준비중</p><strong>${t.preparing}</strong></article>
    <article><p>배송중</p><strong>${t.shipping}</strong></article>
    <article><p>배송완료</p><strong>${t.delivered}</strong></article>
  `}function f(){const t=r.orderStatusFilter.value,e=r.orderRangeFilter.value,n=s.orders.filter(a=>m(a.createdAt,e)).filter(a=>C(a,t));if(!n.length){r.orderTable.innerHTML='<p class="empty">조회 조건에 맞는 주문내역이 없습니다.</p>';return}r.orderTable.innerHTML=`
    <div class="myshop-table-wrap">
      <table class="myshop-table">
        <thead>
          <tr>
            <th>주문일자</th>
            <th>주문번호</th>
            <th>상품수</th>
            <th>주문금액</th>
            <th>주문처리상태</th>
          </tr>
        </thead>
        <tbody>
          ${n.map(a=>`
            <tr>
              <td>${u(a.createdAt)}</td>
              <td><a href="/pages/mypage.html?tab=orders">${c(a.orderNo)}</a></td>
              <td>${a.itemCount}개</td>
              <td>${d(a.totalAmount)}</td>
              <td>${c(p(a))}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `}function g(){const t=r.claimStatusFilter.value,e=r.claimRangeFilter.value,a=s.orders.filter(i=>m(i.createdAt,e)).map(i=>({order:i,claimType:v(i)})).filter(i=>i.claimType).filter(i=>t==="ALL"?!0:t==="EXCHANGE"?!1:i.claimType===t);if(!a.length){r.claimTable.innerHTML='<p class="empty">조회 조건에 맞는 취소/반품/교환내역이 없습니다.</p>';return}r.claimTable.innerHTML=`
    <div class="myshop-table-wrap">
      <table class="myshop-table">
        <thead>
          <tr>
            <th>접수일자</th>
            <th>주문번호</th>
            <th>구분</th>
            <th>처리상태</th>
            <th>금액</th>
          </tr>
        </thead>
        <tbody>
          ${a.map(({order:i,claimType:y})=>`
            <tr>
              <td>${u(i.createdAt)}</td>
              <td>${c(i.orderNo)}</td>
              <td>${I(y)}</td>
              <td>${c(p(i))}</td>
              <td>${d(i.totalAmount)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `}function M(){const t=s.dashboard?.shopping?.couponHistory||[];if(!t.length){r.couponTable.innerHTML='<p class="empty">보유한 쿠폰이 없습니다.</p>';return}r.couponTable.innerHTML=`
    <div class="myshop-table-wrap">
      <table class="myshop-table">
        <thead>
          <tr>
            <th>쿠폰명</th>
            <th>할인금액/비율</th>
            <th>사용가능 기간</th>
            <th>쿠폰적용상품</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          ${t.map(e=>`
            <tr>
              <td>${c(e.name)}</td>
              <td>${d(e.discountAmount)} / -</td>
              <td>${u(e.createdAt)} ~ ${e.expiresAt?u(e.expiresAt):"무기한"}</td>
              <td>전상품</td>
              <td>${e.isUsed?"사용완료":e.isExpired?"만료":"사용가능"}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `}function H(){const t=s.dashboard?.profile||{};r.sidebarGreeting.textContent=`${t.name||t.email||"회원"}님의 쇼핑 정보를 확인하세요.`,P(),w(),f(),g(),M(),h()}async function U(){let t=0;try{t=await R()}catch{t=0}T(F,{userName:s.user?.name||s.user?.email||null,isAdmin:!!(s.user?.is_staff??s.user?.isStaff),cartCountValue:t})}r.navLinks.forEach(t=>{t.addEventListener("click",e=>{const n=t.dataset.sectionLink;n&&(e.preventDefault(),$(n))})});[r.orderStatusFilter,r.orderRangeFilter].forEach(t=>{t?.addEventListener("change",f)});[r.claimStatusFilter,r.claimRangeFilter].forEach(t=>{t?.addEventListener("change",g)});(async function(){const e=await S()||D();if(!e){alert("마이페이지는 로그인 후 이용할 수 있습니다."),location.href="/pages/login.html";return}s.user=e;const n=new URLSearchParams(location.search).get("tab");n&&l[n]&&(s.activeSection=n);try{const[a,i]=await Promise.all([A(),L()]);s.dashboard=a,s.orders=i,H(),await U()}catch(a){console.error(a),alert(a.message||"마이페이지 데이터를 불러오지 못했습니다.")}})();
