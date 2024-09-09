import { Row, Col, Flex, Typography } from "antd";
import { localeNumber } from "@/utils/number";

const { Text } = Typography;

export default function Children({ position }) {
	const token0 = position.tokens[position.token0].symbol;
	const token1 = position.tokens[position.token1].symbol;

	return (
		<Row gutter={[16, 16]} justify={"space-between"}>
			<Col span={12}>
				<Flex vertical>
					<Text code>Min price: {localeNumber(position.price_lower, 8)}</Text>
					<Text code>Max price: {localeNumber(position.price_upper, 8)}</Text>
					<Text code className="warning">Cur price: {localeNumber(position.pool_price, 8)}</Text>
				</Flex>
			</Col>
			<Col span={12}>
				<Flex vertical>
					<Text code>Fees: {localeNumber(position.uncollected_fees0)} {token0}</Text>
					<Text code>Fees: {localeNumber(position.uncollected_fees1)} {token1}</Text>
					<Text code>Age: {localeNumber(position.age, 1)} days</Text>
				</Flex>
			</Col>
		</Row >
	)
}
