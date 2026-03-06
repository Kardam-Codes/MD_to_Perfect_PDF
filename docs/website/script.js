// MD → Perfect PDF Landing Page Script
// Minimal, fast, and privacy-first

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    initSmoothScroll();
    
    // Add scroll animations for better UX
    initScrollAnimations();
    
    // Add keyboard navigation
    initKeyboardNavigation();
    
    initHeaderScroll();
    initEmailCopy();
    initPerformanceMonitoring();
});

// Smooth scrolling for anchor links
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offset = 80; // Account for sticky header
                const targetPosition = targetElement.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without scrolling
                history.pushState(null, null, `#${targetId}`);
            }
        });
    });
}

// Scroll animations for better user experience
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Elements to animate on scroll
    const animatedElements = document.querySelectorAll(
        '.feature-card, .step, .export-option, .privacy-feature'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Keyboard navigation for accessibility
function initKeyboardNavigation() {
    // Add keyboard shortcuts for main actions
    document.addEventListener('keydown', function(e) {
        // Alt + D: Download/Install
        if (e.altKey && e.key === 'd') {
            e.preventDefault();
            const primaryCTA = document.querySelector('.cta-button.primary[href*="chrome.google.com"]');
            if (primaryCTA) {
                primaryCTA.click();
            }
        }
        
        // Escape: Scroll to top
        if (e.key === 'Escape') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

// Header background on scroll
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Add/remove background blur based on scroll position
        if (currentScroll > 100) {
            header.style.background = 'rgba(2, 6, 23, 0.95)';
            header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(2, 6, 23, 0.9)';
            header.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
}

// Copy email address to clipboard
function initEmailCopy() {
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    
    emailLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const email = this.getAttribute('href').replace('mailto:', '');
            
            if (navigator.clipboard) {
                navigator.clipboard.writeText(email).then(() => {
                    // Show success feedback
                    showNotification('Email copied to clipboard!', 'success');
                }).catch(() => {
                    // Fallback: open email client
                    window.location.href = `mailto:${email}`;
                });
            } else {
                // Fallback for older browsers
                window.location.href = `mailto:${email}`;
            }
        });
    });
}

// Show notification toast (no external dependencies)
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success)' : 'var(--accent)'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 1000;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Performance monitoring (development only)
function initPerformanceMonitoring() {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        // Log page load performance
        window.addEventListener('load', function() {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page Load Performance:', {
                domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
                loadComplete: Math.round(perfData.loadEventEnd - perfData.loadEventStart),
                totalTime: Math.round(perfData.loadEventEnd - perfData.loadEventStart)
            });
        });
    }
}

// Initialize all features


// Error handling
window.addEventListener('error', function(e) {
    console.error('Landing page error:', e.error);
    // Could send to error tracking service in production
});

// Prevent image drag for better UX
document.addEventListener('dragstart', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});
