(function () {
  'use strict';

  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isExpanded));
      mobileMenu.classList.toggle('open', !isExpanded);
      mobileMenu.setAttribute('aria-hidden', String(isExpanded));
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('open');
        mobileMenu.setAttribute('aria-hidden', 'true');
      });
    });
  }

  const form = document.getElementById('booking-form');
  const successPanel = document.getElementById('booking-success');

  if (form && successPanel) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const name = (form.elements.name?.value || '').trim();
      const phone = (form.elements.phone?.value || '').trim();
      const validPhone = /^[6-9][0-9]{9}$/.test(phone);

      if (name.length < 2 || !validPhone) {
        alert('Please enter a valid name and 10 digit mobile number.');
        return;
      }

      const submitButtonText = form.querySelector('.btn-text');
      if (submitButtonText) submitButtonText.textContent = 'Sending...';

      setTimeout(() => {
        form.hidden = true;
        successPanel.hidden = false;
      }, 700);
    });
  }

  const toggleAreasBtn = document.getElementById('toggleAreas');
  const moreAreas = document.querySelectorAll('.more-area');

  if (toggleAreasBtn && moreAreas.length > 0) {
    let expanded = false;
    toggleAreasBtn.addEventListener('click', () => {
      expanded = !expanded;
      moreAreas.forEach((area) => area.classList.toggle('show', expanded));
      toggleAreasBtn.textContent = expanded ? 'Show Less Areas' : 'Show More Areas';
    });
  }
})();
