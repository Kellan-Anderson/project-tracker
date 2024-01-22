import { useState, useEffect } from 'react';

export function useScreenSize() {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth ?? 0,
    height: window.innerHeight ?? 0,
  });

  useEffect(() => {
    const handleResize = () => {
			if(typeof window !== undefined) {
				setScreenSize({
					width: window.innerWidth,
					height: window.innerHeight,
				});
			}
    };

    window.addEventListener('resize', handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return screenSize;
};