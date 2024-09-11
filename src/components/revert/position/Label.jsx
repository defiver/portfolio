import { Row, Col, Flex } from "antd";
import { localeNumber } from "@/utils/number";
import chainIcons from '../chainIcons.json';

export default function Label({ position }) {
	const pair = position.tokens[position.token0].symbol + "/" + position.tokens[position.token1].symbol;
	const fees = localeNumber(parseFloat(position.fees_value), 1);
	const apr = localeNumber(position.performance.hodl.pool_apr, 2);
	const value = localeNumber(position.deposits_value);
	const owner = `0x${position.real_owner.slice(2, 6)}...${position.real_owner.slice(-4)}`;
	const pnl24 = localeNumber(position?.deltas_24h?.pnl || 0, 1);
	const apr24 = position?.deltas_24h?.apr || 0;

	const chainIcon = chainIcons[position.network] || chainIcons["unknown"];
	const isRange = position.in_range;

	return (
		<Row gutter={[16, 16]} justify={"space-between"} align={"middle"}>
			<Col span={12} style={{ alignContent: "center" }}>
				<Flex gap={8} align="center">
					<img src={chainIcon} />
					<Flex vertical>
						<span className={isRange ? "" : "warning"}>{pair}</span>
						<span className="underline">{owner}</span>
					</Flex>
				</Flex>
			</Col>

			<Col span={5}>
				<Flex vertical>
					<span>${value}</span>
					<span className="underline">${pnl24}</span>
				</Flex>
			</Col>

			<Col span={3}>
				<Flex vertical>
					<span>{apr}%</span>
					<span className={parseFloat(apr24) < 0 ? "underline warning" : "underline"}>
						{localeNumber(apr24, 1)}%
					</span>
				</Flex>
			</Col>

			<Col span={4} style={{ textAlign: "right" }}>${fees}</Col>
		</Row >
	)
}
