// Theme management system for portfolio website
class ThemeManager {
    constructor() {
        this.currentTheme = 'light';
        this.themes = {
            light: {
                name: 'Light',
                icon: 'sun'
            },
            dark: {
                name: 'Dark', 
                icon: 'moon'
            }
        };
        
        this.storageKey = 'portfolio-theme';
        this.transitionDuration = 300;
        this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        this.init();
    }
    
    init() {
        // Load saved theme or detect system preference
        this.loadTheme();
        
        // Setup theme toggle button
        this.setupThemeToggle();
        
        // Listen for system theme changes
        this.mediaQuery.addEventListener('change', this.handleSystemThemeChange.bind(this));
        
        // Apply initial theme
        this.applyTheme(this.currentTheme, false);
        
        // Setup theme transition class
        this.setupThemeTransition();
    }
    
    // Load theme from localStorage or system preference
    loadTheme() {
        const savedTheme = localStorage.getItem(this.storageKey);
        
        if (savedTheme && this.themes[savedTheme]) {
            this.currentTheme = savedTheme;
        } else {
            // Use system preference
            this.currentTheme = this.mediaQuery.matches ? 'dark' : 'light';
        }
    }
    
    // Save theme to localStorage
    saveTheme() {
        localStorage.setItem(this.storageKey, this.currentTheme);
    }
    
    // Setup theme toggle button functionality
    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;
        
        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Update button appearance
        this.updateThemeToggleIcon();
        
