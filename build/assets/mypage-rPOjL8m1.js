import{m as v,a as w,u as $,p as B,q as y,v as I,r as b,s as g,g as h,w as P,d as E}from"./footer-DEhz7KPv.js";import{c as q}from"./cart-service-Baow9FyR.js";import{f as s,a as H}from"./store-data-Deux6dsM.js";const C=v({showCart:!0,currentNav:""});w();const o={user:null,dashboard:null,inquiryFormOpen:!1},a={greeting:document.getElementById("mypageGreeting"),summary:document.getElementById("mypageSummary"),orders:document.getElementById("mypageOrders"),pointHistory:document.getElementById("mypagePointHistory"),depositHistory:document.getElementById("mypageDepositHistory"),couponHistory:document.getElementById("mypageCouponHistory"),recentProducts:document.getElementById("mypageRecentProducts"),wishlistProducts:document.getElementById("mypageWishlistProducts"),myReviews:document.getElementById("mypageMyReviews"),profileForm:document.getElementById("mypageProfileForm"),passwordForm:document.getElementById("mypagePasswordForm"),inquiryForm:document.getElementById("mypageInquiryForm"),inquiryHistory:document.getElementById("mypageInquiryHistory"),email:document.getElementById("mypageEmail"),name:document.getElementById("mypageName"),phone:document.getElementById("mypagePhone"),oldPassword:document.getElementById("mypageOldPassword"),newPassword:document.getElementById("mypageNewPassword"),newPasswordConfirm:document.getElementById("mypageNewPasswordConfirm"),inquiryTitle:document.getElementById("inquiryTitle"),inquiryContent:document.getElementById("inquiryContent"),openInquiryBtn:document.getElementById("openInquiryBtn"),cancelInquiryBtn:document.getElementById("cancelInquiryBtn"),logoutBtn:document.getElementById("mypageLogoutBtn")};function c(e){if(!e)return"-";const n=new Date(e);if(Number.isNaN(n.getTime()))return"-";const t=n.getFullYear(),i=String(n.getMonth()+1).padStart(2,"0"),r=String(n.getDate()).padStart(2,"0");return`${t}.${i}.${r}`}function m(e,n,t){if(e){if(!n){e.innerHTML=`<p class="empty">${t}</p>`;return}e.innerHTML=n}}function F(){const e=o.dashboard?.shopping?.summary||{orderCount:0,pointBalance:0,depositBalance:0,couponCount:0};a.summary.innerHTML=`
    <article>
      <p>주문내역</p>
      <strong>${e.orderCount}건</strong>
    </article>
    <article>
      <p>적립금</p>
      <strong>${s(e.pointBalance)}</strong>
    </article>
    <article>
      <p>예치금</p>
      <strong>${s(e.depositBalance)}</strong>
    </article>
    <article>
      <p>사용 가능 쿠폰</p>
      <strong>${e.couponCount}장</strong>
    </article>
  `}function L(){const n=(o.dashboard?.shopping?.orders||[]).map(t=>`
        <article class="mypage-order-row">
          <div>
            <strong>${t.orderNo}</strong>
            <p>${c(t.createdAt)} · ${t.itemCount}개 상품</p>
          </div>
          <div>
            <span>${t.status}</span>
            <b>${s(t.totalAmount)}</b>
          </div>
        </article>
      `).join("");m(a.orders,n,"주문내역이 없습니다.")}function A(){const e=o.dashboard?.shopping?.pointHistory||[],n=o.dashboard?.shopping?.depositHistory||[],t=e.map(r=>`
      <article class="mypage-money-row">
        <div>
          <strong>${r.description||"적립금 변동"}</strong>
          <p>${c(r.createdAt)}</p>
        </div>
        <div>
          <b class="${r.amount>=0?"up":"down"}">${r.amount>=0?"+":""}${s(r.amount)}</b>
          <small>잔액 ${s(r.balanceAfter)}</small>
        </div>
      </article>
    `).join("");m(a.pointHistory,t,"적립금 내역이 없습니다.");const i=n.map(r=>`
      <article class="mypage-money-row">
        <div>
          <strong>${r.description||"예치금 변동"}</strong>
          <p>${c(r.createdAt)}</p>
        </div>
        <div>
          <b class="${r.amount>=0?"up":"down"}">${r.amount>=0?"+":""}${s(r.amount)}</b>
          <small>잔액 ${s(r.balanceAfter)}</small>
        </div>
      </article>
    `).join("");m(a.depositHistory,i,"예치금 내역이 없습니다.")}function M(){const n=(o.dashboard?.shopping?.couponHistory||[]).map(t=>`
      <article class="mypage-coupon-row">
        <div>
          <strong>${t.name}</strong>
          <p>${t.code} · ${t.minOrderAmount?`${s(t.minOrderAmount)} 이상`:"최소 금액 제한 없음"}</p>
        </div>
        <div>
          <b>${s(t.discountAmount)}</b>
          <small>${t.isUsed?"사용완료":t.isExpired?"만료":"사용가능"}</small>
        </div>
      </article>
    `).join("");m(a.couponHistory,n,"보유 쿠폰이 없습니다.")}function p(e,n,t,i=!1){const r=n.map(d=>`
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
    `).join("");m(e,r,t)}function N(){const n=(o.dashboard?.activity?.myReviews||[]).map(t=>`
      <article class="mypage-review-row">
        <div>
          <b>${"★".repeat(t.score)}${"☆".repeat(5-t.score)}</b>
          <span>${t.date}</span>
        </div>
        <p>${t.text}</p>
        <a href="/pages/detail.html?id=${t.productId}">상품 보러가기</a>
      </article>
    `).join("");m(a.myReviews,n,"작성한 리뷰가 없습니다.")}function O(){const n=(o.dashboard?.inquiries||[]).map(t=>`
      <article class="mypage-inquiry-row">
        <div>
          <strong>${t.title}</strong>
          <span>${t.status}</span>
        </div>
        <p>${t.content}</p>
        <small>${c(t.created_at||t.createdAt)}</small>
      </article>
    `).join("");m(a.inquiryHistory,n,"등록된 문의가 없습니다.")}function S(){const e=o.dashboard?.profile||{};a.email.value=e.email||"",a.name.value=e.name||"",a.phone.value=e.phone||""}function u(){a.inquiryForm&&a.inquiryForm.classList.toggle("hidden",!o.inquiryFormOpen)}function D(){const e=o.dashboard?.profile||{};a.greeting.textContent=`${e.name||e.email||"회원"}님, 쇼핑/활동 내역을 확인하세요.`,F(),L(),A(),M(),p(a.recentProducts,o.dashboard?.activity?.recentProducts||[],"최근 본 상품이 없습니다."),p(a.wishlistProducts,o.dashboard?.activity?.wishlistProducts||[],"위시리스트가 비어 있습니다.",!0),N(),S(),O(),u()}async function f(){const e=await g()||h();let n=0;try{n=await q()}catch{n=0}E(C,{userName:e?.name||e?.email||null,isAdmin:!!(e?.is_staff??e?.isStaff),cartCountValue:n})}async function l(){o.dashboard=await P(),D()}a.profileForm?.addEventListener("submit",async e=>{e.preventDefault();try{await $({name:a.name.value.trim(),phone:a.phone.value.trim()}),await l(),await f(),alert("회원 정보가 저장되었습니다.")}catch(n){console.error(n),alert(n.message||"회원 정보 저장에 실패했습니다.")}});a.passwordForm?.addEventListener("submit",async e=>{e.preventDefault();try{await B({oldPassword:a.oldPassword.value,newPassword:a.newPassword.value,newPasswordConfirm:a.newPasswordConfirm.value}),a.oldPassword.value="",a.newPassword.value="",a.newPasswordConfirm.value="",alert("비밀번호가 변경되었습니다. 다시 로그인해주세요."),await y(),location.href="/pages/login.html"}catch(n){console.error(n),alert(n.message||"비밀번호 변경에 실패했습니다.")}});a.openInquiryBtn?.addEventListener("click",()=>{o.inquiryFormOpen=!0,u()});a.cancelInquiryBtn?.addEventListener("click",()=>{o.inquiryFormOpen=!1,u()});a.inquiryForm?.addEventListener("submit",async e=>{e.preventDefault();try{await I({title:a.inquiryTitle.value.trim(),content:a.inquiryContent.value.trim()}),a.inquiryTitle.value="",a.inquiryContent.value="",o.inquiryFormOpen=!1,await l(),alert("문의가 접수되었습니다.")}catch(n){console.error(n),alert(n.message||"문의 등록에 실패했습니다.")}});a.wishlistProducts?.addEventListener("click",async e=>{const n=e.target.closest("[data-action='removeWishlist']");if(!n)return;const t=Number(n.dataset.id);if(t)try{await b(t),await l()}catch(i){console.error(i),alert(i.message||"위시리스트 삭제에 실패했습니다.")}});a.logoutBtn?.addEventListener("click",async()=>{await y(),location.href="/pages/home.html"});(async function(){const n=await g()||h();if(!n){alert("마이페이지는 로그인 후 이용할 수 있습니다."),location.href="/pages/login.html";return}o.user=n;try{await l(),await f()}catch(t){console.error(t),alert(t.message||"마이페이지 데이터를 불러오지 못했습니다.")}})();
