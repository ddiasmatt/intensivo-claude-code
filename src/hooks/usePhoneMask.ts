import { useState, useCallback, ChangeEvent } from 'react';

export const formatPhone = (value: string): string => {
  // Remove all non-numeric characters
  const numbers = value.replace(/\D/g, '');
  
  // Limit to 11 digits
  const limited = numbers.slice(0, 11);
  
  // Apply Brazilian phone mask (XX) XXXXX-XXXX
  if (limited.length <= 2) {
    return limited.length > 0 ? `(${limited}` : '';
  } else if (limited.length <= 7) {
    return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
  } else {
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
  }
};

export const usePhoneMask = (initialValue = '') => {
  const [value, setValue] = useState(formatPhone(initialValue));
  const [rawValue, setRawValue] = useState(initialValue.replace(/\D/g, ''));

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = formatPhone(inputValue);
    const raw = inputValue.replace(/\D/g, '').slice(0, 11);
    
    setValue(formatted);
    setRawValue(raw);
  }, []);

  const reset = useCallback(() => {
    setValue('');
    setRawValue('');
  }, []);

  return {
    value,
    rawValue,
    handleChange,
    reset,
    isValid: rawValue.length === 11,
  };
};
