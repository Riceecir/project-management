import { useState, useEffect } from 'react'

/* 挂载 */
export const useMount = (cb: () => void) => {
  useEffect(() => {
    cb()
  }, [])
}

/*  */
export const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timeout)
  }, [value, delay])

  return debouncedValue
}