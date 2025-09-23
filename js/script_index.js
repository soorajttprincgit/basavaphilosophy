document.getElementById('displayDateYear').textContent = new Date().getFullYear();

// jQuery Document Ready
$(document).ready(function() {

  // Donation form handler
  $('#donationForm').on('submit', function(event) {
    event.preventDefault();
    var formData = $(this).serialize();

    // Show loading state (optional)
    $('#donationStatusMessage').text('Processing your donation...').fadeIn();

    // Simulate form submission (replace with actual PHP endpoint)
    setTimeout(function() {
      $('#donationStatusMessage')
        .text('Thank you for your donation! We will contact you soon.')
        .removeClass('alert-danger')
        .addClass('alert-success')
        .fadeIn();

      // Reset form after successful submission
      $('#donationForm')[0].reset();

      // Auto-hide success message after 5 seconds
      setTimeout(function() {
        $('#donationStatusMessage').fadeOut();
      }, 5000);
    }, 1000);
  });

  // Initialize tooltips if needed
  $('[data-toggle="tooltip"]').tooltip();

  // Initialize any carousel with custom settings if needed
  $('.carousel').carousel({
    interval: 8000, // 8 seconds
    pause: 'hover',
    wrap: true
  });

  // Smooth scrolling for anchor links
  $('a[href*="#"]').not('[href="#"]').not('[href="#0"]').click(function(event) {
    if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') 
        && location.hostname === this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top - 100
        }, 1000);
      }
    }
  });

  // Add fade-in animation for elements on scroll
  $(window).scroll(function() {
    $('.about_section, .donation_section').each(function() {
      var elementTop = $(this).offset().top;
      var elementBottom = elementTop + $(this).outerHeight();
      var viewportTop = $(window).scrollTop();
      var viewportBottom = viewportTop + $(window).height();

      if (elementBottom > viewportTop && elementTop < viewportBottom) {
        $(this).addClass('fade-in');
      }
    });
  });

  // Form validation enhancement
  $('form input, form select, form textarea').on('blur', function() {
    validateField($(this));
  });

  // Mobile menu close on link click
  $('.navbar-nav .nav-link').on('click', function() {
    if ($(window).width() < 992) {
      $('.navbar-collapse').collapse('hide');
    }
  });

  // Add loading state to buttons
  $('button[type="submit"], .btn').on('click', function() {
    if ($(this).closest('form').length && !$(this).hasClass('btn-close')) {
      var $btn = $(this);
      var originalText = $btn.text();

      $btn.prop('disabled', true).text('Processing...');

      setTimeout(function() {
        $btn.prop('disabled', false).text(originalText);
      }, 3000);
    }
  });
});

// Show message for under construction pages
function showMessage(event) {
  event.preventDefault();

  // Create a more user-friendly alert
  if (confirm("This page is currently under construction. Would you like to contact us directly for more information?")) {
    window.location.href = "contact.html";
  }
}

// Field validation function
function validateField($field) {
  var value = $field.val().trim();
  var fieldType = $field.attr('type') || $field.prop('tagName').toLowerCase();
  var isValid = true;
  var errorMessage = '';

  // Remove previous validation classes
  $field.removeClass('is-valid is-invalid');
  $field.siblings('.invalid-feedback').remove();

  // Required field validation
  if ($field.prop('required') && !value) {
    isValid = false;
    errorMessage = 'This field is required.';
  } else if (value) {
    // Type-specific validation
    switch (fieldType) {
      case 'email':
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
          isValid = false;
          errorMessage = 'Please enter a valid email address.';
        }
        break;
      case 'tel':
        var phonePattern = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phonePattern.test(value.replace(/[\s\-\(\)]/g, ''))) {
          isValid = false;
          errorMessage = 'Please enter a valid phone number.';
        }
        break;
      case 'number':
        if (isNaN(value) || parseFloat(value) <= 0) {
          isValid = false;
          errorMessage = 'Please enter a valid positive number.';
        }
        break;
    }
  }

  // Apply validation classes and messages
  if (isValid) {
    $field.addClass('is-valid');
  } else {
    $field.addClass('is-invalid');
    $field.after('<div class="invalid-feedback">' + errorMessage + '</div>');
  }

  return isValid;
}

// Donation amount quick select
function setDonationAmount(amount) {
  $('#amount').val(amount).trigger('blur');
}

// Add CSS fade-in class dynamically
$('<style>')
  .prop('type', 'text/css')
  .html(`
    .fade-in {
      opacity: 1 !important;
      transform: translateY(0) !important;
      transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
    .about_section, .donation_section {
      opacity: 0;
      transform: translateY(20px);
    }
  `)
  .appendTo('head');

// Initialize page
$(document).ready(function() {
  // Preloader (if you want to add one later)
  $(window).on('load', function() {
    $('#preloader').fadeOut('slow');
  });

  // Add smooth transitions to all interactive elements
  $('a, button, .btn').addClass('transition-smooth');

  // Console log for development (remove in production)
  console.log('Basava Philosophy Research Foundation - Website Loaded Successfully');
  console.log('For support: info@basavaphilosophy.com');
});

// Error handling for any JavaScript errors
window.onerror = function(msg, url, lineNo, columnNo, error) {
  console.error('JavaScript Error: ', {
    message: msg,
    source: url,
    line: lineNo,
    column: columnNo,
    error: error
  });

  // Optionally send error to server for logging
  // This is useful for production environments
  return false;
};

// Service worker registration (for future PWA implementation)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js')
      .then(function(registration) {
        console.log('ServiceWorker registration successful');
      })
      .catch(function(err) {
        console.log('ServiceWorker registration failed');
      });
  });
}