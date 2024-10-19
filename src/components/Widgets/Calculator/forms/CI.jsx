import { ClearOutlined } from "@ant-design/icons";
import { Row, Col, Button, Table, Form, Card, Select } from "antd";
import { localeNumber } from "@/utils/number";
import { useEffect, useState } from "react";
import MyInputNumber from "@/components/MyInputNumber";

const columns = [
	{ title: 'Год', dataIndex: 'key', key: 'key' },
	{ title: 'Начальная сумма', dataIndex: 'begin', key: 'begin', render: (t) => localeNumber(t), },
	{ title: 'Пополнения', dataIndex: 'refill', key: 'refill', render: (t) => localeNumber(t), },
	{ title: 'Конечная сумма', key: 'end', dataIndex: 'end', render: (t) => localeNumber(t), },
	{ title: 'Доход', dataIndex: 'income', key: 'income', render: (t) => localeNumber(t), },
];

export default function CI({ showDesc }) {
	const [form] = Form.useForm();
	const values = Form.useWatch([], form);
	const [result, setResult] = useState([]);

	const calc = () => {
		const years = [];
		var prevCapital = values.startingCapital;
		var reinvestment = (365 / values.reinvestment);
		var refill = values.refillFrequency > 0 ? values.refill * 365 / values.refillFrequency : 0;
		var profitability = values.profitability / 100;

		for (let i = 0; i < values.period; i++) {
			let capital = (prevCapital + refill) * (1 + profitability / reinvestment) ** (reinvestment);

			years.push({
				key: i + 1,
				begin: prevCapital,
				income: capital - prevCapital - refill,
				refill: refill,
				end: capital,
			});

			prevCapital = capital;
		}

		setResult(years);
	}

	const options = [
		{ label: "Каждый год", value: 365 },
		{ label: "Каждые полгода", value: 365 / 2 },
		{ label: "Каждый квартал", value: 365 / 4 },
		{ label: "Каждый месяц", value: 365 / 12 },
		{ label: "Каждую неделю", value: 7 },
		{ label: "Каждый день", value: 1 },
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
						<Form.Item label="Начисление процентов" name="reinvestment" rules={[{ required: true, message: "" }]}>
							<Select options={options} />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item label="Частота пополнений" name="refillFrequency" rules={[{ required: true, message: "" }]}>
							<Select options={[...options, { label: "Никогда", value: 0 }]} />
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

			<Table bordered size={"small"} columns={columns} dataSource={result} pagination={false} />
		</>
	);
}
