import { Flex, Row, Col } from "antd";
import { calcROE, calcAPY, calcMWR } from "../helper";
import CustomStatistic from "../components/CustomStatistic";

export default function Stats({ transactions, tokens }) {
	const purchase = transactions.reduce((a, b) => a + b.amount * b.price, 0); // сколько потрачено
	const value = transactions.reduce((a, b) => a + b.amount * (tokens[b.token]?.price || 0), 0); // текущая стоимость
	const income = value - purchase; // доход

	// доходности
	const MWR = calcMWR(transactions, tokens);
	const ROE = calcROE(transactions, tokens);
	const APY = calcAPY(transactions, tokens);

	return (
		<Flex vertical gap={16}>
			<Row gutter={[8, 8]}>
				<Col span={8}><CustomStatistic value={purchase < 0 ? 0 : purchase} title={"Вложено"} suffix={"$"} /></Col>
				<Col span={8}><CustomStatistic value={value} title={"Текущая стоимость"} suffix={"$"} /></Col>
				<Col span={8}><CustomStatistic value={income} title={"Доход"} suffix={"$"} painted /></Col>
				<Col span={8}><CustomStatistic value={MWR} title={"MWR"} suffix={"%"} painted /></Col>
				<Col span={8}><CustomStatistic value={ROE} title={"ROE"} suffix={"%"} painted /></Col>
				<Col span={8}><CustomStatistic value={APY} title={"APY"} suffix={"%"} painted /></Col>
			</Row>
		</Flex>
	)
}
