(async function(){
  const fallback = `
<header class="header">
  <div class="container">
    <div class="header-logo">
      <a href="index.html">Cosme Yamamoto</a>
    </div>
    <button class="hamburger-menu" aria-label="メニューを開く">
      <span></span>
      <span></span>
      <span></span>
    </button>
    <nav class="header-nav" id="global-nav">
      <ul>
        <li><a href="about.html">サロン案内</a></li>
        <li><a href="index.html#concept">コンセプト</a></li>
        <li><a href="menu.html">メニュー</a></li>
        <li><a href="index.html#voice">お客様の声</a></li>
        <li><a href="index.html#gallery">ギャラリー</a></li>
        <li><a href="contact.html">お問合せ</a></li>
      </ul>
    </nav>
  </div>
</header>`;
  try {
    const host = document.getElementById('site-header');
    if(!host) return;
    let html = '';
    try {
      const res = await fetch('includes/header.html', { cache: 'no-cache' });
      if(!res.ok) throw new Error('status '+res.status);
      html = await res.text();
      // guard: 空のプレースホルダ誤登録対策
      if(!html || !html.trim() || /<div id=\"site-header\"/.test(html)) html = fallback;
    } catch(e) {
      html = fallback;
    }
    host.innerHTML = html;
    const btn = host.querySelector('.hamburger-menu');
    const nav = host.querySelector('#global-nav');
    if(btn && nav){
      btn.addEventListener('click', ()=>{
        btn.classList.toggle('active');
        nav.classList.toggle('active');
      });
    }
  } catch(e){ console.warn('header include error:', e); }
})();
