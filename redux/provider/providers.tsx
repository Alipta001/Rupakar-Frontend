"use client"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useEffect, useState } from 'react';
import { Provider, useDispatch } from 'react-redux'
import { store } from '../store/store';
import { setAuth, AUTH_USER_STORAGE_KEY, fetchCurrentUserThunk } from '../slice/authSlice/authSlice'

interface ProvidersProps {
  children: ReactNode;
}

function AuthHydrator({ children }: { children: ReactNode }) {
  const dispatch = useDispatch<any>()

  useEffect(() => {
    if (typeof window === 'undefined') return

    const savedUser = window.localStorage.getItem(AUTH_USER_STORAGE_KEY)
    const token = store.getState().auth.token

    if (token) {
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser)
          dispatch(setAuth({ token, user, isAuthenticated: true }))
        } catch (error) {
          window.localStorage.removeItem(AUTH_USER_STORAGE_KEY)
        }
      }
      // Always fetch authoritative, fresh profile data from backend
      dispatch(fetchCurrentUserThunk())
    }
  }, [dispatch])

  return <>{children}</>
}

export default function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }))

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthHydrator>{children}</AuthHydrator>
      </QueryClientProvider>
    </Provider>
  )
}
