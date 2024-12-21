import { ClearOutlined } from "@ant-design/icons";
import { Row, Col, Button, Form, Card, Statistic, Divider } from "antd";
import { localeNumber } from "@/utils/number";
import { useEffect, useState } from "react";
import MyInputNumber from "@/components/MyInputNumber";

const defaultResult = {
	"amountA": 0, // ликвидность в токенах A
	"amountB": 0, // ликвидность в токенах B
	"holdA": 0, // ликвидность в токенах A при HOLD
	"holdB": 0, // ликвидность в токенах A при HOLD
	"feesA": 0, // накопленные комиссии для токенов А
	"feesB": 0, // накопленные комиссии для токенов B
	"poolA": 0, // ликвидность в токенах A в пуле с учётом комиссий
	"poolB": 0, // ликвидность в токенах B в пуле с учётом комиссий
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

		let holdA = amountA * 2;
		let holdB = amountB * 2;

		let feesA = amountA * values.apr / 200 * values.days / 365;
		let feesB = amountB * values.apr / 200 * values.days / 365;

		let poolA = amountA + feesA + (amountB + feesB) / endPrice;
		let poolB = amountB + feesB + (amountA + feesA) * endPrice;

		let ILA = holdA - poolA;
		let ILB = holdB - poolB;

		setResult({ amountA, amountB, holdA, holdB, feesA, feesB, poolA, poolB, ILA, ILB, startPrice, endPrice })
	}

	useEffect(() => {
		if (values?.amountA > 0 && values?.startPrice > 0) {
			form.setFieldsValue({ amountB: values.amountA * values.startPrice })
		}


		form.validateFields({ validateOnly: true })
			.then(() => calc())
			.catch(() => setResult(defaultResult))
	}, [form, values]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			<Card size={"small"} hidden={!showDesc}>
				<p>Сравнение стратегии HODL с внесением активов в v2 пулы, когда кол-во токенов в позиции остаётся постоянным вне зависимости от изменения цены. Можно указать доходность позиции и её продолжительность для приблезительного учёта комиссионных.<br /></p>
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
							<MyInputNumber disabled />
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

				<Col span={6}><Statistic title="Токенов А" value={localeNumber(result.amountA + result.feesA)} suffix={localeNumber(result.amountA) + " + " + localeNumber(result.feesA)} /></Col>

				<Col span={6}><Statistic title="Токенов B" value={localeNumber(result.amountB + result.feesB)} suffix={localeNumber(result.amountB) + " + " + localeNumber(result.feesB)} /></Col>

				<Col span={6}><Statistic title="Всего в А" value={localeNumber(result.poolA)} suffix={localeNumber(result.amountA + result.feesA) + " + " + localeNumber((result.amountB + result.feesB) / result.endPrice)} /></Col>

				<Col span={6}><Statistic title="Всего в B" value={localeNumber(result.poolB)} suffix={localeNumber(result.amountB + result.feesB) + " + " + localeNumber((result.amountA + result.feesA) * result.endPrice)} /></Col>

				<Col span={24}><Divider plain>Непостоянные потери</Divider></Col>

				<Col span={6}><Statistic title="HOLD в А" value={localeNumber(result.holdA)} suffix={localeNumber(result.endPrice * result.holdA) + " B"} /></Col>

				<Col span={6}><Statistic title="HOLD в B" value={localeNumber(result.holdB)} suffix={localeNumber(result.holdB / result.endPrice) + " A"} /></Col>

				<Col span={6}><Statistic title="IL в A" value={localeNumber(result.ILA)} /></Col>

				<Col span={6}><Statistic title="IL в B" value={localeNumber(result.ILB)} /></Col>
			</Row>
		</>
	);
}
