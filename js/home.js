// SAIKO home — the mugshot's eye, the agitation, the visitor-pass QR code.

(function initSaikoHome() {
    const home = document.querySelector('.saiko-home');
    const photo = home.querySelector('.sk-mug-photo');
    const pupil = home.querySelector('.sk-pupil');
    let lastPointerMove = 0;

    // Pupil follows a point on screen, clamped inside the white of the eye.
    function lookAt(x, y) {
        const rect = photo.getBoundingClientRect();
        const eyeX = rect.left + rect.width * 0.645;
        const eyeY = rect.top + rect.height * 0.451;
        const dx = x - eyeX;
        const dy = y - eyeY;
        const distance = Math.hypot(dx, dy) || 1;
        const reach = Math.min(1, distance / 220) * rect.width * 0.045;
        pupil.style.setProperty('--px', `${(dx / distance) * reach}px`);
        pupil.style.setProperty('--py', `${(dy / distance) * reach}px`);
    }

    window.addEventListener('pointermove', e => {
        if (e.pointerType !== 'mouse') return;
        lastPointerMove = Date.now();
        lookAt(e.clientX, e.clientY);
    });

    // No mouse (phones) or idle: the eye darts around on its own.
    setInterval(() => {
        if (Date.now() - lastPointerMove < 2500) return;
        lookAt(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
    }, 700);

    // Hovering the nav makes the subject agitated.
    home.querySelectorAll('.sk-nav a').forEach(link => {
        link.addEventListener('mouseenter', () => home.classList.add('sk-agitated'));
        link.addEventListener('focus', () => home.classList.add('sk-agitated'));
        link.addEventListener('mouseleave', () => home.classList.remove('sk-agitated'));
        link.addEventListener('blur', () => home.classList.remove('sk-agitated'));
    });

    const qrContainer = document.getElementById('qrcode');
    if (qrContainer && typeof QRCode !== 'undefined') {
        new QRCode(qrContainer, {
            text: window.location.href,
            width: 150,
            height: 150,
            colorDark: '#000000',
            colorLight: '#ffffff'
        });
    }
})();
