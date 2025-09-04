(async () => {
  // 支持两种链接写法：
  // 1) www.hiwebsun0914.top/?token=123   （标准 query）
  // 2) www.hiwebsun0914.top/token=123    （你提到的路径式写法）
  const url = new URL(window.location.href);
  let token = url.searchParams.get('token');
  if (!token) {
    // 路径式：/token=123 或 /something/token=123
    const m = window.location.pathname.match(/(?:^|\/)token=([^\/?#]+)/i);
    if (m) token = decodeURIComponent(m[1]);
  }

  const nameEl = document.getElementById('name');
  const fallback = document.getElementById('fallback');

  try {
    // 方式1：静态 JSON（最简单）
    const mapping = await fetch('./names.json', { cache: 'no-store' }).then(r => r.json());
    const name = token ? mapping[token] : null;
    if (name) {
      nameEl.textContent = name;
    } else {
      nameEl.textContent = '尊敬的来宾';
      fallback.style.display = '';
    }
  } catch (e) {
    nameEl.textContent = '尊敬的来宾';
    fallback.style.display = '';
  }
})();
