// Smooth scroll for intra-page anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

document.addEventListener('DOMContentLoaded', function () {
  // Hamburger
  const hamburger = document.querySelector('.hamburger-menu');
  const nav = document.getElementById('global-nav');
  if (hamburger && nav) {
    hamburger.addEventListener('click', function () {
      this.classList.toggle('active');
      nav.classList.toggle('active');
    });
    document.querySelectorAll('#global-nav a').forEach(link => {
      link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
      });
    });
  }

  // Header nav label fixes (ensure proper Japanese labels)
  (function fixHeaderNavLabels() {
    const nav = document.getElementById('global-nav');
    if (!nav) return;
    const setIfMatch = (a, matcher, label) => {
      const href = a.getAttribute('href') || '';
      if (matcher(href)) a.textContent = label;
    };
    nav.querySelectorAll('a').forEach(a => {
      setIfMatch(a, (h) => /(^|\/)menu\.html$/.test(h), 'メニュー');
      setIfMatch(a, (h) => /#gallery$/.test(h), 'ギャラリー');
      setIfMatch(a, (h) => /#voice$/.test(h), 'お客さまの声');
      setIfMatch(a, (h) => /#access$/.test(h), 'アクセス');
    });

    // Ensure order: お客さまの声 → ギャラリー
    const ul = nav.querySelector('ul');
    if (!ul) return;
    const lis = Array.from(ul.children);
    const liGallery = lis.find(li => li.querySelector('a[href*="#gallery"]'));
    const liVoice = lis.find(li => li.querySelector('a[href*="#voice"]'));
    if (liGallery && liVoice) {
      const iG = lis.indexOf(liGallery);
      const iV = lis.indexOf(liVoice);
      if (iV > -1 && iG > -1 && iV > iG) {
        ul.insertBefore(liVoice, liGallery);
      }
    }
  })();

  // Replace Standard course image on menu and home pages
  (function replaceStandardCourseImage() {
    // Menu page (first course image)
    const menuImg = document.querySelector('.menu-list .menu-list-item .menu-list-image img');
    if (menuImg) {
      menuImg.src = 'images/cosyama.cherie.esthe.6.png';
      try { menuImg.alt = 'スタンダードコース'; } catch(_){}
    }
    // Home page digest (first card)
    const homeImg = document.querySelector('.home-menu-cards .home-menu-card img');
    if (homeImg) {
      homeImg.src = 'images/cosyama.cherie.esthe.6.png';
      try { homeImg.alt = 'スタンダードコース'; } catch(_){}
    }
  })();

  // Replace Aging course image on menu and home pages
  (function replaceAgingCourseImage() {
    // Menu page (second course image)
    const menuImgs = document.querySelectorAll('.menu-list .menu-list-item .menu-list-image img');
    if (menuImgs && menuImgs[1]) {
      menuImgs[1].src = 'images/cosyama.cherie.esthe.10.png';
      try { menuImgs[1].alt = 'エイジングコース'; } catch (_) {}
    }
    // Home page digest (second card)
    const homeImgs = document.querySelectorAll('.home-menu-cards .home-menu-card img');
    if (homeImgs && homeImgs[1]) {
      homeImgs[1].src = 'images/cosyama.cherie.esthe.10.png';
      try { homeImgs[1].alt = 'エイジングコース'; } catch (_) {}
    }
  })();

  // Business status (JST)
  const statusEl = document.getElementById('business-status');
  if (statusEl) {
    const now = new Date();
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000; // local->UTC
    const jst = new Date(utcMs + 9 * 60 * 60000); // UTC+9
    const day = jst.getDay(); // 0:Sun .. 6:Sat
    const minutes = jst.getHours() * 60 + jst.getMinutes();
    const openStart = 10 * 60; // 10:00
    const openEnd = 18 * 60 + 30; // 18:30
    const isHoliday = (day === 0 || day === 1); // Sun & Mon
    const isOpenNow = !isHoliday && minutes >= openStart && minutes < openEnd;
    statusEl.textContent = isOpenNow ? '本日営業中' : '準備中';
    statusEl.classList.toggle('open', isOpenNow);
  }

  // Contact form (mailto fallback)
  const form = document.getElementById('contact-form');
  if (!form) return;

  const get = id => document.getElementById(id);
  const errEl = id => form.querySelector('.error[data-for="' + id + '"]');
  const clearErr = id => { const e = errEl(id); if (e) e.textContent = ''; };
  const mark = (id, ok) => {
    const el = get(id); if (!el) return;
    el.classList.toggle('is-invalid', !ok);
    if (!ok) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
    const group = el.closest('.form-group') || el.closest('.form-check');
    if (group) group.classList.toggle('has-error', !ok);
  };

  // Live clear on input/change
  ['name','email','tel','message'].forEach(id => { const el = get(id); if (el) el.addEventListener('input', () => { mark(id, true); clearErr(id); }); });
  ['subject','menu','date','time','agree'].forEach(id => { const el = get(id); if (el) el.addEventListener('change', () => { mark(id, true); clearErr(id); }); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = (get('name')?.value || '').trim();
    const email = (get('email')?.value || '').trim();
    const subjectField = get('subject');
    const subjectValue = subjectField ? (subjectField.value || '').trim() : '';
    const tel = (get('tel')?.value || '').trim();
    const menu = (get('menu')?.value || '').trim();
    const date = (get('date')?.value || '').trim();
    const time = (get('time')?.value || '').trim();
    const message = (get('message')?.value || '').trim();
    const agree = !!get('agree')?.checked;

    // Validate required
    const errors = {};
    if (!name) errors.name = 'お名前を入力してください';
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = '正しいメールアドレスを入力してください';
    if (subjectField && subjectField.required && !subjectValue) errors.subject = '件名を選択してください';
    if (!message) errors.message = 'お問い合わせ内容を入力してください';
    if (!agree) errors.agree = '個人情報の取り扱いに同意が必要です';

    // Render
    form.querySelectorAll('.error').forEach(el => el.textContent = '');
    ['name','email','subject','tel','menu','date','time','message','agree'].forEach(id => {
      const has = Object.prototype.hasOwnProperty.call(errors, id);
      mark(id, !has);
      if (has) { const e = errEl(id); if (e) e.textContent = errors[id]; }
    });
    if (Object.keys(errors).length) {
      const errorList = Object.values(errors);
      alert('未入力/入力エラーがあります。\n' + errorList.join('\n'));
      return;
    }

    // Build mail
    const lines = [
      '件名: ' + (subjectValue || '未選択'),
      'お名前: ' + name,
      'メール: ' + email,
      '電話: ' + (tel || '未記入'),
      'ご希望メニュー: ' + (menu || '未選択'),
      'ご希望日時: ' + (date || '') + (time ? (' ' + time) : ''),
      '---',
      message
    ];
    const mailSubject = encodeURIComponent((subjectValue || 'お問い合わせ') + ': ' + name);
    const body = encodeURIComponent(lines.join('\n'));
    const to = 'info@example.com'; // TODO: 受信先に置き換え
    const mailto = 'mailto:' + to + '?subject=' + mailSubject + '&body=' + body;
    // 起動後にサンクスページへ遷移（mailtoの結果はブラウザから検出できないため）
    try { window.location.href = mailto; } finally {
      setTimeout(() => { window.location.href = 'thanks.html'; }, 600);
    }
  });
});
