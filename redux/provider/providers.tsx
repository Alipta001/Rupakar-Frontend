"use client"
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query'
import { ReactNode, useEffect, useRef, useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux'
import { store } from '../store/store';
import { setAuth, AUTH_USER_STORAGE_KEY, fetchCurrentUserThunk } from '../slice/authSlice/authSlice'
import { ACCESS_TOKEN_STORAGE_KEY } from '../../api/axios/axios'

interface ProvidersProps {
  children: ReactNode;
}

function AuthHydrator({ children }: { children: ReactNode }) {
  const dispatch = useDispatch<any>()
  const queryClient = useQueryClient()
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated)
  const previousAuthState = useRef<boolean | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleAuthExpired = () => {
      dispatch(setAuth({ token: null, user: null, isAuthenticated: false }))
      queryClient.clear()
    }

    window.addEventListener('rupakar:auth-expired', handleAuthExpired)

    const savedUser = window.localStorage.getItem(AUTH_USER_STORAGE_KEY)
    const token = window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) ?? store.getState().auth.token

    if (token) {
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser)
          dispatch(setAuth({ token, user, isAuthenticated: true }))
        } catch (error) {
          window.localStorage.removeItem(AUTH_USER_STORAGE_KEY)
          dispatch(setAuth({ token, isAuthenticated: true }))
        }
      } else {
        dispatch(setAuth({ token, isAuthenticated: true }))
      }
      // Always fetch authoritative, fresh profile data from backend
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      dispatch(fetchCurrentUserThunk())
    }

    return () => window.removeEventListener('rupakar:auth-expired', handleAuthExpired)
  }, [dispatch, queryClient])

  useEffect(() => {
    if (previousAuthState.current === null) {
      previousAuthState.current = isAuthenticated
      return
    }

    if (previousAuthState.current && !isAuthenticated) {
      queryClient.clear()
    } else if (!previousAuthState.current && isAuthenticated) {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
    }

    previousAuthState.current = isAuthenticated
  }, [isAuthenticated, queryClient])

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
