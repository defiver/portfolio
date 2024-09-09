import { ReloadOutlined } from "@ant-design/icons";
import { Tag, Row, Col, Button, Space } from "antd";
import { localeNumber, formatPercent } from "@/utils/number";
import { useRecoilValue } from "recoil";
import { loadingPoolState } from "../store";
import { usePrices } from '../helper';

export default function PoolRow({ db, pool }) {
	const loadingPool = useRecoilValue(loadingPoolState);
	const [updatePrice] = usePrices([pool], db);
	const inRange = pool?.range && pool.price > pool.range[0] & pool.price < pool.range[1];

	return (
		<Row gutter={[16, 16]} justify={"space-between"} align={"middle"}>
			<Col span={8}>
				<Tag color={inRange ? "default" : "error"}>{pool?.name}</Tag>
			</Col>

			<Col span={8}>
				<span>{localeNumber(pool.price, 6)}</span>
			</Col>

			<Col span={6} style={{ fontSize: 12, alignSelf: "center" }}>
				<span>{formatPercent(pool.price, pool.previous, 3)}</span>
			</Col>

			<Col span={2}>
				<Space style={{ float: "right" }} >
					<Button
						loading={loadingPool === pool.address}
						icon={<ReloadOutlined />}
						onClick={(e) => {
							updatePrice();
							e.stopPropagation();
						}}
					/>
				</Space>
			</Col>
		</Row>
	)
}
