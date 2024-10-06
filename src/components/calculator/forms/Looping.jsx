import { ClearOutlined } from "@ant-design/icons";
import { Row, Col, InputNumber, Button, Table, Form, Card } from "antd";
import { localeNumber } from "@/utils/number";
import { useEffect, useState } from "react";

const columns = [
	{ title: 'Круг', dataIndex: 'key', key: 'key' },
	{ title: 'Кредит', dataIndex: 'credit', key: 'credit', render: (t) => localeNumber(t), },
	{ title: 'Депозит', dataIndex: 'deposit', key: 'deposit', render: (t) => localeNumber(t), },
	{ title: 'APR (%)', key: 'apr', dataIndex: 'apr', render: (t) => localeNumber(t), },
];

export default function Looping({ showDesc }) {
	const [form] = Form.useForm();
	const values = Form.useWatch([], form);
	const [result, setResult] = useState([]);

	const calc = () => {
		let rounds = [];
		let amount = values.amount;
		let debt = 0;
		let credit = 0;

		// на каждом круге считаем, сколько токенов накапает за год за депозит,
		// потом вычитаем, сколько токенов за год нужно отдать за кредит,
		// а результат делим на изначальное кол-во токенов, чтобы узнать APR
		for (let i = 0; i <= values.rounds; i++) {
			rounds.push({
				key: i,
				deposit: amount,
				credit: credit,
				apr: (amount * values.deposit - debt * values.credit) / values.amount,
			});

			credit = amount * values.ltv;
			debt = amount * values.ltv;
			amount = values.amount + amount * values.ltv;
		}

		setResult(rounds)
	}

	useEffect(() => {
		form.validateFields({ validateOnly: true })
			.then(() => calc())
			.catch(() => setResult([]))
	}, [form, values]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			<Card size={"small"} hidden={!showDesc}>
				<p>Простой калькулятор для расчёта лупинга токенов в протоколах кредитования. На нулевом круге мы только вносим активы на депозит, а со следующих начинаем закручивать петли.</p>
			</Card>

			<Form form={form} autoComplete="off" requiredMark={false} initialValues={{ rounds: 8 }}>
				<Row gutter={[8, 8]}>
					<Col span={10}>
						<Form.Item label="Кол-во токенов" name="amount" rules={[{ required: true, message: "" }]}>
							<InputNumber placeholder="1000" min={1 / 10 ** 9} />
						</Form.Item>
					</Col>

					<Col span={10}>
						<Form.Item label="LTV" name="ltv" rules={[{ required: true, message: "" }]}>
							<InputNumber placeholder="0.8" min={0} />
						</Form.Item>
					</Col>

					<Col span={4}>
						<Form.Item label="Круги" name="rounds" rules={[{ required: true, message: "" }]}>
							<InputNumber placeholder="10" min={1} />
						</Form.Item>
					</Col>

					<Col span={11}>
						<Form.Item label="Процент за депозит" name="deposit" rules={[{ required: true, message: "" }]}>
							<InputNumber placeholder="10" min={0} />
						</Form.Item>
					</Col>

					<Col span={11}>
						<Form.Item label="Процент за кредит" name="credit" rules={[{ required: true, message: "" }]}>
							<InputNumber placeholder="6" min={0} />
						</Form.Item>
					</Col>

					<Col span={2}>
						<Button icon={<ClearOutlined />} title="Очистить форму" onClick={() => form.resetFields()} />
					</Col>
				</Row>
			</Form>

			<Table bordered size={"small"} columns={columns} dataSource={result} pagination={false} />
		</>
	);
}
