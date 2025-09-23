/* ===== EXECUTIVE BOARD PAGE JAVASCRIPT ===== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    initializeExecutiveBoard();
});

/**
 * Main initialization function
 */
function initializeExecutiveBoard() {
    // Set current year in copyright
    setCurrentYear();

    // Handle member images
    handleMemberImages();

    // Add animation to cards
    animateCards();

    // Setup modal event listeners
    setupModals();

    // Add accessibility improvements
    setupAccessibility();
}

/**
 * Set current year in copyright
 */
function setCurrentYear() {
    const yearElement = document.getElementById('displayDateYear');
    if (yearElement) {
        yearElement.innerHTML = new Date().getFullYear();
    }
}

/**
 * Handle member images - show real images when they exist, hide placeholders
 */
function handleMemberImages() {
    const images = document.querySelectorAll('.member_image');

    images.forEach(function(img) {
        // Add loading class initially
        const container = img.closest('.member_image_container');
        if (container) {
            container.classList.add('loading-placeholder');
        }

        img.onload = function() {
            // Image loaded successfully
            this.style.display = 'block';
            const placeholder = this.parentNode.querySelector('.member_placeholder');
            if (placeholder) {
                placeholder.style.display = 'none';
            }

            // Remove loading class
            if (container) {
                container.classList.remove('loading-placeholder');
            }

            console.log('Image loaded successfully:', this.src);
        };

        img.onerror = function() {
            // Image failed to load, show placeholder
            this.style.display = 'none';
            const placeholder = this.parentNode.querySelector('.member_placeholder');
            if (placeholder) {
                placeholder.style.display = 'flex';
            }

            // Remove loading class
            if (container) {
                container.classList.remove('loading-placeholder');
            }

            console.log('Image failed to load, showing placeholder for:', this.src);
        };

        // Force check if image is already loaded (cached)
        if (img.complete) {
            if (img.naturalWidth === 0) {
                img.onerror();
            } else {
                img.onload();
            }
        }
    });
}

/**
 * Add entrance animations to cards
 */
function animateCards() {
    const cards = document.querySelectorAll('.board_member_card');

    // Add intersection observer for scroll-triggered animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry, index) {
            if (entry.isIntersecting) {
                // Add animation class with delay
                setTimeout(function() {
                    entry.target.classList.add('fade-in-up');
                }, index * 200);

                // Stop observing this element
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Start observing all cards
    cards.forEach(function(card) {
        observer.observe(card);
    });
}

/**
 * Setup modal event listeners and functionality
 */
function setupModals() {
    const modals = document.querySelectorAll('.bio_modal');

    modals.forEach(function(modal) {
        // Add event listener for when modal is shown
        modal.addEventListener('shown.bs.modal', function() {
            // Focus the modal for accessibility
            this.setAttribute('tabindex', '-1');
            this.focus();

            // Add body class to prevent scrolling
            document.body.classList.add('modal-open-custom');
        });

        // Add event listener for when modal is hidden
        modal.addEventListener('hidden.bs.modal', function() {
            // Remove body class
            document.body.classList.remove('modal-open-custom');

            // Return focus to the trigger button
            const triggerButton = document.querySelector(`[data-bs-target="#${this.id}"]`);
            if (triggerButton) {
                triggerButton.focus();
            }
        });
    });

    // Handle escape key for modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.bio_modal.show');
            if (openModal) {
                const bsModal = bootstrap.Modal.getInstance(openModal);
                if (bsModal) {
                    bsModal.hide();
                }
            }
        }
    });
}

/**
 * Setup accessibility improvements
 */
function setupAccessibility() {
    // Add keyboard navigation for cards
    const cards = document.querySelectorAll('.board_member_card');

    cards.forEach(function(card) {
        // Make cards focusable
        card.setAttribute('tabindex', '0');

        // Add keyboard event listeners
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const button = this.querySelector('.view_details_btn');
                if (button) {
                    button.click();
                }
            }
        });

        // Add hover class for keyboard focus
        card.addEventListener('focus', function() {
            this.classList.add('keyboard-focus');
        });

        card.addEventListener('blur', function() {
            this.classList.remove('keyboard-focus');
        });
    });

    // Enhance modal close button accessibility
    const closeButtons = document.querySelectorAll('.bio_modal .btn-close');
    closeButtons.forEach(function(button) {
        button.setAttribute('aria-label', 'Close biography modal');
    });

    // Add skip link functionality
    addSkipLinks();
}

