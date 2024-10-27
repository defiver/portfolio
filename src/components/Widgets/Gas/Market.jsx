import { List, Flex, Row, Col, Progress, Skeleton, Statistic, Card } from "antd";
import { useState, useEffect } from "react";
import { useLoading } from "@/hooks/useLoading";
import { localeNumber, bigNumber } from "@/utils/number";
import { fetchFear, fetchGlobal, fetchCoins } from "./fetching";
import "./style.css";

export default function Market() {
	const [fear, setFear] = useState({ today: 0, change: "0%" });
	const [global, setGlobal] = useState({ cap: 0, btcd: 0 });
	const [coins, setCoins] = useState([]);

	const [getData, isGetDataLoading] = useLoading(async () => {
		setFear(await fetchFear());
		setGlobal(await fetchGlobal());
		setCoins(await fetchCoins());
	}, false);

	useEffect(() => {
		getData()
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	if (isGetDataLoading) {
		return <Skeleton loading active paragraph={{ rows: 4 }} title={false} />
	}

	return (
		<>
			<Row gutter={[16, 16]}>
				<Col span={9}>
					<Card bordered={false}>
						<Statistic title="Капитализация рынка" value={bigNumber(global.cap)} prefix="$" />
					</Card>
				</Col>
				<Col span={6}>
					<Progress
						size={110}
						title="Индекс страха и жадности"
						type="dashboard"
						percent={fear.today}
						strokeColor={{ "0%": "#108ee9", "100%": "#87d068" }}
						format={value => <>
							{value}
							<p style={{ fontSize: 14, marginTop: 5 }}>{value > 50 ? "Жадность" : "Страх"}</p>
							<p title={"Изменение за сутки"} style={{ fontSize: 10, marginTop: 10 }}>{fear.change}</p>
						</>}
					/>
				</Col>
				<Col span={9}>
					<Card bordered={false}>
						<Statistic title="Доминация Bitcoin" value={global.btcd} precision={2} suffix="%" />
					</Card>
				</Col>
			</Row>

			<List
				style={{ marginTop: 16 }}
				bordered
				className="gas-list"
				size="small"
				dataSource={coins}
				header={false}
				renderItem={(coin) => (
					<List.Item style={{ display: "block" }}>
						<Row justify={"space-between"}>
							<Col span={10}>
								<Flex gap={8} align="center">
									<img src={coin.image} />
									{coin.name}
								</Flex>
							</Col>

							<Col span={7} title="Капитализация" style={{ textAlign: "center" }}>
								${bigNumber(coin.cap)}
							</Col>

							<Col span={7} title="Цена" style={{ textAlign: "right" }}>
								${localeNumber(coin.price)}
							</Col>
						</Row>
					</List.Item>
				)}
			/>
		</>
	);
}
