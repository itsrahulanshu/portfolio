// Portfolio JavaScript - Modern ES6+ Implementation

class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initSmoothScroll();
        this.initActiveNavigation();
        this.initScrollAnimations();
        this.initContactForm();
        this.initTypingEffect();
        this.initParallaxEffect();
    }

    setupEventListeners() {
        // Mobile menu toggle
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Close mobile menu when clicking on a link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        }

        // Escape key to close mobile menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                hamburger?.classList.remove('active');
                navMenu?.classList.remove('active');
            }
        });

        // Window resize handler
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        // Scroll handler
        window.addEventListener('scroll', this.throttle(() => {
            this.handleScroll();
        }, 16));
    }

    initSmoothScroll() {
        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (target) {
                    const headerOffset = 100;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Smooth scroll for CTA buttons
        const ctaButtons = document.querySelectorAll('.btn[href^="#"]');
        ctaButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = button.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    initActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -80% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentSection = entry.target.getAttribute('id');
                    
                    // Remove active class from all nav links
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                    });
                    
                    // Add active class to current section's nav link
                    const activeLink = document.querySelector(`.nav-link[href="#${currentSection}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    initScrollAnimations() {
        // Initialize AOS if available
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 100,
                delay: 100
            });
        } else {
            // Fallback intersection observer for fade-in animations
            this.initFallbackAnimations();
        }

        // Parallax effect for floating shapes
        this.initParallaxShapes();
    }

    initFallbackAnimations() {
        const animatedElements = document.querySelectorAll('.glass-card, .stat-card, .project-card, .principle-card, .skill-category');
        
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            animationObserver.observe(element);
        });
    }

    initParallaxShapes() {
        const shapes = document.querySelectorAll('.floating-shape');
        
        window.addEventListener('scroll', this.throttle(() => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            shapes.forEach((shape, index) => {
                const speed = (index + 1) * 0.1;
                shape.style.transform = `translateY(${rate * speed}px)`;
            });
        }, 16));
    }

    initContactForm() {
        const form = document.getElementById('contact-form');
        const submitBtn = document.getElementById('submit-btn');
        
        if (!form || !submitBtn) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!this.validateForm(form)) {
                return;
            }

            // Show loading state
            this.setLoadingState(submitBtn, true);
            
            try {
                // Simulate form submission (replace with actual endpoint)
                await this.submitForm(new FormData(form));
                
                // Show success message
                this.showMessage('Thank you! Your message has been sent successfully.', 'success');
                form.reset();
                
            } catch (error) {
                console.error('Form submission error:', error);
                this.showMessage('Sorry, there was an error sending your message. Please try again.', 'error');
            } finally {
                this.setLoadingState(submitBtn, false);
            }
        });

        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }

    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Clear previous errors
        this.clearFieldError(field);

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            errorMessage = `${this.getFieldLabel(fieldName)} is required.`;
            isValid = false;
        }
        // Email validation
        else if (fieldName === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'Please enter a valid email address.';
                isValid = false;
            }
        }
        // Name validation
        else if (fieldName === 'name' && value) {
            if (value.length < 2) {
                errorMessage = 'Name must be at least 2 characters long.';
                isValid = false;
            }
        }
        // Message validation
        else if (fieldName === 'message' && value) {
            if (value.length < 10) {
                errorMessage = 'Message must be at least 10 characters long.';
                isValid = false;
            }
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Add new error message
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 5px;
            opacity: 0;
            transform: translateY(-10px);
            transition: all 0.3s ease;
        `;
        
        field.parentNode.appendChild(errorElement);
        
        // Animate in
        setTimeout(() => {
            errorElement.style.opacity = '1';
            errorElement.style.transform = 'translateY(0)';
        }, 10);

        // Update field styles
        field.style.borderColor = '#ef4444';
        field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    }

    clearFieldError(field) {
        field.classList.remove('error');
        field.style.borderColor = '';
        field.style.boxShadow = '';
        
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.style.opacity = '0';
            errorMessage.style.transform = 'translateY(-10px)';
            setTimeout(() => errorMessage.remove(), 300);
        }
    }

    getFieldLabel(fieldName) {
        const labels = {
            name: 'Name',
            email: 'Email',
            message: 'Message'
        };
        return labels[fieldName] || fieldName;
    }

    async submitForm(formData) {
        // Simulate API call - replace with actual endpoint
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success/failure
                if (Math.random() > 0.1) { // 90% success rate
                    resolve({ success: true });
                } else {
                    reject(new Error('Network error'));
                }
            }, 2000);
        });
    }

    setLoadingState(button, isLoading) {
        if (isLoading) {
            button.disabled = true;
            button.innerHTML = `
                <span class="btn-loading">
                    <svg class="loading" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 12a9 9 0 11-6.219-8.56"/>
                    </svg>
                </span>
                Sending...
            `;
        } else {
            button.disabled = false;
            button.innerHTML = 'Send Message';
        }
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;
        
        const styles = {
            success: {
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                borderColor: 'rgba(34, 197, 94, 0.3)',
                color: '#22c55e'
            },
            error: {
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderColor: 'rgba(239, 68, 68, 0.3)',
                color: '#ef4444'
            }
        };

        messageElement.style.cssText = `
            padding: 15px 20px;
            border-radius: 8px;
            border: 1px solid ${styles[type].borderColor};
            background-color: ${styles[type].backgroundColor};
            color: ${styles[type].color};
            margin-top: 20px;
            opacity: 0;
            transform: translateY(-10px);
            transition: all 0.3s ease;
        `;

        const form = document.getElementById('contact-form');
        form.appendChild(messageElement);

        // Animate in
        setTimeout(() => {
            messageElement.style.opacity = '1';
            messageElement.style.transform = 'translateY(0)';
        }, 10);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.style.opacity = '0';
                messageElement.style.transform = 'translateY(-10px)';
                setTimeout(() => messageElement.remove(), 300);
            }
        }, 5000);
    }

    initTypingEffect() {
        const heroTitle = document.querySelector('.hero-title');
        if (!heroTitle) return;

        // Check if Typed.js is available
        if (typeof Typed !== 'undefined') {
            const titleText = heroTitle.innerHTML;
            heroTitle.innerHTML = '';
            
            new Typed(heroTitle, {
                strings: [titleText],
                typeSpeed: 50,
                showCursor: false,
                onComplete: () => {
                    heroTitle.classList.add('typing-complete');
                }
            });
        }
    }

    initParallaxEffect() {
        // Parallax effect for hero section
        const hero = document.querySelector('.hero');
        if (!hero) return;

        window.addEventListener('scroll', this.throttle(() => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3;
            
            if (scrolled < window.innerHeight) {
                hero.style.transform = `translateY(${rate}px)`;
            }
        }, 16));
    }

    handleScroll() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        // Add/remove scrolled class based on scroll position
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    handleResize() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768) {
            const hamburger = document.querySelector('.hamburger');
            const navMenu = document.querySelector('.nav-menu');
            
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        }
    }

    // Utility functions
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Enhanced scroll animations for better performance
class ScrollAnimations {
    constructor() {
        this.elements = [];
        this.init();
    }

