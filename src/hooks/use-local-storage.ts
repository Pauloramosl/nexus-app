import { useCallback, useEffect, useState } from 'react';

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return defaultValue;
    }

    const item = window.localStorage.getItem(key);

    if (item) {
      try {
        return JSON.parse(item) as T;
      } catch (error) {
        console.warn(`Não foi possível fazer parse do valor em ${key}`, error);
      }
    }

    return defaultValue;
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Não foi possível salvar o valor em ${key}`, error);
    }
  }, [key, storedValue]);

  const setValue = useCallback(
    (value: React.SetStateAction<T>) => {
      setStoredValue((prev) =>
        value instanceof Function ? value(prev) : value,
      );
    },
    [setStoredValue],
  );

  return [storedValue, setValue] as const;
}
