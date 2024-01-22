import { useState, useEffect } from 'react';

type screenSize = {
  width: number,
  height: number
}

export function useScreenSize() {
  const [screenSize, setScreenSize] = useState<screenSize | 'loading'>('loading');

  useEffect(() => {
    const handleResize = () => {
      console.log('This is running')
      if(typeof window !== undefined) {
				setScreenSize({
					width: window.innerWidth,
					height: window.innerHeight,
				});
			}
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return screenSize;
};