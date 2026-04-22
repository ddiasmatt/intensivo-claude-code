(function (global) {
  var WEBHOOK_URL = 'https://dwkfaqbfhdeemulmkxjn.supabase.co/functions/v1/webhook-funnel?type=generico&funnel_id=14';
  var REDIRECT_URL = 'https://sndflw.com/i/trV5sqi3n9eSZD0U1Rlx';

  var EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function buildUrlWithUTMs(base, utms) {
    try {
      var url = new URL(base);
      Object.keys(utms).forEach(function (k) {
        if (utms[k]) url.searchParams.set(k, utms[k]);
      });
      return url.toString();
    } catch (e) {
      return base;
    }
  }

  function show(el) { if (el) el.hidden = false; }
  function hide(el) { if (el) el.hidden = true; }

  function ModalController(utmParams) {
    var dialog = document.getElementById('capture-modal');
    var form = document.getElementById('capture-form');
    var success = document.getElementById('dialog-success');
    var submitBtn = document.getElementById('submit-btn');
    var submitLabel = document.getElementById('submit-btn-label');
    var submitError = document.getElementById('submit-error');
    var nameInput = document.getElementById('field-name');
    var emailInput = document.getElementById('field-email');
    var phoneInput = document.getElementById('field-phone');
    var errName = document.getElementById('error-name');
    var errEmail = document.getElementById('error-email');
    var errPhone = document.getElementById('error-phone');

    var phone = global.PhoneMask.bindPhoneMask(phoneInput);

    function setFieldError(input, errEl, message) {
      if (message) {
        errEl.textContent = message;
        show(errEl);
        input.classList.add('input--error');
      } else {
        hide(errEl);
        input.classList.remove('input--error');
      }
    }

    function validate() {
      var ok = true;
      if (nameInput.value.trim().length < 2) {
        setFieldError(nameInput, errName, 'Nome deve ter pelo menos 2 caracteres');
        ok = false;
      } else {
        setFieldError(nameInput, errName, '');
      }

      if (!EMAIL_REGEX.test(emailInput.value.trim())) {
        setFieldError(emailInput, errEmail, 'E-mail invalido');
        ok = false;
      } else {
        setFieldError(emailInput, errEmail, '');
      }

      if (!phone.isValid()) {
        setFieldError(phoneInput, errPhone, 'Telefone deve ter 11 digitos');
        ok = false;
      } else {
        setFieldError(phoneInput, errPhone, '');
      }

      return ok;
    }

    function setLoading(isLoading) {
      submitBtn.disabled = isLoading;
      if (isLoading) {
        submitLabel.innerHTML = '<span class="dialog__spinner" aria-hidden="true"></span>Enviando...';
      } else {
        submitLabel.textContent = 'ENTRAR NO GRUPO';
      }
    }

    function reset() {
      form.reset();
      phone.reset();
      setLoading(false);
      hide(submitError);
      hide(success);
      show(form);
      setFieldError(nameInput, errName, '');
      setFieldError(emailInput, errEmail, '');
      setFieldError(phoneInput, errPhone, '');
    }

    function open() {
      reset();
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
      setTimeout(function () {
        nameInput.focus();
      }, 50);
    }

    function close() {
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
      reset();
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) return;

      setLoading(true);
      hide(submitError);

      var payload = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phone.raw(),
        utm_source: utmParams.utm_source || '',
        utm_medium: utmParams.utm_medium || '',
        utm_campaign: utmParams.utm_campaign || '',
        utm_content: utmParams.utm_content || '',
        utm_term: utmParams.utm_term || '',
      };

      fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(function () { /* fire-and-forget */ });

      global.Analytics.trackMetaLead();
      global.Analytics.trackGALead();

      if (REDIRECT_URL) {
        global.location.href = buildUrlWithUTMs(REDIRECT_URL, utmParams);
        return;
      }

      hide(form);
      show(success);
      setLoading(false);
    });

    // Click outside (native dialog) closes it
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) close();
    });

    return { open: open, close: close };
  }

  global.CaptureModal = ModalController;
})(window);
