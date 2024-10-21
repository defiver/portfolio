import { ClearOutlined } from "@ant-design/icons";
import { Row, Col, Button, Table, Form, Card, Select, Statistic } from "antd";
import { localeNumber } from "@/utils/number";
import { useEffect, useState } from "react";
import MyInputNumber from "@/components/MyInputNumber";

const columns = [
	{ title: 'Год', dataIndex: 'key', key: 'key' },
	{ title: 'Начальная сумма', dataIndex: 'begin', key: 'begin', render: (t) => localeNumber(t), },
	{ title: 'Пополнения', dataIndex: 'refill', key: 'refill', render: (t) => localeNumber(t), },
	{ title: 'Доход', dataIndex: 'income', key: 'income', render: (t) => localeNumber(t), },
	{ title: 'Конечная сумма', key: 'end', dataIndex: 'end', render: (t) => localeNumber(t), align: "right", },
];

export default function CI({ showDesc }) {
	const [form] = Form.useForm();
	const values = Form.useWatch([], form);
	const [result, setResult] = useState([]);

	const calc = () => {
		const years = [];
		var capital = values.startingCapital;
		var prevCapital = values.startingCapital;
		var dayProfitability = values.profitability / 36500; // ежедневная доходность
		var days = 365 * values.period; // кол-во дней инвестирования
		var yearRefill = values.refill * parseInt(365 / values.refillFrequency); // сумма пополнений за год
		var profit = 0; // накопленные проценты

		for (let day = 1; day <= days; day++) {
			profit += capital * dayProfitability;

			// если наступил срок реинвестирвоания процентов
			if (day % values.reinvestment === 0) {
				capital += profit;
				profit = 0;
			}

			// если наступил срок пополнения
			if (values.refillFrequency > 0 && day % values.refillFrequency === 0) {
				capital += values.refill;
			}

			// если прошёл год
			if (day % 365 === 0) {
				years.push({
					key: years.length + 1,
					begin: prevCapital,
					income: Math.round(capital - prevCapital - yearRefill),
					refill: yearRefill,
					end: Math.round(capital),
				});

				prevCapital = Math.round(capital);
			}
		}

		// проверка на случай, если период дробный
		if (years.length < values.period) {
			years.push({
				key: years.length + 1,
				begin: prevCapital,
				income: Math.round(capital - prevCapital),
				refill: yearRefill * (values.period - years.length),
				end: Math.round(capital),
			});
		}

		setResult(years);
	}

	const options = [
		{ label: "Каждый год", value: 365 },
		{ label: "Каждые полгода", value: 182 },
		{ label: "Каждый квартал", value: 91 },
		{ label: "Каждый месяц", value: 30 },
		{ label: "Каждую неделю", value: 7 },
		{ label: "Каждый день", value: 1 },
		{ label: "Никогда", value: 0 },
	]

	useEffect(() => {
		form.validateFields({ validateOnly: true })
			.then(() => calc())
			.catch(() => setResult([]))
	}, [form, values]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			<Card size={"small"} hidden={!showDesc}>
				<p>Калькулятор для расчёта капитала с учётом реинвестирования - повторного вложения дохода, полученного от инвестиций. Сложный процент это начисление процентов как на начальную сумму, так и на прошлые проценты.</p>
			</Card>

			<Form form={form} autoComplete="off" requiredMark={false} initialValues={{ reinvestment: 365, refillFrequency: 365 }}>
				<Row gutter={[8, 8]}>
					<Col span={8}>
						<Form.Item label="Стартовый капитал" name="startingCapital" rules={[{ required: true, message: "" }]}>
							<MyInputNumber placeholder="100000" min={0} />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item label="Срок вложений в годах" name="period" rules={[{ required: true, message: "" }]}>
							<MyInputNumber placeholder="0.5" min={0} />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item label="Доходность" name="profitability" rules={[{ required: true, message: "" }]}>
							<MyInputNumber placeholder="15" min={0} />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item label="Реинвестирование %" name="reinvestment" rules={[{ required: true, message: "" }]}>
							<Select options={options} />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item label="Частота пополнений" name="refillFrequency" rules={[{ required: true, message: "" }]}>
							<Select options={options} />
						</Form.Item>
					</Col>
					<Col span={6}>
						<Form.Item label="Сумма пополнений" name="refill" rules={[{ required: true, message: "" }]}>
							<MyInputNumber placeholder="20000" min={0} />
						</Form.Item>
					</Col>
					<Col span={2} style={{ textAlign: "end" }}>
						<Button icon={<ClearOutlined />} title="Очистить форму" onClick={() => form.resetFields()} />
					</Col>
				</Row>
			</Form>

			<Row gutter={[8, 0]} style={{ textAlign: "center" }}>
				<Col span={8}>
					<Statistic title="Начальная сумма" value={result.length ? localeNumber(result[0].begin) : 0} />
				</Col>
				<Col span={8}>
					<Statistic title="Пополнения" value={result.length ? localeNumber(result.map(o => o.refill).reduce((a, b) => a + b)) : 0} />
				</Col>
				<Col span={8}><Statistic title="Итоговая сумма" value={result.length ? localeNumber(result.at(-1).end) : 0} /></Col>
			</Row>

			<Table bordered size={"small"} columns={columns} dataSource={result} pagination={false} />
		</>
	);
}
