import { Flex, Row, Col, Card } from "antd";
import { localeNumber } from "@/utils/number";
import { stringToColour } from "@/utils/colour";
import { Chart as CJS, CategoryScale, LinearScale, PointElement, BarElement, ArcElement, Tooltip } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import dayjs from "dayjs";

CJS.register(CategoryScale, LinearScale, PointElement, Tooltip, BarElement, ArcElement);

export default function Charts({ transactions, tokens }) {
	const value = transactions.reduce((a, b) => a + b.amount * (tokens[b.token]?.price || 0), 0); // текущая стоимость

	const bar = {}
	const pie = {}
	for (const o of transactions) {
		let date = dayjs(o.date).format("YYYY.MM.DD");
		bar[date] = (bar[date] || 0) + o.price * o.amount;
		pie[o.token] = (pie[o.token] || 0) + o.amount * (tokens[o.token]?.price || 0);
	}
	const dates = Object.keys(bar).sort((a, b) => new Date(a) - new Date(b));

	const barData = {
		labels: dates,
		datasets: [{
			label: "Cash flow",
			data: dates.map(i => bar[i]),
			backgroundColor: "#d4d4d4",
			yAxisID: 'y',
			type: 'bar'
		}],
	};

	const pieData = {
		labels: Object.keys(pie),
		datasets: [{
			data: Object.keys(pie).map(i => 100 * pie[i] / value),
			backgroundColor: Object.keys(pie).map(token => stringToColour(token, 3)),
			borderWidth: 1,
		}],
	};

	const barOptions = {
		spanGaps: true,
		normalized: true,
		animation: false,
		responsive: true,
		maintainAspectRatio: false,
		interaction: { intersect: false, },
		plugins: {
			tooltip: {
				displayColors: false,
				callbacks: {
					label: (c) => c.dataset.label + " ($): " + localeNumber(c.dataset.data[c.dataIndex], 0)
				},
			}
		},
		scales: {
			x: { display: false, grid: { display: false } },
			y: { type: 'linear', display: true, position: 'left', grid: { display: false } },
		},
	};

	const pieOptions = {
		responsive: true,
		spanGaps: true,
		maintainAspectRatio: false,
		normalized: true,
		animation: false,
		plugins: {
			tooltip: {
				displayColors: false,
				callbacks: {
					title: () => null,
					label: (c) => `${c.label}: ${localeNumber(c.dataset.data[c.dataIndex])}%`,
				},
			}
		}

	};

	return (
		<Flex vertical gap={16}>
			<Row gutter={[8, 8]}>
				<Col span={16}>
					<Card size="small"><Bar style={{ height: 200 }} options={barOptions} data={barData} /></Card>
				</Col>
				<Col span={8}>
					<Card size="small"><Pie style={{ height: 200 }} options={pieOptions} data={pieData} /></Card>
				</Col>
			</Row>
		</Flex>
	)
}
