import { ClearOutlined } from "@ant-design/icons";
import { Row, Col, InputNumber, Button, Divider, Form, Collapse, Statistic } from "antd";
import { localeNumber } from "@/utils/number";
import { useEffect, useState } from "react";

const defaultResult = {
	"avgDownPrice": 0,
	"avgUpPrice": 0,
	"downAmountA": 0,
	"upAmountB": 0,
	"poolAmountA": 0,
	"poolAmountB": 0,
}

export default function TokensRatio() {
	const [form] = Form.useForm();
	const values = Form.useWatch([], form);
	const [result, setResult] = useState(defaultResult);

	const calc = () => {
		let avgDownPrice = (values.rangeDown + values.price) / 2;
		let avgUpPrice = (values.rangeUp + values.price) / 2;

		let downAmountA = values.amountA + values.amountB / avgDownPrice;
		let upAmountB = values.amountB + values.amountA * avgUpPrice;

		let ratio = 1;
		let tempAmountA = values.amountB + values.amountA * values.price;
		let tempAmountB = 0;
		let preLiquidityA = (Math.sqrt(values.price) * Math.sqrt(values.rangeUp)) / (Math.sqrt(values.rangeUp) - Math.sqrt(values.price));
		let preLiquidityB = (Math.sqrt(values.price) - Math.sqrt(values.rangeDown));

		while (ratio > 0.5) {
			let liquidityA = tempAmountA * preLiquidityA / values.price;
			let liquidityB = tempAmountB / preLiquidityB;

			ratio = liquidityA / (liquidityA + liquidityB);
			let bit = tempAmountA * 0.0001;
			tempAmountA -= bit;
			tempAmountB += bit;
		}

		let poolAmountA = tempAmountA / values.price;
		let poolAmountB = tempAmountB;

		setResult({ avgDownPrice, avgUpPrice, downAmountA, upAmountB, poolAmountA, poolAmountB })
	}

	useEffect(() => {
		form.validateFields({ validateOnly: true })
			.then(() => calc())
			.catch(() => setResult(defaultResult))
	}, [form, values]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			<Collapse
				size="small"
				items={[{
					key: 'desc',
					label: 'Описание',
					children: <p>Расчёт соотнешения токенов при добавлении ликвидности в пул и расчёт средней цены покупки/продажи токенов при выходе цены за границы диапазона. Значения для расчёта  соотнешения токенов могут быть неточными, так как:<br />1) цена в пуле и цена свопа могут отличаться,<br />2) своп может повлиять на цену в пуле,<br />3) при свопе не исключено проскальзывание,<br />4) расчёты делаются на основе формул Uniswap V3 пулов.</p>,
				}]}
			/>

			<Form form={form} autoComplete="off">
				<Row gutter={[8, 8]}>
					<Col span={8}>
						<Form.Item name="price" rules={[{ required: true, message: "" }]}>
							<InputNumber placeholder="Цена (2500)" min={1 / 10 ** 9} />
						</Form.Item>
					</Col>

					<Col span={8}>
						<Form.Item name="rangeDown" rules={[{ required: true, message: "" }]}>
							<InputNumber placeholder="Нижняя граница" min={0} />
						</Form.Item>
					</Col>

					<Col span={8}>
						<Form.Item name="rangeUp" rules={[{ required: true, message: "" }]}>
							<InputNumber placeholder="Верхняя граница" min={0} />
						</Form.Item>
					</Col>

					<Col span={11}>
						<Form.Item name="amountA" rules={[{ required: true, message: "" }]}>
							<InputNumber placeholder="Кол-во токенов А (4.2)" min={0} />
						</Form.Item>
					</Col>

					<Col span={11}>
						<Form.Item name="amountB" rules={[{ required: true, message: "" }]}>
							<InputNumber placeholder="Кол-во токенов B (0)" min={0} />
						</Form.Item>
					</Col>

					<Col span={2}>
						<Button icon={<ClearOutlined />} title="Очистить форму" onClick={() => form.resetFields()} />
					</Col>
				</Row>
			</Form>

			<Row gutter={[8, 0]}>
				<Col span={24}><Divider plain>Внесение ликвидности</Divider></Col>
				<Col span={8}><Statistic title="Tокенов A" value={localeNumber(result.poolAmountA)} /></Col>
				<Col span={8}><Statistic title="Tокенов B" value={localeNumber(result.poolAmountB)} /></Col>
				<Col span={8}>
					<Statistic
						title={result.poolAmountB > values?.amountB ? "Сколько продать А" : "Сколько продать B"}
						value={
							result.poolAmountB > values?.amountB
								? localeNumber(values?.amountA - result.poolAmountA)
								: localeNumber(values?.amountB - result.poolAmountB)
						}
					/>
				</Col>

				<Col span={24}><Divider plain>Выход за нижнюю границу</Divider></Col>
				<Col span={8}><Statistic title="Tокенов A" value={localeNumber(result.downAmountA)} /></Col>
				<Col span={8}><Statistic title="Tокенов B" value={0} /></Col>
				<Col span={8}><Statistic title="Цена продажи" value={localeNumber(result.avgDownPrice)} /></Col>

				<Col span={24}><Divider plain>Выход за верхнюю границу</Divider></Col>
				<Col span={8}><Statistic title="Tокенов A" value={0} /></Col>
				<Col span={8}><Statistic title="Tокенов B" value={localeNumber(result.upAmountB)} /></Col>
				<Col span={8}><Statistic title="Цена покупки" value={localeNumber(result.avgUpPrice)} /></Col>
			</Row>
		</>
	);
}
