// Tipagem para o objeto fbq global
declare global {
  interface Window {
    fbq?: (
      action: 'track' | 'trackCustom' | 'init',
      eventName: string,
      parameters?: Record<string, unknown>,
      options?: { eventID?: string }
    ) => void;
  }
}

// Gera ID único para deduplicação de eventos
const generateEventId = (prefix: string): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const useMetaPixel = () => {
  const trackEvent = (
    eventName: string,
    parameters?: Record<string, unknown>,
    eventID?: string
  ) => {
    if (typeof window !== 'undefined' && window.fbq) {
      const id = eventID || generateEventId(eventName.toLowerCase());
      window.fbq('track', eventName, parameters || {}, { eventID: id });
    }
  };

  const trackCustomEvent = (
    eventName: string,
    parameters?: Record<string, unknown>
  ) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('trackCustom', eventName, parameters || {});
    }
  };

  const trackLead = () => {
    const eventId = generateEventId('lead');
    trackEvent('Lead', {}, eventId);
    return eventId;
  };

  return { trackEvent, trackCustomEvent, trackLead, generateEventId };
};
