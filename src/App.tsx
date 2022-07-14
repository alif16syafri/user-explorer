import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import dayjs from 'dayjs';

import { UsersPage } from './pages/users';

import 'dayjs/locale/id';

const queryClient = new QueryClient();

function App() {
  dayjs.locale('id');

  return (
    <QueryClientProvider client={queryClient}>
      <UsersPage />
    </QueryClientProvider>
  );
}

export default App;
