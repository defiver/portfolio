import { List, Row, Col, Typography, Flex } from "antd";
import { localeNumber } from '@/utils/number';
import { fetchingGet } from "@/utils/fetching";
import { useLoading } from "@/hooks/useLoading";
import { useRecoilValue } from "recoil";
import { filteredPoolsState } from "./store";
import Filter from './Filter';

const { Text } = Typography;
const LINK = "https://yields.llama.fi/pools";

export default function PoolsList({ db }) {
	const filteredPools = useRecoilValue(filteredPoolsState);

	// получаем новые пулы, удаляем все старые, записываем новые по нужным полям
	const [fetchPools, isPoolsLoading] = useLoading(async () => {
		const response = await fetchingGet(LINK);
		if (response?.status === "success") {
			let newpools = response.data.map(o => new Object({
				pool: o.pool,
				name: o.symbol,
				project: o.project,
				chain: o.chain,
				tvl: o.tvlUsd,
				apy: o.apy,
				stable: o.stablecoin,
				il: o.ilRisk,
				apy30d: o.apyMean30d,
				exposure: o.exposure,
				outlier: o.outlier,
			}));
			await db.transaction('rw', db.llama, async function () {
				await db.llama.clear();
				await db.llama.bulkPut(newpools);
			});
		}
	}, false);

	return (
		<List
			bordered
			loading={isPoolsLoading}
			className="llama-list"
			size="small"
			dataSource={filteredPools}
			pagination={{ defaultPageSize: 20, hideOnSinglePage: 1, showLessItems: 1 }}
			header={<Filter fetchPools={fetchPools} isPoolsLoading={isPoolsLoading} />}
			renderItem={(pool) => (
				<List.Item style={{ display: "block" }}>
					<Row justify={"space-between"}>
						<Col span={8}>
							<Flex gap={8} align="center">
								<img
									title={pool.chain}
									src={`https://icons.llamao.fi/icons/chains/rsz_${pool.chain.toLowerCase()}?w=48&h=48`}
								/>
								<Text ellipsis>
									<a href={`https://defillama.com/yields/pool/${pool.pool}`}>{pool.name}</a>
								</Text>
							</Flex>
						</Col>

						<Col span={6}>
							<Flex gap={8} align="center">
								<img
									title={pool.project}
									src={`https://icons.llamao.fi/icons/protocols/${pool.project.toLowerCase()}?w=48&h=48`}
								/>
								<Text ellipsis className="cap">{pool.project.split("-")[0]}</Text>
							</Flex>
						</Col>

						<Col span={2} title="TVL">
							${localeNumber(pool.tvl / 1_000_000)}<span className="underline">m</span>
						</Col>

						<Col span={4} className="right" title="Current APY">
							{localeNumber(pool.apy, 2)}<span className="underline">%</span>
						</Col>

						<Col span={4} className="right" title="30 day APY">
							{localeNumber(pool.apy30d, 2)}<span className="underline">%</span>
						</Col>
					</Row>
				</List.Item>
			)}
		/>
	)
}
