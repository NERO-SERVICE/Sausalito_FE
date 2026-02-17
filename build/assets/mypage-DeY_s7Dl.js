import{m as v,a as w,u as $,p as I,q as y,v as B,r as b,s as g,g as h,w as P,d as E}from"./footer-CGVTRZKF.js";import{c as q}from"./cart-service-CmqApfUf.js";import{f as s,a as H}from"./store-data-Deux6dsM.js";const C=v({showCart:!0,currentNav:""});w();const o={user:null,dashboard:null,inquiryFormOpen:!1},r={greeting:document.getElementById("mypageGreeting"),summary:document.getElementById("mypageSummary"),orders:document.getElementById("mypageOrders"),pointHistory:document.getElementById("mypagePointHistory"),depositHistory:document.getElementById("mypageDepositHistory"),couponHistory:document.getElementById("mypageCouponHistory"),recentProducts:document.getElementById("mypageRecentProducts"),wishlistProducts:document.getElementById("mypageWishlistProducts"),myReviews:document.getElementById("mypageMyReviews"),profileForm:document.getElementById("mypageProfileForm"),passwordForm:document.getElementById("mypagePasswordForm"),inquiryForm:document.getElementById("mypageInquiryForm"),inquiryHistory:document.getElementById("mypageInquiryHistory"),email:document.getElementById("mypageEmail"),name:document.getElementById("mypageName"),phone:document.getElementById("mypagePhone"),oldPassword:document.getElementById("mypageOldPassword"),newPassword:document.getElementById("mypageNewPassword"),newPasswordConfirm:document.getElementById("mypageNewPasswordConfirm"),inquiryTitle:document.getElementById("inquiryTitle"),inquiryContent:document.getElementById("inquiryContent"),openInquiryBtn:document.getElementById("openInquiryBtn"),cancelInquiryBtn:document.getElementById("cancelInquiryBtn"),logoutBtn:document.getElementById("mypageLogoutBtn")};function c(t){if(!t)return"-";const n=new Date(t);if(Number.isNaN(n.getTime()))return"-";const e=n.getFullYear(),i=String(n.getMonth()+1).padStart(2,"0"),a=String(n.getDate()).padStart(2,"0");return`${e}.${i}.${a}`}function m(t,n,e){if(t){if(!n){t.innerHTML=`<p class="empty">${e}</p>`;return}t.innerHTML=n}}function F(){const t=o.dashboard?.shopping?.summary||{orderCount:0,pointBalance:0,depositBalance:0,couponCount:0};r.summary.innerHTML=`
    <article>
      <p>주문내역</p>
      <strong>${t.orderCount}건</strong>
    </article>
    <article>
      <p>적립금</p>
      <strong>${s(t.pointBalance)}</strong>
    </article>
    <article>
      <p>예치금</p>
      <strong>${s(t.depositBalance)}</strong>
    </article>
    <article>
      <p>사용 가능 쿠폰</p>
      <strong>${t.couponCount}장</strong>
    </article>
  `}function L(){const n=(o.dashboard?.shopping?.orders||[]).map(e=>`
        <article class="mypage-order-row">
          <div>
            <strong>${e.orderNo}</strong>
            <p>${c(e.createdAt)} · ${e.itemCount}개 상품</p>
          </div>
          <div>
            <span>${e.status}</span>
            <b>${s(e.totalAmount)}</b>
          </div>
        </article>
      `).join("");m(r.orders,n,"주문내역이 없습니다.")}function A(){const t=o.dashboard?.shopping?.pointHistory||[],n=o.dashboard?.shopping?.depositHistory||[],e=t.map(a=>`
      <article class="mypage-money-row">
        <div>
          <strong>${a.description||"적립금 변동"}</strong>
          <p>${c(a.createdAt)}</p>
        </div>
        <div>
          <b class="${a.amount>=0?"up":"down"}">${a.amount>=0?"+":""}${s(a.amount)}</b>
          <small>잔액 ${s(a.balanceAfter)}</small>
        </div>
      </article>
    `).join("");m(r.pointHistory,e,"적립금 내역이 없습니다.");const i=n.map(a=>`
      <article class="mypage-money-row">
        <div>
          <strong>${a.description||"예치금 변동"}</strong>
          <p>${c(a.createdAt)}</p>
        </div>
        <div>
          <b class="${a.amount>=0?"up":"down"}">${a.amount>=0?"+":""}${s(a.amount)}</b>
          <small>잔액 ${s(a.balanceAfter)}</small>
        </div>
      </article>
    `).join("");m(r.depositHistory,i,"예치금 내역이 없습니다.")}function M(){const n=(o.dashboard?.shopping?.couponHistory||[]).map(e=>`
      <article class="mypage-coupon-row">
        <div>
          <strong>${e.name}</strong>
          <p>${e.code} · ${e.minOrderAmount?`${s(e.minOrderAmount)} 이상`:"최소 금액 제한 없음"}</p>
        </div>
        <div>
          <b>${s(e.discountAmount)}</b>
          <small>${e.isUsed?"사용완료":e.isExpired?"만료":"사용가능"}</small>
        </div>
      </article>
    `).join("");m(r.couponHistory,n,"보유 쿠폰이 없습니다.")}function p(t,n,e,i=!1){const a=n.map(d=>`
      <article class="mypage-product-card">
        <a href="/pages/detail.html?id=${d.id}">
          <img src="${H(d.image)}" alt="${d.name}" />
        </a>
        <div>
          <a class="mypage-product-name" href="/pages/detail.html?id=${d.id}">${d.name}</a>
          <p>${s(d.price)}</p>
          ${i?`<button class="ghost mypage-wish-remove" data-action="removeWishlist" data-id="${d.id}">삭제</button>`:""}
        </div>
      </article>
    `).join("");m(t,a,e)}function N(){const n=(o.dashboard?.activity?.myReviews||[]).map(e=>`
      <article class="mypage-review-row">
        <div>
          <b>${"★".repeat(e.score)}${"☆".repeat(5-e.score)}</b>
          <span>${e.date}</span>
        </div>
        <p>${e.text}</p>
        <a href="/pages/detail.html?id=${e.productId}">상품 보러가기</a>
      </article>
    `).join("");m(r.myReviews,n,"작성한 리뷰가 없습니다.")}function O(){const n=(o.dashboard?.inquiries||[]).map(e=>`
      <article class="mypage-inquiry-row">
        <div>
          <strong>${e.title}</strong>
          <span>${e.status}</span>
        </div>
        <p>${e.content}</p>
        <small>${c(e.created_at||e.createdAt)}</small>
      </article>
    `).join("");m(r.inquiryHistory,n,"등록된 문의가 없습니다.")}function D(){const t=o.dashboard?.profile||{};r.email.value=t.email||"",r.name.value=t.name||"",r.phone.value=t.phone||""}function u(){r.inquiryForm&&r.inquiryForm.classList.toggle("hidden",!o.inquiryFormOpen)}function S(){const t=o.dashboard?.profile||{};r.greeting.textContent=`${t.name||t.email||"회원"}님, 쇼핑/활동 내역을 확인하세요.`,F(),L(),A(),M(),p(r.recentProducts,o.dashboard?.activity?.recentProducts||[],"최근 본 상품이 없습니다."),p(r.wishlistProducts,o.dashboard?.activity?.wishlistProducts||[],"위시리스트가 비어 있습니다.",!0),N(),D(),O(),u()}async function f(){const t=await g()||h();let n=0;try{n=await q()}catch{n=0}E(C,{userName:t?.name||t?.email||null,cartCountValue:n})}async function l(){o.dashboard=await P(),S()}r.profileForm?.addEventListener("submit",async t=>{t.preventDefault();try{await $({name:r.name.value.trim(),phone:r.phone.value.trim()}),await l(),await f(),alert("회원 정보가 저장되었습니다.")}catch(n){console.error(n),alert(n.message||"회원 정보 저장에 실패했습니다.")}});r.passwordForm?.addEventListener("submit",async t=>{t.preventDefault();try{await I({oldPassword:r.oldPassword.value,newPassword:r.newPassword.value,newPasswordConfirm:r.newPasswordConfirm.value}),r.oldPassword.value="",r.newPassword.value="",r.newPasswordConfirm.value="",alert("비밀번호가 변경되었습니다. 다시 로그인해주세요."),await y(),location.href="/pages/login.html"}catch(n){console.error(n),alert(n.message||"비밀번호 변경에 실패했습니다.")}});r.openInquiryBtn?.addEventListener("click",()=>{o.inquiryFormOpen=!0,u()});r.cancelInquiryBtn?.addEventListener("click",()=>{o.inquiryFormOpen=!1,u()});r.inquiryForm?.addEventListener("submit",async t=>{t.preventDefault();try{await B({title:r.inquiryTitle.value.trim(),content:r.inquiryContent.value.trim()}),r.inquiryTitle.value="",r.inquiryContent.value="",o.inquiryFormOpen=!1,await l(),alert("문의가 접수되었습니다.")}catch(n){console.error(n),alert(n.message||"문의 등록에 실패했습니다.")}});r.wishlistProducts?.addEventListener("click",async t=>{const n=t.target.closest("[data-action='removeWishlist']");if(!n)return;const e=Number(n.dataset.id);if(e)try{await b(e),await l()}catch(i){console.error(i),alert(i.message||"위시리스트 삭제에 실패했습니다.")}});r.logoutBtn?.addEventListener("click",async()=>{await y(),location.href="/pages/home.html"});(async function(){const n=await g()||h();if(!n){alert("마이페이지는 로그인 후 이용할 수 있습니다."),location.href="/pages/login.html";return}o.user=n;try{await l(),await f()}catch(e){console.error(e),alert(e.message||"마이페이지 데이터를 불러오지 못했습니다.")}})();
