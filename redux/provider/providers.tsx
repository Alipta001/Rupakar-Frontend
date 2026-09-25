"use client"
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query'
import { ReactNode, useEffect, useRef, useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux'
import { store } from '../store/store';
import { setAuth, markAuthHydrated, AUTH_USER_STORAGE_KEY, fetchCurrentUserThunk } from '../slice/authSlice/authSlice'
import { ACCESS_TOKEN_STORAGE_KEY, onTokenRefreshed, refreshAccessToken } from '../../api/axios/axios'

interface ProvidersProps {
  children: ReactNode;
}

function AuthHydrator({ children }: { children: ReactNode }) {
  const dispatch = useDispatch<any>()
  const queryClient = useQueryClient()
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated)
  const previousAuthState = useRef<boolean | null>(null)

  useEffect(() => {
    const unsub = onTokenRefreshed((newToken) => {
      dispatch(setAuth({ token: newToken, isAuthenticated: true }))
    })
    return unsub
  }, [dispatch])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleAuthExpired = () => {
      dispatch(setAuth({ token: null, user: null, isAuthenticated: false }))
      queryClient.removeQueries({ queryKey: ['cart'] })
      queryClient.removeQueries({ queryKey: ['orders'] })
      queryClient.removeQueries({ queryKey: ['wishlist'] })
      queryClient.removeQueries({ queryKey: ['user'] })
      queryClient.removeQueries({ queryKey: ['addresses'] })
      queryClient.removeQueries({ queryKey: ['profile'] })
    }

    window.addEventListener('rupakar:auth-expired', handleAuthExpired)

    let tokenFromUrl: string | null = null
    try {
      const urlParams = new URLSearchParams(window.location.search)
      tokenFromUrl = urlParams.get('token')
      if (tokenFromUrl) {
        window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, tokenFromUrl)
        urlParams.delete('token')
        const newSearch = urlParams.toString() ? `?${urlParams.toString()}` : ''
        window.history.replaceState(null, '', `${window.location.pathname}${newSearch}${window.location.hash}`)
      }
    } catch {}

    const savedUser = window.localStorage.getItem(AUTH_USER_STORAGE_KEY)
    const token =
      tokenFromUrl ||
      window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) ||
      store.getState().auth?.token ||
      (store.getState().auth as any)?.accessToken ||
      null

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

      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
      dispatch(fetchCurrentUserThunk())
      dispatch(markAuthHydrated())
    } else {
      refreshAccessToken()
        .then((newToken) => {
          if (newToken) {
            dispatch(setAuth({ token: newToken, isAuthenticated: true }))
            queryClient.invalidateQueries({ queryKey: ['cart'] })
            queryClient.invalidateQueries({ queryKey: ['orders'] })
            queryClient.invalidateQueries({ queryKey: ['wishlist'] })
            dispatch(fetchCurrentUserThunk())
          }
        })
        .catch(() => {})
        .finally(() => {
          dispatch(markAuthHydrated())
        })
    }

    return () => window.removeEventListener('rupakar:auth-expired', handleAuthExpired)
  }, [dispatch, queryClient])

  useEffect(() => {
    if (previousAuthState.current === null) {
      previousAuthState.current = isAuthenticated
      return
    }

    if (previousAuthState.current && !isAuthenticated) {
      queryClient.removeQueries({ queryKey: ['cart'] })
      queryClient.removeQueries({ queryKey: ['orders'] })
      queryClient.removeQueries({ queryKey: ['wishlist'] })
      queryClient.removeQueries({ queryKey: ['user'] })
      queryClient.removeQueries({ queryKey: ['addresses'] })
      queryClient.removeQueries({ queryKey: ['profile'] })
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
