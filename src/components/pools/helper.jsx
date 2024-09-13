import { useRecoilState } from "recoil";
import { fetchTokens, fetchDecimals, fetchEvents } from "./fetching";
import { loadingPoolState } from "./store";
import { useLoading } from "@/hooks/useLoading";
import mp3 from './sonar.mp3';

const playSonar = async () => {
	const snd = new Audio(mp3);
	await snd.play();
}

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

			var prices = events.map(arr => {
				let contract = JSON.parse(arr["data"]);
				let price = contract ? (1 / pool.decimals) * Number(contract.sqrtPriceX96) ** 2 / 2 ** 192 : 0;

				return price < 10 ** -9 || price > 10 ** 9 ? price * pool.decimals * 2 : price;
			}).reverse();

			if (prices.length) {
				let price = prices.length ? prices.at(-1) : 0;
				let inRange = pool?.range && price > pool.range[0] & price < pool.range[1];

				!inRange && pool.notify && await playSonar();
				await db.pools.update(pool.address, { previous: pool.price, price, prices, inRange });
			}

			setLoadingPool(undefined);
		}
	}, false);
};
