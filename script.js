/**
 * Transportes CyV SpA - Minimalist Swiss Industrial Operations Router
 */

document.addEventListener('DOMContentLoaded', () => {
  // Official Phone & WhatsApp Numbers
  const NUMBERS = {
    cotizaciones: {
      raw: '56987878997',
      display: '+56 9 8787 8997',
      tel: 'tel:+56987878997'
    },
    grua: {
      raw: '56976106773',
      display: '+56 9 7610 6773',
      tel: 'tel:+56976106773'
    }
  };

  // --- 1. Service / Fleet Tabs Controller ---
  const tabButtons = document.querySelectorAll('.service-tab-btn');
  const tabPanels = document.querySelectorAll('.service-tab-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab-target');

      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.add('hidden'));

      btn.classList.add('active');
      const activePanel = document.getElementById(targetId);
      if (activePanel) {
        activePanel.classList.remove('hidden');
      }
    });
  });

  // --- 2. WhatsApp Floating Menu Controller ---
  const waFabBtn = document.getElementById('waFabBtn');
  const waPopover = document.getElementById('waPopover');
  const waCloseBtn = document.getElementById('waCloseBtn');

  if (waFabBtn && waPopover) {
    const togglePopover = (open) => {
      const isOpen = open !== undefined ? open : !waPopover.classList.contains('active');
      waPopover.classList.toggle('active', isOpen);
      waFabBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    };

    waFabBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePopover();
    });

    if (waCloseBtn) {
      waCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePopover(false);
      });
    }

    document.addEventListener('click', (e) => {
      if (!waPopover.contains(e.target) && !waFabBtn.contains(e.target)) {
        togglePopover(false);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && waPopover.classList.contains('active')) {
        togglePopover(false);
      }
    });
  }

  // --- 3. Mobile Navigation Drawer ---
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenuDrawer = document.getElementById('mobileMenuDrawer');
  const mobileMenuCloseBtn = document.getElementById('mobileMenuCloseBtn');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileMenuDrawer) {
    const toggleMobileMenu = (open) => {
      const isOpen = open !== undefined ? open : mobileMenuDrawer.classList.contains('hidden');
      if (isOpen) {
        mobileMenuDrawer.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      } else {
        mobileMenuDrawer.classList.add('hidden');
        document.body.style.overflow = '';
      }
      mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    };

    mobileMenuBtn.addEventListener('click', () => toggleMobileMenu(true));
    if (mobileMenuCloseBtn) {
      mobileMenuCloseBtn.addEventListener('click', () => toggleMobileMenu(false));
    }

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => toggleMobileMenu(false));
    });
  }

  // --- 4. Dynamic Quote Router & WhatsApp Submission ---
  const quoteForm = document.getElementById('quoteForm');
  const serviceSelect = document.getElementById('serviceSelect');

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('quoteName')?.value.trim() || 'No especificado';
      const company = document.getElementById('quoteCompany')?.value.trim() || 'Particular';
      const phone = document.getElementById('quotePhone')?.value.trim() || 'No especificado';
      const service = serviceSelect?.options[serviceSelect.selectedIndex]?.text || 'Consulta General';
      const serviceVal = serviceSelect?.value || 'carga';
      const location = document.getElementById('quoteLocation')?.value.trim() || 'Por definir';
      const details = document.getElementById('quoteDetails')?.value.trim() || 'Sin detalles adicionales';

      // Route to WhatsApp 2 (Grua) or WhatsApp 1 (Cotizaciones)
      const targetNumber = (serviceVal === 'grua') ? NUMBERS.grua.raw : NUMBERS.cotizaciones.raw;

      const message = 
`Hola *Transportes CyV SpA*, solicito cotización para faena:

• *Cliente:* ${name}
• *Empresa:* ${company}
• *Teléfono:* ${phone}
• *Servicio:* ${service}
• *Ubicación:* ${location}
• *Detalles:* ${details}

Favor confirmar disponibilidad y tarifa.`;

      const encodedUrl = `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;
      
      const submitBtn = quoteForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `Conectando a WhatsApp...`;

      setTimeout(() => {
        window.open(encodedUrl, '_blank');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }, 400);
    });
  }
});
