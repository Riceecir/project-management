import { useState, useEffect, useRef, useMemo, useCallback } from "react";
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

  const setData = useCallback(
    (data: D) =>
      setState({
        data,
        stat: "success",
        error: null,
      }),
    []
  );

  const setError = useCallback(
    (error: Error) =>
      setState({
        data: null,
        stat: "error",
        error,
      }),
    []
  );

  /* runConfig.retry 传入 retry 时调用方法 */
  const run = useCallback(
    (
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

      setState((preState) => ({ ...preState, stat: "loading" }));
      // setState({ ...state, stat: "loading" });
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
    },
    [config.throwOnError, mountedRef, setData, setError]
  );

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

/* use undo hook */
export const useUndo = <T>(initialPresent: T) => {
  /* const [past, setPast] = useState<T[]>([])
  const [present, setPresent] = useState<T>(initialPresent)
  const [future, setFuture] = useState<T[]>([]) */

  /* 互相关联的 state 可以合并成一个 state */
  const [state, setState] = useState({
    past: [] as T[],
    present: initialPresent as T,
    future: [] as T[],
  });

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  const undo = useCallback(() => {
    setState((currentState) => {
      const { past, present, future } = currentState;
      if (past.length === 0) return currentState;

      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [present, ...future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState((currentState) => {
      const { past, present, future } = currentState;
      if (future.length === 0) return currentState;

      const next = future[0];
      const newFuture = future.slice(1);

      return {
        past: [...past, present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  const set = useCallback((newPresent: T) => {
    setState((currentState) => {
      const { past, present } = currentState;
      if (newPresent === present) return currentState;

      return {
        past: [...past, newPresent],
        present: newPresent,
        future: [],
      };
    });
  }, []);

  const reset = useCallback((newPresent: T) => {
    setState(() => ({
      past: [],
      present: newPresent,
      future: [],
    }));
  }, []);

  return [state, { undo, redo, set, reset, canUndo, canRedo }];
};
