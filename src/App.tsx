import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { UsersPage } from './pages/users';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UsersPage />
    </QueryClientProvider>
  );
}

export default App;
