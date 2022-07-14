import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { fetchUsers } from '../../../lib/services/user';
import { GenderFilter } from '../../../lib/types/user';

import type { Sort } from '../../../lib/types/sort';

const LIMIT = 20;

type Params = {
  gender: GenderFilter;
  keyword: string;
  sort: Sort;
}

export const useQueryUser = ({ gender = GenderFilter.ALL, keyword, sort }: Params) => {
  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery(['users-query', gender, keyword, sort.order, sort.column],
    ({ pageParam }) => fetchUsers({
      page: pageParam ?? 1,
      limit: LIMIT,
      gender,
      keyword,
      sort,
    }), {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.results.length < LIMIT) return undefined;

        return lastPage.results.length > 0 ? pages.length + 1 : undefined;
      },
    });

  return useMemo(() => ({
    users: data?.pages.flatMap((item) => item.results),
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  }), [data?.pages, isLoading, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage]);
};
