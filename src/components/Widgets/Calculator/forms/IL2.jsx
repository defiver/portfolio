import { ClearOutlined } from "@ant-design/icons";
import { Row, Col, Button, Form, Card, Statistic, Divider } from "antd";
import { localeNumber } from "@/utils/number";
import { useEffect, useState } from "react";
import MyInputNumber from "@/components/MyInputNumber";

const defaultResult = {
	"holdA": 0, // ликвидность в токенах A при HOLD
	"holdB": 0, // ликвидность в токенах A при HOLD
	"feesA": 0, // накопленные комиссии для токенов А
	"feesB": 0, // накопленные комиссии для токенов B
	"poolAmountA": 0, // ликвидность в токенах A в пуле с учётом комиссий
	"poolAmountB": 0, // ликвидность в токенах B в пуле с учётом комиссий
	"ILA": 0, // непостоянные потери в А
	"ILB": 0, // непостоянные потери в В
	"startPrice": 0,
	"endPrice": 0,
}

export default function IL2({ showDesc }) {
	const [form] = Form.useForm();
	const values = Form.useWatch([], form);
	const [result, setResult] = useState(defaultResult);

	const calc = () => {
		let startPrice = values.startPrice;
		let endPrice = values.endPrice;
		let amountA = values.amountA;
		let amountB = values.amountB;

		// кол-во токенов в пуле после изменения цены (x * y = k)
		let k = values.amountA * values.amountB;
		let poolAmountA = Math.sqrt(k / endPrice);
		let poolAmountB = Math.sqrt(k * endPrice);

		// заработанные комиссионные
		let feesA = ((amountA + poolAmountA) / 2) * values.apr / 100 * values.days / 365;
		let feesB = ((amountB + poolAmountB) / 2) * values.apr / 100 * values.days / 365;

		let holdA = amountA * 2;
		let holdB = amountB * 2;

		let ILA = holdA - (poolAmountA * 2) + feesA + feesB / endPrice;
		let ILB = holdB - (poolAmountB * 2) + feesA * endPrice + feesB;

		setResult({ holdA, holdB, feesA, feesB, poolAmountA, poolAmountB, ILA, ILB, startPrice, endPrice })
	}

	useEffect(() => {
		form.validateFields({ validateOnly: true })
			.then(() => calc())
			.catch(() => setResult(defaultResult))
	}, [form, values]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			<Card size={"small"} hidden={!showDesc}>
				<p>Сравнение стратегии HODL с внесением активов в v2 пулы. Можно указать доходность позиции и её продолжительность для приблизительного учёта комиссионных.<br /></p>
			</Card>

			<Form form={form} autoComplete="off" requiredMark={false}>
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
							<MyInputNumber placeholder="USDC (1000)" min={0} />
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
				<Col span={24}><Divider plain>Пул c учётом комиссий</Divider></Col>

				<Col span={6}><Statistic title="Токенов А" value={localeNumber(result.poolAmountA + result.feesA)} suffix={localeNumber(result.poolAmountA) + " + " + localeNumber(result.feesA)} /></Col>

				<Col span={6}><Statistic title="Токенов B" value={localeNumber(result.poolAmountB + result.feesB)} suffix={localeNumber(result.poolAmountB) + " + " + localeNumber(result.feesB)} /></Col>

				<Col span={6}><Statistic title="Всего в А" value={localeNumber((result.poolAmountA * 2) + result.feesA + result.feesB / result.endPrice)} suffix={localeNumber(result.poolAmountA * 2) + " + " + localeNumber(result.feesA + result.feesB / result.endPrice)} /></Col>

				<Col span={6}><Statistic title="Всего в B" value={localeNumber((result.poolAmountB * 2) + result.feesB * result.endPrice + result.feesB)} suffix={localeNumber(result.poolAmountB * 2) + " + " + localeNumber(result.feesA * result.endPrice + result.feesB)} /></Col>

				<Col span={24}><Divider plain>Непостоянные потери</Divider></Col>

				<Col span={6}><Statistic title="HOLD в А" value={localeNumber(result.holdA)} suffix={localeNumber(result.endPrice * result.holdA) + " B"} /></Col>

				<Col span={6}><Statistic title="HOLD в B" value={localeNumber(result.holdB)} suffix={localeNumber(result.holdB / result.endPrice) + " A"} /></Col>

				<Col span={6}><Statistic title="IL в A" value={localeNumber(result.ILA)} /></Col>

				<Col span={6}><Statistic title="IL в B" value={localeNumber(result.ILB)} /></Col>
			</Row>
		</>
	);
}
