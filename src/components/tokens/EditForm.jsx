import { CloseOutlined, CheckOutlined, MinusOutlined } from "@ant-design/icons";
import { Form, Button, InputNumber, Space, Input, Flex, Popconfirm } from "antd";
import { useLoading } from "@/hooks/useLoading";
import SubmitButton from "@/components/SubmitButton";

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
					<InputNumber
						placeholder="100"
						onChange={(v) => form.setFieldsValue({ amount: token.amount + v })}
					/>
				</Form.Item>

				<Form.Item name="amount" rules={[{ required: true, message: '' }]}>
					<Input />
				</Form.Item>

				<Form.Item name="token" hidden rules={[{ required: true, message: '' }]}>
					<Input />
				</Form.Item>

				<Form.Item>
					<Flex gap={8} justify="end">
						<SubmitButton ghost icon={<CheckOutlined />} form={form} loading={isEditTokenLoading} />

						<Popconfirm title="Delete the token?" onConfirm={deleteToken} okText="Yes" cancelText="No">
							<Button loading={isDeleteTokenLoading} icon={<MinusOutlined />} style={{ color: "red" }} />
						</Popconfirm>

						<Button icon={<CloseOutlined />} onClick={closeForm} />
					</Flex>
				</Form.Item>
			</Space>
		</Form >
	);
}
