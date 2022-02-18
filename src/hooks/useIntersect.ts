import { useState, useCallback, useEffect } from 'react';

const useIntersect = (renew: Function, deps: any[]) => {
  const [target, setTarget] = useState(null);
  const [isEnd, setIsEnd] = useState<boolean>(false);

  const onIntersect: IntersectionObserverCallback = useCallback(
    async ([entry], observer) => {
      if (entry.isIntersecting && !isEnd) {
        observer.unobserve(entry.target);
        renew();
        observer.observe(entry.target);
      }
    },
    [isEnd, ...deps],
  );

  useEffect(() => {
    let observer: IntersectionObserver;
    if (target) {
      observer = new IntersectionObserver(onIntersect, {
        threshold: 0.1,
      });
      observer.observe(target);
    }
    return () => observer && observer.disconnect();
  }, [target, onIntersect]);

  return {
    isEnd,
    setIsEnd,
    setTarget,
  };
};

export default useIntersect;
