(function (global) {
  function eventId(prefix) {
    return (
      prefix +
      '_' +
      Date.now() +
      '_' +
      Math.random().toString(36).substr(2, 9)
    );
  }

  function trackMetaLead() {
    if (typeof global.fbq === 'function') {
      global.fbq('track', 'Lead', {}, { eventID: eventId('lead') });
    }
  }

  function trackGALead(params) {
    if (typeof global.gtag === 'function') {
      global.gtag(
        'event',
        'generate_lead',
        Object.assign({ currency: 'BRL', value: 0 }, params || {})
      );
    }
  }

  global.Analytics = {
    trackMetaLead: trackMetaLead,
    trackGALead: trackGALead,
    eventId: eventId,
  };
})(window);
