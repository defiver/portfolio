import { ReloadOutlined, BellOutlined, LinkOutlined, PoweroffOutlined } from "@ant-design/icons";
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

	const [setSleep] = useLoading(async () => {
		await db.pools.update(pool.address, { sleep: !pool.sleep });
	}, false);

	return (
		<Row
			gutter={[16, 16]}
			justify={"space-between"}
			align={"middle"}
			className={pool.sleep ? "blur" : ""}
		>
			<Col span={6}>
				<Tag color={pool?.inRange ? "default" : "error"}>{pool?.name}</Tag>
			</Col>

			<Col span={6}>
				<span title="Цена">{localeNumber(pool.price, 6)}</span>
			</Col>

			<Col span={6} style={{ fontSize: 12, alignSelf: "center" }}>
				<span title="Изменение цены">{formatPercent(pool.price, pool.previous, 3)}</span>
			</Col>

			<Col span={6}>
				<Space style={{ float: "right" }} size={12}>
					<a
						href={`https://dexscreener.com/search?q=${pool.address}`}
						title="Искать пул на Dex Screener"
						onClick={e => e.stopPropagation()}
					>
						<LinkOutlined />
					</a>

					<PoweroffOutlined
						className={pool.sleep ? "" : "good"}
						onClick={(e) => {
							setSleep();
							e.stopPropagation();
						}}
						title="Включить/выключить"
					/>

					<BellOutlined
						style={{ fontSize: 15 }}
						className={pool.notify ? "good" : ""}
						onClick={(e) => {
							setNotify();
							e.stopPropagation();
						}}
						title="Установить сигнализацию"
					/>

					<Button
						disabled={pool.sleep}
						loading={loadingPool === pool.address}
						icon={<ReloadOutlined />}
						onClick={(e) => {
							updatePrice();
							e.stopPropagation();
						}}
						title="Обновить цену пула"
					/>
				</Space>
			</Col>
		</Row>
	)
}
