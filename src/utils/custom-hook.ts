import { useState, useEffect, useRef, useMemo } from "react";
import { URLSearchParamsInit, useSearchParams } from "react-router-dom";
import { cleanObject } from "utils";

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
  /* 提供重新获取数据func, 利用 useState 惰性初始化保存函数 */
  const [retry, setRetry] = useState(() => () => {});
  /* 组件挂载状态 */
  const mountedRef = useMountedRef();

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

  /* runConfig.retry 传入 retry 时调用方法 */
  const run = (
    promise: Promise<D>,
    runConfig?: {
      retry: () => Promise<D>;
    }
  ) => {
    if (!promise || !promise.then) {
      throw new Error("请传入 Promise");
    }

    setRetry(() => () => {
      if (runConfig?.retry) {
        run(runConfig.retry(), runConfig);
      }
    });

    setState({ ...state, stat: "loading" });
    return promise
      .then((data) => {
        if (mountedRef.current) setData(data);
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
    retry,
    setData,
    setError,
    ...state,
  };
};

/** 修改页面标题
 * 加载时为旧title,
 * 加载后为新传入title
 * @param {boolean} keepOnUnmount: 卸载页面时, 是否丢弃当前title(立即刷新为新title)
 */
export const useDocumentTitle = (
  title: string,
  keepOnUnmount: boolean = true
) => {
  // 使用useRef, oldTitle就不会立即被刷新成新title
  const oldTitle = useRef(document.title).current;

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    return () => {
      if (!keepOnUnmount) document.title = oldTitle;
    };
  }, [oldTitle, keepOnUnmount]);
};

/**
 * 读取url query
 * URLSearchParams API: https://developer.mozilla.org/zh-CN/docs/Web/API/URLSearchParams
 */
export const useUrlQueryParam = <K extends string>(keys: K[]) => {
  const [searchParams, setSearchParams] = useSearchParams();

  return [
    useMemo(
      () =>
        keys.reduce(
          (pre, key: K) => ({ ...pre, [key]: searchParams.get(key) || "" }),
          {} as { [key in K]: string }
        ),
      [searchParams]
    ),
    (params: Partial<{ [key in K]: unknown }>) => {
      const obj = cleanObject({
        ...Object.fromEntries(searchParams),
        ...params,
      }) as URLSearchParamsInit;
      return setSearchParams(obj);
    },
    // setSearchParams
  ] as const;
};

/**
 * 组件挂载状态
 */
export const useMountedRef = () => {
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  });

  return mountedRef;
};
