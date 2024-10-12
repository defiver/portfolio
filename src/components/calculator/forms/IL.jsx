import { ClearOutlined } from "@ant-design/icons";
import { Row, Col, Button, Form, Card, Statistic, Divider } from "antd";
import { localeNumber } from "@/utils/number";
import { useEffect, useState } from "react";
import MyInputNumber from "@/components/MyInputNumber";

const defaultResult = {
	"startAmountA": 0, // изначальная ликвидность в токенах A
	"startAmountB": 0, // изначальная ликвидность в токенах B
	"poolAmountA": 0, // сколько будет токенов А в пуле после перелива
	"poolAmountB": 0, // сколько будет токенов B в пуле после перелива
	"holdAmountA": 0, // сколько будет токена A при HOLD
	"holdAmountB": 0, // сколько будет токена B при HOLD
	"startPrice": 0,
	"endPrice": 0,
}

export default function IL({ showDesc }) {
	const [form] = Form.useForm();
	const values = Form.useWatch([], form);
	const [result, setResult] = useState(defaultResult);

	const calc = () => {
		let startPrice = values.startPrice;
		let endPrice = values.endPrice;

		let startAmountA = values.amountA + values.amountB / startPrice;
		let startAmountB = values.amountA * startPrice + values.amountB;

		let avgPrice = (startPrice + endPrice) / 2;
		let holdAmountA = startAmountA;
		let holdAmountB = startAmountB;
		let poolAmountA = 0;
		let poolAmountB = 0;

		// расчёт итоговой стоимости активов после перелива позиции с учётом комиссионных
		if (startPrice > endPrice) {
			let fees = (poolAmountA + startAmountA) / 2 * values.apr / 100 * values.days / 365;
			poolAmountA = fees + values.amountA + values.amountB / avgPrice;
		} else {
			let fees = (startAmountB + poolAmountB) / 2 * values.apr / 100 * values.days / 365;
			poolAmountB = fees + values.amountB + values.amountA * avgPrice;
		}

		setResult({ startAmountA, startAmountB, poolAmountA, poolAmountB, holdAmountA, holdAmountB, startPrice, endPrice })
	}

	useEffect(() => {
		form.validateFields({ validateOnly: true })
			.then(() => calc())
			.catch(() => setResult(defaultResult))
	}, [form, values]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			<Card size={"small"} hidden={!showDesc}>
				<p>Сравнение стратегии HODL с внесением активов в пул ликвидности. Можно указать доходность позиции и её продолжительность для приблезительного учёта комиссионных. Предполагаемая цена это цена, при которой позиция перестаёт быть активной и она переливается в один из токенов.</p>
			</Card>

			<Form form={form} autoComplete="off" requiredMark={false} initialValues={{ "type": "uniswapv3" }}>
				<Row gutter={[8, 8]}>
					<Col span={12}>
						<Form.Item label="Текущая цена токена А" name="startPrice" rules={[{ required: true, message: "" }]}>
							<MyInputNumber placeholder="2500" min={1 / 10 ** 9} />
						</Form.Item>
					</Col>

					<Col span={12}>
						<Form.Item label="Предполагаемая цена токена А" name="endPrice" rules={[{ required: true, message: "" }]}>
							<MyInputNumber placeholder="3000" min={1 / 10 ** 9} />
						</Form.Item>
					</Col>

					<Col span={12}>
						<Form.Item label="Токены А" name="amountA" rules={[{ required: true, message: "" }]}>
							<MyInputNumber placeholder="ETH (0.2)" min={0} />
						</Form.Item>
					</Col>

					<Col span={12}>
						<Form.Item label="Токены B" name="amountB" rules={[{ required: true, message: "" }]}>
							<MyInputNumber placeholder="USDC (500)" min={0} />
						</Form.Item>
					</Col>

					<Col span={12}>
						<Form.Item label="Сколько дней позиция активна" name="days" rules={[{ required: true, message: "" }]}>
							<MyInputNumber placeholder="7" min={0} />
						</Form.Item>
					</Col>

					<Col span={10}>
						<Form.Item label="APR позиции в %" name="apr" rules={[{ required: true, message: "" }]}>
							<MyInputNumber placeholder="60" min={0} />
						</Form.Item>
					</Col>

					<Col span={2}>
						<Button icon={<ClearOutlined />} title="Очистить форму" onClick={() => form.resetFields()} />
					</Col>
				</Row>
			</Form>

			<Row gutter={[8, 0]} className="IL">
				<Col span={24}><Divider plain>В токенах А</Divider></Col>

				<Col span={6}><Statistic title="Изначально" value={localeNumber(result.startAmountA)} /></Col>

				<Col span={6}><Statistic title="В пуле" value={localeNumber(result.poolAmountA)} suffix={localeNumber(result.poolAmountA * result.endPrice) + " B"} /></Col>

				<Col span={6}><Statistic title="HOLD" value={localeNumber(result.holdAmountA)} suffix={localeNumber(result.startAmountA * result.endPrice) + " B"} /></Col>

				<Col span={6}><Statistic title="IL" value={
					result.startPrice > result.endPrice
						? localeNumber(result.holdAmountA - result.poolAmountA)
						: localeNumber(result.holdAmountA - result.poolAmountB / result.endPrice)
				} /></Col>

				<Col span={24}><Divider plain>В токенах B</Divider></Col>

				<Col span={6}><Statistic title="Изначально" value={localeNumber(result.startAmountB)} /></Col>

				<Col span={6}><Statistic title="В пуле" value={localeNumber(result.poolAmountB)} suffix={localeNumber(result.poolAmountB / result.endPrice) + " A"} /></Col>

				<Col span={6}><Statistic title="HOLD" value={localeNumber(result.holdAmountB)} suffix={localeNumber(result.startAmountB / result.endPrice) + " A"} /></Col>

				<Col span={6}><Statistic title="IL" value={
					result.startPrice > result.endPrice
						? localeNumber(result.holdAmountB - result.poolAmountA * result.endPrice)
						: localeNumber(result.holdAmountB - result.poolAmountB)
				} /></Col>
			</Row>
		</>
	);
}
