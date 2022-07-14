export type User = {
  email: string;
  name: {
    first: string;
    last?: string;
  };
  login: {
    username: string;
  };
  gender: string;
  registered: {
    date: string;
  }
}

export enum GenderFilter {
  ALL = 'all',
  MALE = 'male',
  FEMALE = 'female',
}