        // Add keyboard support
        themeToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }
    
    // Handle system theme preference changes
    handleSystemThemeChange(e) {
        // Only auto-switch if user hasn't manually selected a theme
        const savedTheme = localStorage.getItem(this.storageKey);
        if (!savedTheme) {
            const newTheme = e.matches ? 'dark' : 'light';
            this.setTheme(newTheme);
        }
    }
    
    // Toggle between light and dark themes
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
    
    // Set specific theme
    setTheme(theme, save = true) {
        if (!this.themes[theme] || theme === this.currentTheme) return;
        
        const previousTheme = this.currentTheme;
        this.currentTheme = theme;
        
        // Apply theme with transition
        this.applyTheme(theme, true);
        
        // Save theme preference
        if (save) {
            this.saveTheme();
        }
        
        // Update toggle button
        this.updateThemeToggleIcon();
        
        // Dispatch theme change event
        this.dispatchThemeChangeEvent(theme, previousTheme);
        
        // Update theme-dependent animations
        this.updateThemeAnimations();
    }
    
    // Apply theme to document
    applyTheme(theme, withTransition = false) {
        const html = document.documentElement;
        
        // Add transition class for smooth theme switching
        if (withTransition) {
            html.classList.add('theme-transition');
            
            // Remove transition class after animation
            setTimeout(() => {
                html.classList.remove('theme-transition');
            }, this.transitionDuration);
        }
        
        // Set theme attribute
        html.setAttribute('data-theme', theme);
        
        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor(theme);
        
        // Update favicon if needed
        this.updateFavicon(theme);
    }
    
    // Update theme toggle icon
    updateThemeToggleIcon() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;
        
        const sunIcon = themeToggle.querySelector('.sun-icon');
        const moonIcon = themeToggle.querySelector('.moon-icon');
        
        if (this.currentTheme === 'dark') {
            sunIcon?.style.setProperty('opacity', '0');
            sunIcon?.style.setProperty('transform', 'rotate(-90deg)');
            moonIcon?.style.setProperty('opacity', '1');
            moonIcon?.style.setProperty('transform', 'rotate(0deg)');
        } else {
            sunIcon?.style.setProperty('opacity', '1');
            sunIcon?.style.setProperty('transform', 'rotate(0deg)');
            moonIcon?.style.setProperty('opacity', '0');
            moonIcon?.style.setProperty('transform', 'rotate(90deg)');
        }
        
        // Update aria-label for accessibility
        const themeLabel = this.currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
        themeToggle.setAttribute('aria-label', themeLabel);
    }
    
    // Update meta theme-color for mobile browsers
    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        const colors = {
            light: '#f8fafc',
            dark: '#0f172a'
        };
        
        metaThemeColor.content = colors[theme] || colors.light;
    }
    
    // Update favicon based on theme (optional)
    updateFavicon(theme) {
        // This could be used to switch favicons based on theme
        // For now, we'll keep the same favicon
    }
    
    // Setup smooth theme transition
    setupThemeTransition() {
        const style = document.createElement('style');
        style.textContent = `
            .theme-transition *,
            .theme-transition *::before,
            .theme-transition *::after {
                transition: background-color ${this.transitionDuration}ms ease-out,
                           border-color ${this.transitionDuration}ms ease-out,
                           color ${this.transitionDuration}ms ease-out,
                           fill ${this.transitionDuration}ms ease-out,
                           stroke ${this.transitionDuration}ms ease-out,
                           box-shadow ${this.transitionDuration}ms ease-out !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Dispatch theme change event
    dispatchThemeChangeEvent(newTheme, previousTheme) {
        const event = new CustomEvent('themechange', {
            detail: {
                theme: newTheme,
                previousTheme: previousTheme,
                themes: this.themes
            }
        });
        
        document.dispatchEvent(event);
    }
    
    // Update theme-dependent animations
    updateThemeAnimations() {
        // Update particle colors
        if (window.particleSystem) {
            const particleColor = this.currentTheme === 'dark' 
                ? 'rgba(129, 140, 248, 0.6)' 
                : 'rgba(102, 126, 234, 0.6)';
            
            window.particleSystem.options.particleColor = particleColor;
        }
        
        // Update custom cursor colors if needed
        this.updateCursorTheme();
        
        // Update any other theme-dependent elements
        this.updateThemeElements();
    }
    
    // Update custom cursor for theme
    updateCursorTheme() {
        const cursor = document.getElementById('custom-cursor');
        if (!cursor) return;
        
        const cursorInner = cursor.querySelector('.cursor-inner');
        if (!cursorInner) return;
        
        // Cursor colors are handled by CSS custom properties
        // No additional JavaScript needed
    }
    
    // Update theme-specific elements
    updateThemeElements() {
        // Update any elements that need specific theme handling
        const themeElements = document.querySelectorAll('[data-theme-element]');
        
        themeElements.forEach(element => {
            const elementType = element.dataset.themeElement;
            
            switch (elementType) {
                case 'logo':
                    this.updateLogo(element);
                    break;
                case 'image':
                    this.updateImage(element);
                    break;
                default:
                    break;
            }
        });
    }
    
    // Update logo for theme
    updateLogo(logoElement) {
        // If you have different logos for light/dark themes
        const logoSrc = logoElement.dataset[`${this.currentTheme}Logo`];
        if (logoSrc && logoElement.tagName === 'IMG') {
            logoElement.src = logoSrc;
        }
    }
    
    // Update images for theme
    updateImage(imageElement) {
        // If you have different images for light/dark themes
        const imageSrc = imageElement.dataset[`${this.currentTheme}Src`];
        if (imageSrc && imageElement.tagName === 'IMG') {
            imageElement.src = imageSrc;
        }
    }
    
    // Get current theme
    getCurrentTheme() {
        return this.currentTheme;
    }
    
    // Get available themes
    getAvailableThemes() {
        return this.themes;
    }
    
    // Check if current theme is dark
    isDarkMode() {
        return this.currentTheme === 'dark';
    }
    
    // Check if current theme is light
    isLightMode() {
        return this.currentTheme === 'light';
    }
    
    // Add custom theme
    addTheme(name, config) {
        if (this.themes[name]) {
            console.warn(`Theme "${name}" already exists`);
            return false;
        }
        
        this.themes[name] = {
            name: config.displayName || name,
            icon: config.icon || 'circle',
            ...config
        };
        
        return true;
    }
    
    // Remove custom theme
    removeTheme(name) {
        if (name === 'light' || name === 'dark') {
            console.warn('Cannot remove default themes');
            return false;
        }
        
        if (!this.themes[name]) {
            console.warn(`Theme "${name}" does not exist`);
            return false;
        }
        
        // Switch to light theme if removing current theme
        if (this.currentTheme === name) {
            this.setTheme('light');
        }
        
        delete this.themes[name];
        return true;
    }
    
    // Create theme selector (if you want multiple themes)
    createThemeSelector(container) {
        if (!container) return;
        
        const selector = document.createElement('div');
        selector.className = 'theme-selector';
        
        Object.entries(this.themes).forEach(([key, theme]) => {
            const button = document.createElement('button');
            button.className = 'theme-option glass-button';
            button.dataset.theme = key;
            button.innerHTML = `
                <span class="theme-icon">${this.getThemeIcon(theme.icon)}</span>
                <span class="theme-name">${theme.name}</span>
            `;
            
            if (key === this.currentTheme) {
                button.classList.add('active');
            }
            
            button.addEventListener('click', () => {
                this.setTheme(key);
                
                // Update active state
                selector.querySelectorAll('.theme-option').forEach(opt => {
                    opt.classList.toggle('active', opt.dataset.theme === key);
                });
            });
            
            selector.appendChild(button);
        });
        
        container.appendChild(selector);
        return selector;
    }
    
    // Get theme icon SVG
    getThemeIcon(iconName) {
        const icons = {
            sun: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </svg>`,
            moon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                     <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                   </svg>`,
            circle: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                       <circle cx="12" cy="12" r="10"></circle>
                     </svg>`
        };
        
        return icons[iconName] || icons.circle;
    }
    
    // Export theme configuration
    exportTheme() {
        return {
            currentTheme: this.currentTheme,
            themes: this.themes,
            timestamp: Date.now()
        };
    }
    
    // Import theme configuration
    importTheme(config) {
        if (!config || typeof config !== 'object') {
            console.error('Invalid theme configuration');
            return false;
        }
        
        if (config.themes) {
            this.themes = { ...this.themes, ...config.themes };
        }
        
        if (config.currentTheme && this.themes[config.currentTheme]) {
            this.setTheme(config.currentTheme);
        }
        
        return true;
    }
    
    // Destroy theme manager
    destroy() {
        this.mediaQuery.removeEventListener('change', this.handleSystemThemeChange);
        
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.replaceWith(themeToggle.cloneNode(true));
        }
    }
}

// Auto-initialize theme manager
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
    
    // Listen for theme changes to update other components
    document.addEventListener('themechange', (e) => {
        console.log(`Theme changed to: ${e.detail.theme}`);
        
        // Update any theme-dependent components
        if (window.animationManager) {
            window.animationManager.updateTheme?.(e.detail.theme);
        }
    });
});

// Export for use in other scripts
window.ThemeManager = ThemeManager;

