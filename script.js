/* ------------------------------------------------------------
   Language toggle (DA / EN)
   ------------------------------------------------------------ */
(function () {
    const body = document.body;
    const buttons = document.querySelectorAll('.lang-switch button');
    const placeholderFields = document.querySelectorAll('[data-placeholder-da], [data-placeholder-en]');

    function updatePlaceholders(lang) {
        placeholderFields.forEach(el => {
            const val = el.getAttribute('data-placeholder-' + lang);
            if (val !== null) el.setAttribute('placeholder', val);
        });
    }

    function setLang(lang) {
        body.classList.remove('lang-da', 'lang-en');
        body.classList.add('lang-' + lang);
        document.documentElement.setAttribute('lang', lang);
        buttons.forEach(b => {
            const active = b.dataset.lang === lang;
            b.classList.toggle('active', active);
            b.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
        updatePlaceholders(lang);
        try { localStorage.setItem('site-lang', lang); } catch (e) {}
    }

    buttons.forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));

    let saved = null;
    try { saved = localStorage.getItem('site-lang'); } catch (e) {}
    if (saved === 'en' || saved === 'da') {
        setLang(saved);
    } else {
        updatePlaceholders('da');
    }
})();

/* ------------------------------------------------------------
   Kontaktformular (Formspree, AJAX)
   ------------------------------------------------------------ */
(function () {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    const status = form.querySelector('.form-status');
    const button = form.querySelector('button[type="submit"]');

    const messages = {
        da: {
            sending: 'Sender…',
            success: 'Tak — din besked er sendt. Jeg vender tilbage så hurtigt jeg kan.',
            error: 'Noget gik galt. Prøv igen, eller skriv direkte til psykolog.claus.bornemann@protonmail.com',
            validation: 'Udfyld venligst navn, en gyldig e-mail og en besked.'
        },
        en: {
            sending: 'Sending…',
            success: 'Thank you — your message has been sent. I will get back to you as soon as I can.',
            error: 'Something went wrong. Please try again or write to psykolog.claus.bornemann@protonmail.com',
            validation: 'Please fill in your name, a valid email and a message.'
        }
    };

    function lang() {
        return document.body.classList.contains('lang-en') ? 'en' : 'da';
    }

    function showStatus(type, text) {
        status.className = 'form-status ' + type;
        status.textContent = text;
    }

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const msgs = messages[lang()];

        if (!form.checkValidity()) {
            showStatus('error', msgs.validation);
            return;
        }

        showStatus('', msgs.sending);
        button.disabled = true;

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                form.reset();
                showStatus('success', msgs.success);
            } else {
                let data = null;
                try { data = await response.json(); } catch (e) {}
                if (data && data.errors && data.errors.length) {
                    showStatus('error', data.errors.map(err => err.message).join(' '));
                } else {
                    showStatus('error', msgs.error);
                }
            }
        } catch (err) {
            showStatus('error', msgs.error);
        } finally {
            button.disabled = false;
        }
    });
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
