import { useMemo } from "react";

const useFilterByChain = (arr, chainId) => {
	return useMemo(() => {
		return chainId ? arr.filter(o => o.chainId === chainId) : arr;
	}, [arr, chainId])
}

const useSortByParam = (arr, param) => {
	return useMemo(() => {
		return param ? arr.sort((a, b) => b.params[param] - a.params[param]) : arr;
	}, [arr, param])
}

const useFilterByQuery = (arr, query) => {
	return useMemo(() => {
		let clearquery = query.toLowerCase().trim().replace(/ +/, ' ');
		return clearquery ? arr.filter(o => o.name.toLowerCase().includes(clearquery)) : arr;
	}, [arr, query]);
}

export const useFilterList = (arr, chainId, query, param) => {
	return useSortByParam(useFilterByQuery(useFilterByChain(arr, chainId), query), param);
}