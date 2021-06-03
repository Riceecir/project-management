import { useState, useEffect } from "react";

/* 挂载 */
export const useMount = (cb: () => void) => {
  useEffect(() => {
    cb();
  }, []);
};

/* 函数防抖 */
export const useDebounce = <V>(value: V, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
};

/*  */
export const useArray = <V>(initialArray: V[]) => {
  const [array, setArray] = useState(initialArray);

  return {
    value: array,
    setValue: setArray,
    add: (val: V): void => {
      setArray([...array, val]);
    },
    removeIndex: (index: number): void => {
      const newArr = [...array];
      newArr.splice(index, 1);
      setArray(newArr);
    },
    clear: (): void => {
      setArray([]);
    },
  };
};

interface State<D> {
  error: Error | null;
  data: D | null;
  stat: "idle" | "loading" | "error" | "success";
}
const defaultInitialState: State<null> = {
  stat: "idle",
  data: null,
  error: null,
};
/* @param }throwOnError：是否抛出错误 */
const defaultInitialConfig = {
  throwOnError: false,
};
/* 异步请求 hook */
export const useAsync = <D>(
  initialState?: State<D>,
  initialConfig?: typeof defaultInitialConfig
) => {
  const config = { ...defaultInitialConfig, ...initialConfig };
  const [state, setState] = useState({
    ...defaultInitialState,
    ...initialState,
  });

  const setData = (data: D) =>
    setState({
      data,
      stat: "success",
      error: null,
    });

  const setError = (error: Error) =>
    setState({
      data: null,
      stat: "error",
      error,
    });

  const run = (promise: Promise<D>) => {
    if (!promise || !promise.then) {
      throw new Error("请传入 Promise");
    }

    setState({ ...state, stat: "loading" });
    return promise
      .then((data) => {
        setData(data);
        return Promise.resolve(data);
      })
      .catch((error) => {
        setError(error);
        if (config.throwOnError) return Promise.reject(error);
        return error;
      });
  };

  return {
    isIdle: state.stat === "idle",
    isLoading: state.stat === "loading",
    isError: state.stat === "error",
    isSuccess: state.stat === "success",
    run,
    setData,
    setError,
    ...state,
  };
};
