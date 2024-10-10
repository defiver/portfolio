import { useCallback, useEffect, useState } from "react";

// хук, реализующий бесконечную прокрутку для длинных списков
export const usePagination = (allData, perpage) => {
	const [page, setPage] = useState(0);
	const [isMore, setIsMore] = useState(false);
	const [displayData, setDisplayData] = useState([]);

	const makeData = useCallback(() => {
		let newData = allData.slice(0, page * perpage + perpage);
		setIsMore(allData.length - newData.length > 0)
		setDisplayData(newData);
	}, [page, allData, perpage]);

	const next = () => {
		setPage(page + 1)
		makeData()
	}

	const start = () => {
		setPage(0)
		makeData()
	}

	useEffect(() => {
		makeData()
	}, [page, makeData, allData, perpage])

	return { displayData, next, start, isMore }
}