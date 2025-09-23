/* ===== CONTACT PAGE JAVASCRIPT ===== */
/* Enhanced functionality with professional form handling */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the contact page
    initializeContactPage();
});

/**
 * Main initialization function
 */
function initializeContactPage() {
    // Set current year in copyright
    setCurrentYear();

    // Initialize contact form
    initializeContactForm();

    // Initialize donation form
    initializeDonationForm();

    // Setup smooth scrolling
    setupSmoothScrolling();

    // Add form animations
    addFormAnimations();

    // Setup accessibility improvements
    setupAccessibility();

    // Initialize contact info interactions
    setupContactInfoInteractions();

    console.log('Contact page initialized successfully');
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
 * Initialize contact form with validation and submission
 */
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        // Real-time form validation
        const formInputs = contactForm.querySelectorAll('input, select, textarea');
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

        // Form submission handler
        contactForm.addEventListener('submit', function(event) {
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

            // Proceed with form submission
            submitContactForm(this);
        });
    }
}

/**
 * Submit contact form with AJAX
 */
function submitContactForm(form) {
    const formData = new FormData(form);
    const submitButton = form.querySelector('.contact_submit_btn');
    const messageDiv = document.getElementById('statusMessage');
    const originalButtonText = submitButton.innerHTML;

    // Show loading state
    submitButton.disabled = true;
    submitButton.classList.add('loading');
    submitButton.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Sending...';
    messageDiv.style.display = 'none';

    // Add ripple effect
    createRippleEffect(submitButton);

    // Simulate AJAX submission (replace with actual implementation)
    $.ajax({
        type: 'POST',
        url: 'contact_form_handler.php',
        data: formData,
        processData: false,
        contentType: false,
        timeout: 10000,
        success: function(response) {
            messageDiv.className = 'message success';
            messageDiv.innerHTML = '<i class="fa fa-check-circle"></i> Thank you for your message! We'll get back to you soon.';
            messageDiv.style.display = 'block';

            // Reset form
            form.reset();

            // Remove validation classes
            const inputs = form.querySelectorAll('.form-control');
            inputs.forEach(function(input) {
                input.classList.remove('is-valid', 'is-invalid');
            });

            // Success animation
            setTimeout(function() {
                messageDiv.style.animation = 'successPulse 0.6s ease-out';
            }, 100);
        },
        error: function(xhr, status, error) {
            let errorMessage = 'An error occurred while sending your message. Please try again.';

            if (status === 'timeout') {
                errorMessage = 'The request timed out. Please check your connection and try again.';
            } else if (xhr.responseText) {
                errorMessage = xhr.responseText;
            }

            messageDiv.className = 'message error';
            messageDiv.innerHTML = '<i class="fa fa-exclamation-triangle"></i> ' + errorMessage;
            messageDiv.style.display = 'block';
        },
        complete: function() {
            // Reset button state
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
            submitButton.innerHTML = originalButtonText;
        }
    });
}

/**
 * Validate individual form field
 */
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let message = '';

    // Remove previous validation classes and feedback
    field.classList.remove('is-valid', 'is-invalid');
    const existingFeedback = field.parentNode.querySelector('.invalid-feedback, .valid-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
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
    } else if (field.id === 'firstName' && value && value.length < 2) {
        isValid = false;
        message = 'First name must be at least 2 characters.';
    } else if (field.id === 'lastName' && value && value.length < 2) {
        isValid = false;
        message = 'Last name must be at least 2 characters.';
    } else if (field.id === 'message' && value && value.length < 10) {
        isValid = false;
        message = 'Message must be at least 10 characters.';
    }

    // Apply validation styling
    const feedbackDiv = document.createElement('div');
    if (isValid && value) {
        field.classList.add('is-valid');
        feedbackDiv.className = 'valid-feedback';
        feedbackDiv.innerHTML = '<i class="fa fa-check"></i> Looks good!';
    } else if (!isValid) {
        field.classList.add('is-invalid');
        feedbackDiv.className = 'invalid-feedback';
        feedbackDiv.innerHTML = '<i class="fa fa-exclamation-circle"></i> ' + message;
    }

    if (feedbackDiv.className) {
        field.parentNode.appendChild(feedbackDiv);
    }

    return isValid;
}

/**
 * Initialize donation form functionality
 */
function initializeDonationForm() {
    const donationForm = document.getElementById('donationForm');

    if (donationForm) {
        donationForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const formData = new FormData(this);
            const submitButton = this.querySelector('button[type="submit"]');
            const messageDiv = document.getElementById('donationStatusMessage');
            const originalText = submitButton.textContent;

            // Show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Processing...';
            messageDiv.style.display = 'none';

            // Simulate AJAX submission
            $.ajax({
                type: 'POST',
                url: 'donation_form_handler.php',
                data: formData,
                processData: false,
                contentType: false,
                timeout: 10000,
                success: function(response) {
                    messageDiv.className = 'message success';
                    messageDiv.textContent = 'Thank you for your donation! ' + response;
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
                    messageDiv.className = 'message error';
                    messageDiv.textContent = 'An error occurred while processing your donation.';
                    messageDiv.style.display = 'block';
                },
                complete: function() {
                    // Reset button state
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                }
            });
        });
    }
}

/**
 * Setup smooth scrolling for anchor links
 */
