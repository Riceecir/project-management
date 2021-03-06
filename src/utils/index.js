export const isFalsy = (val) => val === 0 ? false : !val

/* 清除无效值 */
export const cleanObject = (obj) => {
  const result = {...obj}
  Object.keys(result).forEach(key => {
    if (isFalsy(result[key])) {
      delete result[key]
    }
  })

  return result
}

/* 函数防抖 */
const debounce = (func, delay = 300) => {
  let timeout;

  return (...param) => {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(function() {
      typeof func === 'function' && func(...param)
    }, delay)
  }
}