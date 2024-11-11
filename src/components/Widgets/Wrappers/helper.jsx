import { useMemo } from "react";

const useFilterByType = (arr, type) => {
	return useMemo(() => {
		return type ? arr.filter(o => o.type === type) : arr;
	}, [arr, type])
}

const useFilterByQuery = (arr, query) => {
	return useMemo(() => {
		let clearquery = query.toLowerCase().trim().replace(/ +/, ' ');
		return clearquery ? arr.filter(o =>
			o.ticker.toLowerCase().includes(clearquery) || o.name.toLowerCase().includes(clearquery)
		) : arr;
	}, [arr, query]);
}

export const useFilterList = (arr, type, query) => {
	return useFilterByQuery(useFilterByType(arr, type), query);
}