function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Add highlight effect
                target.style.boxShadow = '0 0 20px rgba(3, 85, 204, 0.3)';
                setTimeout(function() {
                    target.style.boxShadow = '';
                }, 2000);
            }
        });
    });
}

/**
 * Add form animations
 */
function addFormAnimations() {
    const formGroups = document.querySelectorAll('.form-group');

    // Stagger form group animations
    formGroups.forEach(function(group, index) {
        group.style.opacity = '0';
        group.style.transform = 'translateY(20px)';
        group.style.transition = 'all 0.6s ease';

        setTimeout(function() {
            group.style.opacity = '1';
            group.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Enhanced input focus animations
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(function(input) {
        input.addEventListener('focus', function() {
            this.parentNode.style.transform = 'scale(1.02)';
            this.parentNode.style.transition = 'transform 0.3s ease';
        });

        input.addEventListener('blur', function() {
            this.parentNode.style.transform = 'scale(1)';
        });
    });
}

/**
 * Setup accessibility improvements
 */
function setupAccessibility() {
    // Enhanced keyboard navigation
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                const formElements = Array.from(form.elements);
                const currentIndex = formElements.indexOf(e.target);
                const nextElement = formElements[currentIndex + 1];

                if (nextElement && nextElement.type !== 'submit') {
                    nextElement.focus();
                } else {
                    form.querySelector('button[type="submit"]').focus();
                }
            }
        });
    }

    // Screen reader announcements
    const statusMessage = document.getElementById('statusMessage');
    if (statusMessage) {
        statusMessage.setAttribute('aria-live', 'polite');
        statusMessage.setAttribute('aria-atomic', 'true');
    }

    // Enhanced button accessibility
    const submitButton = document.querySelector('.contact_submit_btn');
    if (submitButton) {
        submitButton.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }
}

/**
 * Setup contact info interactions
 */
function setupContactInfoInteractions() {
    // Enhanced hover effects for contact items
    const contactItems = document.querySelectorAll('.info_section .item');
    contactItems.forEach(function(item) {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
            this.style.transition = 'all 0.3s ease';
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Click to copy functionality
    const phoneItem = document.querySelector('a[href^="tel:"]');
    if (phoneItem) {
        phoneItem.addEventListener('click', function(e) {
            e.preventDefault();
            const phoneNumber = this.textContent.trim();

            if (navigator.clipboard) {
                navigator.clipboard.writeText(phoneNumber).then(function() {
                    showTemporaryMessage('Phone number copied to clipboard!');
                });
            }

            // Still allow the call functionality
            setTimeout(function() {
                window.location.href = phoneItem.getAttribute('href');
            }, 1000);
        });
    }

    const emailItem = document.querySelector('a[href^="mailto:"]');
    if (emailItem) {
        emailItem.addEventListener('click', function(e) {
            const email = this.textContent.trim();

            if (navigator.clipboard) {
                navigator.clipboard.writeText(email).then(function() {
                    showTemporaryMessage('Email address copied to clipboard!');
                });
            }
        });
    }
}

/**
 * Create ripple effect for buttons
 */
function createRippleEffect(button) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = rect.width / 2 - size / 2;
    const y = rect.height / 2 - size / 2;

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

    button.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 600);
}

/**
 * Show temporary message
 */
function showTemporaryMessage(message, type = 'success', duration = 3000) {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 5px;
        z-index: 9999;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
    `;

    if (type === 'success') {
        messageDiv.style.backgroundColor = '#d4edda';
        messageDiv.style.color = '#155724';
        messageDiv.style.border = '1px solid #c3e6cb';
    } else {
        messageDiv.style.backgroundColor = '#f8d7da';
        messageDiv.style.color = '#721c24';
        messageDiv.style.border = '1px solid #f5c6cb';
    }

    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);

    // Animate in
    setTimeout(() => {
        messageDiv.style.transform = 'translateX(0)';
        messageDiv.style.opacity = '1';
    }, 100);

    // Remove after duration
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateX(100%)';
        setTimeout(() => {
            messageDiv.remove();
        }, 300);
    }, duration);
}

/**
 * Show general message in the form
 */
function showMessage(message, type = 'success') {
    const messageDiv = document.getElementById('statusMessage');
    if (messageDiv) {
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `<i class="fa fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i> ${message}`;
        messageDiv.style.display = 'block';

        // Hide after 5 seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
}

/**
 * Initialize analytics tracking (optional)
 */
function initializeAnalytics() {
    // Track form interactions
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    'form_name': 'contact_form',
                    'page_location': window.location.href
                });
            }
            console.log('Contact form submitted');
        });
    }

    // Track contact info clicks
    const contactLinks = document.querySelectorAll('a[href^="tel:"], a[href^="mailto:"]');
    contactLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            const type = this.getAttribute('href').startsWith('tel:') ? 'phone' : 'email';
            if (typeof gtag !== 'undefined') {
                gtag('event', 'contact_click', {
                    'contact_type': type,
                    'contact_value': this.textContent.trim()
                });
            }
            console.log(`${type} contact clicked:`, this.textContent.trim());
        });
    });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeContactPage();
    initializeAnalytics();
});

// Add CSS for ripple animation if not exists
if (!document.querySelector('#contact-ripple-style')) {
    const style = document.createElement('style');
    style.id = 'contact-ripple-style';
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

// Error handling
window.addEventListener('error', function(e) {
    console.error('Contact page error:', e.error);
});