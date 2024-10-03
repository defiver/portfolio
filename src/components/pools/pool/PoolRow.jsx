import { ReloadOutlined, BellOutlined } from "@ant-design/icons";
import { Tag, Row, Col, Button, Space } from "antd";
import { localeNumber, formatPercent } from "@/utils/number";
import { useLoading } from "@/hooks/useLoading";
import { useRecoilValue } from "recoil";
import { loadingPoolState } from "../store";
import { usePrices } from '../helper';

export default function PoolRow({ db, pool }) {
	const loadingPool = useRecoilValue(loadingPoolState);
	const [updatePrice] = usePrices([pool], db);

	const [setNotify] = useLoading(async () => {
		await db.pools.update(pool.address, { notify: !pool.notify });
	}, false);

	return (
		<Row gutter={[16, 16]} justify={"space-between"} align={"middle"}>
			<Col span={8}>
				<Tag color={pool?.inRange ? "default" : "error"}>{pool?.name}</Tag>
			</Col>

			<Col span={8}>
				<span title="Price">{localeNumber(pool.price, 6)}</span>
			</Col>

			<Col span={6} style={{ fontSize: 12, alignSelf: "center" }}>
				<span title="Price change">{formatPercent(pool.price, pool.previous, 3)}</span>
			</Col>

			<Col span={2}>
				<Space style={{ float: "right" }} >
					<BellOutlined
						className={pool.notify ? "good" : ""}
						onClick={(e) => {
							setNotify();
							e.stopPropagation();
						}}
						title="Set signaling"
					/>
					<Button
						loading={loadingPool === pool.address}
						icon={<ReloadOutlined />}
						onClick={(e) => {
							updatePrice();
							e.stopPropagation();
						}}
						title="Update price"
					/>
				</Space>
			</Col>
		</Row>
	)
}
