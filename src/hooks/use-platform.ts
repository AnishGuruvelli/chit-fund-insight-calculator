
import { useEffect, useState } from 'react';

export function usePlatform() {
  const [platform, setPlatform] = useState({
    isAndroid: false,
    isIOS: false,
    isDesktop: true,
  });

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroid = userAgent.indexOf('android') > -1;
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isDesktop = !isAndroid && !isIOS;

    setPlatform({
      isAndroid,
      isIOS,
      isDesktop,
    });
  }, []);

  return platform;
}
