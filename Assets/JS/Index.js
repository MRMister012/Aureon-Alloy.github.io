/* ---------- Menú desplegable ---------- */
document.addEventListener('DOMContentLoaded', () => {
    const dropdownItems = document.querySelectorAll('.has-dropdown');

    dropdownItems.forEach(item => {
        const toggleBtn = item.querySelector('.dropdown-toggle');
        if (!toggleBtn) return;
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownItems.forEach(other => { if (other !== item) other.classList.remove('open'); });
            item.classList.toggle('open');
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.header')) dropdownItems.forEach(i => i.classList.remove('open'));
    });
    document.querySelectorAll('.dropdown-link').forEach(l =>
        l.addEventListener('click', () => dropdownItems.forEach(i => i.classList.remove('open'))));

    initMiniCalendar();
    initQuotes();
    initForm();
    document.getElementById('year').textContent = new Date().getFullYear();
});

/* ---------- Calendario de muestra (portafolio) ---------- */
function initMiniCalendar() {
    const grid = document.getElementById('mini-cal');
    if (!grid) return;
    const events = [3, 9, 14, 21, 27];
    let html = ['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(d => `<span class="wd">${d}</span>`).join('');
    html += '<span></span><span></span>'; // el mes empieza en miércoles
    for (let d = 1; d <= 31; d++) {
        const cls = d === 14 ? 'today' : events.includes(d) ? 'ev' : '';
        html += `<span class="${cls}">${d}</span>`;
    }
    grid.innerHTML = html;
}

/* ---------- Carrusel de opiniones ---------- */
function initQuotes() {
    const quotes = document.querySelectorAll('.quote');
    const dotsBox = document.querySelector('.dots');
    if (!quotes.length || !dotsBox) return;

    let current = 0, timer;
    const dots = [...quotes].map((_, i) => {
        const b = document.createElement('button');
        b.className = 'dot';
        b.type = 'button';
        b.setAttribute('aria-label', `Opinión ${i + 1}`);
        b.addEventListener('click', () => { show(i); restart(); });
        dotsBox.appendChild(b);
        return b;
    });

    function show(i) {
        current = i;
        quotes.forEach((q, n) => q.classList.toggle('active', n === i));
        dots.forEach((d, n) => d.classList.toggle('active', n === i));
    }
    function restart() {
        clearInterval(timer);
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
            timer = setInterval(() => show((current + 1) % quotes.length), 6000);
    }
    show(0);
    restart();
}

/* ---------- Formulario de contacto ---------- */
function initForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    const status = document.getElementById('form-status');

    const rules = {
        nombre: v => v.trim() ? '' : 'Escribe tu nombre.',
        apellido: v => v.trim() ? '' : 'Escribe tu apellido.',
        email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Escribe un correo válido, como nombre@correo.com.',
        telefono: v => v.replace(/\D/g, '').length >= 10 ? '' : 'Escribe un número de al menos 10 dígitos.',
        tipo: v => v ? '' : 'Selecciona una opción.'
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;
        Object.keys(rules).forEach(name => {
            const field = form.elements[name];
            const msg = rules[name](field.value);
            field.setAttribute('aria-invalid', msg ? 'true' : 'false');
            field.closest('.form-row').querySelector('.error').textContent = msg;
            if (msg && valid) { field.focus(); valid = false; }
        });
        if (!valid) { status.className = 'form-status'; status.textContent = ''; return; }

        // TODO: conectar con un backend o servicio (Formspree, EmailJS, etc.)
        const data = Object.fromEntries(new FormData(form));
        console.log('Datos del formulario:', data);
        form.reset();
        status.className = 'form-status ok';
        status.textContent = 'Mensaje enviado. Te contactaremos pronto.';
    });
}