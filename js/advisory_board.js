/**
 * Advisory Board Page JavaScript
 * Handles image loading, form submissions, and interactive elements
 * Updated to work with "Voices of Insight and Innovation" theme
 */

$(document).ready(function() {
  // ===== COPYRIGHT YEAR =====
  // Set current year in footer
  document.getElementById('displayDateYear').innerHTML = new Date().getFullYear();

  // ===== ADVISOR IMAGE HANDLING =====
  // Handle advisor member images with fallback to placeholders
  const advisorImages = document.querySelectorAll('.advisor_image');

  advisorImages.forEach(function(img) {
    img.onload = function() {
      // Image loaded successfully
      this.style.display = 'block';
      const placeholder = this.parentNode.querySelector('.advisor_placeholder');
      if (placeholder) {
        placeholder.style.display = 'none';
      }
    };

    img.onerror = function() {
      // Image failed to load, show placeholder
      this.style.display = 'none';
      const placeholder = this.parentNode.querySelector('.advisor_placeholder');
      if (placeholder) {
        placeholder.style.display = 'flex';
      }
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

  // ===== DONATION FORM HANDLING =====
  // Handle donation form submission with AJAX
  $('#donationForm').on('submit', function(event) {
    event.preventDefault();
    const formData = $(this).serialize();
    const submitButton = $(this).find('button[type="submit"]');
    const messageDiv = $('#donationStatusMessage');

    // Show loading state
    submitButton.prop('disabled', true);
    submitButton.text('Processing...');
    messageDiv.hide();

    $.ajax({
      type: 'POST',
      url: 'donation_form_handler.php',
      data: formData,
      timeout: 10000, // 10 second timeout
      success: function(response) {
        messageDiv
          .removeClass('alert-danger')
          .addClass('alert-success')
          .text('Thank you for supporting our advisory initiatives! ' + response)
          .fadeIn();

        // Reset form after successful submission
        $('#donationForm')[0].reset();
      },
      error: function(xhr, status, error) {
        let errorMessage = 'An error occurred while processing your donation. Please try again.';

        if (status === 'timeout') {
          errorMessage = 'The request timed out. Please check your connection and try again.';
        } else if (xhr.responseText) {
          errorMessage = xhr.responseText;
        }

        messageDiv
          .removeClass('alert-success')
          .addClass('alert-danger')
          .text(errorMessage)
          .fadeIn();
      },
      complete: function() {
        // Reset button state
        submitButton.prop('disabled', false);
        submitButton.text('Submit');
      }
    });
  });

  // ===== CAROUSEL AUTO-PLAY ENHANCEMENT =====
  // Pause carousel on hover for better user experience
  $('.carousel').hover(
    function() {
      $(this).carousel('pause');
    },
    function() {
      $(this).carousel('cycle');
    }
  );

  // ===== MODAL ENHANCEMENTS =====
  // Enhanced modal behavior for advisor biographies
  $('.bio_modal').on('show.bs.modal', function(event) {
    const button = $(event.relatedTarget);
    const modal = $(this);

    // Add fade-in animation to modal body content
    modal.find('.bio_section').addClass('animate__fadeInUp');
  });

  $('.bio_modal').on('hidden.bs.modal', function() {
    // Remove animation classes when modal is hidden
    $(this).find('.bio_section').removeClass('animate__fadeInUp');
  });

  // ===== ACCESSIBILITY IMPROVEMENTS =====
  // Keyboard navigation for advisor cards
  $('.advisory_board_section .box').on('keydown', function(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      $(this).find('.view_details_btn').click();
    }
  });

  // Focus management for modals
  $('.bio_modal').on('shown.bs.modal', function() {
    $(this).find('.btn-close').focus();
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

  // ===== FORM VALIDATION ENHANCEMENTS =====
  // Real-time form validation
  $('#donationForm input, #donationForm select').on('blur', function() {
    validateField($(this));
  });

  function validateField(field) {
    const value = field.val().trim();
    let isValid = true;
    let message = '';

    // Remove previous validation classes
    field.removeClass('is-valid is-invalid');
    field.siblings('.invalid-feedback').remove();

    // Field-specific validation
    if (field.attr('required') && !value) {
      isValid = false;
      message = 'This field is required.';
    } else if (field.attr('type') === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        message = 'Please enter a valid email address.';
      }
    } else if (field.attr('type') === 'tel' && value) {
      const phoneRegex = /^[+]?[1-9]?[0-9]{7,15}$/;
      if (!phoneRegex.test(value.replace(/[^\d+]/g, ''))) {
        isValid = false;
        message = 'Please enter a valid phone number.';
      }
    } else if (field.attr('type') === 'number' && value) {
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue <= 0) {
        isValid = false;
        message = 'Please enter a valid positive number.';
      }
    }

    // Apply validation styling
    if (isValid) {
      field.addClass('is-valid');
    } else {
      field.addClass('is-invalid');
      field.after('<div class="invalid-feedback">' + message + '</div>');
    }

    return isValid;
  }

  // ===== ENHANCED USER INTERACTIONS =====
  // Hover effects for advisor cards
  $('.advisory_board_section .box').on('mouseenter', function() {
    $(this).find('.advisor_image').addClass('hover-effect');
  }).on('mouseleave', function() {
    $(this).find('.advisor_image').removeClass('hover-effect');
  });

  // Loading animation for modals
  $('.view_details_btn').on('click', function() {
    const targetModal = $($(this).data('bs-target'));
    targetModal.find('.modal-body').append('<div class="loading-spinner text-center"><i class="fa fa-spinner fa-spin fa-2x"></i></div>');

    setTimeout(function() {
      targetModal.find('.loading-spinner').remove();
    }, 500);
  });

  // ===== ANALYTICS AND TRACKING =====
  // Track advisor card interactions
  $('.view_details_btn').on('click', function() {
    const advisorName = $(this).closest('.box').find('.advisor_name').text();

    // Log interaction (you can integrate with Google Analytics or other tracking)
    console.log('Advisor biography viewed:', advisorName);

    // Optional: Send to analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'advisor_bio_view', {
        'advisor_name': advisorName,
        'section': 'advisory_board'
      });
    }
  });

  // Track donation button clicks
  $('[data-bs-target="#donationModal"]').on('click', function() {
    console.log('Donation modal opened from advisory board');

    if (typeof gtag !== 'undefined') {
      gtag('event', 'donation_modal_open', {
        'source_page': 'advisory_board'
      });
    }
  });

  // ===== ERROR HANDLING =====
  // Global error handler for uncaught errors
  window.addEventListener('error', function(event) {
    console.error('Advisory board page error:', event.error);
  });

  // Handle image loading errors gracefully
  $('img').on('error', function() {
    const alt = $(this).attr('alt') || 'Image';
    $(this).replaceWith('<div class="image-placeholder"><i class="fa fa-image"></i><br><small>' + alt + '</small></div>');
  });
});

// ===== UTILITY FUNCTIONS =====
// Show message function for construction alerts
function showMessage(event) {
  event.preventDefault(); // Prevent the link from navigating
  alert("This page is under construction.");
}

// Lazy loading for images (performance optimization)
function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries, observer) => {
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

// Initialize lazy loading when DOM is ready
$(document).ready(function() {
  initLazyLoading();
});

// ===== SCROLL ANIMATIONS =====
// Animate advisor cards on scroll
function initScrollAnimations() {
  const cards = document.querySelectorAll('.advisory_board_section .box');
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    cardObserver.observe(card);
  });
}

// Initialize scroll animations
$(document).ready(function() {
  initScrollAnimations();
});