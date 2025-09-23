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
  // Unify header navigation across all pages
  (function unifyHeaderNav() {
    try {
      const nav = document.getElementById('global-nav');
      if (!nav) return;
      let ul = nav.querySelector('ul');
      if (!ul) { ul = document.createElement('ul'); nav.appendChild(ul); }

      // Preserve existing CTA button if present
      const ctaEl = ul.querySelector('a.btn');
      const cta = ctaEl ? {
        href: ctaEl.getAttribute('href') || 'contact.html',
        text: (ctaEl.textContent || '').trim() || 'ご予約・お問い合わせ',
        className: ctaEl.className
      } : null;

      const items = [
        { href: 'about.html', label: '私たちの想い' },
        { href: 'index.html#concept', label: 'サロン紹介' },
        { href: 'menu.html', label: 'メニュー' },
        { href: 'index.html#voice', label: 'お客さまの声' },
        { href: 'index.html#gallery', label: 'ギャラリー' },
        { href: 'index.html#access', label: 'アクセス' }
      ];

      // Rebuild nav list
      ul.innerHTML = '';
      items.forEach(it => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.setAttribute('href', it.href);
        a.textContent = it.label;
        li.appendChild(a);
        ul.appendChild(li);
      });

      if (cta) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.setAttribute('href', cta.href);
        a.className = cta.className || '';
        a.textContent = cta.text;
        li.appendChild(a);
        ul.appendChild(li);
      }
    } catch (_) {}
  })();
  // About page: update SUPER section heading and subtitle per request
  (function updateSuperSectionHeading() {
    try {
      const container = document.querySelector('.super-container');
      if (!container) return;
      const h1 = container.querySelector('h1');
      if (h1) {
        h1.textContent = 'サロンのこだわり';
        let next = h1.nextElementSibling;
        if (!(next && next.classList && next.classList.contains('section-subtitle'))) {
          const p = document.createElement('p');
          p.className = 'section-subtitle';
          h1.insertAdjacentElement('afterend', p);
          next = p;
        }
        // Set subtitle to COMMITMENT (overwrite if it was SUPER)
        next.textContent = 'COMMITMENT';

        // Insert bold, slightly larger 「SUPER」 line under the subtitle
        let label = container.querySelector('.super-keyword');
        if (!label) {
          label = document.createElement('p');
          label.className = 'super-keyword';
          next.insertAdjacentElement('afterend', label);
        }
        label.textContent = '「SUPER」';
      }
    } catch (_) {}
  })();

  // About page: remove the commitment section above Therapist
  (function removeCommitmentSection() {
    try {
      const section = document.querySelector('section#commitment');
      if (section) section.remove();
    } catch (_) {}
  })();

  // Move top "サロンのこだわり（SUPER）" section just above Therapist
  (function moveSuperSectionAboveTherapist() {
    try {
      const superContainer = document.querySelector('.super-container');
      if (!superContainer) return;
      const superSection = superContainer.closest('section');
      if (!superSection) return;

      // Find Therapist section
      let therapistSection = null;
      const subs = Array.from(document.querySelectorAll('p.section-subtitle'));
      const subTherapist = subs.find(p => (p.textContent || '').trim().toUpperCase() === 'THERAPIST');
      if (subTherapist) therapistSection = subTherapist.closest('section');
      if (!therapistSection) {
        const profile = document.querySelector('.profile');
        if (profile) therapistSection = profile.closest('section');
      }
      if (!therapistSection) return;

      // If already immediately above, skip; otherwise insert right before therapist
      if (superSection.nextElementSibling !== therapistSection) {
        therapistSection.parentNode.insertBefore(superSection, therapistSection);
      }
    } catch (_) {}
  })();
  // Front page: set title
  try {
    if (document.getElementById('hero')) {
      document.title = 'コスメ山本神栖エステサロン';
      const desc = document.querySelector('meta[name="description"]');
      if (desc) {
        desc.setAttribute('content', 'コスメ山本は、神栖市のフェイシャル専門エステサロン。丁寧なカウンセリングと心地よいケアで、自然体の美しさを引き出します。');
      }
    }
  } catch (_) {}
  // Set hero catch copy (header tagline)
  try {
    const heroHeading = document.querySelector('#hero h1');
    if (heroHeading) {
      heroHeading.textContent = '年齢を魅力に、美しさを肌にまとう';
    }
  } catch (_) {}

  // Replace "私たちの想い" (concept) section image
  (function replaceConceptImage() {
    const conceptImg = document.querySelector('#concept .concept-image img');
    if (conceptImg) {
      conceptImg.src = 'images/cosyama.cherie.esthe.2.png';
    }
  })();

  // Access: set parking info text under TEL
  (function setParkingInfo() {
    try {
      const li = document.getElementById('store-parking');
      if (li) {
        li.textContent = '駐車場: 5台完備';
      }
    } catch (_) {}
  })();

  // Access: set payment methods (cash + e-payments). Credit brands to be added on confirmation.
  (function setPaymentInfo() {
    try {
      const li = document.getElementById('store-payment');
      if (!li) return;
      const credit = ['VISA', 'Mastercard', 'JCB', 'American Express'];
      const epay = ['楽天ペイ', 'PayPay', 'd払い', 'au PAY', 'メルペイ'];
      const creditText = credit.join(', ');
      const epayText = epay.join('、');
      li.textContent = 'お支払い: 現金／クレジット（' + creditText + '）／電子決済（' + epayText + '）';
    } catch (_) {}
  })();

  // Access: insert address directly under store name
  (function insertAddressUnderStoreName() {
    try {
      const info = document.querySelector('#access .access-info');
      if (!info) return;
      const nameP = info.querySelector('p strong')?.parentElement;
      if (!nameP) return;
      const hasAddress = Array.from(info.querySelectorAll('p')).some(p => {
        const t = (p.textContent || '').trim();
        return t.startsWith('住所：') || t.startsWith('住所:');
      });
      if (!hasAddress) {
        const p = document.createElement('p');
        p.textContent = '住所：〒314-0115 茨城県神栖市知手２９７５－５１';
        nameP.insertAdjacentElement('afterend', p);
      }
    } catch (_) {}
  })();

  // Access: remove address, reservation, and duplicate hours rows (per request)
  (function normalizeStoreBrief() {
    try {
      const list = document.querySelector('#access .store-brief ul');
      if (!list) return;
      list.querySelectorAll('li').forEach(li => {
        const hasContact = !!li.querySelector('a[href*="contact.html"]');
        const hasMaps = !!li.querySelector('a[href*="google.com/maps"]');
        const txt = (li.textContent || '');
        const hasHours = /10:00|18:30/.test(txt);
        if (hasContact || hasMaps || hasHours) li.remove();
      });
    } catch (_) {}
  })();

  // Empathy section: adjust first item wording per request
  (function updateEmpathyWording() {
    try {
      const items = document.querySelectorAll('#empathy .empathy-list li');
      if (!items || !items.length) return;
      items.forEach(li => {
        const t = (li.textContent || '').trim();
        if (t.includes('気分が上がらない')) {
          li.textContent = 'カガミを見るたびに、なんだか気分が上がらない';
        }
        // Update dullness/sagging phrasing to combined wording including pores
        if (t.includes('くすみ') && t.includes('たるみ')) {
          li.textContent = 'お肌のくすみやたるみ、毛穴が目立つ';
        }
        // Update hydration phrasing
        if (t.includes('保湿しても乾燥')) {
          li.textContent = '保湿しても乾燥する';
        }
      });

      // Ensure inclusion of: 忙しくて自分のケアは後回し
      const list = document.querySelector('#empathy .empathy-list');
      if (!list) return;
      const hasBusy = Array.from(list.children).some(li => (li.textContent || '').includes('忙しくて自分のケアは後回し'));
      if (!hasBusy) {
        const target = Array.from(list.children).find(li => (li.textContent || '').includes('毛穴が目立つようになった'))
                    || Array.from(list.children).find(li => (li.textContent || '').includes('毛穴が目立つ'))
                    || list.lastElementChild;
        if (target) target.textContent = '忙しくて自分のケアは後回し';
      }

      // Ensure inclusion of: 年齢だからとあきらめている
      const hasAge = Array.from(list.children).some(li => (li.textContent || '').includes('年齢だからと'));
      if (!hasAge) {
        const li = document.createElement('li');
        li.textContent = '年齢だからとあきらめている';
        list.insertBefore(li, list.firstChild);
      }
    } catch (_) {}
  })();
  // (note) PASONA runtime injection remains removed

  // Gallery: swap requested images and sort by number
  (function updateGalleryImages() {
    try {
      const container = document.querySelector('#gallery .gallery-images');
      if (!container) return;
      const imgs = Array.from(container.querySelectorAll('img'));
      imgs.forEach(img => {
        const src = img.getAttribute('src') || '';
        // only handle cosyama.cherie.esthe.*.png
        const m = src.match(/cosyama\.cherie\.esthe\.(\d+)\.png$/);
        if (!m) return;
        const n = parseInt(m[1], 10);
        if (n === 9) {
          img.setAttribute('src', src.replace('9.png', '17.png'));
        } else if (n === 12) {
          img.setAttribute('src', src.replace('12.png', '22.png'));
        }
      });
      // Reorder by numeric suffix
      const ordered = Array.from(container.querySelectorAll('img')).sort((a, b) => {
        const an = parseInt((a.getAttribute('src') || '').match(/esthe\.(\d+)\.png$/)?.[1] || '0', 10);
        const bn = parseInt((b.getAttribute('src') || '').match(/esthe\.(\d+)\.png$/)?.[1] || '0', 10);
        return an - bn;
      });
      ordered.forEach(img => container.appendChild(img));
    } catch (_) {}
  })();

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
