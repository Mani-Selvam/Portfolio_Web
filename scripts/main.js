// Main JavaScript file for portfolio website
document.addEventListener('DOMContentLoaded', function () {
    // Initialize all components
    initializeLoading();
    initializeNavigation();
    initializeCustomCursor();
    initializeScrollProgress();
    initializeHeroAnimation();
    initializeScrollAnimations();
    initializeCounterAnimation();
    initializeSkillsAnimation();
    initializeProjectsModal();
    initializeContactForm();
    initializeParallaxEffects();
    initializeSmoothScrolling();
});

// Loading screen management
function initializeLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    const minLoadingTime = 1500; // Minimum loading time for better UX
    const startTime = Date.now();

    window.addEventListener('load', function () {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            document.body.style.overflow = 'visible';

            // Trigger entrance animations
            triggerEntranceAnimations();
        }, remainingTime);
    });
}

// Navigation functionality
function initializeNavigation() {
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Scroll effect on navigation
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // Add scrolled class for styling
        if (currentScrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Update active navigation link
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (currentScrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });

        lastScrollY = currentScrollY;
    });

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Custom cursor implementation
function initializeCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    const cursorInner = cursor.querySelector('.cursor-inner');
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    // Only initialize on non-touch devices
    if (window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Smooth cursor movement
        function animateCursor() {
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;

            cursorX += dx * 0.1;
            cursorY += dy * 0.1;

            cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px)`;
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Cursor hover effects
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-item, .contact-item');

        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
            });

            element.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
            });

            element.addEventListener('mousedown', () => {
                cursor.classList.add('click');
            });

            element.addEventListener('mouseup', () => {
                cursor.classList.remove('click');
            });
        });
    } else {
        cursor.style.display = 'none';
    }
}

// Scroll progress indicator
function initializeScrollProgress() {
    const scrollProgress = document.getElementById('scroll-progress');

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / documentHeight) * 100;

        scrollProgress.style.width = scrollPercent + '%';
    });
}

// Hero section animations
function initializeHeroAnimation() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = 50;

    // Resize canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
        constructor () {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            this.opacity = Math.random() * 0.5 + 0.3;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.fillStyle = `rgba(102, 126, 234, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Animation loop
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        requestAnimationFrame(animateParticles);
    }

    animateParticles();

    // Hero button functionality
    const primaryCTA = document.querySelector('.primary-cta');
    const secondaryCTA = document.querySelector('.secondary-cta');

    primaryCTA.addEventListener('click', () => {
        document.getElementById('projects').scrollIntoView({
            behavior: 'smooth'
        });
    });

    secondaryCTA.addEventListener('click', () => {
        document.getElementById('contact').scrollIntoView({
            behavior: 'smooth'
        });
    });
}

// Scroll-based animations using Intersection Observer
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');

                // Trigger specific animations based on element
                if (entry.target.classList.contains('stat-number')) {
                    animateCounter(entry.target);
                }

                if (entry.target.classList.contains('skill-progress')) {
                    animateSkillBar(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe all reveal elements
    const revealElements = document.querySelectorAll('.reveal-element');
    revealElements.forEach(element => {
        observer.observe(element);
    });
}

// Counter animation for statistics
function initializeCounterAnimation() {
    window.animateCounter = function (element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);

            // Easing function
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(target * easeOutCubic);

            element.textContent = currentValue;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }

        requestAnimationFrame(updateCounter);
    };
}

// Skills section animations
function initializeSkillsAnimation() {
    window.animateSkillBar = function (progressBar) {
        const targetWidth = progressBar.getAttribute('data-width');
        progressBar.style.width = targetWidth + '%';
    };
}



// Smooth scrolling enhancements
function initializeSmoothScrolling() {
    // Add smooth scrolling to all anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip if it's just '#'
            if (href === '#') return;

            e.preventDefault();

            const targetElement = document.querySelector(href);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Entrance animations after loading
function triggerEntranceAnimations() {
    // Hero section animations
    const heroElements = document.querySelectorAll('.hero-greeting, .hero-name, .hero-role, .hero-description, .hero-actions');
    heroElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });

    // Navigation fade in
    const nav = document.querySelector('.nav');
    setTimeout(() => {
        nav.style.opacity = '1';
        nav.style.transform = 'translateY(0)';
    }, 500);
}

// Utility functions
function debounce(func, wait) {
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

function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Performance optimizations
function initializePerformanceOptimizations() {
    // Lazy load images when they exist
    const images = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window && images.length > 0) {
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

        images.forEach(img => imageObserver.observe(img));
    }

    // Preload critical resources
    const criticalResources = [
        'styles/main.css',
        'styles/themes.css',
        'styles/animations.css'
    ];

    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = resource.endsWith('.css') ? 'style' : 'script';
        link.href = resource;
        document.head.appendChild(link);
    });
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error occurred:', e.error);
    // You could send this to an error tracking service
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // You could send this to an error tracking service
});

// Initialize performance optimizations
initializePerformanceOptimizations();









function initializeContactForm() {
    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const submitBtn = form.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');

    const formInputs = form.querySelectorAll('.form-input');
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });

    function validateForm(formData) {
        const errors = [];

        if (!formData.get('name').trim()) {
            errors.push('Name is required');
        }

        const email = formData.get('email').trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            errors.push('Email is required');
        } else if (!emailRegex.test(email)) {
            errors.push('Please enter a valid email address');
        }

        if (!formData.get('subject').trim()) {
            errors.push('Subject is required');
        }

        if (!formData.get('message').trim()) {
            errors.push('Message is required');
        }

        return errors;
    }

    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type} show`;
        setTimeout(() => {
            formMessage.classList.remove('show');
        }, 5000);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const errors = validateForm(formData);

        if (errors.length > 0) {
            showFormMessage(errors.join(', '), 'error');
            return;
        }

        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
            emailjs.init("BBBpJAyMTdhk8Ta6l"); // Only once

            await emailjs.sendForm(
                "service_0dq1qnk",
                "template_k64h1pe",
                form
            );

            submitBtn.classList.remove('loading');
            submitBtn.classList.add('success');
            showFormMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
            form.reset();

            formInputs.forEach(input => {
                input.parentElement.classList.remove('focused');
            });

            setTimeout(() => {
                submitBtn.classList.remove('success');
                submitBtn.disabled = false;
            }, 3000);
        } catch (error) {
            console.error(error);
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            showFormMessage('Failed to send message. Please try again.', 'error');
        }
    });
}

initializeContactForm();
