import { ClearOutlined } from "@ant-design/icons";
import { Row, Col, Button, Divider, Form, Card, Statistic, Typography, Select } from "antd";
import { localeNumber } from "@/utils/number";
import { useEffect, useState } from "react";
import MyInputNumber from "@/components/MyInputNumber";

const { Paragraph } = Typography;

const defaultResult = {
	"poolAmountA": 0, // кол-во токенов А при добавлени ликвидности в пул
	"poolAmountB": 0, // кол-во токенов В при добавлени ликвидности в пул
}

export default function TR({ showDesc }) {
	const [form] = Form.useForm();
	const values = Form.useWatch([], form);
	const [result, setResult] = useState(defaultResult);

	const calc = () => {
		var poolAmountA = 0;
		var poolAmountB = 0;

		if (values.type === "uniswapv3") {
			// предполагаем, что вся ликвидность в одном токене, а кол-во второго равно нулю
			let tempAmountA = values.amountB + values.amountA * values.price;
			let tempAmountB = 0;
			// считаем виртуальную ликвидность по формулам из https://ethereum.stackexchange.com/a/110452
			let preLiquidityA = (Math.sqrt(values.price) * Math.sqrt(values.rangeUp)) / (Math.sqrt(values.rangeUp) - Math.sqrt(values.price));
			let preLiquidityB = (Math.sqrt(values.price) - Math.sqrt(values.rangeDown));

			// поэтому считаем численным методом, в каком соотношении должны быть активы,
			// чтобы LiquidityA быть равно LiquidityB. погрешность 0.01%
			let ratio = 1;
			while (ratio > 0.5) {
				let liquidityA = tempAmountA * preLiquidityA / values.price;
				let liquidityB = tempAmountB / preLiquidityB;

				ratio = liquidityA / (liquidityA + liquidityB);
				let bit = tempAmountA * 0.0001;
				tempAmountA -= bit;
				tempAmountB += bit;
			}

			poolAmountA = tempAmountA / values.price;
			poolAmountB = tempAmountB;
		} else {
			// считаем соотношение токенов при внесении ликвидности как обычную пропорцию
			let liquidity = values.amountA * values.price + values.amountB;
			let ratio = (values.price - values.rangeDown) / (values.rangeUp - values.rangeDown);
			poolAmountA = ratio * liquidity / values.price;
			poolAmountB = (1 - ratio) * liquidity;
		}

		setResult({ poolAmountA, poolAmountB })
	}

	useEffect(() => {
		form.validateFields({ validateOnly: true })
			.then(() => calc())
			.catch(() => setResult(defaultResult))
	}, [form, values]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			<Card size={"small"} hidden={!showDesc}>
				<p>Расчёт соотнешения токенов при добавлении ликвидности в пул. Нужно для того, чтобы оптимально разделить актив на два.<br /><br />Результаты могут быть неточными, так как:<br />1) цена в пуле и цена свопа могут отличаться,<br />2) своп может повлиять на цену в пуле,<br />3) при свопе не исключено проскальзывание.<br /><br />Расчёты можно делать на основе формул Uniswap V3 пулов или на основе обычной пропорции.<br /><br />Формулы для Uniswap V3 имеют квадратичную зависимость и очень чувствительны к точности, поэтому рекомендуется копировать значения со страницы пула со всеми знаками после зяпятой.</p>
			</Card>

			<Form form={form} autoComplete="off" requiredMark={false} initialValues={{ "type": "uniswapv3" }}>
				<Row gutter={[8, 8]}>
					<Col span={8}>
						<Form.Item label="Цена токена А" name="price" rules={[{ required: true, message: "" }]}>
							<MyInputNumber placeholder="2500" min={1 / 10 ** 9} />
						</Form.Item>
					</Col>

					<Col span={8}>
						<Form.Item label="Нижняя граница" name="rangeDown" rules={[{ required: true, message: "" }]}>
							<MyInputNumber placeholder="2100" min={0} />
						</Form.Item>
					</Col>

					<Col span={8}>
						<Form.Item label="Верхняя граница" name="rangeUp" rules={[{ required: true, message: "" }]}>
							<MyInputNumber placeholder="2900" min={0} />
						</Form.Item>
					</Col>

					<Col span={8}>
						<Form.Item label="Токены А" name="amountA" rules={[{ required: true, message: "" }]}>
							<MyInputNumber placeholder="ETH (4.2)" min={0} />
						</Form.Item>
					</Col>

					<Col span={8}>
						<Form.Item label="Токены B" name="amountB" rules={[{ required: true, message: "" }]}>
							<MyInputNumber placeholder="USDC (0)" min={0} />
						</Form.Item>
					</Col>

					<Col span={6}>
						<Form.Item label="Тип" name="type" rules={[{ required: true, message: "" }]}>
							<Select
								options={[
									{ label: "Uniswap V3", value: "uniswapv3" },
									{ label: "Пропорция", value: "ratio" },
								]}
							/>
						</Form.Item>
					</Col>

					<Col span={2}>
						<Button icon={<ClearOutlined />} title="Очистить форму" onClick={() => form.resetFields()} />
					</Col>
				</Row>
			</Form>

			<Row gutter={[8, 0]}>
				<Col span={24}><Divider plain>Внесение ликвидности</Divider></Col>
				<Col span={8}><Statistic title="Tокенов A" value={localeNumber(result.poolAmountA)} suffix={<Paragraph copyable={{ text: result.poolAmountA.toFixed(6) }} />} /></Col>
				<Col span={8}><Statistic title="Tокенов B" value={localeNumber(result.poolAmountB)} suffix={<Paragraph copyable={{ text: result.poolAmountB.toFixed(6) }} />} /></Col>
				<Col span={8}>
					<Statistic
						title={result.poolAmountB > values?.amountB ? "Сколько продать А" : "Сколько продать B"}
						value={result.poolAmountB > values?.amountB
							? localeNumber(values?.amountA - result.poolAmountA)
							: localeNumber(values?.amountB - result.poolAmountB)
						}
						suffix={result.poolAmountB > values?.amountB
							? <Paragraph copyable={{ text: (values?.amountA - result.poolAmountA).toFixed(6) }} />
							: <Paragraph copyable={{ text: (values?.amountB - result.poolAmountB).toFixed(6) }} />
						}
					/>
				</Col>
			</Row>
		</>
	);
}
