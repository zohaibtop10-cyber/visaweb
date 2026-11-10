/**
 * PropertyVisaDubai - Interactive Logic & Live Calculator
 */

document.addEventListener('DOMContentLoaded', () => {
  initCalculator();
  initFaqAccordion();
  initMobileNav();
  initConsultationForm();
  initTestimonialSlider();
});

/* ==========================================================================
   1. Live Visa Cost & Eligibility Calculator
   ========================================================================== */
function initCalculator() {
  const state = {
    duration: 10,       // 10 years or 2 years
    status: 'ready',    // 'ready' or 'offplan'
    residency: 'inside',// 'inside' or 'outside'
    family: {
      spouse: false,
      children: false,
      parents: false
    }
  };

  // Base pricing tables (in AED)
  const baseDldFee = {
    10: 80000, // 4% on 2,000,000 AED property
    2: 30000   // 4% on 750,000 AED property
  };

  const baseMedicalEmiratesId = {
    inside: 1250,
    outside: 1650 // Includes change of status / entry permit
  };

  const baseGdrfaPermit = {
    10: 2850,
    2: 2150
  };

  const familyFees = {
    spouse: 3200,    // Visa file + Emirates ID + Medical
    children: 2400,  // Visa file + Emirates ID (medical if >18)
    parents: 3800    // Dependent parent visa
  };

  // DOM Elements
  const durationBtns = document.querySelectorAll('[data-type="duration"]');
  const statusBtns = document.querySelectorAll('[data-type="status"]');
  const residencyBtns = document.querySelectorAll('[data-type="residency"]');
  const familyBtns = document.querySelectorAll('.family-tag');

  const feeDldDisplay = document.getElementById('fee-dld');
  const feeMedicalDisplay = document.getElementById('fee-medical');
  const feeGdrfaDisplay = document.getElementById('fee-gdrfa');
  const feeFamilyDisplay = document.getElementById('fee-family');
  const totalCostDisplay = document.getElementById('total-cost-display');
  const btnWhatsApp = document.getElementById('btn-whatsapp');

  // Format currency helper
  function formatAED(amount) {
    return 'AED ' + amount.toLocaleString('en-US');
  }

  // Recalculate totals
  function updateCalculator() {
    let dld = baseDldFee[state.duration];
    if (state.status === 'offplan') {
      // Off-plan registration Oqood / Admin differential
      dld += 1050;
    }

    let medical = baseMedicalEmiratesId[state.residency];
    let gdrfa = baseGdrfaPermit[state.duration];

    let familyTotal = 0;
    let selectedFamilyList = [];

    if (state.family.spouse) {
      familyTotal += familyFees.spouse;
      selectedFamilyList.push('Spouse');
    }
    if (state.family.children) {
      familyTotal += familyFees.children;
      selectedFamilyList.push('Children');
    }
    if (state.family.parents) {
      familyTotal += familyFees.parents;
      selectedFamilyList.push('Parents');
    }

    const grandTotal = dld + medical + gdrfa + familyTotal;

    // Update UI elements
    if (feeDldDisplay) feeDldDisplay.textContent = '+ ' + formatAED(dld);
    if (feeMedicalDisplay) feeMedicalDisplay.textContent = '+ ' + formatAED(medical);
    if (feeGdrfaDisplay) feeGdrfaDisplay.textContent = '+ ' + formatAED(gdrfa);
    if (feeFamilyDisplay) {
      feeFamilyDisplay.textContent = familyTotal > 0 ? '+ ' + formatAED(familyTotal) : 'AED 0';
    }
    if (totalCostDisplay) {
      totalCostDisplay.textContent = formatAED(grandTotal);
    }

    // Dynamic WhatsApp Link Builder
    if (btnWhatsApp) {
      const durationText = state.duration === 10 ? '10-Year Golden Visa (AED 2M+)' : '2-Year Investor Visa (AED 750K+)';
      const statusText = state.status === 'ready' ? 'Ready Property' : 'Off-Plan Property';
      const residencyText = state.residency === 'inside' ? 'Inside UAE' : 'Outside UAE';
      const familyText = selectedFamilyList.length > 0 ? selectedFamilyList.join(', ') : 'None';

      const message = `Hello PropertyVisaDubai,\n\nI used your Visa Cost & Eligibility Calculator and would like to apply:\n- Visa: ${durationText}\n- Status: ${statusText}\n- Residency: ${residencyText}\n- Family Included: ${familyText}\n- Estimated Cost: ${formatAED(grandTotal)}\n\nPlease advise on next steps.`;

      btnWhatsApp.href = `https://wa.me/971500000000?text=${encodeURIComponent(message)}`;
    }
  }

  // Duration toggle event
  durationBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      durationBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.duration = parseInt(btn.dataset.value, 10);
      updateCalculator();
    });
  });

  // Status toggle event
  statusBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      statusBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.status = btn.dataset.value;
      updateCalculator();
    });
  });

  // Residency toggle event
  residencyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      residencyBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.residency = btn.dataset.value;
      updateCalculator();
    });
  });

  // Family toggle multi-select event
  familyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const familyKey = btn.dataset.family;
      state.family[familyKey] = !state.family[familyKey];
      btn.classList.toggle('selected', state.family[familyKey]);
      updateCalculator();
    });
  });

  // Initial calculation
  updateCalculator();
}

/* ==========================================================================
   2. FAQ Accordion Interaction
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other accordion items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });

      // Toggle current
      item.classList.toggle('active', !isActive);
    });
  });
}

/* ==========================================================================
   3. Mobile Navigation Menu Toggle
   ========================================================================== */
function initMobileNav() {
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener('click', () => {
      const isOpen = navMenu.style.display === 'flex';
      navMenu.style.display = isOpen ? 'none' : 'flex';
      if (!isOpen) {
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '100%';
        navMenu.style.left = '0';
        navMenu.style.right = '0';
        navMenu.style.background = '#f5f1e8';
        navMenu.style.padding = '20px';
        navMenu.style.borderBottom = '1px solid rgba(197, 160, 89, 0.3)';
      }
    });

    // Close menu when clicking links
    document.querySelectorAll('.nav-menu .nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          navMenu.style.display = 'none';
        }
      });
    });
  }
}

/* ==========================================================================
   4. Consultation Lead Form
   ========================================================================== */
function initConsultationForm() {
  const form = document.getElementById('consultation-form');
  const feedback = document.getElementById('form-feedback');
  const input = document.getElementById('lead-input');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = input.value.trim();
      if (!val) return;

      feedback.className = 'form-feedback-message success';
      feedback.textContent = `Thank you! Our Dubai Golden Visa advisors will contact you shortly at ${val}.`;
      input.value = '';

      setTimeout(() => {
        feedback.textContent = '';
      }, 7000);
    });
  }
}

/* ==========================================================================
   5. Testimonial Slider / Pagination Dots
   ========================================================================== */
function initTestimonialSlider() {
  const dots = document.querySelectorAll('.slider-pagination-dots .dot');
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      dots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
    });
  });
}
