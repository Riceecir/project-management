export const isFalsy = (val: unknown) => (val === 0 ? false : !val);

export const isVoid = (val: any) => [undefined, null, ""].includes(val);

/* 清除无效值 */
export const cleanObject = (obj: { [key: string]: unknown }) => {
  const result = { ...obj };
  Object.keys(result).forEach((key) => {
    if (isVoid(result[key])) {
      delete result[key];
    }
  });

  return result;
};

/* 函数防抖 */
const debounce = (func: () => void, delay = 300) => {
  let timeout: any;

  return (...param: any) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(function () {
      // @ts-ignore
      typeof func === "function" && func(...param);
    }, delay);
  };
};
