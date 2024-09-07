import { useRecoilState } from "recoil";
import { loadingPoolState } from "./store";
import { fetchGraphql } from "./ferching";
import { useLoading } from "@/hooks/useLoading";

export const usePrices = (pools, db) => {
	const [, setLoadingPool] = useRecoilState(loadingPoolState);

	return useLoading(async () => {
		for (const pool of pools) {
			setLoadingPool(pool.address);

			const graphql = await fetchGraphql(pool.address, pool.chain);

			const logs = graphql["data"]["contract"]["logs"];
			const prices = !(logs instanceof Array) ? [] : logs.map(arr => {
				const contract = JSON.parse(arr["data"]);
				const price = contract ? Number(contract.sqrtPriceX96) ** 2 / 2 ** 192 : 0;
				// For example, 1 WETH actually represents 10 ** 18 WETH in the contract whereas USDC is 10 ** 6
				return (price < (1 / 10 ** 6)) ? (price * 10 ** 12) : price;
			})

			await db.pools.update(pool.address, {
				previous: pool.price,
				price: prices.length ? prices[0] : 0,
				prices: prices.reverse()
			});

			setLoadingPool(undefined);
		}
	}, false);
};
