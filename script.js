document.addEventListener('DOMContentLoaded', () => {

    // --- Element Selections ---
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    // Select the mobile menu wrapper
    const mobileMenuWrapper = document.querySelector('.mobile-menu-wrapper');
    // Select ALL nav links (both desktop and mobile) for click event
    const navLinks = document.querySelectorAll('.nav-link');
    // Select all theme toggles using the common class
    const themeToggles = document.querySelectorAll('.js-theme-toggle');
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const formConfirmation = document.getElementById('form-confirmation');
    const serviceCards = document.querySelectorAll('.service-card'); // For 3D tilt
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    const whatsappIcon = document.querySelector('.whatsapp-icon'); // Select whatsapp icon
    const modalTriggers = document.querySelectorAll('.project-modal-trigger');
    const modals = document.querySelectorAll('.modal');
    const modalCloseBtns = document.querySelectorAll('.modal-close');

    // --- Sticky Navbar & Scroll Button Visibility ---
    const handleScroll = () => {
        // Sticky Nav
        if (window.scrollY > 50) { // Adjust scroll threshold if needed
            navbar.classList.add('sticky');
        } else {
            navbar.classList.remove('sticky');
        }

        // Scroll to Top Button and Whatsapp Icon Visibility
        if (window.scrollY > 300) { // Adjust scroll threshold if needed
             if(scrollToTopBtn) scrollToTopBtn.classList.add('visible');
             if(whatsappIcon) whatsappIcon.classList.add('visible');
        } else {
             if(scrollToTopBtn) scrollToTopBtn.classList.remove('visible');
             // Keep whatsapp visible at top unless it's scrolled past the threshold
             // Or hide it only when scrollY <= 300, then show it when > 300
             // Let's make them both appear/disappear together for simplicity
             if(whatsappIcon) whatsappIcon.classList.remove('visible');
        }
    };
    window.addEventListener('scroll', handleScroll);
    // Initial check on page load
    handleScroll();


    // --- Mobile Menu Toggle ---
    if (hamburger && mobileMenuWrapper) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            // Toggle the active class on the mobile menu wrapper
            mobileMenuWrapper.classList.toggle('active');
            // Prevent body scroll when menu is open
            document.body.style.overflow = mobileMenuWrapper.classList.contains('active') ? 'hidden' : '';
        });
    }


    // Close mobile menu on link click (targets ALL .nav-links)
    navLinks.forEach(link => link.addEventListener('click', () => {
        // Check if the mobile menu wrapper is currently active (meaning we are in mobile view with menu open)
        if (mobileMenuWrapper && mobileMenuWrapper.classList.contains('active')) {
            if(hamburger) hamburger.classList.remove('active');
            // Remove active class from the mobile menu wrapper
            mobileMenuWrapper.classList.remove('active');
            document.body.style.overflow = ''; // Re-enable scroll
        }
        // If not in mobile menu, the click behaves as a standard anchor link
    }));

    // --- Theme Toggle ---
    const setTheme = (theme) => {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('preferredTheme', theme);
        // CSS handles the icon switching based on data-theme on body
    };

    // Loop through all theme toggle buttons
    themeToggles.forEach(button => {
        button.addEventListener('click', () => {
            const currentTheme = document.body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    });

    // Load saved theme or default explicitly to dark
    const savedTheme = localStorage.getItem('preferredTheme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        // The HTML body has data-theme="dark" by default.
        // You can optionally set it here to save 'dark' to localStorage on the very first visit.
        // setTheme('dark');
    }


     // --- Intersection Observer for Scroll Animations ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
            const delay = entry.target.dataset.delay || '0'; // Get delay from data-attribute
            if (entry.isIntersecting) {
                 entry.target.style.setProperty('--delay-offset', `${delay}s`); // Set delay variable
                entry.target.classList.add('is-visible');
                // Optionally stop observing once animated
                // observerInstance.unobserve(entry.target);
            } else {
                 // Optional: Reset animation on scroll out (remove the lines below if you don't want this)
                 // entry.target.classList.remove('is-visible');
                 // entry.target.style.removeProperty('--delay-offset'); // Remove delay for next scroll-in
            }
        });
    }, { threshold: 0.1 }); // Adjust threshold as needed

    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // --- Service Card 3D Tilt Effect ---
    serviceCards.forEach(card => {
        // Check if it's a touch device (simplified)
        const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

        if (!isTouchDevice) { // Only add mousemove for non-touch devices
             card.addEventListener('mousemove', (e) => {
                 const rect = card.getBoundingClientRect();
                 const x = e.clientX - rect.left - rect.width / 2; // X position from center
                 const y = e.clientY - rect.top - rect.height / 2; // Y position from center

                 const rotateY = (x / (rect.width / 2)) * 5; // Reduced max rotation
                 const rotateX = (-y / (rect.height / 2)) * 5; // Reduced max rotation

                 card.style.setProperty('--tiltX', `${rotateX}deg`);
                 card.style.setProperty('--tiltY', `${rotateY}deg`);
                 // Apply hover transform including tilt
                 card.style.transform = `translateY(-5px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
             });

             card.addEventListener('mouseleave', () => {
                 card.style.removeProperty('--tiltX');
                 card.style.removeProperty('--tiltY');
                 card.style.transform = 'translateY(0) rotateX(0deg) rotateY(0deg) translateZ(0px)'; // Reset transform
             });
        }
    });

    // --- Contact Form Submission ---
    // IMPORTANT: Replace 'YOUR_FORM_ENDPOINT_HERE' with your actual endpoint
    // like Formspree, EmailJS, or your custom backend API.
    // For Formspree, it looks like https://formspree.io/f/yourhashhere
    const formEndpoint = 'YOUR_FORM_ENDPOINT_HERE'; // <<< CHANGE THIS LINE

    if (contactForm && formEndpoint && formEndpoint !== 'YOUR_FORM_ENDPOINT_HERE') {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const submitButton = contactForm.querySelector('.submit-btn');
            const submitButtonText = submitButton.querySelector('.btn-text');

            formStatus.textContent = ''; // Clear previous status
            formStatus.className = 'form-status'; // Reset classes
            submitButton.classList.add('loading');
            submitButton.disabled = true;
            if(submitButtonText) submitButtonText.textContent = 'Sending...';

            try {
                const response = await fetch(formEndpoint, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    showFormConfirmation();
                    contactForm.reset();
                } else {
                    // Handle errors from the server
                    const data = await response.json().catch(() => ({})); // Try to parse JSON, fallback to empty object
                    formStatus.textContent = data.error || 'Oops! There was a problem submitting the form.';
                    formStatus.classList.add('error', 'visible');
                    console.error('Form submission failed:', response.status, data.error);
                }
            } catch (error) {
                // Handle network errors
                console.error('Form submission network error:', error);
                formStatus.textContent = 'Network error. Please check your connection and try again.';
                formStatus.classList.add('error', 'visible');
            } finally {
                 submitButton.classList.remove('loading');
                 submitButton.disabled = false;
                 if(submitButtonText) submitButtonText.textContent = 'Send Message';
                 // Hide status message after a few seconds if it's not the confirmation overlay
                 if (!formConfirmation || !formConfirmation.classList.contains('show')) {
                      setTimeout(() => { formStatus.classList.remove('visible'); }, 5000); // Hide error after 5s
                 }
            }
        });
    } else if (contactForm) {
        console.warn("Contact form endpoint is not set. Form submissions will not work.");
         const submitButton = contactForm.querySelector('.submit-btn');
         if(submitButton) submitButton.disabled = true; // Disable form if no endpoint
         if(formStatus) {
              formStatus.textContent = "Form is disabled (endpoint not configured).";
              formStatus.classList.add('error', 'visible');
              setTimeout(() => { formStatus.classList.remove('visible'); }, 10000);
         }
    }


    // --- Form Confirmation Animation ---
    const showFormConfirmation = () => {
        if (formConfirmation) {
            formConfirmation.classList.add('show');
            setTimeout(() => {
                formConfirmation.classList.remove('show');
            }, 2500); // Hide after 2.5 seconds
        } else { // Fallback to text message if overlay not found
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
             if (modal) {
                closeModal(modal);
             }
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

    // Close modal on pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });


    // --- Scroll to Top --- (Visibility handled in handleScroll)
    if (scrollToTopBtn) {
         scrollToTopBtn.addEventListener('click', (e) => {
             e.preventDefault(); // Prevent default anchor behavior
             window.scrollTo({
                 top: 0,
                 behavior: 'smooth' // Smooth scrolling effect
             });
         });
    }

    // --- Whatsapp Icon Visibility ---
    // Visibility is now tied to scroll threshold via handleScroll


}); // End DOMContentLoaded
