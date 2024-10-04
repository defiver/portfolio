import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Popconfirm, Button, Flex } from "antd";
import { Chart as CJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useLoading } from "@/hooks/useLoading";
import { useRecoilState } from "recoil";
import { formAddressState } from "../store";

CJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

// компонент для отрисовки графика изменения цены в пуле
export default function PoolsList({ db, pool }) {
	const [, setFormAddress] = useRecoilState(formAddressState);

	const [deletePool, isDeletePollLoading] = useLoading(async () => {
		await db.pools.delete(pool.address);
	}, false);

	const datapoints = pool.prices || [];
	const data = {
		labels: datapoints.map(i => i.toString()),
		datasets: [{
			label: "Цена",
			data: datapoints,
			borderWidth: 1,
			borderColor: "#d4d4d4",
			radius: 0,
		}]
	};

	// отрисовка горизонтальных линий диапазона
	pool?.range && pool.range[0] > 0 && data.datasets.push({
		label: "Нижняя граница",
		data: new Array(datapoints.length).fill(pool.range[0]),
		fill: false,
		radius: 0,
		borderColor: "green",
		borderWidth: 0.75,
		borderDash: [2, 2],
	});

	// отрисовка горизонтальных линий диапазона
	pool?.range && pool.range[1] > 0 && pool.range[1] < 10 ** 9 && data.datasets.push({
		label: "Верхняя граница",
		data: new Array(datapoints.length).fill(pool.range[1]),
		fill: false,
		radius: 0,
		borderColor: "green",
		borderWidth: 0.75,
		borderDash: [2, 2],
	});

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: { display: false },
			tooltip: {
				callbacks: {
					title: () => null,
					label: (context) => `${context.dataset.label}: ${context.dataset.data[context.dataIndex]}`,
				},
				displayColors: false,
			},
		},
		interaction: { intersect: false, },
		scales: { x: { display: false }, y: { display: false } },
	};

	return (
		<Flex gap={8} vertical>
			<div className="price-chart">
				<Line options={options} data={data} />
			</div>

			<Flex justify={"end"} gap={8}>
				<Popconfirm title="Удалить пул?" onConfirm={deletePool} okText="Да" cancelText="Нет">
					<Button loading={isDeletePollLoading} icon={<DeleteOutlined />} className="warning" />
				</Popconfirm>

				<Button icon={<EditOutlined />} onClick={() => setFormAddress(pool.address)} title="Изменить диапазон" />
			</Flex>
		</Flex>
	)
}