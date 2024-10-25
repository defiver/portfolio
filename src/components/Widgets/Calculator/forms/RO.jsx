import { ClearOutlined } from "@ant-design/icons";
import { Row, Col, Button, Divider, Form, Card, Statistic } from "antd";
import { localeNumber } from "@/utils/number";
import { useEffect, useState } from "react";
import MyInputNumber from "@/components/MyInputNumber";

const defaultResult = {
	"avgDownPriceA": 0, // средняя цена покупки токена А при выходе цены из нижней границы
	"avgUpPriceB": 0, // средняя цена покупки токена B при выходе цены из верхней границы
	"downAmountA": 0, // кол-во токенов А при выходе цены из нижней границы
	"upAmountB": 0, // кол-во токенов В при выходе цены из верхней границы
	"avgDownPriceAB": 0, // средняя цена покупки токена А с учётом изначального кол-ва токенов
	"avgUpPriceBA": 0, // средняя цена покупки токена B с учётом изначального кол-ва токенов
}

export default function RO({ showDesc }) {
	const [form] = Form.useForm();
	const values = Form.useWatch([], form);
	const [result, setResult] = useState(defaultResult);

	const calc = () => {
		let avgDownPriceA = (values.rangeDown + values.price) / 2;
		let avgUpPriceB = (values.rangeUp + values.price) / 2;

		let downAmountA = values.amountA + values.amountB / avgDownPriceA;
		let upAmountB = values.amountB + values.amountA * avgUpPriceB;

		// расчёт средней цены покупки/продажи с учётом начальной ликвидности
		let avgDownPriceAB = (values.amountA * values.price + (downAmountA - values.amountA) * avgDownPriceA) / downAmountA;
		let avgUpPriceBA = (values.amountB * values.price + (upAmountB - values.amountB) * avgUpPriceB) / upAmountB;

		setResult({ avgDownPriceA, avgUpPriceB, downAmountA, upAmountB, avgDownPriceAB, avgUpPriceBA })
	}

	useEffect(() => {
		form.validateFields({ validateOnly: true })
			.then(() => calc())
			.catch(() => setResult(defaultResult))
	}, [form, values]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			<Card size={"small"} hidden={!showDesc}>
				<p>Расчёт средней цены покупки/продажи токенов при выходе цены за границы диапазона. Средняя цена считается как для случая переливания одного токена в другой, так и с учётом изначально имеющихся активов.</p>
			</Card>

			<Form form={form} autoComplete="off" requiredMark={false}>
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

					<Col span={8} style={{ textAlign: "end" }}>
						<Button icon={<ClearOutlined />} title="Очистить форму" onClick={() => form.resetFields()} />
					</Col>
				</Row>
			</Form>

			<Row gutter={[8, 0]}>
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
