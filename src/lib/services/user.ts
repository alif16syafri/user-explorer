import axios from 'axios';

import type { User, GenderFilter } from '../types/user';
import type { Sort } from '../types/sort';

type UserResponse = {
  results: User[];
}

const BASE_URL = 'https://randomuser.me/api';

type FetchUsersParams = {
  page: number;
  limit: number
  gender: GenderFilter
  keyword: string;
  sort: Sort;
}
export const fetchUsers = async ({
  page = 1,
  limit = 20,
  gender,
  keyword,
  sort,
}: FetchUsersParams): Promise<UserResponse> => {
  const { data } = await axios.get(BASE_URL, {
    params: {
      results: limit,
      page,
      gender,
      sortBy: sort.column,
      sortOrder: sort.order,
      ...(keyword && { keyword }),
    },
  });

  return data;
};
