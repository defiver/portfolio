import { useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";

// вспомогательный хук для usePagination
export const useScroll = (observerRef, isMore, callback) => {
	const debouncedCallback = useDebounce(callback, 100);

	useEffect(() => {
		let observerRefValue = null;
		let options = {
			rootMargin: '100%',
		}

		const observer = new IntersectionObserver(([target]) => {
			(isMore !== false && target.isIntersecting) && debouncedCallback();
		}, options)

		if (observerRef.current) {
			observer.observe(observerRef.current);
			observerRefValue = observerRef.current;
		}

		return () => {
			observerRefValue && observer.unobserve(observerRefValue);
		}
	}, [observerRef, debouncedCallback, isMore])
}
