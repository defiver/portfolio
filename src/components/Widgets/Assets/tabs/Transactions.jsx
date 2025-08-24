import { CheckOutlined } from "@ant-design/icons";
import { Form, Flex, Select, Row, Col, DatePicker } from "antd";
import { useLoading } from "@/hooks/useLoading";
import { useState } from "react";
import SubmitButton from "@/components/SubmitButton";
import MyInputNumber from "@/components/MyInputNumber";
import TransTable from "../components/TransTable";
import locale from 'antd/es/date-picker/locale/ru_RU';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

dayjs.locale('ru', { weekStart: 1 });

export default function Transactions({ db, transactions, tokens }) {
	const [form] = Form.useForm();
	const [options, setOptions] = useState([]);

	const [addTransaction, isAddTransactionLoading] = useLoading(async () => {
		let values = form.getFieldValue();
		let { date } = values;
		await db.assets.add({ ...values, date: new Date(date) });
		form.resetFields();
	}, false);

	// токенов много, поэтому выводим только 10 подходящих
	const handleSearch = (value) => {
		value = value.toLowerCase()
		let search = Object.values(tokens).filter(o => o.symbol && (o.name.toLowerCase().includes(value) || o.symbol.toLowerCase().includes(value)));
		setOptions(search.slice(0, 10));
	};

	return (
		<Flex vertical gap={32}>
			<Form form={form} onFinish={addTransaction} className="edit-form" autoComplete="off">
				<Row gutter={[8, 8]}>
					<Col span={5}>
						<Form.Item label="Дата покупки" name="date" rules={[{ required: true, message: '' }]}>
							<DatePicker
								placeholder="20.12.2021"
								showNow
								allowClear
								style={{ width: "100%" }}
								locale={locale}
								format="DD.MM.YYYY"
							/>
						</Form.Item>
					</Col>

					<Col span={7}>
						<Form.Item label="Токен" name="token" rules={[{ required: true, message: '' }]}>
							<Select
								showSearch
								allowClear
								placeholder={"BTC"}
								filterOption={false}
								onSearch={handleSearch}
								suffixIcon={null}
								notFoundContent={null}
								options={options.map(o => ({ value: o.symbol, label: `${o.name} (${o.symbol})` }))}
							/>
						</Form.Item>
					</Col>

					<Col span={5}>
						<Form.Item label="Кол-во" name="amount" rules={[{ required: true, message: '' }]}>
							<MyInputNumber placeholder="10 или -2" />
						</Form.Item>
					</Col>

					<Col span={5}>
						<Form.Item label="Цена за токен" name="price" rules={[{ required: true, message: '' }]}>
							<MyInputNumber placeholder="4500" min={0} />
						</Form.Item>
					</Col>

					<Col span={2} style={{ textAlign: "end" }}>
						<Form.Item>
							<SubmitButton icon={<CheckOutlined />} form={form} loading={isAddTransactionLoading} />
						</Form.Item>
					</Col>
				</Row>
			</Form>

			<TransTable db={db} transactions={transactions} />
		</Flex>
	);
}