    init() {
        // Collect all animatable elements
        this.collectElements();
        
        // Setup intersection observer
        this.setupObserver();
        
        // Add scroll-triggered animations
        this.addScrollTriggers();
    }

    collectElements() {
        const selectors = [
            '.glass-card',
            '.stat-card',
            '.project-card',
            '.principle-card',
            '.skill-category',
            '.contact-card',
            '.hero-content > *'
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                this.elements.push({
                    element,
                    animated: false
                });
            });
        });
    }

    setupObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, options);

        this.elements.forEach(({ element }) => {
            this.observer.observe(element);
        });
    }

    animateElement(element) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        
        // Add stagger effect for grouped elements
        const siblings = element.parentNode.children;
        const index = Array.from(siblings).indexOf(element);
        element.style.transitionDelay = `${index * 100}ms`;
    }

    addScrollTriggers() {
        // Counter animation for stats
        this.animateCounters();
        
        // Progress bars if any
        this.animateProgressBars();
    }

    animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/\D/g, ''));
            const suffix = counter.textContent.replace(/\d/g, '');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.countUp(counter, 0, target, suffix, 2000);
                        observer.unobserve(counter);
                    }
                });
            });
            
            observer.observe(counter);
        });
    }

    countUp(element, start, end, suffix, duration) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + suffix;
        }, 16);
    }

    animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar');
        
        progressBars.forEach(bar => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const width = bar.dataset.width || '0%';
                        bar.style.width = width;
                        observer.unobserve(bar);
                    }
                });
            });
            
            observer.observe(bar);
        });
    }
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            this.logPerformanceMetrics();
        });

        // Monitor scroll performance
        this.monitorScrollPerformance();
    }

    logPerformanceMetrics() {
        if ('performance' in window) {
            const navigation = performance.getEntriesByType('navigation')[0];
            const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
            
            console.log(`Page load time: ${loadTime}ms`);
            
            // Log to analytics if available
            if (typeof gtag !== 'undefined') {
                gtag('event', 'page_load_time', {
                    value: Math.round(loadTime),
                    custom_parameter: 'performance'
                });
            }
        }
    }

    monitorScrollPerformance() {
        let scrollCount = 0;
        let lastScrollTime = performance.now();

        window.addEventListener('scroll', () => {
            scrollCount++;
            const currentTime = performance.now();
            
            // Log if scroll performance is poor (>16ms between frames)
            if (currentTime - lastScrollTime > 16) {
                console.warn('Scroll performance issue detected');
            }
            
            lastScrollTime = currentTime;
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main app
    new PortfolioApp();
    
    // Initialize scroll animations
    new ScrollAnimations();
    
    // Initialize performance monitoring
    new PerformanceMonitor();
    
    // Add loading complete class
    document.body.classList.add('loaded');
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is hidden
        document.body.classList.add('paused');
    } else {
        // Resume animations when page is visible
        document.body.classList.remove('paused');
    }
});

// Preload critical resources
const preloadResources = () => {
    const criticalImages = [
        // Add any critical images here
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
};

// Initialize preloading
preloadResources();

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PortfolioApp, ScrollAnimations, PerformanceMonitor };
}