import { CloseOutlined, CheckOutlined, MinusOutlined } from "@ant-design/icons";
import { Form, Button, Space, Input, Flex, Popconfirm } from "antd";
import { useLoading } from "@/hooks/useLoading";
import SubmitButton from "@/components/SubmitButton";
import MyInputNumber from "@/components/MyInputNumber";

export default function EditForm({ token, setToken, db }) {
	const [form] = Form.useForm();

	const closeForm = () => {
		form.resetFields();
		setToken(null);
	};

	const [deleteToken, isDeleteTokenLoading] = useLoading(async () => {
		await db.tokens.delete(token.token);
		closeForm();
	}, false);

	const [editTonen, isEditTokenLoading] = useLoading(async () => {
		await db.tokens.put(form.getFieldValue());
		closeForm();
	}, false);

	return (
		<Form
			form={form}
			onFinish={editTonen}
			autoComplete="off"
			initialValues={token}
			style={{ maxHeight: 23 }}
		>
			<Space>
				<Form.Item>
					<MyInputNumber
						placeholder="Прибавить (100)"
						onChange={(v) => form.setFieldsValue({ amount: Number(token.amount) + Number(v) })}
					/>
				</Form.Item>

				<Form.Item name="amount" rules={[{ required: true, message: '' }]}>
					<MyInputNumber placeholder="Кол-во токенов" />
				</Form.Item>

				<Form.Item name="token" hidden rules={[{ required: true, message: '' }]}>
					<Input />
				</Form.Item>

				<Form.Item>
					<Flex gap={8} justify="end">
						<SubmitButton ghost icon={<CheckOutlined />} form={form} loading={isEditTokenLoading} />

						<Popconfirm title="Удалить токена?" onConfirm={deleteToken} okText="Да" cancelText="Нет">
							<Button loading={isDeleteTokenLoading} icon={<MinusOutlined />} className="warning" title="Удалить" />
						</Popconfirm>

						<Button icon={<CloseOutlined />} onClick={closeForm} title="Отмена" />
					</Flex>
				</Form.Item>
			</Space>
		</Form >
	);
}
