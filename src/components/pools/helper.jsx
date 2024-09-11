import { useRecoilState } from "recoil";
import { fetchTokens, fetchDecimals, fetchEvents } from "./ferching";
import { loadingPoolState } from "./store";
import { useLoading } from "@/hooks/useLoading";

export const getDecimals = async (address, chain) => {
	const tokens = await fetchTokens(address, chain);

	const d1 = tokens[0] ? await fetchDecimals(tokens[0], chain) : 0;
	const d2 = tokens[1] ? await fetchDecimals(tokens[1], chain) : 0;

	return (10 ** parseInt(d1)) / (10 ** parseInt(d2));
};

export const usePrices = (pools, db) => {
	const [, setLoadingPool] = useRecoilState(loadingPoolState);

	return useLoading(async () => {
		for (const pool of pools) {
			setLoadingPool(pool.address);
			const events = await fetchEvents(pool.address, pool.chain);

			const prices = events.map(arr => {
				const contract = JSON.parse(arr["data"]);
				const price = contract ? (1 / pool.decimals) * Number(contract.sqrtPriceX96) ** 2 / 2 ** 192 : 0;

				return price < 10 ** -9 || price > 10 ** 9 ? price * pool.decimals * 2 : price;
			});

			await db.pools.update(pool.address, {
				previous: pool.price,
				price: prices.length ? prices[0] : 0,
				prices: prices.reverse()
			});

			setLoadingPool(undefined);
		}
	}, false);
};
