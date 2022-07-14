import { useCallback } from 'react';
import cx from 'classnames';

import type { FC } from 'react';

import { Loading } from '../../components/Loading';
import { Chevron } from '../../components/Icon/IconChevron';
import { GenderFilter } from '../../lib/types/user';
import { SortOrder } from '../../lib/types/sort';

import { useLoadMore } from './hooks/useLoadMore';
import { useUserPage } from './hooks/useUserPage';
import { TableColumn } from './hooks/useUserPage';

import styles from './index.module.scss';

const ROW_CLASS = 'grid gap-x-2 py-4 border-1 border-b';
const TEXT_BODY_CLASS = 'break-all text-sm'

export const UsersPage: FC = () => {
  const {
    users,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    keyword,
    gender,
    sortedColumn,
    fetchNextPage,
    handleChangeKeyword,
    handleResetFilter,
    handleSort,
    setGender,
  } = useUserPage();
  const { loadMoreMarker } = useLoadMore({
    isFetching,
    isFetchingNextPage,
    onLoadMore: () => fetchNextPage(),
  });

  const renderFilter = useCallback(() => (
    <div className="flex mb-5">

      <div className="basis-2/6 mr-4">
        <input
          className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full h-12 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
          type="text"
          placeholder="Search username"
          value={keyword}
          onChange={(e) => handleChangeKeyword(e.target.value)}
        />
      </div>

      <div className="basis-2/6 mr-4 relative">
        <select
          className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 h-12 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          value={gender}
          data-testid="filter-select"
          onChange={(e) => setGender(e.target.value as GenderFilter)}
        >
          {Object.values(GenderFilter).map((item) => (
            <option key={item} value={item}>{item.toUpperCase()}</option>
          ))}
        </select>
        <Chevron className="absolute" />
      </div>

      <button
        className="basis-1/6 shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold h-12 px-4 rounded"
        type="button"
        onClick={handleResetFilter}
      >
        Reset
      </button>

    </div>
  ), [gender, handleChangeKeyword, handleResetFilter, keyword, setGender]);

  const renderHead = useCallback(() => (
    <div className={cx(styles.row, ROW_CLASS)}>
      {Object.values(TableColumn).map((col) => {
        const isSorted = sortedColumn.column === col;

        return (
          <div className="relative cursor-pointer" key={col} onClick={() => handleSort(col)}>
            <p className="font-semibold capitalize">
              {col}
            </p>
            {isSorted && (
              <Chevron className="absolute" direction={sortedColumn.order === SortOrder.ASC ? 'up' : 'down'} />
            )}
          </div>
        );
      })}
    </div>
  ), [handleSort, sortedColumn.column, sortedColumn.order]);

  const renderBody = useCallback(() => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center mt-5">
          <Loading />
        </div>
      );
    }

    if (!users || !users.length) {
      return (
        <div className="flex items-center justify-center mt-5">
          <p>No users data found.</p>
        </div>
      );
    }

    return (
      <div>
        {users.map((user) => (
          <div className={cx(styles.row, ROW_CLASS)} key={user.email}>
            <p className={TEXT_BODY_CLASS}>{user.login.username}</p>
            <p className={TEXT_BODY_CLASS}>{user.name.first} {user.name.last}</p>
            <p className={TEXT_BODY_CLASS}>{user.email}</p>
            <p className={TEXT_BODY_CLASS}>{user.gender}</p>
            <p className={TEXT_BODY_CLASS}>{user.registered.date}</p>
          </div>
        ))}
        {hasNextPage && (!isFetching || !isFetchingNextPage) && keyword.length < 1 && (
          <div data-testid="load-more-marker" ref={loadMoreMarker} style={{ height: 10, width: '100%' }} />
        )}
        {isFetchingNextPage && (
          <div className="flex items-center justify-center mt-5">
            <Loading />
          </div>
        )}
      </div>
    );
  }, [hasNextPage, isFetching, isFetchingNextPage, isLoading, keyword.length, loadMoreMarker, users]);


  return (
    <div className="px-4 py-6 lg:px-0 max-w-5xl lg:mx-auto">
      {renderFilter()}
      {renderHead()}
      {renderBody()}
    </div>
  );
};
