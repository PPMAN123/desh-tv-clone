import { useEffect, useState } from 'react';

const useMediaQuery = (query: string) => {
  const [queryStatus, changeQueryStatus] = useState(false);

  useEffect(() => {
    changeQueryStatus(window.matchMedia(query).matches);
    addEventListener('resize', () => {
      changeQueryStatus(window.matchMedia(query).matches);
    });
  }, []);

  return queryStatus;
};

export default useMediaQuery;
