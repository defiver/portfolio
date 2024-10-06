import { ClearOutlined } from "@ant-design/icons";
import { Row, Col, InputNumber, Button, Divider, Form, Card, Statistic, Typography } from "antd";
import { localeNumber } from "@/utils/number";
import { useEffect, useState } from "react";

const { Paragraph } = Typography;

const defaultResult = {
	"avgDownPriceA": 0,
	"avgUpPriceB": 0,
	"downAmountA": 0,
	"upAmountB": 0,
	"avgDownPriceAB": 0,
	"avgUpPriceBA": 0,
	"poolAmountA": 0,
	"poolAmountB": 0,
}

export default function TokensRatio({ showDesc }) {
	const [form] = Form.useForm();
	const values = Form.useWatch([], form);
	const [result, setResult] = useState(defaultResult);

	const calc = () => {
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

		let avgDownPriceA = (values.rangeDown + values.price) / 2;
		let avgUpPriceB = (values.rangeUp + values.price) / 2;

		let downAmountA = values.amountA + values.amountB / avgDownPriceA;
		let upAmountB = values.amountB + values.amountA * avgUpPriceB;

		let avgDownPriceAB = (values.amountA * values.price + (downAmountA - values.amountA) * avgDownPriceA) / downAmountA;
		let avgUpPriceBA = (values.amountB * values.price + (upAmountB - values.amountB) * avgUpPriceB) / upAmountB;

		setResult({ avgDownPriceA, avgUpPriceB, downAmountA, upAmountB, avgDownPriceAB, avgUpPriceBA, poolAmountA, poolAmountB })
	}

	useEffect(() => {
		form.validateFields({ validateOnly: true })
			.then(() => calc())
			.catch(() => setResult(defaultResult))
	}, [form, values]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			<Card size={"small"} hidden={!showDesc}>
				<p>Расчёт средней цены покупки/продажи токенов при выходе цены за границы диапазона. Средняя цена считается как для случая переливания одного токена в другой, так и с учётом изначально имеющихся активов.</p><br />
				<p>Расчёт соотнешения токенов при добавлении ликвидности в пул. Нужно для того, чтобы оптимально разделить актив на два. Результаты могут быть неточными, так как:<br />1) цена в пуле и цена свопа могут отличаться,<br />2) своп может повлиять на цену в пуле,<br />3) при свопе не исключено проскальзывание,<br />4) расчёты делаются на основе формул Uniswap V3 пулов.</p>
			</Card>

			<Form form={form} autoComplete="off" requiredMark={false}>
				<Row gutter={[8, 8]}>
					<Col span={8}>
						<Form.Item label="Цена" name="price" rules={[{ required: true, message: "" }]}>
							<InputNumber placeholder="2500" min={1 / 10 ** 9} />
						</Form.Item>
					</Col>

					<Col span={8}>
						<Form.Item label="Нижняя граница" name="rangeDown" rules={[{ required: true, message: "" }]}>
							<InputNumber placeholder="2100" min={0} />
						</Form.Item>
					</Col>

					<Col span={8}>
						<Form.Item label="Верхняя граница" name="rangeUp" rules={[{ required: true, message: "" }]}>
							<InputNumber placeholder="2900" min={0} />
						</Form.Item>
					</Col>

					<Col span={11}>
						<Form.Item label="Токены А" name="amountA" rules={[{ required: true, message: "" }]}>
							<InputNumber placeholder="4.2" min={0} />
						</Form.Item>
					</Col>

					<Col span={11}>
						<Form.Item label="Токены B" name="amountB" rules={[{ required: true, message: "" }]}>
							<InputNumber placeholder="0" min={0} />
						</Form.Item>
					</Col>

					<Col span={2}>
						<Button icon={<ClearOutlined />} title="Очистить форму" onClick={() => form.resetFields()} />
					</Col>
				</Row>
			</Form>

			<Row gutter={[8, 0]}>
				<Col span={24}><Divider plain>Внесение ликвидности</Divider></Col>
				<Col span={8}><Statistic title="Tокенов A" value={localeNumber(result.poolAmountA)} suffix={<Paragraph copyable={{ text: result.poolAmountA }} />} /></Col>
				<Col span={8}><Statistic title="Tокенов B" value={localeNumber(result.poolAmountB)} suffix={<Paragraph copyable={{ text: result.poolAmountB }} />} /></Col>
				<Col span={8}>
					<Statistic
						title={result.poolAmountB > values?.amountB ? "Сколько продать А" : "Сколько продать B"}
						value={result.poolAmountB > values?.amountB
							? localeNumber(values?.amountA - result.poolAmountA)
							: localeNumber(values?.amountB - result.poolAmountB)
						}
						suffix={result.poolAmountB > values?.amountB
							? <Paragraph copyable={{ text: values?.amountA - result.poolAmountA }} />
							: <Paragraph copyable={{ text: values?.amountB - result.poolAmountB }} />
						}
					/>
				</Col>

				<Col span={24}><Divider plain>Выход за нижнюю границу</Divider></Col>
				<Col span={8}><Statistic title="Tокенов A" value={localeNumber(result.downAmountA)} /></Col>
				<Col span={8}><Statistic title="Цена продажи B" value={localeNumber(result.avgDownPriceA)} /></Col>
				<Col span={8}><Statistic title="Цена покупки A" value={localeNumber(result.avgDownPriceAB)} /></Col>

				<Col span={24}><Divider plain>Выход за верхнюю границу</Divider></Col>
				<Col span={8}><Statistic title="Tокенов B" value={localeNumber(result.upAmountB)} /></Col>
				<Col span={8}><Statistic title="Цена продажи А" value={localeNumber(result.avgUpPriceB)} /></Col>
				<Col span={8}><Statistic title="Цена покупки B" value={localeNumber(result.avgUpPriceBA)} /></Col>
			</Row>
		</>
	);
}
