import { ClearOutlined } from "@ant-design/icons";
import { Row, Col, Button, Statistic, Form, Card } from "antd";
import { localeNumber } from "@/utils/number";
import { useEffect, useState } from "react";
import MyInputNumber from "@/components/MyInputNumber";

const defaultResult = {
	"HF": 0, // показатель здоровья
	"LPA": 0, // цена ликвидации по токену в депозите
	"LPB": 0, // цена ликвидации по токену в займе
	"LPAB": 0, // цена ликвидации по отношениею токенов
	"LPBA": 0, // цена ликвидации по отношениею токенов
}

export default function HF({ showDesc }) {
	const [form] = Form.useForm();
	const values = Form.useWatch([], form);
	const [result, setResult] = useState(defaultResult);

	const calc = () => {
		let HF = (values.amountA * values.priceA) * values.lth / (values.amountB * values.priceB);
		let LPA = values.priceA / HF;
		let LPB = values.priceB * HF;
		// для случаев когда на депозите, например, BTC, а в займе ETH
		let LPAB = values.priceA / values.priceB / HF;
		let LPBA = values.priceB / values.priceA * HF;

		setResult({ HF, LPA, LPB, LPAB, LPBA })
	}

	useEffect(() => {
		form.validateFields({ validateOnly: true })
			.then(() => calc())
			.catch(() => setResult([]))
	}, [form, values]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			<Card size={"small"} hidden={!showDesc}>
				<p>Простой калькулятор для расчёта показателя здоровья и цен ликвидации при взятии кредита в лендинг протоколах.</p>
			</Card>

			<Form form={form} autoComplete="off" requiredMark={false}>
				<Row gutter={[8, 8]}>
					<Col span={10}>
						<Form.Item label="Кол-во токенов A на депозите" name="amountA" rules={[{ required: true, message: "" }]}>
							<MyInputNumber placeholder="1" min={0} />
						</Form.Item>
					</Col>

					<Col span={10}>
						<Form.Item label="Цена токена A в долларах" name="priceA" rules={[{ required: true, message: "" }]}>
							<MyInputNumber placeholder="2500" min={0} />
						</Form.Item>
					</Col>

					<Col span={4}>
						<Form.Item label="LTH" name="lth" rules={[{ required: true, message: "" }]}>
							<MyInputNumber placeholder="0.8" min={0} max={1} />
						</Form.Item>
					</Col>

					<Col span={10}>
						<Form.Item label="Кол-во токенов B в займе" name="amountB" rules={[{ required: true, message: "" }]}>
							<MyInputNumber placeholder="1500" min={0} />
						</Form.Item>
					</Col>

					<Col span={10}>
						<Form.Item label="Цена токена B в долларах" name="priceB" rules={[{ required: true, message: "" }]}>
							<MyInputNumber placeholder="1" min={0} />
						</Form.Item>
					</Col>

					<Col span={4} style={{ textAlign: "end" }}>
						<Button icon={<ClearOutlined />} title="Очистить форму" onClick={() => form.resetFields()} />
					</Col>
				</Row>
			</Form>

			<Row gutter={[8, 0]} style={{ textAlign: "center" }}>
				<Col span={24}><Statistic title="Health Factor" value={localeNumber(result.HF)} /></Col>
				<Col span={12}><Statistic title="Цена ликвидации по А/B" value={localeNumber(result.LPAB)} /></Col>
				<Col span={12}><Statistic title="Цена ликвидации по B/A" value={localeNumber(result.LPBA)} /></Col>
				<Col span={12}><Statistic title="Цена ликвидации по токену А" value={localeNumber(result.LPA)} /></Col>
				<Col span={12}><Statistic title="Цена ликвидации по токену B" value={localeNumber(result.LPB)} /></Col>
			</Row>
		</>
	);
}