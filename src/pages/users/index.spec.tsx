import React from 'react';
import axios from 'axios';
import { QueryClient, QueryClientProvider } from 'react-query';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { mockUsers } from '../../lib/mocks/user';
import { SortOrder } from '../../lib/types/sort';
import { GenderFilter } from '../../lib/types/user';
import * as userService from '../../lib/services/user';

import { TableColumn } from './hooks/useUserPage';
import { UsersPage } from './index';

jest.mock('axios');
jest.mock('../../lib/services/user');

const spyFetchUsers = jest.spyOn(userService, 'fetchUsers');

const DEFAULT_FETCH_USER_PARAMS = {
  gender: GenderFilter.ALL,
  page: 1,
  limit: 20,
  keyword: '',
  sort: {
    column: TableColumn.USERNAME,
    order: SortOrder.ASC,
  },
};

describe('Users page', () => {
  const init = (users = mockUsers) => {
    // @ts-ignore
    const wrapper = ({ children }) => {
      const queryClient = new QueryClient();

      return (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );
    };

    const utils = render(<UsersPage />, { wrapper });

    const getFirstUser = () => screen.queryByText(users.results[0].email);
    const getSearchInput = () => screen.getByPlaceholderText(/Search username/i);
    const getEmailHead = () => screen.getByText(TableColumn.EMAIL);
    const getGenderInput = () => screen.getByTestId('filter-select');
    const getDefaultGenderValue = () => screen.getByDisplayValue(GenderFilter.ALL.toUpperCase());
    const getResetButton = () => screen.getByText(/reset/i);

    return {
      ...utils,
      getFirstUser,
      getSearchInput,
      getEmailHead,
      getDefaultGenderValue,
      getGenderInput,
      getResetButton,
    };
  };

  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
    jest.clearAllMocks();

    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  afterEach(() => {
    cleanup();
  });

  it('Should render users correctly', async () => {
    spyFetchUsers.mockImplementationOnce(() => Promise.resolve(mockUsers));

    const { getFirstUser } = init();

    expect(spyFetchUsers).toHaveBeenCalledWith(DEFAULT_FETCH_USER_PARAMS);

    await waitFor(() => {
      expect(getFirstUser()).toBeInTheDocument();
    });
  });

  it('Should able to search user correctly', async () => {
    spyFetchUsers.mockImplementation(() => Promise.resolve(mockUsers));

    const username = mockUsers.results[0].login.username;

    const { getSearchInput, getFirstUser } = init();

    await waitFor(() => {
      expect(getSearchInput()).toBeInTheDocument();
    });

    userEvent.type(getSearchInput(), username);

    await waitFor(() => {
      expect(spyFetchUsers).toHaveBeenCalledWith({
        ...DEFAULT_FETCH_USER_PARAMS,
        keyword: username,
      });
    });

    await waitFor(() => {
      expect(getFirstUser()).toBeInTheDocument();
    });
  });

  it('Should able to sort by email correctly', async () => {
    spyFetchUsers.mockImplementationOnce(() => Promise.resolve(mockUsers));

    const { getEmailHead } = init();

    await waitFor(() => {
      expect(getEmailHead()).toBeInTheDocument();
    });

    userEvent.click(getEmailHead());

    expect(spyFetchUsers).toHaveBeenCalledWith({
      ...DEFAULT_FETCH_USER_PARAMS,
      sort: {
        column: TableColumn.EMAIL,
        order: SortOrder.ASC,
      },
    });

    userEvent.click(getEmailHead());

    expect(spyFetchUsers).toHaveBeenCalledWith({
      ...DEFAULT_FETCH_USER_PARAMS,
      sort: {
        column: TableColumn.EMAIL,
        order: SortOrder.DESC,
      },
    });
  });

  it('Should able to filter by gender & reset the filter correctly', async () => {
    spyFetchUsers.mockImplementationOnce(() => Promise.resolve(mockUsers));

    const { getDefaultGenderValue, getGenderInput, getResetButton } = init();

    await waitFor(() => {
      expect(getDefaultGenderValue()).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(getGenderInput()).toBeInTheDocument();
    });

    fireEvent.change(getGenderInput(), { target: { value: GenderFilter.MALE } });

    await waitFor(() => {
      expect(spyFetchUsers).toHaveBeenCalledWith({
        ...DEFAULT_FETCH_USER_PARAMS,
        gender: GenderFilter.MALE,
      });
    });

    expect(getResetButton()).toBeInTheDocument();

    userEvent.click(getResetButton());

    await waitFor(() => {
      expect(spyFetchUsers).toHaveBeenCalledWith(DEFAULT_FETCH_USER_PARAMS);
    });
  });
});
