/* ===== OUR UNITS PAGE JAVASCRIPT ===== */
/* Enhanced functionality with professional button interactions */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    initializeOurUnits();
});

/**
 * Main initialization function
 */
function initializeOurUnits() {
    // Set current year in copyright
    setCurrentYear();

    // Add subtle animations
    addSubtleAnimations();

    // Setup modal functionality
    setupDonationModal();

    // Add accessibility improvements
    setupAccessibility();

    // Initialize donation form
    initializeDonationForm();

    // Setup button interactions
    setupButtonInteractions();

    // Initialize unit card animations
    initializeCardAnimations();

    console.log('Our Units page initialized successfully');
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
 * Setup professional button interactions
 */
function setupButtonInteractions() {
    // Handle all unit buttons with enhanced interactions
    const unitButtons = document.querySelectorAll('.unit_learn_more_btn, .unit_kaayaka_btn');

    unitButtons.forEach(function(button) {
        // Add ripple effect on click
        button.addEventListener('click', function(e) {
            createRippleEffect(e, this);
        });

        // Enhanced focus handling
        button.addEventListener('focus', function() {
            this.style.transform = 'scale(1.02)';
        });

        button.addEventListener('blur', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Special handling for Kaayaka buttons (smooth scrolling)
    const kaayakaButtons = document.querySelectorAll('a[href="#kaayaka"]');
    kaayakaButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector('#kaayaka');
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Create ripple effect for button clicks
 */
function createRippleEffect(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    `;

    // Add ripple animation CSS if not exists
    if (!document.querySelector('#ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    const originalPosition = element.style.position;
    element.style.position = 'relative';
    element.style.overflow = 'hidden';

    element.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
        element.style.position = originalPosition;
    }, 600);
}

/**
 * Initialize card animations
 */
function initializeCardAnimations() {
    const cards = document.querySelectorAll('.service_section .box, .kaayaka_card');

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry, index) {
            if (entry.isIntersecting) {
                setTimeout(function() {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.classList.add('animated');
                }, index * 150); // Staggered animation

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Initialize cards with starting animation state
    cards.forEach(function(card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

/**
 * Add subtle animations consistent with homepage
 */
function addSubtleAnimations() {
    // Animate heading on load
    const headings = document.querySelectorAll('.heading_container h2');
    headings.forEach(function(heading) {
        heading.style.opacity = '0';
        heading.style.transform = 'translateY(-20px)';
        heading.style.transition = 'all 0.8s ease';

        setTimeout(function() {
            heading.style.opacity = '1';
            heading.style.transform = 'translateY(0)';
        }, 300);
    });

    // Smooth hover effects for images
    const images = document.querySelectorAll('.service_section .img-box img');
    images.forEach(function(img) {
        img.addEventListener('mouseenter', function() {
            this.style.filter = 'brightness(1.1)';
        });

        img.addEventListener('mouseleave', function() {
            this.style.filter = 'brightness(1)';
        });
    });
}

/**
 * Setup donation modal functionality
 */
function setupDonationModal() {
    const modal = document.getElementById('donationModal');

    if (modal) {
        modal.addEventListener('shown.bs.modal', function() {
            // Focus management for accessibility
            this.setAttribute('tabindex', '-1');
            this.focus();

            // Prevent body scroll
            document.body.style.overflow = 'hidden';

            // Add modal open class for styling
            this.classList.add('modal-open');
        });

        modal.addEventListener('hidden.bs.modal', function() {
            // Restore body scroll
            document.body.style.overflow = '';

            // Remove modal open class
            this.classList.remove('modal-open');

            // Return focus to trigger button
            const triggerButton = document.querySelector('[data-bs-target="#donationModal"]');
            if (triggerButton) {
                triggerButton.focus();
            }
        });
    }

    // Handle escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.show');
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
 * Initialize donation form functionality
 */
function initializeDonationForm() {
    const donationForm = document.getElementById('donationForm');

    if (donationForm) {
        // Real-time form validation
        const formInputs = donationForm.querySelectorAll('input, select');
        formInputs.forEach(function(input) {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    validateField(this);
                }
            });
        });

        donationForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Validate all fields
            let isValid = true;
            formInputs.forEach(function(input) {
                if (!validateField(input)) {
                    isValid = false;
                }
            });

            if (!isValid) {
                showMessage('Please correct the errors in the form.', 'error');
                return;
            }

            const formData = new FormData(this);
            const submitButton = this.querySelector('button[type="submit"]');
            const messageDiv = document.getElementById('donationStatusMessage');

            // Show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Processing...';
            messageDiv.style.display = 'none';

            // Simulate AJAX submission (replace with actual implementation)
            $.ajax({
                type: 'POST',
                url: 'donation_form_handler.php',
                data: formData,
                processData: false,
                contentType: false,
                timeout: 10000,
                success: function(response) {
                    messageDiv.className = 'message success';
                    messageDiv.textContent = 'Thank you for supporting our research units! ' + response;
                    messageDiv.style.display = 'block';

                    // Reset form
                    donationForm.reset();

                    // Close modal after success
                    setTimeout(function() {
                        const modal = bootstrap.Modal.getInstance(document.getElementById('donationModal'));
                        if (modal) {
                            modal.hide();
                        }
                    }, 2000);
                },
                error: function(xhr, status, error) {
                    let errorMessage = 'An error occurred while processing your donation. Please try again.';

                    if (status === 'timeout') {
                        errorMessage = 'The request timed out. Please check your connection and try again.';
                    } else if (xhr.responseText) {
                        errorMessage = xhr.responseText;
                    }

                    messageDiv.className = 'message error';
                    messageDiv.textContent = errorMessage;
                    messageDiv.style.display = 'block';
                },
                complete: function() {
                    // Reset button state
                    submitButton.disabled = false;
                    submitButton.innerHTML = 'Submit';
                }
            });
        });
    }
}

/**
 * Validate individual form field
 */
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let message = '';

    // Remove previous validation classes
    field.classList.remove('is-valid', 'is-invalid');
    const feedback = field.parentNode.querySelector('.invalid-feedback');
    if (feedback) {
        feedback.remove();
    }

    // Field-specific validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        message = 'This field is required.';
    } else if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            message = 'Please enter a valid email address.';
        }
    } else if (field.type === 'tel' && value) {
        const phoneRegex = /^[+]?[1-9]?[0-9]{7,15}$/;
        if (!phoneRegex.test(value.replace(/[^\d+]/g, ''))) {
            isValid = false;
            message = 'Please enter a valid phone number.';
        }
    } else if (field.type === 'number' && value) {
        const numValue = parseFloat(value);
        if (isNaN(numValue) || numValue <= 0) {
            isValid = false;
            message = 'Please enter a valid positive number.';
        }
    }

    // Apply validation styling
    if (isValid) {
        field.classList.add('is-valid');
    } else {
        field.classList.add('is-invalid');
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = 'invalid-feedback';
        feedbackDiv.textContent = message;
        field.parentNode.appendChild(feedbackDiv);
    }

    return isValid;
}

/**
 * Setup accessibility improvements
 */
function setupAccessibility() {
    const cards = document.querySelectorAll('.service_section .box, .kaayaka_card');

    cards.forEach(function(card, index) {
        // Make cards focusable
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'article');
        card.setAttribute('aria-label', `Research unit ${index + 1}`);

        // Visual focus indicator
        card.addEventListener('focus', function() {
            this.style.outline = '2px solid #0355cc';
            this.style.outlineOffset = '4px';
        });

        card.addEventListener('blur', function() {
            this.style.outline = 'none';
        });

        // Keyboard navigation
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const button = this.querySelector('.unit_learn_more_btn, .unit_kaayaka_btn, .kaayaka_btn');
                if (button) {
                    button.click();
                }
            }
        });
    });

    // Add skip links
    addSkipLinks();
}

/**
 * Add skip links for better navigation
 */
function addSkipLinks() {
    const skipLinks = document.createElement('div');
    skipLinks.className = 'skip-links';
    skipLinks.innerHTML = `
        <a href="#services" class="skip-link">Skip to research units</a>
        <a href="#kaayaka" class="skip-link">Skip to Kaayaka initiatives</a>
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

    document.head.appendChild(style);
    document.body.insertBefore(skipLinks, document.body.firstChild);
}

/**
 * Show messages to users
 */
function showMessage(message, type = 'success') {
    // Create or show message
    let messageDiv = document.getElementById('globalMessage');

    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.id = 'globalMessage';
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 9999;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            font-weight: 600;
            transition: all 0.3s ease;
        `;
        document.body.appendChild(messageDiv);
    }

    // Set message type styling
    if (type === 'success') {
        messageDiv.style.backgroundColor = '#d4edda';
        messageDiv.style.color = '#155724';
        messageDiv.style.borderLeft = '4px solid #28a745';
    } else if (type === 'error') {
        messageDiv.style.backgroundColor = '#f8d7da';
        messageDiv.style.color = '#721c24';
        messageDiv.style.borderLeft = '4px solid #dc3545';
    }

    messageDiv.textContent = message;
    messageDiv.style.display = 'block';
    messageDiv.style.opacity = '1';

    // Hide after 5 seconds
    setTimeout(function() {
        messageDiv.style.opacity = '0';
        setTimeout(function() {
            messageDiv.style.display = 'none';
        }, 300);
    }, 5000);
}

/**
 * Show construction message for under construction links
 */
function showMessage(event) {
    event.preventDefault();

    // Show professional modal instead of alert
    const constructionModal = document.createElement('div');
    constructionModal.innerHTML = `
        <div class="modal fade" id="constructionModal" tabindex="-1" aria-labelledby="constructionModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="constructionModalLabel">
                            <i class="fa fa-tools"></i> Page Under Construction
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-center">
                        <i class="fa fa-hard-hat" style="font-size: 3rem; color: #ff8a1d; margin-bottom: 20px;"></i>
                        <h4>We're Building Something Great!</h4>
                        <p>This page is currently under construction. Our team is working hard to bring you detailed information about this research unit.</p>
                        <p class="text-muted">Please check back soon or contact us for more information.</p>
                    </div>
                    <div class="modal-footer justify-content-center">
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Got It</button>
                        <a href="contact_professional.html" class="btn btn-outline-primary">Contact Us</a>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(constructionModal);

    const modal = new bootstrap.Modal(document.getElementById('constructionModal'));
    modal.show();

    // Clean up modal after it's hidden
    document.getElementById('constructionModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

/**
 * Initialize analytics tracking (optional)
 */
function initializeAnalytics() {
    // Track unit card interactions
    const unitCards = document.querySelectorAll('.service_section .box');
    unitCards.forEach(function(card, index) {
        const unitName = card.querySelector('h5').textContent;

        card.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'view_research_unit', {
                    'unit_name': unitName,
                    'unit_position': index + 1
                });
            }
            console.log('Research unit viewed:', unitName);
        });
    });

    // Track button clicks
    const buttons = document.querySelectorAll('.unit_learn_more_btn, .unit_kaayaka_btn, .kaayaka_btn');
    buttons.forEach(function(button) {
        button.addEventListener('click', function() {
            const action = this.textContent.trim();
            if (typeof gtag !== 'undefined') {
                gtag('event', 'button_click', {
                    'button_text': action,
                    'source_page': 'our_units'
                });
            }
            console.log('Button clicked:', action);
        });
    });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeOurUnits();
    initializeAnalytics();
});

// Handle window resize for responsive elements
window.addEventListener('resize', function() {
    // Adjust card layouts if needed
    const cards = document.querySelectorAll('.kaayaka_card');
    cards.forEach(function(card) {
        if (window.innerWidth < 768) {
            card.style.marginBottom = '25px';
        } else {
            card.style.marginBottom = '30px';
        }
    });
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('Our Units page error:', e.error);
});