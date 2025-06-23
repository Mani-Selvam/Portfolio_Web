// Advanced animations and effects for portfolio website
class AnimationManager {
    constructor() {
        this.observers = new Map();
        this.animationQueue = [];
        this.isInitialized = false;
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.init();
    }
    
    init() {
        if (this.isInitialized) return;
        
        this.setupIntersectionObservers();
        this.initializeGSAP();
        this.setupScrollTriggers();
        this.initializeTextAnimations();
        this.initializeMouseEffects();
        this.initializeLoadingAnimations();
        
        this.isInitialized = true;
    }
    
    // Setup intersection observers for scroll-based animations
    setupIntersectionObservers() {
        // Main content observer
        const contentObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerAnimation(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -10% 0px'
        });
        
        // Observe all elements with animation classes
        document.querySelectorAll('.reveal-element, .animate-on-scroll').forEach(el => {
            contentObserver.observe(el);
        });
        
        this.observers.set('content', contentObserver);
        
        // Skills bars observer
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateSkillBars(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        document.querySelectorAll('.skills-category').forEach(el => {
            skillsObserver.observe(el);
        });
        
        this.observers.set('skills', skillsObserver);
    }
    
    // Initialize GSAP-like animations using pure CSS/JS
    initializeGSAP() {
        // Custom easing functions
        this.easings = {
            easeOutCubic: t => 1 - Math.pow(1 - t, 3),
            easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
            easeOutElastic: t => {
                const c4 = (2 * Math.PI) / 3;
                return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
            },
            easeOutBounce: t => {
                const n1 = 7.5625;
                const d1 = 2.75;
                if (t < 1 / d1) {
                    return n1 * t * t;
                } else if (t < 2 / d1) {
                    return n1 * (t -= 1.5 / d1) * t + 0.75;
                } else if (t < 2.5 / d1) {
                    return n1 * (t -= 2.25 / d1) * t + 0.9375;
                } else {
                    return n1 * (t -= 2.625 / d1) * t + 0.984375;
                }
            }
        };
    }
    
