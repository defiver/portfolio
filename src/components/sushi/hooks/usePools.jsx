import { fetchGraphql, fetchPool } from "../ferching";
import { useLoading } from "@/hooks/useLoading";
import chains from '../chains.json';

export const usePools = (chainId, db) => {
	return useLoading(async () => {
		const chain = chains.find(o => o.chainId === chainId).name.toLowerCase().replace(" ", "-");
		let pools = [];
		let page = 1;

		do {
			const response = await fetchGraphql(chainId, page++);
			var newpools = response?.data?.pools?.data || []
			pools.push(...newpools);
		} while (newpools.length === 100);

		for (const pool of pools) {
			const tvl = parseInt(pool.liquidityUSD) || 0;
			if (tvl < 1000) {
				continue;
			}

			const response = await fetchPool(pool.address, chainId);

			const params = {
				"tvl": tvl,
				"apr1d": parseInt(parseFloat(response?.totalApr1d) * 100) || 0,
				"apr1w": parseInt(parseFloat(response?.totalApr1w) * 100) || 0,
				"apr1m": parseInt(parseFloat(response?.totalApr1m) * 100) || 0,
			};
			const version = response.protocol === "SUSHISWAP_V2" ? "v2" : "v3";

			await db.sushi.put({
				address: pool.address,
				name: pool.name.replace(" / ", "/"),
				link: `https://www.sushi.com/${chain}/pool/${version}/${pool.address}`,
				chainId: chainId,
				params: params,
			});
		}
	}, false);
};
