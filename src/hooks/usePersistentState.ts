import { useEffect, useState, Dispatch, SetStateAction } from 'react';

// useState backed by localStorage. Falls back to in-memory state when storage is
// unavailable (private mode, blocked cookies) or the stored value is corrupt.
export function usePersistentState<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw !== null ? (JSON.parse(raw) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Quota exceeded or storage disabled; state still works for this session.
    }
  }, [key, value]);

  return [value, setValue];
}
