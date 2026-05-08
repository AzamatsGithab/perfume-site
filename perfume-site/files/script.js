/* =========================================
   LUMIÈRE PARFUM — script.js
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── CUSTOM CURSOR ─────────────────────── */
  const cur = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  if (cur && ring) {
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      cur.style.left = mx + 'px';
      cur.style.top = my + 'px';
    });

    (function trackRing() {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(trackRing);
    })();

    const hoverEls = document.querySelectorAll(
      'a, button, .pcard, .filter-tab, .nav-arrow, .icon-btn, .apply-item'
    );
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cur.classList.add('big');
        ring.classList.add('big');
      });
      el.addEventListener('mouseleave', () => {
        cur.classList.remove('big');
        ring.classList.remove('big');
      });
    });
  }

  /* ─── NAV SCROLL EFFECT ─────────────────── */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ─── HERO PARTICLES ────────────────────── */
  const heroParticles = document.getElementById('heroParticles');
  if (heroParticles) {
    for (let i = 0; i < 24; i++) {
      const p = document.createElement('div');
      p.className = 'hero-particle';
      const size = 2 + Math.random() * 4;
      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${30 + Math.random() * 45}%;
        bottom: ${Math.random() * 70}%;
        --dur: ${6 + Math.random() * 6}s;
        --delay: ${Math.random() * 7}s;
      `;
      heroParticles.appendChild(p);
    }
  }

  /* ─── HERO BOTTLE PARALLAX ──────────────── */
  const heroBottle = document.getElementById('heroBottle');
  const heroSection = document.getElementById('hero');
  if (heroBottle && heroSection) {
    heroSection.addEventListener('mousemove', e => {
      const rect = heroSection.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width - 0.5;
      const cy = (e.clientY - rect.top) / rect.height - 0.5;
      heroBottle.style.transform = `translateY(${cy * -12}px) rotateY(${cx * 6}deg)`;
    });
    heroSection.addEventListener('mouseleave', () => {
      heroBottle.style.transform = '';
    });
  }

  /* ─── CATALOG STRIP ─────────────────────── */
  const strip = document.getElementById('catalogStrip');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const fillBar = document.getElementById('stripFill');

  if (strip && prevBtn && nextBtn) {
    const CARD_W = 300 + 20; // card width + gap
    let offset = 0;
    let totalCards = strip.children.length;
    const visible = () => Math.floor(strip.parentElement.offsetWidth / CARD_W);
    const maxOffset = () => Math.max(0, (totalCards - visible()) * CARD_W);

    const updateStrip = () => {
      strip.style.transform = `translateX(-${offset}px)`;
      const max = maxOffset();
      const pct = max > 0 ? (offset / max) * 75 + 25 : 100;
      if (fillBar) fillBar.style.width = Math.round(pct) + '%';
      prevBtn.disabled = offset <= 0;
      nextBtn.disabled = offset >= max;
    };

    nextBtn.addEventListener('click', () => {
      offset = Math.min(offset + CARD_W, maxOffset());
      updateStrip();
    });

    prevBtn.addEventListener('click', () => {
      offset = Math.max(offset - CARD_W, 0);
      updateStrip();
    });

    // Touch/drag
    let dragStart = null, startOffset = 0;
    strip.addEventListener('mousedown', e => {
      dragStart = e.clientX;
      startOffset = offset;
      strip.style.transition = 'none';
      strip.style.cursor = 'grabbing';
    });
    document.addEventListener('mousemove', e => {
      if (dragStart === null) return;
      const delta = dragStart - e.clientX;
      offset = Math.max(0, Math.min(startOffset + delta, maxOffset()));
      strip.style.transform = `translateX(-${offset}px)`;
    });
    document.addEventListener('mouseup', () => {
      if (dragStart === null) return;
      dragStart = null;
      strip.style.transition = 'transform 0.7s cubic-bezier(0.23, 1, 0.32, 1)';
      strip.style.cursor = '';
      // Snap
      offset = Math.round(offset / CARD_W) * CARD_W;
      offset = Math.max(0, Math.min(offset, maxOffset()));
      updateStrip();
    });

    // Touch events
    let touchStartX = null;
    strip.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
      startOffset = offset;
      strip.style.transition = 'none';
    }, { passive: true });
    strip.addEventListener('touchmove', e => {
      if (touchStartX === null) return;
      const delta = touchStartX - e.touches[0].clientX;
      offset = Math.max(0, Math.min(startOffset + delta, maxOffset()));
      strip.style.transform = `translateX(-${offset}px)`;
    }, { passive: true });
    strip.addEventListener('touchend', () => {
      touchStartX = null;
      strip.style.transition = 'transform 0.7s cubic-bezier(0.23, 1, 0.32, 1)';
      offset = Math.round(offset / CARD_W) * CARD_W;
      offset = Math.max(0, Math.min(offset, maxOffset()));
      updateStrip();
    });

    updateStrip();
    window.addEventListener('resize', () => {
      offset = Math.min(offset, maxOffset());
      updateStrip();
    });
  }

  /* ─── FILTER TABS ───────────────────────── */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.pcard');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;

      // Reset strip position
      if (strip) {
        offset = 0;
        strip.style.transform = 'translateX(0)';
      }

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
          card.style.opacity = '1';
        } else {
          card.style.opacity = '0.3';
          card.style.pointerEvents = 'none';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.pointerEvents = '';
          }, 600);
        }
      });
    });
  });

  /* ─── INGREDIENTS PARALLAX ON HOVER ────── */
  document.querySelectorAll('.pcard').forEach(card => {
    const wrap = card.querySelector('.ingredients-wrap');
    if (!wrap) return;

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width - 0.5;
      const cy = (e.clientY - rect.top) / rect.height - 0.5;
      wrap.querySelectorAll('.ingr').forEach((el, i) => {
        const depth = ((i % 3) + 1) * 10;
        el.style.marginLeft = cx * depth + 'px';
        el.style.marginTop = cy * depth + 'px';
      });
    });

    card.addEventListener('mouseleave', () => {
      wrap.querySelectorAll('.ingr').forEach(el => {
        el.style.marginLeft = '';
        el.style.marginTop = '';
      });
    });
  });

  /* ─── WISHLIST TOGGLE ───────────────────── */
  document.querySelectorAll('.pcard-wish').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      btn.classList.toggle('active');
    });
  });

  /* ─── ADD TO CART ───────────────────────── */
  const cartCount = document.querySelector('.cart-count');
  let count = 0;
  document.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', () => {
      count++;
      if (cartCount) cartCount.textContent = count;
      btn.textContent = 'Добавлено ✓';
      btn.style.color = 'var(--gold)';
      setTimeout(() => {
        btn.textContent = 'В корзину';
        btn.style.color = '';
      }, 1800);
    });
  });

  /* ─── APPLY POINT HIGHLIGHT ─────────────── */
  const applyItems = document.querySelectorAll('.apply-item');
  applyItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const id = item.dataset.point;
      document.querySelectorAll('.app-pt').forEach(pt => {
        if (pt.dataset.id === id) {
          pt.style.r = '12';
          pt.style.opacity = '1';
        } else {
          pt.style.opacity = '0.35';
        }
      });
    });
    item.addEventListener('mouseleave', () => {
      document.querySelectorAll('.app-pt').forEach(pt => {
        pt.style.r = '';
        pt.style.opacity = '0.9';
      });
    });
  });

  /* ─── SCROLL REVEAL ─────────────────────── */
  const revealEls = document.querySelectorAll(
    '.pcard, .apply-item, .footer-col, .stat'
  );

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(28px)';
      el.style.transition = `opacity 0.7s cubic-bezier(0.23,1,0.32,1) ${(i % 4) * 0.1}s, transform 0.7s cubic-bezier(0.23,1,0.32,1) ${(i % 4) * 0.1}s`;
      io.observe(el);
    });
  }

  /* ─── SMOOTH SCROLL FOR NAV LINKS ──────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
