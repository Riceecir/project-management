import { useState, useEffect } from 'react'

/* 挂载 */
export const useMount = (cb: () => void) => {
  useEffect(() => {
    cb()
  }, [])
}

/* 函数防抖 */
export const useDebounce = <V> (value: V, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timeout)
  }, [value, delay])

  return debouncedValue
}

/*  */
export const useArray = <V> (initialArray: V[]) => {
  const [array, setArray] = useState(initialArray)

  return {
    value: array,
    setValue: setArray,
    add: (val: V): void => {
      setArray([...array, val])
    },
    removeIndex: (index: number): void => {
      const newArr = [...array]
      newArr.splice(index, 1)
      setArray(newArr)
    },
    clear: (): void => {
      setArray([])
    }
  }
}