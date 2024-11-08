import { fetchingGet } from "@/utils/fetching";
import { formatPercent } from "@/utils/number";

export const fetchGas = async () => {
	const data = await fetchingGet("https://eth.blockscout.com/api/v2/stats", {}, false);
	return data?.gas_prices?.average || 0;
};

export const fetchFear = async () => {
	const data = await fetchingGet("https://api.cryptorank.io/v0/widgets/fear-and-greed-index");
	return {
		today: data?.today || 0,
		change: data?.yesterday ? formatPercent(data?.today, data?.yesterday) : 0,
	}
};

export const fetchGlobal = async () => {
	const data = await fetchingGet("https://api.cryptorank.io/v0/global");

	return {
		cap: data?.totalMarketCap || 0,
		btcd: data?.btcDominance || 0,
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