import { Statistic, Flex, Popover, Card } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { localeNumber } from "@/utils/number";

const description = {
	"AVG": "Доходность, расчитанная по методу средневзвешенной цены.",
	"MWR": "Доходность, взвешенная по деньгам. Вычислена модифицированным методом Дитца.",
	"ROE": "Рентабельность капитала - отношение текущей стоимости активов ко вложенному капиталу.",
	"APY": "Среднегодовая доходность, вычисленная функцией XIRR.",
}

export default function CustomStatistic(props) {
	let desc = "";
	if (props.title in description) {
		desc = description[props.title];
		desc = <Popover placement="leftTop" content={desc}><InfoCircleOutlined style={{ fontSize: 12 }} /></Popover>;
	}

	const color = (!props.painted || props.value === 0) ? "inherit" : props.value > 0 ? "#3f8600" : "#e45431";

	return (
		<Card size="small">
			<Statistic
				{...props}
				value={localeNumber(props.value)}
				valueStyle={{ fontSize: 20, color: color }}
				title={<Flex justify="space-between">{props.title}{desc}</Flex>}
			/>
		</Card>
	);
}
