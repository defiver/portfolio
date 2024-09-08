import { useMemo } from "react";

const useFilterByType = (arr, fresh) => {
	return useMemo(() => {
		return fresh ? arr.filter(o => o.fresh) : arr;
	}, [arr, fresh])
}

const useSortByKey = (arr, key) => {
	return useMemo(() => {
		return key ? arr.sort((a, b) => b[key] - a[key]) : arr;
	}, [arr, key])
}

const useFilterByQuery = (arr, query) => {
	return useMemo(() => {
		let clearquery = query.toLowerCase().trim().replace(/ +/, ' ');
		return clearquery ? arr.filter(o => o.name.toLowerCase().includes(clearquery)) : arr;
	}, [arr, query]);
}

export const useFilterList = (arr, fresh, query, sortKey = null) => {
	return useSortByKey(useFilterByQuery(useFilterByType(arr, fresh), query), sortKey);
}