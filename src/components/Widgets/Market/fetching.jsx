import { fetchingGet } from "@/utils/fetching";
import { formatPercent } from "@/utils/number";

export const fetchGas = async () => {
	const data = await fetchingGet("https://eth.blockscout.com/api/v2/stats", {}, false);
	return data?.gas_prices?.average || 0;
};

export const fetchFear = async () => {
	const data = await fetchingGet("https://api.coin-stats.com/v2/fear-greed");
	return {
		today: data?.now?.value || 0,
		change: data?.yesterday?.value ? formatPercent(data?.now?.value, data?.yesterday?.value) : 0,
	}
};

export const fetchGlobal = async () => {
	const data = await fetchingGet("https://api.coin-stats.com/v2/markets/global");

	return {
		cap: data?.globalData?.marketCap || 0,
		btcd: data?.globalData?.btcDominance || 0,
	};
};

export const fetchCoins = async () => {
	const data = await fetchingGet("https://api.cryptorank.io/v0/coins/v2?limit=10");

	return (data?.data instanceof Array ? data.data : []).map(o => {
		return {
			name: o.name,
			cap: o.marketCap,
			price: o.price.USD,
			image: o.image,
		}
	});
};