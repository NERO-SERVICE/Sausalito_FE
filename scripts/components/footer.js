export function mountSiteFooter() {
  const mount = document.getElementById("siteFooterMount");
  if (!mount) return;

  mount.innerHTML = `
    <footer class="site-footer">
      <div class="site-footer-inner">
        <nav class="site-footer-links">
          <a href="/pages/privacy.html">개인정보처리방침</a>
          <a href="/pages/terms.html">이용약관</a>
          <a href="/pages/commerce-notice.html">전자상거래 고지</a>
          <a href="/pages/guide.html">이용안내</a>
        </nav>
        <div class="site-footer-info">
          <p><strong>상호</strong> 주식회사 네로</p>
          <p><strong>대표</strong> 한동균, 박호연</p>
          <p><strong>사업자등록번호</strong> 355-86-03876</p>
          <p><strong>통신판매업신고</strong> 제 2026-서울마포-0044호</p>
          <p><strong>주소</strong> 서울특별시 중구 퇴계로36길 2</p>
          <p><strong>고객센터</strong> 1588-1234 (평일 10:00 - 18:00 / 점심 13:00 - 14:00)</p>
          <p><strong>이메일</strong> official@nero.ai.kr</p>
        </div>
        <p class="site-footer-copy">Copyright © Nero Inc. All rights reserved.</p>
      </div>
    </footer>
  `;
}
