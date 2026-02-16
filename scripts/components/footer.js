export function mountSiteFooter() {
  const mount = document.getElementById("siteFooterMount");
  if (!mount) return;

  mount.innerHTML = `
    <footer class="site-footer">
      <div class="site-footer-inner">
        <nav class="site-footer-links">
          <a href="/pages/privacy.html">개인정보처리방침</a>
          <a href="/pages/terms.html">이용약관</a>
          <a href="/pages/guide.html">이용안내</a>
        </nav>
        <div class="site-footer-info">
          <p><strong>상호</strong> 소살리토웰니스 주식회사</p>
          <p><strong>대표</strong> 홍길동</p>
          <p><strong>사업자등록번호</strong> 123-45-67890</p>
          <p><strong>통신판매업신고</strong> 2026-서울강남-0001</p>
          <p><strong>주소</strong> 서울특별시 강남구 테헤란로 123, 소살리토빌딩 8층</p>
          <p><strong>고객센터</strong> 1588-1234 (평일 10:00 - 18:00 / 점심 12:30 - 13:30)</p>
          <p><strong>이메일</strong> help@sausalito.co.kr</p>
        </div>
        <p class="site-footer-copy">Copyright © SAUSALITO WELLNESS Co., Ltd. All rights reserved.</p>
      </div>
    </footer>
  `;
}
