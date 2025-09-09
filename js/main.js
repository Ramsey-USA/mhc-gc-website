// MH Construction - Main JavaScript

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeHomepage();
    initializeNavigation();
    initializeScrollEffects();
    initializeFormHandling();
});

// Homepage initialization
function initializeHomepage() {
    // Only run on homepage
    if (!document.querySelector('.homepage')) return;
    
    initializeHeroVideo();
    initializeFlipCards();
    initializeCarousel();
    initializeTeamDropdown();
    initializeScrollAnimations();
}

// Hero video initialization
function initializeHeroVideo() {
    const heroVideo = document.getElementById('hero-video');
    if (!heroVideo) return;
    
    // Ensure video plays automatically
    heroVideo.play().catch(error => {
        console.log('Video autoplay failed:', error);
    });
    
    // Pause video when not in viewport (performance optimization)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                heroVideo.play();
            } else {
                heroVideo.pause();
            }
        });
    });
    
    observer.observe(heroVideo);
}

// Flip cards functionality
function initializeFlipCards() {
    const flipCards = document.querySelectorAll('.flip-card');
    
    flipCards.forEach(card => {
        let isFlipped = false;
        
        // Handle click/touch
        card.addEventListener('click', function() {
            isFlipped = !isFlipped;
            this.classList.toggle('flipped', isFlipped);
            
            // Track analytics
            if (window.analyticsHelper) {
                window.analyticsHelper.trackEvent('flip_card_interaction', {
                    card_type: this.dataset.type || 'unknown',
                    event_category: 'engagement'
                });
            }
        });
        
        // Handle hover on desktop
        if (!window.matchMedia('(hover: none)').matches) {
            card.addEventListener('mouseenter', function() {
                if (!isFlipped) {
                    this.classList.add('flipped');
                }
            });
            
            card.addEventListener('mouseleave', function() {
                if (!isFlipped) {
                    this.classList.remove('flipped');
                }
            });
        }
        
        // Handle keyboard navigation
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // Make focusable
        card.setAttribute('tabindex', '0');
    });
}

// Carousel functionality
function initializeCarousel() {
    const carousel = document.querySelector('.blog-carousel');
    if (!carousel) return;
    
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    const dots = carousel.querySelectorAll('.carousel-dot');
    
    let currentSlide = 0;
    let autoAdvanceInterval;
    
    function updateCarousel() {
        const slideWidth = slides[0].offsetWidth;
        track.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
        
        // Update button states
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === slides.length - 1;
    }
    
    function nextSlide() {
        if (currentSlide < slides.length - 1) {
            currentSlide++;
            updateCarousel();
        } else {
            // Loop back to first slide
            currentSlide = 0;
            updateCarousel();
        }
    }
    
    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateCarousel();
        }
    }
    
    function goToSlide(index) {
        currentSlide = index;
        updateCarousel();
    }
    
    // Event listeners
    nextBtn.addEventListener('click', () => {
        nextSlide();
        restartAutoAdvance();
    });
    
    prevBtn.addEventListener('click', () => {
        prevSlide();
        restartAutoAdvance();
    });
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            restartAutoAdvance();
        });
    });
    
    // Touch/swipe support
    let startX = 0;
    let endX = 0;
    
    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });
    
    track.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        
        if (Math.abs(diff) > 50) { // Minimum swipe distance
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            restartAutoAdvance();
        }
    });
    
    // Auto-advance functionality
    function startAutoAdvance() {
        autoAdvanceInterval = setInterval(nextSlide, 5000); // 5 seconds
    }
    
    function stopAutoAdvance() {
        clearInterval(autoAdvanceInterval);
    }
    
    function restartAutoAdvance() {
        stopAutoAdvance();
        startAutoAdvance();
    }
    
    // Pause auto-advance on hover
    carousel.addEventListener('mouseenter', stopAutoAdvance);
    carousel.addEventListener('mouseleave', startAutoAdvance);
    
    // Pause auto-advance when page is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoAdvance();
        } else {
            startAutoAdvance();
        }
    });
    
    // Initialize
    updateCarousel();
    startAutoAdvance();
    
    // Handle window resize
    window.addEventListener('resize', updateCarousel);
}

