import { DeleteOutlined, ReloadOutlined } from "@ant-design/icons";
import { Tag, Row, Col, Popconfirm, Button, Space } from "antd";
import { useDB } from "@/hooks/useDB";
import { localeNumber, formatPercent } from "@/utils/number";
import { useFetching } from "@/hooks/useFetching";
import { fetchGraphql } from "./ferching";

export default function PoolRow({ db, setPool, pool }) {
	const [fetchPrice, isFetchPriceLoading] = useFetching(async () => {
		const graphql = await fetchGraphql(pool.address, pool.chain);
		const contract = JSON.parse(graphql["data"]["contract"]["logs"][0]["data"]);
		const newprice = Number(contract.sqrtPriceX96) ** 2 / 2 ** 192;

		await db.pools.put({ ...pool, previous: pool.price, price: newprice });
	}, false);

	const [deletePool, isDeletePollLoading] = useDB(async () => {
		await db.pools.delete(pool.address)
	}, false);

	const inRange = pool.price > pool.range[0] & pool.price < pool.range[1];

	return (
		<Row gutter={[16, 16]} justify={"space-between"} align={"middle"}>
			<Col span={8}>
				<Tag
					color={inRange ? "default" : "error"}
					style={{ cursor: "pointer" }}
					onClick={() => setPool(pool)}
				>
					{pool.name}
				</Tag>
			</Col>
			<Col span={4} style={{ textAlign: "right" }}>
				<span>{localeNumber(pool.price, "", 6)}</span>
			</Col>

			<Col span={4} style={{ fontSize: 12, textAlign: "right", alignSelf: "center" }}>
				<span>{formatPercent(pool.price, pool.previous, 3)}</span>
			</Col>
			<Col span={6}>
				<Space style={{ float: "right" }} >
					<Popconfirm title="Delete the token?" onConfirm={deletePool} okText="Yes" cancelText="No">
						<Button loading={isDeletePollLoading} icon={<DeleteOutlined />} />
					</Popconfirm>

					<Button
						loading={isFetchPriceLoading}
						icon={<ReloadOutlined />}
						onClick={() => fetchPrice()}
					/>
				</Space>
			</Col>
		</Row>
	)
}
