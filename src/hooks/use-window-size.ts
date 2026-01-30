import { throttle } from 'lodash-es';
import { useEffect, useState } from 'react';

export default function useWindowSize(defaultWidth: number = 1280) {
  const [windowSize, setWindoSize] = useState(defaultWidth);

  useEffect(() => {
    const handleResize = throttle(() => {
      const width = window.innerWidth;

      setWindoSize(width);
    }, 200);
    window.addEventListener('resize', handleResize);

    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { windowSize };
}
