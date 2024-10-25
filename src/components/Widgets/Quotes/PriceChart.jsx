import { localeNumber } from "@/utils/number";
import { Flex, Skeleton, Segmented } from "antd";
import { Chart as CJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useLoading } from "@/hooks/useLoading";
import { fetchingGet } from "@/utils/fetching";
import { useState, useEffect } from "react";
import dayjs from "dayjs";

CJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);
const LINK = "https://http-api.livecoinwatch.com/coins/history/range";

// компонент для отрисовки графика цены
export default function PriceChart({ db, pair }) {
	const [quotes, setQuotes] = useState([]);
	const [period, setPeriod] = useState(pair.period);

	const [loadQuotes, isLoadQuotes] = useLoading(async () => {
		let end = Date.now();
		let start = period > 0 ? end - period * 1000 : 0;
		let data = await fetchingGet(`${LINK}?coin=${pair.coin}&start=${start}&end=${end}&currency=${pair.currency}`);
		if (data.success && data.data.length > 0) {
			setQuotes(data.data.map(o => { return [o.date, o.rate] }));
			if (period === pair.period) {
				let price = data.data.at(-1)["rate"];
				await db.pairs.put({ ...pair, price, previous: pair.price });
			} else {
				await db.pairs.put({ ...pair, period });
			}

		}
	}, false);

	useEffect(() => {
		loadQuotes();
	}, [period]); // eslint-disable-line react-hooks/exhaustive-deps

	const data = {
		labels: quotes.map(a => dayjs(a[0]).format("DD.MM.YYYY HH:mm")),
		datasets: [{
			label: "Цена",
			data: quotes.map(a => a[1]),
			borderWidth: 1,
			borderColor: "#d4d4d4",
			radius: 0,
		}]
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			tooltip: {
				displayColors: false, callbacks: {
					label: (context) => localeNumber(context.dataset.data[context.dataIndex], 5)
				},
			}
		},
		interaction: { intersect: false, },
		scales: { x: { display: false } },
	};

	return (
		<Flex gap={8} vertical>
			<div className="price-chart">
				{isLoadQuotes
					? <Skeleton loading active paragraph={{ rows: 4 }} title={false} />
					: <Line options={options} data={data} />
				}
			</div>

			<Segmented
				block
				value={period}
				onChange={setPeriod}
				options={[
					{ value: 86400, label: "1Д" },
					{ value: 604800, label: "7Д" },
					{ value: 2592000, label: "30Д" },
					{ value: 7776000, label: "90Д" },
					{ value: 15552000, label: "180Д" },
					{ value: 31536000, label: "Год" },
					{ value: 0, label: "Всё" },
				]}
			/>
		</Flex>
	)
}