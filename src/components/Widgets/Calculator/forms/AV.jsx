import { ClearOutlined } from "@ant-design/icons";
import { Row, Col, Button, Statistic, Form, Card } from "antd";
import { localeNumber } from "@/utils/number";
import { useEffect, useState } from "react";
import MyInputNumber from "@/components/MyInputNumber";

export default function Lo({ showDesc }) {
	const [form] = Form.useForm();
	const values = Form.useWatch([], form);
	const [result, setResult] = useState(0);

	const calc = () => {
		let result = (values.old_amount * values.old_price + values.new_amount * values.new_price);
		result /= (values.old_amount + values.new_amount);
		setResult(result);
	}

	useEffect(() => {
		form.validateFields({ validateOnly: true })
			.then(() => calc())
			.catch(() => setResult(0))
	}, [form, values]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			<Card size={"small"} hidden={!showDesc}>
				<p>Калькулятор для расчёта средней стоимости активов при дополнительной покупке.</p>
			</Card>

			<Form form={form} autoComplete="off" requiredMark={false} initialValues={{ rounds: 8 }}>
				<Row gutter={[8, 8]}>
					<Col span={11}>
						<Form.Item label="Имеется токенов" name="old_amount" rules={[{ required: true, message: "" }]}>
							<MyInputNumber placeholder="5" min={1 / 10 ** 9} />
						</Form.Item>
					</Col>

					<Col span={11}>
						<Form.Item label="Их цена" name="old_price" rules={[{ required: true, message: "" }]}>
							<MyInputNumber placeholder="100" min={1 / 10 ** 9} />
						</Form.Item>
					</Col>

					<Col span={11}>
						<Form.Item label="Докупается токенов" name="new_amount" rules={[{ required: true, message: "" }]}>
							<MyInputNumber placeholder="5" min={1 / 10 ** 9} />
						</Form.Item>
					</Col>

					<Col span={11}>
						<Form.Item label="По цене" name="new_price" rules={[{ required: true, message: "" }]}>
							<MyInputNumber placeholder="120" min={1 / 10 ** 9} />
						</Form.Item>
					</Col>

					<Col span={2} style={{ textAlign: "end" }}>
						<Button icon={<ClearOutlined />} title="Очистить форму" onClick={() => form.resetFields()} />
					</Col>
				</Row>
			</Form>

			<Statistic style={{ textAlign: "center" }} title="Новая средняя цена" value={localeNumber(result)} />
		</>
	);
}
