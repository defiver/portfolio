import { fetchingPost } from "@/utils/fetching";

export const fetchGraphql = (address, chain) => {
	const data = { "operationName": "ContractLogs", "variables": { "address": address, "log": "Swap", "chain": chain, "filters": [], "limit": 50, "offset": 0 }, "query": "query ContractLogs($address: String!, $log: String!, $chain: String, $filters: [LogFilter], $limit: Int, $offset: Int) {\n  contract(address: $address, chain: $chain) {\n    chain\n    address\n    name\n    logs(log: $log, limit: $limit, offset: $offset, filters: $filters) {\n      contract\n      address\n      timestamp\n      index\n      data\n      topic\n      blockHash\n      txId\n      __typename\n    }\n    __typename\n  }\n}" }

	const headers = {
		"Accept": "*/*",
		"Referer": "https://app.parsec.finance/",
		"Origin": "https://app.parsec.finance/",
		"content-type": "application/json",
		"authorization": "GUEST",
		"session-uuid": crypto.randomUUID(),
		"Sec-Fetch-Mode": "cors"
	}

	return fetchingPost("https://api.parsec.finance/graphql", data, headers);
};