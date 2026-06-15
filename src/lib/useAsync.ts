import { useEffect, useState } from 'react'

interface State<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

/** Minimal async data hook. `deps` re-runs the loader (e.g. on route change). */
export function useAsync<T>(loader: () => Promise<T>, deps: unknown[] = []): State<T> {
  const [state, setState] = useState<State<T>>({ data: null, loading: true, error: null })

  useEffect(() => {
    let alive = true
    setState({ data: null, loading: true, error: null })
    loader()
      .then((data) => alive && setState({ data, loading: false, error: null }))
      .catch((error) => alive && setState({ data: null, loading: false, error }))
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}
