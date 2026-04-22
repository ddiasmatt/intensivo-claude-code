import { useEffect } from 'react';

const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'aff'];
const STORAGE_KEY = 'chatfunnel_tracking';

type TrackingParams = Record<string, string>;

const getStoredParams = (): TrackingParams => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

export const useUTMParams = () => {
  // Captura parâmetros no mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const storedParams = getStoredParams();
    let hasNewParams = false;
    
    // Atualiza apenas se houver novos parâmetros
    UTM_PARAMS.forEach(param => {
      const value = params.get(param);
      if (value) {
        storedParams[param] = value;
        hasNewParams = true;
      }
    });
    
    if (hasNewParams) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storedParams));
    }
  }, []);

  // Função para construir URL com parâmetros
  const buildCTAUrl = (baseUrl: string): string => {
    const stored = getStoredParams();
    
    try {
      const url = new URL(baseUrl);
      
      Object.entries(stored).forEach(([key, value]) => {
        if (value) url.searchParams.set(key, value);
      });
      
      return url.toString();
    } catch {
      // Se falhar ao parsear a URL, retorna a original
      return baseUrl;
    }
  };

  return { buildCTAUrl };
};
