import { useState, useEffect } from 'react';

function useOnScreen(element) {
  const [isInViewport, setIsInViewport] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsInViewport(entry.isIntersecting);
    });
    if (element) {
      observer.observe(element);
    }
    return () => {
      observer.disconnect();
    };
  }, [element]);

  return isInViewport;
}

export default useOnScreen;
