document.addEventListener('DOMContentLoaded', () => {

    // --- Element Selections ---
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const themeToggle = document.getElementById('themeToggle');
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const formConfirmation = document.getElementById('form-confirmation');
    const serviceCards = document.querySelectorAll('.service-card'); // For 3D tilt
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    const modalTriggers = document.querySelectorAll('.project-modal-trigger');
    const modals = document.querySelectorAll('.modal');
    const modalCloseBtns = document.querySelectorAll('.modal-close');

    // --- Sticky Navbar ---
    const handleScroll = () => {
        // Sticky Nav
        if (window.scrollY > 50) {
            navbar.classList.add('sticky');
        } else {
            navbar.classList.remove('sticky');
        }
        // Scroll to Top Button Visibility
        if (window.scrollY > 300) {
             scrollToTopBtn.classList.add('visible');
        } else {
             scrollToTopBtn.classList.remove('visible');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // --- Mobile Menu Toggle ---
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        // Optional: Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    navLinks.forEach(link => link.addEventListener('click', () => {
        if (hamburger.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = ''; // Re-enable scroll
        }
    }));

    // // --- Theme Toggle ---
    // const setTheme = (theme) => {
    //     document.body.setAttribute('data-theme', theme);
    //     localStorage.setItem('preferredTheme', theme);
    // };

    // themeToggle.addEventListener('click', () => {
    //     const currentTheme = document.body.getAttribute('data-theme');
    //     const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    //     setTheme(newTheme);
    // });

    // // Load saved theme or system preference
    // const savedTheme = localStorage.getItem('preferredTheme');
    // const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    //  if (savedTheme) {
    //      setTheme(savedTheme);
    // } else if (prefersDark) {
    //      setTheme('dark'); // Default to dark if system prefers
    //  } else {
    //      setTheme('light'); // Fallback to light
    //  }

     // --- Intersection Observer for Scroll Animations ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
            const delay = entry.target.dataset.delay || '0'; // Get delay from data-attribute
            if (entry.isIntersecting) {
                 entry.target.style.setProperty('--delay-offset', `${delay}s`); // Set delay variable
                entry.target.classList.add('is-visible');
               
            } else {
                 // Optional: Reset animation on scroll out
                 // entry.target.classList.remove('is-visible');
                 // entry.target.style.removeProperty('--delay-offset');
            }
        });
    }, { threshold: 0.1 }); // Adjust threshold as needed

    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // --- Service Card 3D Tilt Effect ---
    serviceCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2; // X position from center
            const y = e.clientY - rect.top - rect.height / 2; // Y position from center

            const rotateY = (x / (rect.width / 2)) * 10; // Max rotation 10deg
            const rotateX = (-y / (rect.height / 2)) * 10; // Max rotation 10deg

            card.style.setProperty('--tiltX', `${rotateX}deg`);
            card.style.setProperty('--tiltY', `${rotateY}deg`);
            card.style.transform = `translateY(-5px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`; // Apply hover transform
        });

        card.addEventListener('mouseleave', () => {
            card.style.removeProperty('--tiltX');
            card.style.removeProperty('--tiltY');
            card.style.transform = 'translateY(0) rotateX(0deg) rotateY(0deg) translateZ(0px)'; // Reset transform
        });
    });

    // --- Contact Form Submission ---
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const submitButton = contactForm.querySelector('.submit-btn');
            const submitButtonText = submitButton.querySelector('.btn-text');

            formStatus.textContent = '';
            formStatus.className = 'form-status';
            submitButton.classList.add('loading');
            submitButton.disabled = true;
            if(submitButtonText) submitButtonText.textContent = 'Sending...';


            try {
                // *** REPLACE WITH YOUR FORMSPREE/EMAILJS/BACKEND ENDPOINT ***
                const response = await fetch('YOUR_FORM_ENDPOINT_HERE', {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    showFormConfirmation();
                    contactForm.reset();
                } else {
                    const data = await response.json().catch(() => ({})); // Handle non-json errors
                    formStatus.textContent = data.error || 'Oops! There was a problem.';
                    formStatus.classList.add('error', 'visible');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                formStatus.textContent = 'Network error. Please try again.';
                formStatus.classList.add('error', 'visible');
            } finally {
                 submitButton.classList.remove('loading');
                 submitButton.disabled = false;
                 if(submitButtonText) submitButtonText.textContent = 'Send Message';
            }
        });
    }

    // --- Form Confirmation Animation ---
    const showFormConfirmation = () => {
        if (formConfirmation) {
            formConfirmation.classList.add('show');
            setTimeout(() => {
                formConfirmation.classList.remove('show');
            }, 2500); // Hide after 2.5 seconds
        } else { // Fallback text message
             formStatus.textContent = 'Message Sent Successfully!';
             formStatus.classList.add('success', 'visible');
             setTimeout(() => { formStatus.classList.remove('visible'); }, 3000);
        }
    };

     // --- Modal Handling ---
    const openModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        }
    };

    const closeModal = (modal) => {
        if (modal) {
            modal.classList.remove('active');
            // Only re-enable scroll if no other modals are active
            if (!document.querySelector('.modal.active')) {
                 document.body.style.overflow = '';
            }
        }
    };

    modalTriggers.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.dataset.modalId;
            openModal(modalId);
        });
    });

    modalCloseBtns.forEach(button => {
        button.addEventListener('click', () => {
             const modal = button.closest('.modal'); // Find parent modal
            closeModal(modal);
        });
    });

    // Close modal on background click
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) { // Clicked on the overlay itself
                closeModal(modal);
            }
        });
    });

    // --- Scroll to Top --- (handled in handleScroll)

}); // End DOMContentLoaded
    // --- Theme Toggle ---
    const setTheme = (theme) => {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('preferredTheme', theme); // Keep saving the explicit choice
    };

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });

    // Load saved theme OR default explicitly to dark (NEW LOGIC)
    const savedTheme = localStorage.getItem('preferredTheme');
    if (savedTheme) {
        // If the user explicitly chose a theme before, respect it
        setTheme(savedTheme);
    } else {
        // Otherwise, ensure the theme is dark (matching the HTML default)
        // No need to call setTheme('dark') here because the body tag already has it.
        // The HTML default handles the initial load.
        // If you *wanted* to save 'dark' to localStorage on first load without explicit choice,
        // you *could* call setTheme('dark'); here, but it's not strictly necessary
        // just to achieve the initial dark view.
    }

    // --- Rest of your JavaScript ---
    // ... (Intersection Observer, Form handling, etc.) ...
    document.addEventListener('DOMContentLoaded', function() {
        const scrollToTopButton = document.querySelector('.scroll-to-top');
        const whatsappButton = document.querySelector('.whatsapp-icon');
    
        function toggleVisibility() {
            if (window.scrollY > 300) { // Adjust the scroll distance (in pixels) as needed
                scrollToTopButton.classList.add('visible');
                whatsappButton.classList.add('visible');
            } else {
                scrollToTopButton.classList.remove('visible');
                whatsappButton.classList.remove('visible');
            }
        }
    
        // Initially hide the buttons
        scrollToTopButton.classList.remove('visible');
        whatsappButton.classList.remove('visible');
    
        // Listen for scroll events
        window.addEventListener('scroll', toggleVisibility);
    });
