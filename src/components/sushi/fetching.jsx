import { fetchingGet, fetchingPost } from "@/utils/fetching";

export const fetchGraphql = (chain, page = 1) => {
	const data = {
		"query": "query Pools($chainId: PoolChainId!, $page: Int, $search: [String], $orderBy: PoolsOrderBy, $orderDirection: OrderDirection, $protocols: [Protocol], $onlyIncentivized: Boolean, $onlySmartPools: Boolean) {\n\tpools(\n\t\tchainId: $chainId\n\t\tpage: $page\n\t\tsearch: $search\n\t\tprotocols: $protocols\n\t\tonlyIncentivized: $onlyIncentivized\n\t\tonlySmartPools: $onlySmartPools\n\t\torderBy: $orderBy\n\t\torderDirection: $orderDirection\n\t) {\n\t\tcount\n\t\tdata { name, address, liquidityUSD }\n\t}\n}", "variables": { "chainId": chain, "search": [], "onlyIncentivized": false, "onlySmartPools": false, "protocols": ["SUSHISWAP_V3", "SUSHISWAP_V2"], "orderDirection": "desc", "page": page }, "operationName": "Pools"
	}

	const headers = {
		"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:129.0) Gecko/20100101 Firefox/129.0",
		"Accept": "application/graphql-response+json, application/json",
		"Accept-Language": "ru-RU,ru;q=0.8,en-US;q=0.5,en;q=0.3",
		"content-type": "application/json",
		"Priority": "u=0",
	}

	// CORS!
	return fetchingPost("https://data.sushi.com/graphql", data, headers);
};

export const fetchPool = (address, chain) => {
	return fetchingGet(`https://web-7iu927aib.sushi.com/pool/api/pools/${chain}/${address}`);
};