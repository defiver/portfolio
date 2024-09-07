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
		return query ? arr.filter(o => o.name.toLowerCase().includes(query)) : arr;
	}, [arr, query]);
}

export const useFilterList = (arr, fresh, query, sortKey = null) => {
	query = query.toLowerCase().trim().replace(/ +/, ' ');
	return useSortByKey(useFilterByQuery(useFilterByType(arr, fresh), query), sortKey);
}