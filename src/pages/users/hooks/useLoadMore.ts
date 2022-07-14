import { useEffect, useMemo, useRef } from 'react';

const INTERSECTION_OBSERVER_OPTIONS = {
  rootMargin: '0px',
  threshold: 1.0,
};

type Params = {
  isFetching?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore: () => void;
}

export const useLoadMore = ({ onLoadMore, isFetching, isFetchingNextPage }: Params) => {
  const loadMoreMarker = useRef<HTMLDivElement>(null);

  // load more detector
  useEffect(() => {
    if (!loadMoreMarker?.current) return;

    let observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target instanceof HTMLElement) {
          if (!isFetchingNextPage && !isFetching) {
            onLoadMore();
          }
        }
      });
    }, INTERSECTION_OBSERVER_OPTIONS);

    if (loadMoreMarker.current) observer.observe(loadMoreMarker.current);
  }, [onLoadMore, isFetchingNextPage, isFetching]);

  return useMemo(() => ({
    loadMoreMarker,
  }), []);
};
