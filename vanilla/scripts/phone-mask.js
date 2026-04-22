(function (global) {
  function formatPhone(value) {
    var digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length === 0) return '';
    if (digits.length <= 2) return '(' + digits;
    if (digits.length <= 7) {
      return '(' + digits.slice(0, 2) + ') ' + digits.slice(2);
    }
    return (
      '(' +
      digits.slice(0, 2) +
      ') ' +
      digits.slice(2, 7) +
      '-' +
      digits.slice(7)
    );
  }

  function bindPhoneMask(input) {
    if (!input) return { raw: function () { return ''; }, reset: function () {} };
    input.addEventListener('input', function () {
      input.value = formatPhone(input.value);
    });
    return {
      raw: function () {
        return input.value.replace(/\D/g, '').slice(0, 11);
      },
      reset: function () {
        input.value = '';
      },
      isValid: function () {
        return input.value.replace(/\D/g, '').length === 11;
      },
    };
  }

  global.PhoneMask = {
    formatPhone: formatPhone,
    bindPhoneMask: bindPhoneMask,
  };
})(window);
