import { useState, useEffect } from 'react';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timeout to update debounced value after the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the timeout if value changes (or component unmounts)
    // This is how debounce works: if a new value comes in before the delay,
    // the previous timeout is cleared, and a new one is set.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); 

  return debouncedValue;
}

export { useDebounce };