    // Setup scroll-triggered animations
    setupScrollTriggers() {
        let ticking = false;
        
        const updateAnimations = () => {
            if (this.reducedMotion) return;
            
            const scrollY = window.pageYOffset;
            const windowHeight = window.innerHeight;
            
            // Parallax effects
            this.updateParallax(scrollY);
            
            // Progress indicators
            this.updateScrollProgress(scrollY);
            
            // Floating elements
            this.updateFloatingElements(scrollY);
            
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateAnimations);
                ticking = true;
            }
        });
    }
    
    // Initialize text animations
    initializeTextAnimations() {
        // Typewriter effect for hero text
        this.initTypewriter();
        
        // Text reveal animations
        this.initTextReveal();
        
        // Gradient text animations
        this.initGradientText();
    }
    
    // Typewriter effect
    initTypewriter() {
        const typewriterElements = document.querySelectorAll('.typewriter');
        
        typewriterElements.forEach(element => {
            const text = element.textContent;
            const speed = element.dataset.speed || 50;
            let i = 0;
            
            element.textContent = '';
            element.style.borderRight = '2px solid var(--primary-color)';
            
            const typeWriter = () => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, speed);
                } else {
                    // Blinking cursor effect
                    setInterval(() => {
                        element.style.borderRight = element.style.borderRight === 'none' ? 
                            '2px solid var(--primary-color)' : 'none';
                    }, 500);
                }
            };
            
            typeWriter();
        });
    }
    
    // Text reveal animation
    initTextReveal() {
        const revealElements = document.querySelectorAll('.text-reveal');
        
        revealElements.forEach(element => {
            const words = element.textContent.split(' ');
            element.innerHTML = words.map(word => 
                `<span class="word"><span class="word-inner">${word}</span></span>`
            ).join(' ');
            
            const wordElements = element.querySelectorAll('.word-inner');
            wordElements.forEach((word, index) => {
                word.style.transform = 'translateY(100%)';
                word.style.transition = `transform 0.6s cubic-bezier(0.23, 1, 0.32, 1) ${index * 0.1}s`;
            });
            
            // Trigger animation when in view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        wordElements.forEach(word => {
                            word.style.transform = 'translateY(0)';
                        });
                        observer.disconnect();
                    }
                });
            });
            
            observer.observe(element);
        });
    }
    
    // Gradient text animation
    initGradientText() {
        const gradientTexts = document.querySelectorAll('.gradient-text');
        
        gradientTexts.forEach(element => {
            element.style.background = 'linear-gradient(45deg, var(--primary-color), var(--secondary-color), var(--accent-color))';
            element.style.backgroundSize = '300% 300%';
            element.style.webkitBackgroundClip = 'text';
            element.style.webkitTextFillColor = 'transparent';
            element.style.backgroundClip = 'text';
            element.style.animation = 'gradientShift 3s ease-in-out infinite';
        });
    }
    
    // Mouse interaction effects
    initializeMouseEffects() {
        // Magnetic effect for buttons
        this.initMagneticEffect();
        
        // Ripple effect on click
        this.initRippleEffect();
        
        // Tilt effect for cards
        this.initTiltEffect();
    }
    
    // Magnetic effect for interactive elements
    initMagneticEffect() {
        const magneticElements = document.querySelectorAll('.magnetic');
        
        magneticElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                if (this.reducedMotion) return;
                
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const distance = Math.sqrt(x * x + y * y);
                const maxDistance = 100;
                
                if (distance < maxDistance) {
                    const force = (maxDistance - distance) / maxDistance;
                    const translateX = x * force * 0.3;
                    const translateY = y * force * 0.3;
                    
                    element.style.transform = `translate(${translateX}px, ${translateY}px)`;
                }
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0, 0)';
            });
        });
    }
    
    // Ripple effect on click
    initRippleEffect() {
        const rippleElements = document.querySelectorAll('.ripple-effect');
        
        rippleElements.forEach(element => {
            element.addEventListener('click', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const ripple = document.createElement('div');
                ripple.className = 'ripple';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                
                element.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }
    
    // 3D tilt effect for cards
    initTiltEffect() {
        const tiltElements = document.querySelectorAll('.tilt-effect');
        
        tiltElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                if (this.reducedMotion) return;
                
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / centerY * -10;
                const rotateY = (x - centerX) / centerX * 10;
                
                element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }
    
    // Loading animations
    initializeLoadingAnimations() {
        // Skeleton loading effect
        const skeletonElements = document.querySelectorAll('.skeleton');
        skeletonElements.forEach(element => {
            element.style.background = 'linear-gradient(90deg, var(--surface-secondary) 25%, var(--surface-primary) 50%, var(--surface-secondary) 75%)';
            element.style.backgroundSize = '200% 100%';
            element.style.animation = 'skeletonLoading 1.5s infinite';
        });
    }
    
    // Trigger specific animations
    triggerAnimation(element) {
        if (element.classList.contains('revealed')) return;
        
        element.classList.add('revealed');
        
        // Stagger children animations
        if (element.classList.contains('stagger-children')) {
            const children = element.children;
            Array.from(children).forEach((child, index) => {
                setTimeout(() => {
                    child.classList.add('animate-in');
                }, index * 100);
            });
        }
        
        // Counter animations
        if (element.classList.contains('counter')) {
            this.animateCounter(element);
        }
        
        // Progress bar animations
        if (element.classList.contains('progress-bar')) {
            this.animateProgressBar(element);
        }
    }
    
    // Animate skill bars
    animateSkillBars(container) {
        const skillBars = container.querySelectorAll('.skill-progress');
        
        skillBars.forEach((bar, index) => {
            setTimeout(() => {
                const width = bar.dataset.width;
                bar.style.width = width + '%';
            }, index * 200);
        });
    }
    
    // Animate counters
    animateCounter(element) {
        const target = parseInt(element.dataset.target);
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeProgress = this.easings.easeOutCubic(progress);
            const current = Math.floor(start + (target - start) * easeProgress);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };
        
        requestAnimationFrame(updateCounter);
    }
    
    // Animate progress bars
    animateProgressBar(element) {
        const progress = element.querySelector('.progress-fill');
        const percentage = element.dataset.percentage;
        
        progress.style.width = percentage + '%';
    }
    
    // Update parallax elements
    updateParallax(scrollY) {
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.speed) || 0.5;
            const yPos = scrollY * speed;
            
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    // Update scroll progress
    updateScrollProgress(scrollY) {
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollY / documentHeight) * 100;
        
        const progressBar = document.getElementById('scroll-progress');
        if (progressBar) {
            progressBar.style.width = Math.min(progress, 100) + '%';
        }
    }
    
    // Update floating elements
    updateFloatingElements(scrollY) {
        const floatingElements = document.querySelectorAll('.floating');
        
        floatingElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = Math.sin(scrollY * 0.01 + index) * 10 * speed;
            
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    // Animate element into view
    animateIn(element, options = {}) {
        const {
            duration = 600,
            delay = 0,
            easing = 'easeOutCubic',
            from = { opacity: 0, y: 30 },
            to = { opacity: 1, y: 0 }
        } = options;
        
        if (this.reducedMotion) {
            Object.assign(element.style, {
                opacity: to.opacity,
                transform: `translateY(${to.y}px)`
            });
            return Promise.resolve();
        }
        
        return new Promise(resolve => {
            setTimeout(() => {
                const startTime = performance.now();
                const startValues = { ...from };
                const endValues = { ...to };
                
                const animate = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const easedProgress = this.easings[easing](progress);
                    
                    // Interpolate values
                    const currentOpacity = startValues.opacity + (endValues.opacity - startValues.opacity) * easedProgress;
                    const currentY = startValues.y + (endValues.y - startValues.y) * easedProgress;
                    
                    element.style.opacity = currentOpacity;
                    element.style.transform = `translateY(${currentY}px)`;
                    
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        resolve();
                    }
                };
                
                requestAnimationFrame(animate);
            }, delay);
        });
    }
    
    // Batch animate multiple elements
    animateGroup(elements, options = {}) {
        const { stagger = 100 } = options;
        
        return Promise.all(
            elements.map((element, index) => 
                this.animateIn(element, {
                    ...options,
                    delay: (options.delay || 0) + (index * stagger)
                })
            )
        );
    }
    
    // Cleanup observers
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        this.isInitialized = false;
    }
}