/**
 * Add skip links for better navigation
 */
function addSkipLinks() {
    // Create skip link container
    const skipLinks = document.createElement('div');
    skipLinks.className = 'skip-links';
    skipLinks.innerHTML = `
        <a href="#main-content" class="skip-link">Skip to main content</a>
        <a href="#board-members" class="skip-link">Skip to board members</a>
    `;

    // Add CSS for skip links
    const style = document.createElement('style');
    style.textContent = `
        .skip-links {
            position: absolute;
            top: -100px;
            left: 0;
            z-index: 9999;
        }

        .skip-link {
            position: absolute;
            top: -100px;
            left: 0;
            background: #0355cc;
            color: white;
            padding: 10px 15px;
            text-decoration: none;
            border-radius: 0 0 5px 0;
            font-weight: 600;
            transition: top 0.3s;
        }

        .skip-link:focus {
            top: 0;
            color: white;
            text-decoration: none;
        }
    `;

    // Insert skip links and styles
    document.head.appendChild(style);
    document.body.insertBefore(skipLinks, document.body.firstChild);

    // Add IDs to target elements
    const mainContent = document.querySelector('.page_header_section');
    if (mainContent) {
        mainContent.id = 'main-content';
    }

    const boardMembers = document.querySelector('.executive_board_section');
    if (boardMembers) {
        boardMembers.id = 'board-members';
    }
}

/**
 * Handle responsive image loading
 */
function handleResponsiveImages() {
    // Check if we need to load different image sizes based on screen size
    const images = document.querySelectorAll('.member_image');

    images.forEach(function(img) {
        const originalSrc = img.src;
        const screenWidth = window.innerWidth;

        // Load smaller images on mobile devices
        if (screenWidth < 768 && originalSrc.includes('.jpg')) {
            const mobileSrc = originalSrc.replace('.jpg', '_mobile.jpg');

            // Check if mobile version exists
            const testImg = new Image();
            testImg.onload = function() {
                img.src = mobileSrc;
            };
            testImg.src = mobileSrc;
        }
    });
}

/**
 * Add smooth scrolling to internal links
 */
function addSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Handle window resize events
 */
function handleResize() {
    let resizeTimeout;

    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Handle responsive images
            handleResponsiveImages();

            // Recalculate any layout-dependent elements
            const modals = document.querySelectorAll('.bio_modal .modal-body');
            modals.forEach(function(modal) {
                // Recalculate max-height for mobile
                if (window.innerWidth < 768) {
                    modal.style.maxHeight = '60vh';
                } else {
                    modal.style.maxHeight = '70vh';
                }
            });
        }, 250);
    });
}

/**
 * Add loading states and error handling
 */
function addLoadingStates() {
    // Show loading state for images
    const imageContainers = document.querySelectorAll('.member_image_container');

    imageContainers.forEach(function(container) {
        container.classList.add('loading-placeholder');
    });
}

/**
 * Initialize analytics tracking (if needed)
 */
function initializeAnalytics() {
    // Track modal opens
    const modalTriggers = document.querySelectorAll('[data-bs-toggle="modal"]');

    modalTriggers.forEach(function(trigger) {
        trigger.addEventListener('click', function() {
            const targetModal = this.getAttribute('data-bs-target');
            const memberName = this.closest('.board_member_card').querySelector('.member_name').textContent;

            // Example: Send analytics event
            if (typeof gtag !== 'undefined') {
                gtag('event', 'view_board_member', {
                    'member_name': memberName,
                    'modal_id': targetModal
                });
            }

            console.log('Board member bio viewed:', memberName);
        });
    });
}

/**
 * Add error handling for failed operations
 */
function addErrorHandling() {
    window.addEventListener('error', function(e) {
        console.error('Executive board page error:', e.error);

        // Could implement user-friendly error display here
        // For now, just log to console
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled promise rejection:', e.reason);
    });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Add loading states first
    addLoadingStates();

    // Initialize main functionality
    initializeExecutiveBoard();

    // Add additional features
    addSmoothScrolling();
    handleResize();
    initializeAnalytics();
    addErrorHandling();

    console.log('Executive Board page initialized successfully');
});

// Export functions for potential external use
window.ExecutiveBoardPage = {
    handleMemberImages: handleMemberImages,
    animateCards: animateCards,
    setupModals: setupModals
};