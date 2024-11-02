import { localeNumber } from "@/utils/number";
import { Chart as CJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import dayjs from "dayjs";
import minMax from "dayjs/plugin/minMax";

dayjs.extend(minMax);
CJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, BarElement);

// функция для создания диапазона дат по дням
const getRange = (beginDate, endDate) => {
	let ranges = [];
	while (beginDate.isBefore(endDate) || beginDate.isSame(endDate)) {
		ranges.push(beginDate.format("YYYY.MM.DD"));
		beginDate = beginDate.add(1, "day");
	}
	return ranges;
}

export default function Chart({ journal }) {
	var dates = journal
		.filter(o => o?.daterange && o.daterange[0] && dayjs(o.daterange[0].$d).isValid())
		.map(o => dayjs(o.daterange[0].$d));
	// если нет ни одной начальной даты, то выбираем жату публикации приложения
	var beginDate = dayjs.min(dates) || dayjs("2024-10-01T00:00:00.000Z");
	var endDate = dayjs().endOf("day"); // доход расчитываем только по сегодняшний день

	var range = getRange(beginDate, endDate);
	var incomes = range.reduce((acc, curr) => (acc[curr] = 0, acc), {});

	journal.forEach(o => {
		let bd = o?.daterange && o.daterange[0] && dayjs(o.daterange[0].$d).isValid() ? dayjs(o.daterange[0].$d) : beginDate;
		let ed = o?.daterange && o.daterange[1] && dayjs(o.daterange[1].$d).isValid() ? dayjs(o.daterange[1].$d) : endDate;
		// если конечная дата позже сегодняшнего дня, то обрезаем
		if (ed.isAfter(endDate, "day")) {
			ed = endDate;
		}
		let period = ed.diff(bd, 'day');
		let dayincome = (o.income || 0) / (period + 1); // средний дневной заработок позиции

		getRange(bd, ed).forEach(d => {
			incomes[d] += parseFloat(dayincome);
		})
	});

	var datasets = [];
	let allincome = 0;
	// заполняем массив доходом, который суммируется
	for (let [key, value] of Object.entries(incomes)) {
		allincome += value;
		datasets.push([key, allincome]);
	}

	// выводим данные только за последний год
	datasets = datasets.slice(-365);
	incomes = Object.values(incomes).map(v => v).slice(-365);

	const data = {
		labels: datasets.map(a => a[0]),
		datasets: [
			{
				type: "line",
				label: "Общий доход",
				data: datasets.map(a => a[1]),
				borderWidth: 1,
				borderColor: "#d4d4d4",
				yAxisID: 'y1',
				radius: 0,
			},
			{
				label: 'Дневной доход',
				data: incomes,
				backgroundColor: "rgb(50, 216, 190, 0.2)",
				yAxisID: 'y2',
				type: 'bar'
			}]
	};

	const options = {
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
					label: (c) => c.dataset.label + "($): " + localeNumber(c.dataset.data[c.dataIndex], 0)
				},
			}
		},
		scales: {
			x: { display: false, grid: { display: false } },
			y1: { type: 'linear', display: true, position: 'right', grid: { display: false } },
			y2: { type: 'linear', display: true, position: 'left', grid: { display: false } },
		},
	};

	return <div style={{ height: 300, margin: "10px 0" }} ><Bar options={options} data={data} /></div>
}