// Particle system for background effects
class ParticleSystem {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.isAnimating = false;
        
        this.options = {
            particleCount: 50,
            particleSize: 2,
            particleSpeed: 1,
            particleColor: 'rgba(102, 126, 234, 0.6)',
            connectionDistance: 150,
            mouseRadius: 100,
            ...options
        };
        
        this.init();
    }
    
    init() {
        this.resizeCanvas();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        this.particles = [];
        
        for (let i = 0; i < this.options.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.options.particleSpeed,
                vy: (Math.random() - 0.5) * this.options.particleSpeed,
                size: Math.random() * this.options.particleSize + 1
            });
        }
    }
    
    bindEvents() {
        window.addEventListener('resize', () => this.resizeCanvas());
        
        this.canvas.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x <= 0 || particle.x >= this.canvas.width) {
                particle.vx *= -1;
            }
            if (particle.y <= 0 || particle.y >= this.canvas.height) {
                particle.vy *= -1;
            }
            
            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.options.mouseRadius) {
                const force = (this.options.mouseRadius - distance) / this.options.mouseRadius;
                particle.vx += dx * force * 0.01;
                particle.vy += dy * force * 0.01;
            }
        });
    }
    
    drawParticles() {
        this.ctx.fillStyle = this.options.particleColor;
        
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    drawConnections() {
        this.ctx.strokeStyle = this.options.particleColor;
        this.ctx.lineWidth = 0.5;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.options.connectionDistance) {
                    const opacity = 1 - (distance / this.options.connectionDistance);
                    this.ctx.globalAlpha = opacity * 0.3;
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
        
        this.ctx.globalAlpha = 1;
    }
    
    animate() {
        if (!this.isAnimating) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.updateParticles();
        this.drawConnections();
        this.drawParticles();
        
        requestAnimationFrame(() => this.animate());
    }
    
    start() {
        this.isAnimating = true;
        this.animate();
    }
    
    stop() {
        this.isAnimating = false;
    }
}

// Export for use in main.js
window.AnimationManager = AnimationManager;
window.ParticleSystem = ParticleSystem;

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.animationManager = new AnimationManager();
    
    // Initialize particle system for hero section
    const particlesCanvas = document.getElementById('particles-canvas');
    if (particlesCanvas) {
        window.particleSystem = new ParticleSystem(particlesCanvas);
        window.particleSystem.start();
    }
});

