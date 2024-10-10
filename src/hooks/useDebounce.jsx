import { useCallback, useRef } from "react";

// хук для задержки выполнения callback при быстром обновлении
export const useDebounce = (callback, delay = 300) => {
	const timer = useRef();

	const debouncedCallback = useCallback((...args) => {
		if (timer.current) {
			clearTimeout(timer.current)
		}
		timer.current = setTimeout(() => {
			callback(...args)
		}, delay)
	}, [callback, delay])

	return debouncedCallback;
}