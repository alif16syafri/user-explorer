import { useCallback, useState, useMemo } from 'react';
import debounce from 'lodash.debounce';

import { GenderFilter } from '../../../lib/types/user';
import { SortOrder, Sort } from '../../../lib/types/sort';

import { useQueryUser } from './useQueryUser';

export enum TableColumn {
  USERNAME = 'username',
  NAME = 'name',
  EMAIL = 'email',
  GENDER = 'gender',
  DATE = 'registered date',
}

const INITIAL_FILTER = {
  keyword: '',
  gender: GenderFilter.ALL,
  sort: {
    column: TableColumn.USERNAME,
    order: SortOrder.ASC,
  },
};

export const useUserPage = () => {
  const [keyword, setKeyword] = useState(INITIAL_FILTER.keyword);
  // needed to distinguish keyword to render & keyword to send to payload to react-query
  const [keywordPayload, setKeywordPayload] = useState(INITIAL_FILTER.keyword);
  const [gender, setGender] = useState(INITIAL_FILTER.gender);
  const [sortedColumn, setSortedColumn] = useState<Sort>(INITIAL_FILTER.sort);

  const debounceKeywordHandler = useMemo(() => debounce((value) => setKeywordPayload(value), 500), []);

  const { users, hasNextPage, isLoading, isFetching, isFetchingNextPage, fetchNextPage } = useQueryUser({
    gender,
    keyword: keywordPayload,
    sort: sortedColumn,
  });

  const handleChangeKeyword = useCallback((value: string) => {
    debounceKeywordHandler(value)
    setKeyword(value);
  }, [debounceKeywordHandler]);

  const handleResetFilter = useCallback(() => {
    setGender(INITIAL_FILTER.gender);
    setKeyword(INITIAL_FILTER.keyword);
    setSortedColumn(INITIAL_FILTER.sort);
  }, []);

  const handleSort = useCallback((column: TableColumn) => {
    let newSort = { ...sortedColumn };

    if (column === sortedColumn.column) {
      newSort.order = newSort.order === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
    } else {
      newSort.order = SortOrder.ASC;
      newSort.column = column;
    }

    setSortedColumn(newSort);
  }, [sortedColumn]);

  return useMemo(() => ({
    users,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    keyword,
    gender,
    sortedColumn,
    handleChangeKeyword,
    handleResetFilter,
    handleSort,
    fetchNextPage,
    setGender,
  }), [
    fetchNextPage,
    gender,
    handleChangeKeyword,
    handleResetFilter,
    handleSort,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    keyword,
    sortedColumn,
    users,
  ]);
};


