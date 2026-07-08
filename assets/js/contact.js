/* ==========================================================================
   NanoRa Technologies — contact.js
   Page-specific interaction logic for the Contact page (contact.html).
   Covers only what's unique to this page:
     1. Client-side form validation with inline field errors
     2. Live character counter for the message field
     3. Submit button loading state + success/error status message
   Everything else — navbar, scroll progress, back-to-top, FAQ accordion,
   reveal animations, cursor glow — is already handled by main.js /
   animation.js and is reused as-is; nothing here duplicates that logic.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCharacterCounter();
  initContactForm();
});

/* --------------------------------------------------------------------------
   Live character counter for the message textarea
   -------------------------------------------------------------------------- */
function initCharacterCounter() {
  const textarea = document.getElementById('message');
  const counter = document.getElementById('charCount');
  if (!textarea || !counter) return;

  const limit = parseInt(textarea.getAttribute('maxlength'), 10) || 800;
  const wrapper = counter.closest('.char-counter');

  const update = () => {
    const length = textarea.value.length;
    counter.textContent = length;
    wrapper.classList.toggle('near-limit', length >= limit * 0.85 && length < limit);
    wrapper.classList.toggle('at-limit', length >= limit);
  };

  textarea.addEventListener('input', update);
  update();
}

/* --------------------------------------------------------------------------
   Contact form — validation, loading state, success/error feedback
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn = document.getElementById('formSubmitBtn');
  const statusEl = document.getElementById('formStatus');

  const validators = {
    fullName: (value) => value.trim().length >= 2 || 'Please enter your full name.',
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) || 'Please enter a valid email address.',
    subject: (value) => value.trim().length >= 3 || 'Please enter a short subject.',
    message: (value) => value.trim().length >= 10 || 'Please share a few more details (at least 10 characters).'
  };

  const setFieldError = (field, message) => {
    const group = field.closest('.form-group');
    const errorEl = form.querySelector(`[data-error-for="${field.name}"]`);
    if (!group || !errorEl) return;

    if (message) {
      group.classList.add('field-invalid');
      errorEl.textContent = message;
    } else {
      group.classList.remove('field-invalid');
      errorEl.textContent = '';
    }
  };

  const validateField = (field) => {
    const validate = validators[field.name];
    if (!validate) return true;

    const result = validate(field.value);
    if (result === true) {
      setFieldError(field, '');
      return true;
    }
    setFieldError(field, result);
    return false;
  };

  // Validate on blur for immediate, non-intrusive feedback
  Object.keys(validators).forEach((name) => {
    const field = form.elements[name];
    if (field) field.addEventListener('blur', () => validateField(field));
  });

  const showStatus = (type, message) => {
    statusEl.textContent = message;
    statusEl.className = `form-status visible ${type}`;
  };

  const hideStatus = () => {
    statusEl.className = 'form-status';
    statusEl.textContent = '';
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    hideStatus();

    let isValid = true;
    Object.keys(validators).forEach((name) => {
      const field = form.elements[name];
      if (field && !validateField(field)) isValid = false;
    });

    if (!isValid) {
      showStatus('error', 'Please fix the highlighted fields and try again.');
      const firstInvalid = form.querySelector('.field-invalid input, .field-invalid textarea');
      firstInvalid?.focus();
      return;
    }

    // Simulate submission — replace with a real endpoint integration
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      showStatus(
        'success',
        "Thank you! We've received your inquiry and will get back to you as soon as possible."
        );
      form.reset();
      document.getElementById('charCount').textContent = '0';
    }, 1400);
  });
}