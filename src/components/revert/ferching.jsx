import { fetchingGet } from "@/utils/fetching";

export const fetchPositions = (address) => {
	const headers = {
		"Accept": "*/*",
		"Referer": "https://revert.finance",
		"Origin": "https://revert.finance",
		"Sec-Fetch-Mode": "cors",
		"Sec-Fetch-Dest": "empty",
		"Sec-Fetch-Site": "same-site",
	}

	return fetchingGet(`https://api.revert.finance/v1/positions/uniswapv3/account/${address}`, headers);
};