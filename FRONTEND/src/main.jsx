import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routing/routeTree.js'
import store from './store/store.js'
import { Provider } from 'react-redux'
import { checkAuth } from './utils/helper';

export const queryClient = new QueryClient()
const router = createRouter({
  routeTree,
  context:{
    queryClient,
    store
  }
})

const AppBootstrap = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        await checkAuth({ context: { queryClient, store } });
      } catch (e) {
        setError('Authentication check failed. Please log in again.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div style={{textAlign: 'center', marginTop: '2rem'}}>Loading...</div>;
  if (error) return <div style={{color: 'red', textAlign: 'center', marginTop: '2rem'}}>{error}</div>;

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Provider>
  );
};

createRoot(document.getElementById('root')).render(<AppBootstrap />);
