import { useCallback, useEffect, useRef, useState } from 'react';
import useCallbackRef from './useCallbackRef';

type UseControllableStateParams<T> = {
  prop?: T | undefined;
  defaultProp?: T | undefined;
  onChange?: (state: T) => void;
};

type SetStateFn<T> = (prevState?: T) => T;

function useUncontrolledState<T>({
  defaultProp,
  onChange,
}: Omit<UseControllableStateParams<T>, 'prop'>) {
  const uncontrolledState = useState<T | undefined>(defaultProp);
  const [value] = uncontrolledState;
  const prevValueRef = useRef(value);
  const handleChange = useCallbackRef(onChange);

  useEffect(() => {
    if (prevValueRef.current !== value) {
      handleChange(value as T);
      prevValueRef.current = value;
    }
  }, [value, prevValueRef, handleChange]);

  return uncontrolledState;
}

function useControllableState<T>({
  prop,
  defaultProp,
  onChange = () => {},
}: UseControllableStateParams<T>) {
  const [uncontrolledProp, setUncontrolledProp] = useUncontrolledState({ defaultProp, onChange });

  const isControlled = prop !== undefined;

  const value = isControlled ? prop : uncontrolledProp;
  const handleChange = useCallbackRef(onChange);

  const setValue: React.Dispatch<React.SetStateAction<T | undefined>> = useCallback(
    (nextValue) => {
      if (isControlled) {
        const setter = nextValue as SetStateFn<T>;
        const value = typeof nextValue === 'function' ? setter(prop) : nextValue;
        if (value !== prop) handleChange(value as T);
      } else {
        setUncontrolledProp(nextValue);
      }
    },
    [isControlled, prop, setUncontrolledProp, handleChange],
  );

  return [value, setValue] as const;
}

export default useControllableState;
