import { fetchingPost } from "@/utils/fetching";

const fetchGraphql = (data) => {
	const headers = {
		"Accept": "*/*",
		"content-type": "application/json",
		"authorization": "GUEST",
		"session-uuid": crypto.randomUUID()
	}

	return fetchingPost("https://api.parsec.finance/graphql", data, headers);
};

// загрузка последних событий контракта
export const fetchEvents = async (address, chain, limit = 25) => {
	const data = { "operationName": "ContractLogs", "variables": { "address": address, "log": "Swap", "chain": chain, "filters": [], "limit": limit, "offset": 0 }, "query": "query ContractLogs($address: String!, $log: String!, $chain: String, $filters: [LogFilter], $limit: Int, $offset: Int) {\n  contract(address: $address, chain: $chain) {\n    chain\n    address\n    name\n    logs(log: $log, limit: $limit, offset: $offset, filters: $filters) {\n      contract\n      address\n      timestamp\n      index\n      data\n      topic\n      blockHash\n      txId\n      __typename\n    }\n    __typename\n  }\n}" }

	const events = await fetchGraphql(data);

	const logs = events?.data?.contract?.logs;

	return (logs instanceof Array) ? logs : [];
};

// получение адресов токенов в пуле по адресу контракта в конкретной сети
// нужно для последующего парсинга разрядности
export const fetchTokens = async (address, chain) => {
	const data = { "operationName": "AssetBalances", "variables": { "addresses": [address], "chains": [chain] }, "query": "query AssetBalances($addresses: [String!]!, $mode: String, $chains: [String!]) {\n  assetBalances(addresses: $addresses, mode: $mode, chains: $chains) {\n    address\n    addressLabel {\n      address\n      label\n      tags\n      src\n      chains\n      __typename\n    }\n    balances {\n      tokenLogoUrl\n      protocolLogoUrl\n      symbol\n      usdValue\n      usdPrice\n      usdPriceDelta1d\n      totalBalance\n      positionIndex\n      balanceSheet {\n        tokenLogoUrl\n        protocolLogoUrl\n        address\n        chain\n        type\n        subtype\n        type\n        name\n        balance\n        protocol\n        usdPrice\n        symbol\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}" }

	const balances = await fetchGraphql(data);

	const tokens = balances?.data?.assetBalances[0].balances;
	return (tokens instanceof Array) ? tokens.map(a => a.balanceSheet[0].address) : [];
};

// парсинг разрядности токена (максимальное количество знаков после запятой)
export const fetchDecimals = async (address, chain) => {
	const data = { "operationName": "TokenDeltas", "variables": { "address": address, "chain": chain }, "query": "query TokenDeltas($address: String, $symbol: String, $chain: String!) {\n  token(symbol: $symbol, address: $address, chain: $chain) {\n    address\n    usdPrice\n    decimals\n    __typename\n  }\n}" }

	const decimals = await fetchGraphql(data);
	return decimals?.data?.token?.decimals;
};