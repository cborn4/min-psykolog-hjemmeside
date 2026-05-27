/* ------------------------------------------------------------
   Language toggle (DA / EN)
   ------------------------------------------------------------ */
(function () {
    const body = document.body;
    const buttons = document.querySelectorAll('.lang-switch button');

    function setLang(lang) {
        body.classList.remove('lang-da', 'lang-en');
        body.classList.add('lang-' + lang);
        document.documentElement.setAttribute('lang', lang);
        buttons.forEach(b => {
            const active = b.dataset.lang === lang;
            b.classList.toggle('active', active);
            b.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
        try { localStorage.setItem('site-lang', lang); } catch (e) {}
    }

    buttons.forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));

    let saved = null;
    try { saved = localStorage.getItem('site-lang'); } catch (e) {}
    if (saved === 'en' || saved === 'da') {
        setLang(saved);
    }
})();

/* ------------------------------------------------------------
   Mobile nav toggle
   ------------------------------------------------------------ */
(function () {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.getElementById('primary-nav');
    if (!toggle || !nav) return;

    function close() {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
    }
    function open() {
        nav.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
    }

    toggle.addEventListener('click', () => {
        if (nav.classList.contains('open')) close(); else open();
    });

    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 800) close();
    });
})();
