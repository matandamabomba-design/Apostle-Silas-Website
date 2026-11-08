    const menuButton = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    menuButton.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open menu');
    }));

    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', event => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          event.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    const modal = document.getElementById('video-modal');
    const modalFrame = modal.querySelector('iframe');
    const modalTitle = document.getElementById('video-modal-title');
    let previousFocus;
    function closeModal() {
      modal.classList.remove('open');
      modalFrame.src = '';
      document.body.style.overflow = '';
      if (previousFocus) previousFocus.focus();
    }
    document.querySelectorAll('.open-player').forEach(button => button.addEventListener('click', () => {
      previousFocus = button;
      modalTitle.textContent = button.dataset.title || 'Media player';
      modalFrame.src = button.dataset.video + '?autoplay=1&rel=0';
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      modal.querySelector('.modal-close').focus();
    }));
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

    document.querySelectorAll('.filter-btn').forEach(button => button.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      const filter = button.dataset.filter;
      document.querySelectorAll('.sermon-card').forEach(card => {
        card.classList.toggle('hidden', filter !== 'all' && !card.dataset.type.split(' ').includes(filter));
      });
    }));

    const quotes = [
      ['Apostle Silas brings rare biblical depth with a pastor’s compassion. Every room left more hopeful, more grounded, and ready to serve.', 'Dr. Miriam Adebayo • Chair, Kingdom Leadership Summit'],
      ['His teaching made Scripture feel both urgent and deeply personal. He speaks with authority while creating a genuine sense of family.', 'Pastor Daniel Mensah • Cornerstone Community Church'],
      ['A clear communicator, a faithful shepherd, and a trusted partner in ministry. Silas helped our leaders rediscover purpose and unity.', 'Rev. Rachel Collins • Director, Renewal Network']
    ];
    document.querySelectorAll('.quote-dot').forEach((dot, index) => dot.addEventListener('click', () => {
      document.querySelectorAll('.quote-dot').forEach(item => item.classList.remove('active'));
      dot.classList.add('active');
      document.getElementById('quote-text').textContent = quotes[index][0];
      document.getElementById('quote-meta').textContent = quotes[index][1];
    }));

    function validateForm(form) {
      let valid = true;
      form.querySelectorAll('[required]').forEach(field => {
        const error = field.closest('.field')?.querySelector('.error');
        if (!field.value.trim() || !field.checkValidity()) {
          valid = false;
          if (error) error.textContent = field.type === 'email' ? 'Enter a valid email address.' : 'This field is required.';
          field.setAttribute('aria-invalid', 'true');
        } else {
          if (error) error.textContent = '';
          field.removeAttribute('aria-invalid');
        }
      });
      return valid;
    }
    document.querySelectorAll('[required]').forEach(field => field.addEventListener('input', () => {
      if (field.value.trim() && field.checkValidity()) {
        field.removeAttribute('aria-invalid');
        const error = field.closest('.field')?.querySelector('.error');
        if (error) error.textContent = '';
      }
    }));
    document.getElementById('booking-form').addEventListener('submit', event => {
      event.preventDefault();
      if (validateForm(event.currentTarget)) {
        event.currentTarget.querySelector('.form-status').classList.add('show');
        event.currentTarget.reset();
      }
    });
    document.getElementById('contact-form').addEventListener('submit', event => {
      event.preventDefault();
      if (validateForm(event.currentTarget)) {
        event.currentTarget.querySelector('.form-status').classList.add('show');
        event.currentTarget.reset();
      }
    });
    document.getElementById('newsletter-form').addEventListener('submit', event => {
      event.preventDefault();
      const email = document.getElementById('newsletter-email');
      if (email.checkValidity()) {
        email.value = '';
        email.placeholder = 'Thank you — you are subscribed!';
      } else {
        email.setAttribute('aria-invalid', 'true');
        email.reportValidity();
      }
    });

    const sections = [...document.querySelectorAll('main section[id], section[id]')];
    const navItems = [...document.querySelectorAll('.nav-links a[href^="#"]')];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navItems.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id));
        }
      });
    }, { rootMargin: '-35% 0px -55%', threshold: 0 });
    sections.forEach(section => observer.observe(section));