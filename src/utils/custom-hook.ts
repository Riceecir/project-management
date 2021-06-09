import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useReducer,
} from "react";
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
const useSafeDispatch = <T>(dispatch: (...args: T[]) => void) => {
  const mountedRef = useMountedRef();
  return useCallback(
    (...args: T[]) => (mountedRef.current ? dispatch(...args) : void 0),
    [dispatch, mountedRef]
  );
};

/* 异步请求 hook */
export const useAsync = <D>(
  initialState?: State<D>,
  initialConfig?: typeof defaultInitialConfig
) => {
  const config = { ...defaultInitialConfig, ...initialConfig };
  const [state, dispatch] = useReducer(
    (state: State<D>, action: Partial<State<D>>) => ({ ...state, ...action }),
    {
      ...defaultInitialState,
      ...initialState,
    }
  );

  const safeDispatch = useSafeDispatch(dispatch);
  /* 提供重新获取数据func, 利用 useState 惰性初始化保存函数 */
  const [retry, setRetry] = useState(() => () => {});

  const setData = useCallback(
    (data: D) =>
      safeDispatch({
        data,
        stat: "success",
        error: null,
      }),
    [safeDispatch]
  );

  const setError = useCallback(
    (error: Error) =>
      safeDispatch({
        data: null,
        stat: "error",
        error,
      }),
    [safeDispatch]
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

      safeDispatch({ stat: "loading" });
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
    },
    [config.throwOnError, setData, setError, safeDispatch]
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
  const [searchParams] = useSearchParams();
  const setSearchParams = useSetUrlQueryParam();
  const [stateKeys] = useState(keys);

  return [
    useMemo(() => {
      /**
       * keys: ["a"]
       * { a: "1", b: "2" } => [["a", "1"], ["b", "2"]] => filtered from keys... => [["a", "1"]] => { a: "1" }
       */
      const toArr = Object.entries(Object.fromEntries(searchParams));
      const filtered = toArr.filter(([key]) => stateKeys.includes(key as K));

      return Object.fromEntries(filtered);
    }, [searchParams, stateKeys]),

    (params: Partial<{ [key in K]: unknown }>) => setSearchParams(params),
  ] as const;
};

/** 设置 url query */
export const useSetUrlQueryParam = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  return (params: { [key in string]: unknown }) => {
    const obj = cleanObject({
      ...Object.fromEntries(searchParams),
      ...params,
    }) as URLSearchParamsInit;
    return setSearchParams(obj);
  };
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

type undoState<T> = {
  past: T[];
  present: T;
  future: T[];
};

const UNDO = "UNDO";
const REDO = "REDO";
const SET = "SET";
const RESET = "RESET";

type Action<T> = {
  newPresent?: T;
  type: typeof UNDO | typeof REDO | typeof SET | typeof RESET;
};

/* 使用 useReducer 改造 useUndo */
const undoReducer = <T>(state: undoState<T>, action: Action<T>) => {
  const { past, present, future } = state;
  const { newPresent } = action;

  switch (action.type) {
    case UNDO: {
      if (past.length === 0) return state;

      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [present, ...future],
      };
    }
    case REDO: {
      if (future.length === 0) return state;

      const next = future[0];
      const newFuture = future.slice(1);

      return {
        past: [...past, present],
        present: next,
        future: newFuture,
      };
    }
    case SET: {
      if (newPresent === present) return state;
      return {
        past: [...past, newPresent],
        present: newPresent,
        future: [],
      };
    }
    case RESET: {
      return {
        past: [],
        present: newPresent,
        future: [],
      };
    }
  }
};

/* use undo hook */
export const useUndo = <T>(initialPresent: T) => {
  /* const [past, setPast] = useState<T[]>([])
  const [present, setPresent] = useState<T>(initialPresent)
  const [future, setFuture] = useState<T[]>([]) */

  /* 互相关联的 state 可以合并成一个 state */
  /* const [state, setState] = useState({
    past: [] as T[],
    present: initialPresent as T,
    future: [] as T[],
  }); */

  /* 使用 useReducer */
  const [state, dispatch] = useReducer(undoReducer, {
    past: [],
    present: initialPresent,
    future: [],
  });

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  const undo = useCallback(() => dispatch({ type: UNDO }), []);

  const redo = useCallback(() => dispatch({ type: REDO }), []);

  const set = useCallback(
    (newPresent: T) => dispatch({ type: SET, newPresent }),
    []
  );

  const reset = useCallback(
    (newPresent: T) => dispatch({ type: RESET, newPresent }),
    []
  );

  return [state, { undo, redo, set, reset, canUndo, canRedo }];
};
