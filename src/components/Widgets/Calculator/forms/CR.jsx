import { ClearOutlined } from "@ant-design/icons";
import { Row, Col, Button, Form, Card, Statistic } from "antd";
import { localeNumber } from "@/utils/number";
import { useEffect, useState } from "react";
import MyInputNumber from "@/components/MyInputNumber";

export default function CR({ showDesc }) {
	const [form] = Form.useForm();
	const values = Form.useWatch([], form);
	const [CAGR, setCAGR] = useState(0);

	const calc = () => {
		let result = 100 * ((values.end / values.begin) ** (1 / values.period) - 1);

		setCAGR(result)
	}

	useEffect(() => {
		form.validateFields({ validateOnly: true })
			.then(() => calc())
			.catch(() => setCAGR(0))
	}, [form, values]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			<Card size={"small"} hidden={!showDesc}>
				<p>CAGR - это совокупный среднегодовой темп роста. Выражается в процентах и показывает, на сколько процентов за год прирастает капитал.</p>
			</Card>

			<Form form={form} autoComplete="off" requiredMark={false}>
				<Row gutter={[8, 8]}>
					<Col span={8}>
						<Form.Item label="Было" name="begin" rules={[{ required: true, message: "" }]}>
							<MyInputNumber placeholder="100000" min={0} />
						</Form.Item>
					</Col>

					<Col span={8}>
						<Form.Item label="Стало" name="end" rules={[{ required: true, message: "" }]}>
							<MyInputNumber placeholder="130000" min={0} />
						</Form.Item>
					</Col>

					<Col span={6}>
						<Form.Item label="Период в годах" name="period" rules={[{ required: true, message: "" }]}>
							<MyInputNumber placeholder="2.5" min={0} />
						</Form.Item>
					</Col>

					<Col span={2}>
						<Button icon={<ClearOutlined />} title="Очистить форму" onClick={() => form.resetFields()} />
					</Col>
				</Row>
			</Form>

			<Statistic style={{ textAlign: "center" }} title="CAGR" value={localeNumber(CAGR)} suffix="%" />
		</>
	);
}
