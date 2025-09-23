/**
 * Volunteers Page JavaScript
 * Handles form submissions, validation, and interactive elements
 */

$(document).ready(function() {

    // ===== COPYRIGHT YEAR =====
    // Set current year in footer
    document.getElementById('displayDateYear').innerHTML = new Date().getFullYear();

    // ===== FORM VALIDATION =====
    // Real-time form validation
    $('#volunteerForm input, #volunteerForm select, #volunteerForm textarea').on('blur', function() {
        validateField($(this));
    });

    $('#volunteerForm input, #volunteerForm select, #volunteerForm textarea').on('input change', function() {
        if ($(this).hasClass('is-invalid') || $(this).hasClass('is-valid')) {
            validateField($(this));
        }
    });

    // ===== VOLUNTEER FORM SUBMISSION =====
    $('#volunteerForm').on('submit', function(event) {
        event.preventDefault();

        // Validate all fields before submission
        let isFormValid = true;
        $('#volunteerForm input, #volunteerForm select, #volunteerForm textarea').each(function() {
            if (!validateField($(this))) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            showMessage('Please correct the errors above before submitting.', 'error');
            return;
        }

        const formData = $(this).serialize();
        const submitButton = $('#volunteerForm .volunteer_submit_btn');
        const originalText = submitButton.text();

        // Show loading state
        submitButton.prop('disabled', true);
        submitButton.addClass('loading');
        submitButton.text('Submitting...');

        // Hide any previous messages
        $('#statusMessage').hide();

        $.ajax({
            type: 'POST',
            url: 'volunteer_form_handler.php',
            data: formData,
            timeout: 15000, // 15 second timeout
            success: function(response) {
                showMessage('Thank you for your volunteer application! We have received your information and will contact you soon to discuss next steps.', 'success');

                // Reset form after successful submission
                $('#volunteerForm')[0].reset();

                // Remove validation classes
                $('#volunteerForm .form-control').removeClass('is-valid is-invalid');
                $('#volunteerForm .invalid-feedback, #volunteerForm .valid-feedback').remove();

                // Redirect to home page after 8 seconds
                setTimeout(function() {
                    window.location.href = 'index.html';
                }, 8000);
            },
            error: function(xhr, status, error) {
                let errorMessage = 'An error occurred while submitting your application. Please try again.';

                if (status === 'timeout') {
                    errorMessage = 'The request timed out. Please check your connection and try again.';
                } else if (xhr.responseText) {
                    errorMessage = xhr.responseText;
                }

                showMessage(errorMessage, 'error');
            },
            complete: function() {
                // Reset button state
                submitButton.prop('disabled', false);
                submitButton.removeClass('loading');
                submitButton.text(originalText);
            }
        });
    });

    // ===== SMOOTH SCROLLING =====
    // Smooth scrolling for anchor links
    $('a[href^="#"]').on('click', function(event) {
        const target = $(this.getAttribute('href'));
        if (target.length) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 100
            }, 1000);
        }
    });

    // ===== CAROUSEL ENHANCEMENTS =====
    // Pause carousel on hover for better user experience
    $('.carousel').hover(
        function() {
            $(this).carousel('pause');
        },
        function() {
            $(this).carousel('cycle');
        }
    );

    // ===== FORM FIELD ENHANCEMENTS =====
    // Auto-format phone number
    $('#phone').on('input', function() {
        let value = $(this).val().replace(/\D/g, '');
        if (value.length >= 6) {
            value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        } else if (value.length >= 3) {
            value = value.replace(/(\d{3})(\d{1,3})/, '($1) $2');
        }
        $(this).val(value);
    });

    // Capitalize names
    $('#firstName, #lastName').on('blur', function() {
        const value = $(this).val();
        $(this).val(value.charAt(0).toUpperCase() + value.slice(1).toLowerCase());
    });

    // ===== ACCESSIBILITY IMPROVEMENTS =====
    // Keyboard navigation for opportunity cards
    $('.volunteer_opportunities_section .box').on('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            $(this).find('a').click();
        }
    });

    // Focus management for better accessibility
    $('.volunteer_opportunities_section .box a').on('click', function(event) {
        event.preventDefault();
        $('html, body').animate({
            scrollTop: $('#volunteer-form').offset().top - 100
        }, 1000, function() {
            $('#firstName').focus();
        });
    });
});

// ===== UTILITY FUNCTIONS =====

/**
 * Validate individual form field
 */
function validateField($field) {
    const value = $field.val().trim();
    const fieldType = $field.attr('type') || $field.prop('tagName').toLowerCase();
    const fieldName = $field.attr('name');
    let isValid = true;
    let errorMessage = '';

    // Remove previous validation classes and messages
    $field.removeClass('is-valid is-invalid');
    $field.siblings('.invalid-feedback, .valid-feedback').remove();

    // Required field validation
    if ($field.prop('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required.';
    } else if (value) {
        // Type-specific validation
        switch (fieldType) {
            case 'email':
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address.';
                }
                break;
            case 'tel':
                const phonePattern = /^[\(\)\s\-\d]{10,}$/;
                if (!phonePattern.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number.';
                }
                break;
            case 'text':
                if (fieldName === 'firstName' || fieldName === 'lastName') {
                    if (value.length < 2) {
                        isValid = false;
                        errorMessage = 'Name must be at least 2 characters long.';
                    }
                } else if (fieldName === 'location') {
                    if (value.length < 3) {
                        isValid = false;
                        errorMessage = 'Please enter a valid location.';
                    }
                }
                break;
            case 'textarea':
                if (fieldName === 'motivation' && value.length < 10) {
                    isValid = false;
                    errorMessage = 'Please provide more detail (at least 10 characters).';
                }
                break;
            case 'select':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Please make a selection.';
                }
                break;
        }
    }

    // Apply validation styling and messages
    if (isValid) {
        $field.addClass('is-valid');
        if (value) {
            $field.after('<div class="valid-feedback">Looks good!</div>');
        }
    } else {
        $field.addClass('is-invalid');
        $field.after('<div class="invalid-feedback">' + errorMessage + '</div>');
    }

    return isValid;
}

/**
 * Show success/error messages
 */
function showMessage(message, type = 'success') {
    const messageDiv = $('#statusMessage');
    messageDiv
        .removeClass('success error')
        .addClass(type)
        .text(message)
        .fadeIn();

    // Scroll to message if it's not visible
    if (messageDiv.offset().top > $(window).scrollTop() + $(window).height()) {
        $('html, body').animate({
            scrollTop: messageDiv.offset().top - 100
        }, 500);
    }
}

/**
 * Track volunteer form interactions for analytics
 */
function trackVolunteerInteraction(action, detail) {
    // Add your analytics tracking code here
    if (typeof gtag !== 'undefined') {
        gtag('event', 'volunteer_' + action, {
            'detail': detail,
            'page_title': document.title
        });
    }
    console.log('Volunteer interaction tracked:', action, detail);
}