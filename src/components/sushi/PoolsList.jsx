import { ReloadOutlined } from "@ant-design/icons";
import { Button, List, Typography, Input, Flex, Select, Row, Col } from "antd";
import { useFilterList } from './hooks/useFilterList';
import { usePools } from './hooks/usePools';
import { localeNumber } from '@/utils/number';
import { useState, useDeferredValue } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import chains from './chains.json';

const { Text } = Typography;

export default function PoolsList({ db }) {
	const pools = useLiveQuery(() => db.sushi.toArray(), [], []);
	const [inputQuery, setInputQuery] = useState("");
	const [chainId, setChainId] = useState(42161);
	const [param, setParam] = useState("apr1w");

	const [fetchPools, isFetchPoolsLoading] = usePools(chainId, db);

	const params = [
		{ value: "tvl", label: "TVL" },
		{ value: "apr1d", label: "Day APR" },
		{ value: "apr1w", label: "Week APR" },
		{ value: "apr1m", label: "Month APR" },
	];

	const deferredQuery = useDeferredValue(inputQuery);
	const filterPools = useFilterList(pools, chainId, deferredQuery, param);

	return (
		<List
			bordered
			className="sushi-list"
			size="small"
			dataSource={filterPools}
			pagination={{ defaultPageSize: 20, hideOnSinglePage: 1, showLessItems: 1 }}
			header={
				<Flex gap={8} justify={"space-between"}>
					<Input
						allowClear
						onChange={e => setInputQuery(e.target.value)}
						placeholder="Search..."
					/>

					<Select
						disabled={isFetchPoolsLoading}
						value={chainId}
						onChange={setChainId}
						style={{ minWidth: 140 }}
						options={chains.map(o => { return { value: o.chainId, label: o.name } })}
					/>

					<Select
						value={param}
						onChange={setParam}
						style={{ minWidth: 110 }}
						options={params}
					/>

					<Button
						style={{ minWidth: 32 }}
						icon={<ReloadOutlined />}
						onClick={fetchPools}
						loading={isFetchPoolsLoading}
					/>
				</Flex>
			}
			renderItem={(pool) => (
				<List.Item style={{ display: "block" }}>
					<Row justify={"space-between"}>
						<Col span={10}>
							<Text ellipsis><a href={pool.link}>{pool.name}</a></Text>
						</Col>
						<Col span={5}>
							<Text code ellipsis className={param === "tvl" ? "border" : ""}>
								${localeNumber(pool.params.tvl)}
							</Text>
						</Col>
						<Col span={3} style={{ textAlign: "end" }}>
							<Text code ellipsis className={param === "apr1d" ? "border" : ""}>
								{pool.params.apr1d}%
							</Text>
						</Col>
						<Col span={3} style={{ textAlign: "end" }}>
							<Text code ellipsis className={param === "apr1w" ? "border" : ""}>
								{pool.params.apr1w}%
							</Text>
						</Col>
						<Col span={3} style={{ textAlign: "end" }}>
							<Text code ellipsis className={param === "apr1m" ? "border" : ""}>
								{pool.params.apr1m}%
							</Text>
						</Col>
					</Row>
				</ List.Item>
			)}
		/>
	)
}
