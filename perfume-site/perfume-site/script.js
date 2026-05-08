/* ============================================================
   JAVOKHIR ATTOR — site script
   ============================================================ */

(function () {
    'use strict';

    /* --------------------------------------------------------
       1. STICKY NAV
    -------------------------------------------------------- */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    /* --------------------------------------------------------
       2. PARTICLE CANVAS
    -------------------------------------------------------- */
    const canvas = document.getElementById('particleCanvas');
    const ctx    = canvas.getContext('2d');
    let particles = [], animFrame;

    function resizeCanvas() {
        const par = canvas.parentElement;
        canvas.width  = par.offsetWidth;
        canvas.height = par.offsetHeight;
    }

    class Particle {
        constructor() { this.init(true); }
        init(randomY) {
            this.x  = Math.random() * canvas.width;
            this.y  = randomY ? Math.random() * canvas.height : canvas.height + 4;
            this.r  = Math.random() * 1.8 + 0.4;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = -(Math.random() * 0.5 + 0.2);
            this.a  = Math.random() * 0.55 + 0.1;
            this.da = (Math.random() - 0.5) * 0.008;
            const hue = Math.random() * 24 + 38;
            this.col = `hsla(${hue},72%,62%,1)`;
        }
        update() {
            this.x += this.vx; this.y += this.vy; this.a += this.da;
            if (this.a > 0.65) this.da = -Math.abs(this.da);
            if (this.a < 0.06) this.da =  Math.abs(this.da);
            if (this.y < -6 || this.x < -6 || this.x > canvas.width + 6) this.init(false);
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.a;
            ctx.fillStyle   = this.col;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    function initParticles(n) { particles = []; for (let i = 0; i < n; i++) particles.push(new Particle()); }
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        animFrame = requestAnimationFrame(animateParticles);
    }
    function setupCanvas() { resizeCanvas(); initParticles(55); cancelAnimationFrame(animFrame); animateParticles(); }

    setupCanvas();
    window.addEventListener('resize', () => { resizeCanvas(); initParticles(55); }, { passive: true });

    /* --------------------------------------------------------
       2b. PARTICLE CANVAS — star-field mode for dark hero
    -------------------------------------------------------- */
    /* Override particle colours to white/gold stars on dark bg */
    Particle.prototype._origInit = Particle.prototype.init;
    Particle.prototype.init = function(randomY) {
        this._origInit(randomY);
        this.r  = Math.random() * 1.1 + 0.15;
        this.vx = (Math.random() - 0.5) * 0.12;
        this.vy = -(Math.random() * 0.18 + 0.03);
        this.a  = Math.random() * 0.55 + 0.04;
        this.da = (Math.random() - 0.5) * 0.004;
        const gold = Math.random() < 0.18;
        this.col = gold ? 'rgba(201,168,76,1)' : 'rgba(255,255,255,1)';
    };
    initParticles(70); /* reinit with new look */

    /* --------------------------------------------------------
       3. HERO SHOWCASE — dark cinematic, orbiting ingredients
    -------------------------------------------------------- */

    /* ── Dark backgrounds per theme ───────────────────────── */
    const DARK_BG = {
        gold:  'linear-gradient(135deg, #130B00 0%, #221000 40%, #160800 70%, #0A0500 100%)',
        rose:  'linear-gradient(135deg, #0E0008 0%, #1E0015 40%, #130010 70%, #080005 100%)',
        green: 'linear-gradient(135deg, #00100A 0%, #001F12 40%, #001509 70%, #000805 100%)',
    };
    const GLOW_COLOR = {
        gold:  'radial-gradient(circle at 50% 50%, rgba(201,168,76,0.20) 0%, transparent 65%)',
        rose:  'radial-gradient(circle at 50% 50%, rgba(224,122,146,0.20) 0%, transparent 65%)',
        green: 'radial-gradient(circle at 50% 50%, rgba(46,125,82,0.20)  0%, transparent 65%)',
    };

    /* ── Ingredient SVG factory (inline, unique IDs per call) ─ */
    let _oid = 0;
    const ORB = {
        orange: (s, u) => `<svg width="${s}" height="${s}" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="oo${u}" cx="44%" cy="38%" r="60%"><stop offset="0%" stop-color="#FFE566"/><stop offset="42%" stop-color="#FF9020"/><stop offset="100%" stop-color="#D44500"/></radialGradient></defs><circle cx="35" cy="35" r="33" fill="#CC5200"/><circle cx="35" cy="35" r="30" fill="rgba(255,255,255,0.95)"/><circle cx="35" cy="35" r="27" fill="url(#oo${u})"/><line x1="35" y1="35" x2="35" y2="8" stroke="rgba(255,255,255,0.82)" stroke-width="1.4"/><line x1="35" y1="35" x2="54.1" y2="15.9" stroke="rgba(255,255,255,0.82)" stroke-width="1.4"/><line x1="35" y1="35" x2="62" y2="35" stroke="rgba(255,255,255,0.82)" stroke-width="1.4"/><line x1="35" y1="35" x2="54.1" y2="54.1" stroke="rgba(255,255,255,0.82)" stroke-width="1.4"/><line x1="35" y1="35" x2="35" y2="62" stroke="rgba(255,255,255,0.82)" stroke-width="1.4"/><line x1="35" y1="35" x2="15.9" y2="54.1" stroke="rgba(255,255,255,0.82)" stroke-width="1.4"/><line x1="35" y1="35" x2="8" y2="35" stroke="rgba(255,255,255,0.82)" stroke-width="1.4"/><line x1="35" y1="35" x2="15.9" y2="15.9" stroke="rgba(255,255,255,0.82)" stroke-width="1.4"/><circle cx="35" cy="35" r="6" fill="#FFB830" stroke="rgba(255,255,255,0.8)" stroke-width="1.1"/><circle cx="35" cy="35" r="3" fill="#FFE070"/><ellipse cx="24" cy="21" rx="8" ry="5" fill="rgba(255,255,255,0.38)" transform="rotate(-35 24 21)"/></svg>`,

        lemon:  (s, u) => `<svg width="${s}" height="${s}" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="ol${u}" cx="40%" cy="33%" r="65%"><stop offset="0%" stop-color="#FFFAAA"/><stop offset="45%" stop-color="#FFD800"/><stop offset="100%" stop-color="#C89000"/></radialGradient></defs><path d="M8 35 C8 18 20 5 35 5 C50 5 62 18 62 35 C62 52 50 65 35 65 C20 65 8 52 8 35 Z" fill="#B88800"/><path d="M9.5 35 C9.5 19.5 21 7 35 7 C49 7 60.5 19.5 60.5 35 C60.5 50.5 49 63 35 63 C21 63 9.5 50.5 9.5 35 Z" fill="url(#ol${u})"/><ellipse cx="6" cy="35" rx="4" ry="5" fill="#FFDA30"/><ellipse cx="64" cy="35" rx="4" ry="5" fill="#FFDA30"/><circle cx="23" cy="28" r="1.3" fill="rgba(150,100,0,0.25)"/><circle cx="43" cy="25" r="1.4" fill="rgba(150,100,0,0.25)"/><circle cx="46" cy="43" r="1.4" fill="rgba(150,100,0,0.25)"/><ellipse cx="22" cy="20" rx="11" ry="6" fill="rgba(255,255,255,0.42)" transform="rotate(-25 22 20)"/></svg>`,

        rose:   (s, u) => `<svg width="${s}" height="${s}" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="or${u}" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#FFB0C8"/><stop offset="100%" stop-color="#A80828"/></radialGradient></defs><ellipse cx="35" cy="16" rx="10" ry="15" fill="#9A0820"/><ellipse cx="58" cy="30" rx="10" ry="15" fill="#9A0820" transform="rotate(72 58 30)"/><ellipse cx="50" cy="58" rx="10" ry="15" fill="#9A0820" transform="rotate(144 50 58)"/><ellipse cx="20" cy="58" rx="10" ry="15" fill="#9A0820" transform="rotate(216 20 58)"/><ellipse cx="12" cy="30" rx="10" ry="15" fill="#9A0820" transform="rotate(288 12 30)"/><ellipse cx="35" cy="19" rx="9" ry="13" fill="#C41040"/><ellipse cx="54" cy="28" rx="9" ry="13" fill="#C41040" transform="rotate(72 54 28)"/><ellipse cx="47" cy="54" rx="9" ry="13" fill="#C41040" transform="rotate(144 47 54)"/><ellipse cx="23" cy="54" rx="9" ry="13" fill="#C41040" transform="rotate(216 23 54)"/><ellipse cx="16" cy="28" rx="9" ry="13" fill="#C41040" transform="rotate(288 16 28)"/><circle cx="35" cy="35" r="18" fill="url(#or${u})"/><circle cx="35" cy="35" r="10" fill="#FFAAC0"/><circle cx="35" cy="34" r="6" fill="#FFD0DC"/><circle cx="35" cy="33" r="3" fill="#FFECF0"/></svg>`,

        jasmine:(s, u) => `<svg width="${s}" height="${s}" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="oj${u}" cx="35%" cy="30%" r="65%"><stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#EDE0D8"/></radialGradient><radialGradient id="ojc${u}" cx="50%" cy="45%" r="55%"><stop offset="0%" stop-color="#FFE840"/><stop offset="100%" stop-color="#D4A800"/></radialGradient></defs><ellipse cx="35" cy="12" rx="8" ry="13" fill="url(#oj${u})" stroke="rgba(180,160,140,0.4)" stroke-width="0.6"/><ellipse cx="56" cy="27" rx="8" ry="13" fill="url(#oj${u})" stroke="rgba(180,160,140,0.4)" stroke-width="0.6" transform="rotate(72 56 27)"/><ellipse cx="48" cy="55" rx="8" ry="13" fill="url(#oj${u})" stroke="rgba(180,160,140,0.4)" stroke-width="0.6" transform="rotate(144 48 55)"/><ellipse cx="22" cy="55" rx="8" ry="13" fill="url(#oj${u})" stroke="rgba(180,160,140,0.4)" stroke-width="0.6" transform="rotate(216 22 55)"/><ellipse cx="14" cy="27" rx="8" ry="13" fill="url(#oj${u})" stroke="rgba(180,160,140,0.4)" stroke-width="0.6" transform="rotate(288 14 27)"/><circle cx="35" cy="35" r="9" fill="url(#ojc${u})"/><circle cx="35" cy="35" r="5" fill="#FFE840"/><circle cx="32" cy="32" r="1.4" fill="#88700A"/><circle cx="38" cy="32" r="1.4" fill="#88700A"/><circle cx="35" cy="30" r="1.4" fill="#88700A"/></svg>`,

        leaf:   (s, u) => `<svg width="${s}" height="${s}" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="olf${u}" x1="25%" y1="5%" x2="75%" y2="95%"><stop offset="0%" stop-color="#A8D860"/><stop offset="45%" stop-color="#3A9430"/><stop offset="100%" stop-color="#1A5C18"/></linearGradient></defs><path d="M35 8 C48 8 62 20 62 38 C62 54 50 62 35 64 C35 64 12 52 12 35 C12 18 22 8 35 8 Z" fill="#154A12" opacity="0.35" transform="translate(2 2)"/><path d="M35 8 C48 8 62 20 62 38 C62 54 50 62 35 64 C35 64 12 52 12 35 C12 18 22 8 35 8 Z" fill="url(#olf${u})"/><path d="M35 10 C35 35 35 55 35 63" stroke="rgba(255,255,255,0.5)" stroke-width="1.5" fill="none"/><path d="M35 22 C28 28 18 30 14 34" stroke="rgba(255,255,255,0.32)" stroke-width="0.9" fill="none"/><path d="M35 32 C28 36 19 37 15 40" stroke="rgba(255,255,255,0.32)" stroke-width="0.9" fill="none"/><path d="M35 22 C42 28 52 30 56 34" stroke="rgba(255,255,255,0.32)" stroke-width="0.9" fill="none"/><path d="M35 32 C42 36 51 37 55 40" stroke="rgba(255,255,255,0.32)" stroke-width="0.9" fill="none"/></svg>`,

        cedar:  (s, u) => `<svg width="${s}" height="${s}" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="ocd${u}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#D4AA70"/><stop offset="50%" stop-color="#A0643A"/><stop offset="100%" stop-color="#6B3E20"/></linearGradient></defs><rect x="10" y="18" width="50" height="34" rx="4" fill="#6B3E20" stroke="#4A2812" stroke-width="1.2"/><rect x="11.5" y="19.5" width="47" height="31" rx="3" fill="url(#ocd${u})"/><line x1="13" y1="26" x2="57" y2="26" stroke="rgba(80,40,15,0.35)" stroke-width="1"/><line x1="13" y1="30" x2="57" y2="30" stroke="rgba(80,40,15,0.3)" stroke-width="0.8"/><line x1="13" y1="34" x2="57" y2="34" stroke="rgba(80,40,15,0.35)" stroke-width="1"/><line x1="13" y1="38" x2="57" y2="38" stroke="rgba(80,40,15,0.3)" stroke-width="0.8"/><line x1="13" y1="42" x2="57" y2="42" stroke="rgba(80,40,15,0.35)" stroke-width="1"/><ellipse cx="40" cy="35" rx="8" ry="6" fill="none" stroke="rgba(80,40,15,0.25)" stroke-width="1"/><ellipse cx="24" cy="26" rx="8" ry="4" fill="rgba(255,230,200,0.3)" transform="rotate(-10 24 26)"/></svg>`,

        amber:  (s, u) => `<svg width="${s}" height="${s}" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="oam${u}" cx="40%" cy="35%" r="62%"><stop offset="0%" stop-color="#FFE880"/><stop offset="42%" stop-color="#D4A030"/><stop offset="100%" stop-color="#8A5010"/></radialGradient></defs><path d="M35 8 C48 8 60 18 62 32 C64 46 58 58 46 62 C38 65 26 63 18 56 C10 49 8 38 12 26 C16 14 22 8 35 8 Z" fill="#7A4808"/><path d="M35 10 C47 10 58 19 60 32 C62 45 56 56 45 60 C37 63 26 61 19 54 C12 47 10 37 14 26 C18 15 23 10 35 10 Z" fill="url(#oam${u})"/><path d="M35 10 L48 24 L54 40" stroke="rgba(255,220,100,0.4)" stroke-width="1" fill="none"/><path d="M35 10 L22 22 L14 36" stroke="rgba(255,220,100,0.35)" stroke-width="1" fill="none"/><ellipse cx="26" cy="22" rx="9" ry="6" fill="rgba(255,255,230,0.45)" transform="rotate(-30 26 22)"/></svg>`,

        herb:   (s, u) => `<svg width="${s}" height="${s}" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="oh${u}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#90D050"/><stop offset="100%" stop-color="#2A6A10"/></linearGradient></defs><path d="M35 62 C35 40 33 25 32 10" stroke="#3A7818" stroke-width="2.5" fill="none" stroke-linecap="round"/><ellipse cx="28" cy="15" rx="8" ry="4.5" fill="url(#oh${u})" transform="rotate(-35 28 15)"/><ellipse cx="38" cy="13" rx="8" ry="4.5" fill="url(#oh${u})" transform="rotate(30 38 13)"/><ellipse cx="25" cy="26" rx="9" ry="5" fill="url(#oh${u})" transform="rotate(-40 25 26)"/><ellipse cx="41" cy="24" rx="9" ry="5" fill="url(#oh${u})" transform="rotate(35 41 24)"/><ellipse cx="23" cy="38" rx="10" ry="5.5" fill="url(#oh${u})" transform="rotate(-38 23 38)"/><ellipse cx="44" cy="36" rx="10" ry="5.5" fill="url(#oh${u})" transform="rotate(33 44 36)"/><ellipse cx="31" cy="8" rx="4" ry="6" fill="#5AAA28" transform="rotate(-5 31 8)"/></svg>`,

        water:  (s, u) => `<svg width="${s}" height="${s}" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="ow${u}" x1="30%" y1="0%" x2="70%" y2="100%"><stop offset="0%" stop-color="#A8E0FF"/><stop offset="45%" stop-color="#3090E0"/><stop offset="100%" stop-color="#0050B0"/></linearGradient><radialGradient id="owh${u}" cx="38%" cy="28%" r="45%"><stop offset="0%" stop-color="rgba(255,255,255,0.88)"/><stop offset="100%" stop-color="rgba(255,255,255,0)"/></radialGradient></defs><path d="M35 6 C35 6 14 30 14 46 C14 57.6 23.4 67 35 67 C46.6 67 56 57.6 56 46 C56 30 35 6 35 6 Z" fill="url(#ow${u})"/><path d="M35 6 C35 6 14 30 14 46 C14 57.6 23.4 67 35 67 C46.6 67 56 57.6 56 46 C56 30 35 6 35 6 Z" fill="url(#owh${u})"/><ellipse cx="27" cy="30" rx="7" ry="12" fill="rgba(255,255,255,0.5)" transform="rotate(-12 27 30)"/></svg>`,
    };

    /* ── Orbit configurations per theme ───────────────────── */
    const ORBIT_SETS = {
        gold:  [
            { key:'orange', size:62, rx:215, ry:88,  speed: 0.0080, phase:0.00, sr: 0.50 },
            { key:'lemon',  size:52, rx:252, ry:100, speed:-0.0062, phase:1.57, sr:-0.32 },
            { key:'amber',  size:58, rx:192, ry:80,  speed: 0.0104, phase:3.14, sr: 0.44 },
            { key:'herb',   size:48, rx:238, ry:94,  speed:-0.0072, phase:4.71, sr: 0.60 },
        ],
        rose:  [
            { key:'rose',    size:66, rx:212, ry:90,  speed: 0.0072, phase:0.50, sr: 0.40 },
            { key:'jasmine', size:54, rx:250, ry:102, speed:-0.0090, phase:2.20, sr:-0.50 },
            { key:'leaf',    size:58, rx:194, ry:82,  speed: 0.0112, phase:3.80, sr: 0.32 },
            { key:'water',   size:48, rx:234, ry:96,  speed:-0.0060, phase:5.10, sr: 0.70 },
        ],
        green: [
            { key:'cedar',  size:64, rx:218, ry:88,  speed: 0.0062, phase:0.80, sr: 0.30 },
            { key:'leaf',   size:62, rx:248, ry:104, speed:-0.0080, phase:2.60, sr:-0.42 },
            { key:'herb',   size:54, rx:202, ry:84,  speed: 0.0100, phase:4.20, sr: 0.52 },
            { key:'water',  size:48, rx:230, ry:96,  speed:-0.0072, phase:5.80, sr: 0.30 },
        ],
    };

    /* ── Live orbit state ──────────────────────────────────── */
    let orbitState   = [];  /* { el, rx, ry, speed, angle, selfRot, selfRotSpeed } */
    let orbitRafId   = null;
    let orbitRunning = false;

    /* Base orbit parameters reused by both SVG and real-image paths */
    const BASE_ORBITS = [
        { rx:215, ry:88,  speed: 0.0080, phase:0.00, sr: 0.50 },
        { rx:252, ry:100, speed:-0.0062, phase:1.57, sr:-0.32 },
        { rx:192, ry:80,  speed: 0.0104, phase:3.14, sr: 0.44 },
        { rx:238, ry:94,  speed:-0.0072, phase:4.71, sr: 0.60 },
        { rx:228, ry:90,  speed: 0.0088, phase:2.36, sr:-0.48 },
        { rx:245, ry:96,  speed:-0.0055, phase:5.50, sr: 0.30 },
    ];

    function _addOrbitEl(el, cfg, angleOverride) {
        orbitState.push({
            el,
            rx: cfg.rx, ry: cfg.ry,
            speed: cfg.speed,
            angle: (angleOverride !== undefined) ? angleOverride : cfg.phase,
            selfRot: Math.random() * 360,
            selfRotSpeed: cfg.sr,
        });
        requestAnimationFrame(() => {
            el.style.transition = 'opacity 0.7s ease';
            el.style.opacity    = '1';
        });
    }

    /* SVG ingredient path (original behaviour) */
    function _buildSVGOrbits(theme, wrap) {
        const cfgs = ORBIT_SETS[theme] || ORBIT_SETS.gold;
        cfgs.forEach(cfg => {
            const uid = ++_oid;
            const el  = document.createElement('div');
            el.className = 'hs-orb-item';
            el.style.cssText = `width:${cfg.size}px;height:${cfg.size}px;margin-left:-${cfg.size/2}px;margin-top:-${cfg.size/2}px;opacity:0;`;
            el.innerHTML = `<div class="hs-orb-inner">${ORB[cfg.key](cfg.size, uid)}</div>`;
            wrap.appendChild(el);
            _addOrbitEl(el, cfg);
        });
    }

    /* Real ingredient image path */
    function _buildRealOrbits(ingredients, wrap) {
        const SIZE = 64;
        const count = ingredients.length;
        ingredients.forEach((ing, i) => {
            const cfg   = BASE_ORBITS[i % BASE_ORBITS.length];
            /* spread evenly around the ellipse regardless of BASE_ORBITS phases */
            const angle = (i / count) * Math.PI * 2;
            const el    = document.createElement('div');
            el.className = 'hs-orb-item';
            /* extra height for the label below the circle */
            const h = ing.label ? SIZE + 22 : SIZE;
            el.style.cssText = `width:${SIZE}px;height:${h}px;margin-left:-${SIZE/2}px;margin-top:-${h/2}px;opacity:0;`;
            el.innerHTML = `<div class="hs-orb-inner hs-orb-real">
                <img src="${ing.imageUrl}" alt="${ing.label || ''}" class="hs-orb-img" loading="lazy">
                ${ing.label ? `<span class="hs-orb-label">${ing.label}</span>` : ''}
            </div>`;
            wrap.appendChild(el);
            _addOrbitEl(el, { ...cfg, sr: cfg.sr * 0.2 }, angle);
        });
    }

    function buildOrbitItems(theme, product) {
        const wrap = document.getElementById('hsOrbitWrap');
        if (!wrap) return;
        wrap.innerHTML = '';
        orbitState = [];

        /* Use real images when the product has at least one ingredient with an imageUrl */
        const realIngs = product && Array.isArray(product.ingredients)
            ? product.ingredients.filter(i => i && i.imageUrl)
            : [];

        if (realIngs.length > 0) {
            _buildRealOrbits(realIngs, wrap);
        } else {
            _buildSVGOrbits(theme, wrap);
        }
    }

    function tickOrbits() {
        orbitState.forEach(s => {
            s.angle   += s.speed;
            s.selfRot += s.selfRotSpeed;
            const x = Math.cos(s.angle) * s.rx;
            const y = Math.sin(s.angle) * s.ry;
            s.el.style.transform = `translate(${x}px,${y}px) rotate(${s.selfRot}deg)`;
        });
        if (orbitRunning) orbitRafId = requestAnimationFrame(tickOrbits);
    }

    function startOrbits() {
        orbitRunning = true;
        cancelAnimationFrame(orbitRafId);
        orbitRafId = requestAnimationFrame(tickOrbits);
    }
    function stopOrbits() { orbitRunning = false; cancelAnimationFrame(orbitRafId); }

    function fadeOutOrbits() {
        orbitState.forEach(s => { s.el.style.transition = 'opacity 0.28s ease'; s.el.style.opacity = '0'; });
    }

    /* ── Bottle SVG factory (hero size) ────────────────────── */
    const HS_C = {
        gold:  { g1:'#FBF0CF', g2:'#D4AF37', cap:'#C9A84C', tc:'#7A5E10', sc:'#C9A84C', lc:'#D4AF37', lbl:'OMBRE DORÉE' },
        rose:  { g1:'#FEF0F3', g2:'#F0A0B4', cap:'#E07A92', tc:'#8C3050', sc:'#E07A92', lc:'#E07A92', lbl:'ROSE ÉTERNELLE' },
        green: { g1:'#D8F0E4', g2:'#4A9C68', cap:'#2E7D52', tc:'#1A4D33', sc:'#4A9C68', lc:'#2E7D52', lbl:'FORÊT VERTE' },
    };
    function hsBottleSVG(theme, uid) {
        const c = HS_C[theme] || HS_C.gold, d = `hb${uid}`;
        return `<svg class="hs-bottle-svg" viewBox="0 0 200 380" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="${d}a" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${c.g1}" stop-opacity=".93"/><stop offset="55%" stop-color="${c.g2}" stop-opacity=".85"/><stop offset="100%" stop-color="${c.cap}" stop-opacity=".75"/></linearGradient><linearGradient id="${d}b" x1="20%" y1="0%" x2="80%" y2="100%"><stop offset="0%" stop-color="${c.g1}" stop-opacity=".95"/><stop offset="100%" stop-color="${c.g2}" stop-opacity=".80"/></linearGradient><filter id="${d}f" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect x="76" y="8" width="48" height="32" rx="6" fill="url(#${d}a)"/><rect x="81" y="38" width="38" height="14" rx="2" fill="${c.cap}" opacity=".85"/><rect x="86" y="51" width="28" height="42" rx="3" fill="url(#${d}a)"/><rect x="68" y="91" width="64" height="9" rx="2" fill="${c.cap}" opacity=".90"/><rect x="44" y="99" width="112" height="224" rx="14" fill="url(#${d}b)" stroke="${c.cap}" stroke-width="1.5" filter="url(#${d}f)"/><rect x="58" y="112" width="5" height="195" rx="3" fill="rgba(255,255,255,0.45)"/><rect x="68" y="108" width="2" height="200" rx="1" fill="rgba(255,255,255,0.2)"/><rect x="60" y="158" width="80" height="68" rx="4" fill="rgba(255,255,255,0.88)"/><line x1="68" y1="166" x2="132" y2="166" stroke="${c.lc}" stroke-width="0.5"/><text x="100" y="181" text-anchor="middle" font-family="Cormorant Garamond,serif" font-size="10" fill="${c.tc}" font-style="italic" font-weight="500">JAVOKHIR</text><text x="100" y="195" text-anchor="middle" font-family="Jost,sans-serif" font-size="6.5" fill="${c.sc}" letter-spacing="4">ATTOR</text><line x1="68" y1="202" x2="132" y2="202" stroke="${c.lc}" stroke-width="0.5"/><text x="100" y="213" text-anchor="middle" font-family="Jost,sans-serif" font-size="5.5" fill="${c.tc}" letter-spacing="2">${c.lbl}</text><rect x="44" y="318" width="112" height="8" rx="5" fill="${c.cap}" opacity=".4"/></svg>`;
    }

    /* ── Showcase state ────────────────────────────────────── */
    let hsProducts = [], hsCurrent = 0, hsTimer;
    let hsTransitioning = false;
    const hsBotWrap = document.getElementById('hsBottleWrap');
    const hsBg      = document.getElementById('hsBg');
    const hsGlow    = document.getElementById('hsGlow');

    /* ── Progress bar ──────────────────────────────────────── */
    const ADVANCE_MS = 5000;
    let progressStart = 0, progressRaf;
    function tickProgress() {
        const fill = document.getElementById('hsProgressFill');
        if (!fill) return;
        const elapsed = Date.now() - progressStart;
        const pct = Math.min((elapsed / ADVANCE_MS) * 100, 100);
        fill.style.width = pct + '%';
        if (pct < 100) progressRaf = requestAnimationFrame(tickProgress);
    }
    function startProgress() {
        cancelAnimationFrame(progressRaf);
        progressStart = Date.now();
        const fill = document.getElementById('hsProgressFill');
        if (fill) fill.style.width = '0%';
        progressRaf = requestAnimationFrame(tickProgress);
    }
    function stopProgress() { cancelAnimationFrame(progressRaf); }

    /* ── Colour helpers ────────────────────────────────────────
       Convert a hex colour (#rrggbb) to an rgb triplet array.     */
    function hexToRgb(hex) {
        const h = hex.replace('#', '');
        return [
            parseInt(h.slice(0,2), 16),
            parseInt(h.slice(2,4), 16),
            parseInt(h.slice(4,6), 16),
        ];
    }

    /* Build a subtle dark linear-gradient from the admin-chosen base colour. */
    function buildHeroBg(hex) {
        const [r,g,b] = hexToRgb(hex);
        const mid  = `rgb(${Math.min(r+18,255)},${Math.min(g+18,255)},${Math.min(b+18,255)})`;
        const dark = `rgb(${Math.max(r-6,0)},${Math.max(g-6,0)},${Math.max(b-6,0)})`;
        return `linear-gradient(135deg, ${hex} 0%, ${mid} 40%, ${hex} 70%, ${dark} 100%)`;
    }

    /* Build a radial glow from the admin-chosen halo colour at 22% opacity. */
    function buildHeroGlow(hex) {
        const [r,g,b] = hexToRgb(hex);
        return `radial-gradient(circle at 50% 50%, rgba(${r},${g},${b},0.22) 0%, transparent 65%)`;
    }

    /* ── Update scene info (text + bg + glow) ──────────────── */
    function updateHSScene(p, animate) {
        const name  = formatName(p.name);
        const theme = p.theme || 'gold';

        /* Background — product-specific colour wins; theme preset is fallback */
        if (hsBg) {
            hsBg.style.background = p.heroBackground
                ? buildHeroBg(p.heroBackground)
                : DARK_BG[theme] || DARK_BG.gold;
        }
        /* Glow halo — product-specific halo colour wins */
        if (hsGlow) {
            hsGlow.style.background = p.heroGlowColor
                ? buildHeroGlow(p.heroGlowColor)
                : GLOW_COLOR[theme] || GLOW_COLOR.gold;
        }

        /* Fade text then swap */
        const fadeEls = ['hsName','hsPrice'].map(id => document.getElementById(id));
        if (animate) fadeEls.forEach(el => el && el.classList.add('hs-fade-text'));

        setTimeout(() => {
            const elName  = document.getElementById('hsName');
            const elBrand = document.getElementById('hsBrand');
            const elDesc  = document.getElementById('hsDesc');
            const elPrice = document.getElementById('hsPrice');
            const elVol   = document.getElementById('hsVol');
            const elNotes = document.getElementById('hsNoteList');

            if (elName)  elName.textContent  = name;
            if (elBrand) elBrand.textContent = p.brand || 'Javokhir Attor';
            if (elDesc)  elDesc.textContent  = p.description || '';
            if (elPrice) elPrice.textContent = `$${p.price}`;
            if (elVol)   elVol.textContent   = `${p.volume || 50}ml`;

            if (elNotes && p.notes) {
                const notes = p.notes.split(',').map(n => n.trim()).filter(Boolean).slice(0, 5);
                elNotes.innerHTML = notes.map((n, i) =>
                    `<div class="hs-note-item" style="transition-delay:${i * 0.055}s">${n}</div>`
                ).join('');
            }

            fadeEls.forEach(el => el && el.classList.remove('hs-fade-text'));
        }, animate ? 270 : 0);
    }

    /* ── Go to slide ───────────────────────────────────────── */
    function goToHS(rawIdx, animate) {
        if (hsTransitioning && animate !== false) return;
        animate = animate !== false;
        hsTransitioning = animate;

        hsCurrent = ((rawIdx % hsProducts.length) + hsProducts.length) % hsProducts.length;
        const p = hsProducts[hsCurrent];

        /* Sync dots */
        document.querySelectorAll('.hs-dot').forEach((d, i) => d.classList.toggle('active', i === hsCurrent));

        if (!animate) {
            updateHSScene(p, false);
            if (hsBotWrap) hsBotWrap.innerHTML = p.image
                ? `<img class="hs-bottle-img" src="${p.image}" alt="${formatName(p.name)}" loading="lazy">`
                : hsBottleSVG(p.theme || 'gold', p.id);
            buildOrbitItems(p.theme || 'gold', p);
            startOrbits();
            hsTransitioning = false;
            return;
        }

        /* ── Cinematic transition ── */
        fadeOutOrbits();
        updateHSScene(p, true);

        if (!hsBotWrap) { hsTransitioning = false; return; }

        /* Exit current bottle right */
        hsBotWrap.classList.add('hs-exit');
        hsBotWrap.addEventListener('animationend', () => {
            hsBotWrap.classList.remove('hs-exit');

            /* Swap content */
            hsBotWrap.innerHTML = p.image
                ? `<img class="hs-bottle-img" src="${p.image}" alt="${formatName(p.name)}" loading="lazy">`
                : hsBottleSVG(p.theme || 'gold', p.id);

            /* Enter from left */
            hsBotWrap.classList.add('hs-enter');
            hsBotWrap.addEventListener('animationend', () => {
                hsBotWrap.classList.remove('hs-enter');
                hsTransitioning = false;

                /* Spawn new orbiting ingredients */
                buildOrbitItems(p.theme || 'gold', p);
                startOrbits();
            }, { once: true });

        }, { once: true });
    }

    /* ── Render showcase from product array ─────────────────── */
    function renderHeroShowcase(products) {
        hsProducts = products;
        if (!products.length) return;

        const dotsEl = document.getElementById('hsNavDots');
        if (dotsEl) {
            dotsEl.innerHTML = products.map((p, i) =>
                `<button class="hs-dot${i === 0 ? ' active' : ''}" data-idx="${i}" aria-label="${formatName(p.name)}"></button>`
            ).join('');
            dotsEl.querySelectorAll('.hs-dot').forEach(btn => {
                btn.addEventListener('click', () => { goToHS(+btn.dataset.idx); resetHSTimer(); });
            });
        }

        document.getElementById('hsBuy') && document.getElementById('hsBuy').addEventListener('click', () => {
            const btn = document.getElementById('hsBuy');
            const orig = btn.textContent;
            btn.textContent = 'Added ✓';
            btn.style.background = 'rgba(46,125,82,0.2)';
            btn.style.borderColor = '#2E7D52';
            setTimeout(() => { btn.textContent = orig; btn.style.background = ''; btn.style.borderColor = ''; }, 1800);
        });

        goToHS(0, false);
        resetHSTimer();
        startProgress();

        const heroEl = document.getElementById('hero');
        if (heroEl) {
            heroEl.addEventListener('mouseenter', () => { stopProgress(); clearInterval(hsTimer); });
            heroEl.addEventListener('mouseleave', () => { resetHSTimer(); startProgress(); });
        }
    }

    function resetHSTimer() {
        clearInterval(hsTimer);
        if (hsProducts.length > 1) {
            hsTimer = setInterval(() => { goToHS(hsCurrent + 1); startProgress(); }, ADVANCE_MS);
        }
    }
    /* --------------------------------------------------------
       4. PARALLAX
    -------------------------------------------------------- */
    const hsStage    = document.querySelector('.hs-stage');
    const aboutStats = document.querySelector('.about-stats');

    window.addEventListener('scroll', () => {
        const sy = window.scrollY;
        if (hsStage && sy < window.innerHeight * 1.2)
            hsStage.style.transform = `translateY(${sy * 0.08}px)`;
        if (aboutStats) {
            const rect = aboutStats.getBoundingClientRect();
            const mid  = rect.top + rect.height / 2 - window.innerHeight / 2;
            aboutStats.style.transform = `translateY(${mid * -0.05}px)`;
        }
    }, { passive: true });

    /* --------------------------------------------------------
       5. SCROLL REVEAL
    -------------------------------------------------------- */
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    function observeReveal(root) {
        if (root.classList && root.classList.contains('reveal')) revealObs.observe(root);
        if (root.querySelectorAll) root.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
    }
    document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

    /* --------------------------------------------------------
       6. CATALOG DRAG SCROLL + ARROWS
    -------------------------------------------------------- */
    const viewport = document.getElementById('catalogViewport');
    const btnPrev  = document.getElementById('catPrev');
    const btnNext  = document.getElementById('catNext');

    if (viewport) {
        const SCROLL_STEP = 420;
        btnPrev && btnPrev.addEventListener('click', () => viewport.scrollBy({ left: -SCROLL_STEP, behavior: 'smooth' }));
        btnNext && btnNext.addEventListener('click', () => viewport.scrollBy({ left:  SCROLL_STEP, behavior: 'smooth' }));

        let isDragging = false, startX = 0, startScroll = 0;
        viewport.addEventListener('mousedown', e => {
            isDragging = true; startX = e.pageX - viewport.offsetLeft;
            startScroll = viewport.scrollLeft; viewport.classList.add('dragging');
        });
        viewport.addEventListener('mousemove', e => {
            if (!isDragging) return; e.preventDefault();
            viewport.scrollLeft = startScroll - (e.pageX - viewport.offsetLeft - startX) * 1.2;
        });
        ['mouseup', 'mouseleave'].forEach(ev =>
            viewport.addEventListener(ev, () => { isDragging = false; viewport.classList.remove('dragging'); }));
    }

    /* --------------------------------------------------------
       7. SMOOTH ANCHOR LINKS
    -------------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const id = a.getAttribute('href').slice(1);
            if (!id) return;
            const target = document.getElementById(id);
            if (!target) return;
            e.preventDefault();
            const offset = navbar ? navbar.offsetHeight + 16 : 80;
            window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
        });
    });

    /* --------------------------------------------------------
       8. PRODUCT CATALOG — dynamic loading from /api/products
    -------------------------------------------------------- */

    /* Convert a slug-style name to display name: "louis-vuitton-symphony" → "Louis Vuitton Symphony" */
    function formatName(raw) {
        if (!raw) return '';
        if (raw.includes('-') && !/\s/.test(raw)) {
            return raw.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        }
        return raw;
    }

    /* Build note pill tags */
    function mkNotePills(notesStr) {
        if (!notesStr) return '';
        return notesStr.split(',')
            .map(n => n.trim()).filter(Boolean)
            .map(n => `<span class="note-pill">${n}</span>`)
            .join('');
    }

    /* Themed card bottle SVGs */
    const THEMES = {
        gold:  { g1:'#FBF0CF', g2:'#D4AF37', cap:'#C9A84C', tc:'#7A5E10', sc:'#C9A84C', lc:'#D4AF37', lbl:'OMBRE DORÉE' },
        rose:  { g1:'#FEF0F3', g2:'#F0A0B4', cap:'#E07A92', tc:'#8C3050', sc:'#E07A92', lc:'#E07A92', lbl:'ROSE' },
        green: { g1:'#D8F0E4', g2:'#4A9C68', cap:'#2E7D52', tc:'#1A4D33', sc:'#4A9C68', lc:'#2E7D52', lbl:'FORÊT' },
    };
    const CARD_BG = { gold: 'var(--bg-warm)', rose: '#FDF6F8', green: '#F4FAF6' };

    function cardBottleSVG(theme, uid) {
        const c  = THEMES[theme] || THEMES.gold;
        const id = `cg-${uid}`;
        return `<svg class="card-bottle" viewBox="0 0 120 230" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="${c.g1}" stop-opacity=".93"/>
                    <stop offset="100%" stop-color="${c.g2}" stop-opacity=".8"/>
                </linearGradient>
            </defs>
            <rect x="43" y="4"  width="34" height="22" rx="4" fill="${c.cap}"/>
            <rect x="48" y="24" width="24" height="28" rx="2" fill="${c.cap}"/>
            <rect x="28" y="50" width="64" height="6"  rx="2" fill="${c.cap}" opacity=".8"/>
            <rect x="20" y="55" width="80" height="158" rx="10" fill="url(#${id})" stroke="${c.cap}" stroke-width="1.5"/>
            <rect x="33" y="62" width="5"  height="144" rx="3" fill="rgba(255,255,255,0.38)"/>
            <rect x="30" y="100" width="60" height="52" rx="3" fill="rgba(255,255,255,0.88)"/>
            <line x1="38" y1="108" x2="82" y2="108" stroke="${c.lc}" stroke-width="0.5"/>
            <text x="60" y="122" text-anchor="middle" font-family="Cormorant Garamond,serif" font-size="8"   fill="${c.tc}" font-style="italic" font-weight="500">JAVOKHIR</text>
            <text x="60" y="135" text-anchor="middle" font-family="Jost,sans-serif"           font-size="5"   fill="${c.sc}" letter-spacing="3">ATTOR</text>
            <line x1="38" y1="142" x2="82" y2="142" stroke="${c.lc}" stroke-width="0.5"/>
            <text x="60" y="148" text-anchor="middle" font-family="Jost,sans-serif"           font-size="4"   fill="${c.tc}" letter-spacing="1.5">${c.lbl}</text>
        </svg>`;
    }

    /* Spread orbs evenly regardless of how many notes exist */
    const POSITION_MAP = { 1:[2], 2:[1,3], 3:[0,2,4], 4:[0,1,3,4], 5:[0,1,2,3,4] };

    function buildCardOrbs(p) {
        let notes = [];
        if (p.ingredients && p.ingredients.length > 0) {
            notes = p.ingredients.slice(0, 5).map(i => ({ label: i.label || i.name || '', image: i.imageUrl || null }));
        } else if (p.notes) {
            notes = p.notes.split(',').map(n => n.trim()).filter(Boolean).slice(0, 5)
                .map(n => ({ label: n, image: null }));
        }
        if (!notes.length) return '';
        const posMap = POSITION_MAP[notes.length] || [0,1,2,3,4];
        return notes.map((note, i) => {
            const pos  = posMap[i] !== undefined ? posMap[i] : i;
            const icon = note.image
                ? `<img src="${note.image}" alt="${note.label}" class="card-orb-img-sm">`
                : `<span class="card-orb-icon">${note.label.slice(0, 3)}</span>`;
            return `<div class="card-orb-item" data-orb-idx="${pos}">
                        <div class="card-orb-circle">${icon}</div>
                        <span class="card-orb-label">${note.label}</span>
                    </div>`;
        }).join('');
    }

    /* Build a full product card HTML string */
    function createCard(p, idx) {
        const bg     = CARD_BG[p.theme] || 'var(--bg-warm)';
        const vol    = p.volume ? `${p.volume}ml` : '50ml';
        const delay  = (idx % 3) * 0.15;
        const name   = formatName(p.name);
        const visual = p.image
            ? `<img class="card-product-img" src="${p.image}" alt="${name}" loading="lazy">`
            : cardBottleSVG(p.theme, p.id);

        return `<div class="product-card reveal" data-category="${p.category || ''}" style="--reveal-delay:${delay}s">
            <div class="card-visual" style="background:${bg}">
                <div class="card-orb-ring">${buildCardOrbs(p)}</div>
                <div class="card-bottle-wrap">
                    ${visual}
                </div>
            </div>
            <div class="card-info">
                <p class="card-cat">Eau de Parfum · ${vol}</p>
                <h3 class="card-name">${name}</h3>
                <div class="card-notes">
                    ${mkNotePills(p.notes)}
                </div>
                <div class="card-foot">
                    <span class="card-price">$${p.price}</span>
                    <button class="card-btn">Add to Cart</button>
                </div>
            </div>
        </div>`;
    }

    function initCardOrbs(cardEl) {
        const visual = cardEl.querySelector('.card-visual');
        if (!visual) return;
        const orbs = [...visual.querySelectorAll('.card-orb-item')];
        if (!orbs.length) return;

        let blooming = false;

        visual.addEventListener('mouseenter', () => {
            blooming = true;
            orbs.forEach(orb => {
                /* Reset to origin cleanly before animating */
                orb.style.transition = 'none';
                orb.style.animation  = 'none';
                orb.style.opacity    = '0';
                orb.style.transform  = 'translate(0,0) scale(0.3)';
                orb.style.zIndex     = '1';
                orb.style.filter     = '';
            });

            requestAnimationFrame(() => {
                if (!blooming) return;
                orbs.forEach((orb, i) => {
                    const pos   = parseInt(orb.dataset.orbIdx) || i;
                    const dur   = 0.72 + pos * 0.05;    /* 0.72 – 0.92 s  */
                    const delay = pos * 0.07;            /* 0 – 0.28 s stagger */

                    orb.style.animation = `card-orb-bloom-${pos} ${dur}s ${delay}s cubic-bezier(0.34,1.1,0.64,1) forwards`;

                    orb.addEventListener('animationend', () => {
                        if (!blooming) return;
                        orb.style.zIndex    = '3';
                        const floatDur      = 2.2 + pos * 0.25;
                        const floatDel      = pos * 0.12;
                        orb.style.animation = `card-orb-float-${pos} ${floatDur}s ease-in-out ${floatDel}s infinite`;
                    }, { once: true });
                });
            });
        });

        visual.addEventListener('mouseleave', () => {
            blooming = false;
            orbs.forEach((orb, i) => {
                orb.style.animation  = 'none';
                orb.style.zIndex     = '1';
                orb.style.filter     = '';
                orb.style.transition = `opacity 0.28s ease ${i * 0.03}s, transform 0.38s cubic-bezier(0.4,0,1,1) ${i * 0.03}s`;
                orb.style.opacity    = '0';
                orb.style.transform  = 'translate(0,0) scale(0.3)';
            });
            setTimeout(() => { orbs.forEach(orb => { orb.style.transition = ''; }); }, 450);
        });
    }

    let allProducts  = [];
    let activeFilter = 'all';
    const productsGrid = document.getElementById('productsGrid');

    function renderProducts() {
        if (!productsGrid) return;
        const list = activeFilter === 'all'
            ? allProducts
            : allProducts.filter(p => p.category === activeFilter);

        if (!list.length) {
            productsGrid.innerHTML = `<p class="products-empty">${
                activeFilter === 'all'
                    ? 'No fragrances available yet.'
                    : 'No fragrances in this category.'
            }</p>`;
            return;
        }

        productsGrid.innerHTML = list.map((p, i) => createCard(p, i)).join('');
        productsGrid.querySelectorAll('.product-card').forEach(el => { observeReveal(el); initCardOrbs(el); });
    }

    function loadProducts() {
        if (!productsGrid) return;
        /* 1. localStorage — shared with admin.html, updated on every admin save */
        try {
            const cached = localStorage.getItem('javokhir_products');
            if (cached) {
                const data = JSON.parse(cached);
                if (Array.isArray(data) && data.length > 0) {
                    allProducts = data;
                    renderHeroShowcase(allProducts);
                    renderProducts();
                    return;
                }
            }
        } catch (e) {}
        /* 2. PRODUCTS_DATA from products.js loaded via <script> tag */
        if (typeof PRODUCTS_DATA !== 'undefined' && Array.isArray(PRODUCTS_DATA)) {
            allProducts = PRODUCTS_DATA;
            renderHeroShowcase(allProducts);
            renderProducts();
            return;
        }
        /* 3. Fallback: fetch products.json */
        productsGrid.innerHTML = '<p class="products-loading">Loading collection…</p>';
        fetch('./products.json')
            .then(r => { if (!r.ok) throw new Error(); return r.json(); })
            .then(data => { allProducts = data; renderHeroShowcase(allProducts); renderProducts(); })
            .catch(() => {
                productsGrid.innerHTML = '<p class="products-empty">Products unavailable.<br><small style="font-size:11px;font-style:normal;letter-spacing:1px">Make sure products.js is in the same folder as index.html.</small></p>';
            });
    }

    /* Filter tab clicks */
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeFilter = tab.dataset.filter;
            renderProducts();
        });
    });

    loadProducts();

    /* --------------------------------------------------------
       9. ADD-TO-CART — delegated (cards are dynamic)
    -------------------------------------------------------- */
    if (productsGrid) {
        productsGrid.addEventListener('click', e => {
            const btn = e.target.closest('.card-btn');
            if (!btn) return;
            const orig = btn.textContent;
            btn.textContent     = 'Added ✓';
            btn.style.background = '#2E7D52';
            setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 1800);
        });
    }

}());