// Team dropdown functionality
function initializeTeamDropdown() {
    const dropdown = document.querySelector('.team-dropdown');
    if (!dropdown) return;
    
    const toggle = dropdown.querySelector('.dropdown-toggle');
    const content = dropdown.querySelector('.dropdown-content');
    const membersList = dropdown.querySelector('.team-members-list');
    
    let isOpen = false;
    
    // Load team members
    loadTeamMembers();
    
    async function loadTeamMembers() {
        try {
            const teamMembers = await window.firestore.getTeamMembers();
            
            membersList.innerHTML = teamMembers
                .sort((a, b) => a.order - b.order)
                .map(member => `
                    <a href="team/${member.id}.html" class="dropdown-item team-member-item">
                        <div class="member-info">
                            <strong>${member.name}</strong>
                            <span>${member.position}</span>
                        </div>
                    </a>
                `).join('');
        } catch (error) {
            console.error('Error loading team members:', error);
            membersList.innerHTML = '<div class="dropdown-item">Unable to load team members</div>';
        }
    }
    
    function toggleDropdown() {
        isOpen = !isOpen;
        content.classList.toggle('active', isOpen);
        toggle.setAttribute('aria-expanded', isOpen);
        
        if (isOpen && window.analyticsHelper) {
            window.analyticsHelper.trackEvent('team_dropdown_opened', {
                event_category: 'engagement'
            });
        }
    }
    
    function closeDropdown() {
        isOpen = false;
        content.classList.remove('active');
        toggle.setAttribute('aria-expanded', false);
    }
    
    // Event listeners
    toggle.addEventListener('click', (e) => {
        e.preventDefault();
        toggleDropdown();
    });
    
    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            closeDropdown();
        }
    });
    
    // Keyboard navigation
    toggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleDropdown();
        } else if (e.key === 'Escape') {
            closeDropdown();
        }
    });
}

// Navigation functionality
function initializeNavigation() {
    const header = document.querySelector('.header');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    
    // Mobile menu toggle
    if (mobileToggle && nav) {
        mobileToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            
            // Update aria-expanded
            const isExpanded = nav.classList.contains('active');
            mobileToggle.setAttribute('aria-expanded', isExpanded);
        });
        
        // Close mobile menu on nav link click
        nav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                mobileToggle.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', false);
            });
        });
    }
    
    // Header scroll effect
    if (header) {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScrollY = currentScrollY;
        });
    }
}

// Scroll effects and animations
function initializeScrollEffects() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .slide-in-bottom').forEach(el => {
        observer.observe(el);
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize scroll animations
function initializeScrollAnimations() {
    // Counter animation for stats
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Counter animation
function animateCounter(element) {
    const target = parseInt(element.dataset.target || element.textContent);
    const duration = 2000; // 2 seconds
    const start = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(target * easeOut);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }
    
    requestAnimationFrame(update);
}

// Form handling
function initializeFormHandling() {
    // Generic form handler
    document.querySelectorAll('form[data-ajax="true"]').forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });
    
    // Newsletter signup
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
    
    // Quick contact form
    const quickContactForm = document.getElementById('quick-contact-form');
    if (quickContactForm) {
        quickContactForm.addEventListener('submit', handleQuickContactSubmit);
    }
}

// Generic form submit handler
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    try {
        // Save to Firebase
        if (window.firestore) {
            await window.firestore.saveLeadProgression({
                ...data,
                formType: form.dataset.formType || 'contact',
                leadSource: 'website_form',
                leadQuality: 'medium'
            });
        }
        
        // Send to CRM
        if (window.crmIntegration) {
            await window.crmIntegration.sendLead(data);
        }
        
        // Show success message
        showSuccessMessage('Thank you! We\'ll be in touch within 24 hours.');
        
        // Reset form
        form.reset();
        
        // Track analytics
        if (window.analyticsHelper) {
            window.analyticsHelper.trackEvent('form_submission', {
                form_type: form.dataset.formType || 'contact',
                event_category: 'lead_generation'
            });
        }
        
    } catch (error) {
        console.error('Form submission error:', error);
        showErrorMessage('There was an error sending your message. Please try again.');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Newsletter signup handler
async function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const email = form.querySelector('input[type="email"]').value;
    
    try {
        await window.firestore.saveLeadProgression({
            email: email,
            leadType: 'newsletter',
            leadSource: 'homepage_newsletter',
            leadQuality: 'low'
        });
        
        showSuccessMessage('Thanks for subscribing to our newsletter!');
        form.reset();
        
        if (window.analyticsHelper) {
            window.analyticsHelper.trackEvent('newsletter_signup', {
                event_category: 'lead_generation'
            });
        }
        
    } catch (error) {
        console.error('Newsletter signup error:', error);
        showErrorMessage('Error subscribing to newsletter. Please try again.');
    }
}

// Quick contact handler
async function handleQuickContactSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    try {
        await window.firestore.saveLeadProgression({
            ...data,
            leadType: 'quick_contact',
            leadSource: 'homepage_quick_contact',
            leadQuality: 'high'
        });
        
        showSuccessMessage('Message sent! We\'ll contact you within 24 hours.');
        form.reset();
        
        if (window.analyticsHelper) {
            window.analyticsHelper.trackEvent('quick_contact_submission', {
                event_category: 'lead_generation'
            });
        }
        
    } catch (error) {
        console.error('Quick contact error:', error);
        showErrorMessage('Error sending message. Please try again.');
    }
}

// Utility functions
function showSuccessMessage(message) {
    if (window.toast) {
        window.toast.success(message);
    } else {
        alert(message);
    }
}

function showErrorMessage(message) {
    if (window.toast) {
        window.toast.error(message);
    } else {
        alert(message);
    }
}

// Performance optimization: Lazy load images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', initializeLazyLoading);

// Export functions for use in other modules
window.MHConstruction = {
    initializeHomepage,
    initializeNavigation,
    initializeScrollEffects,
    showSuccessMessage,
    showErrorMessage
};