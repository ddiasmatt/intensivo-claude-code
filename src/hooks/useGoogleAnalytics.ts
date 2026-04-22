// Tipagem para o objeto gtag global
declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'set',
      targetOrEventName: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

export const useGoogleAnalytics = () => {
  const trackEvent = (
    eventName: string,
    params?: Record<string, unknown>
  ) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, params);
    }
  };

  const trackLead = (params?: Record<string, unknown>) => {
    trackEvent('generate_lead', {
      currency: 'BRL',
      value: 0,
      ...params,
    });
  };

  const trackSignUp = (method?: string) => {
    trackEvent('sign_up', { method: method || 'form' });
  };

  const trackFormStart = (formName: string) => {
    trackEvent('form_start', { form_name: formName });
  };

  const trackFormSubmit = (formName: string) => {
    trackEvent('form_submit', { form_name: formName });
  };

  return { 
    trackEvent, 
    trackLead, 
    trackSignUp, 
    trackFormStart, 
    trackFormSubmit 
  };
};
