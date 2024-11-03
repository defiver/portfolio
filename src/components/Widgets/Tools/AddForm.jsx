import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import { Form, Button, Row, Col, Input, Flex, Select } from "antd";
import { useLoading } from "@/hooks/useLoading";
import SubmitButton from "@/components/SubmitButton";

export default function EditForm({ setAdd, db }) {
	const [form] = Form.useForm();

	const closeForm = () => {
		form.resetFields();
		setAdd(false);
	};

	const [addTool, isAddToolLoading] = useLoading(async () => {
		let values = form.getFieldValue();
		values.favorite = false;
		values.links = values.links.map(o => o.link);
		await db.tools.add(values);
		closeForm();
	}, false);

	return (
		<Form form={form} onFinish={addTool} className="edit-form" autoComplete="off">
			<Row gutter={8}>
				<Col span={8}>
					<Form.Item name="name" rules={[{ required: true, message: '' }]}>
						<Input placeholder="Name" />
					</Form.Item>
				</Col>

				<Col span={16}>
					<Form.Item name="description">
						<Input placeholder="Description" />
					</Form.Item>
				</Col>

				<Col span={12}>
					<Form.Item name="categories">
						<Select
							mode="tags"
							placeholder="Categories"
							// disabled={isOppLoading}
							// defaultValue={showFresh ? "fresh" : "all"}
							// onChange={() => setshowFresh(!showFresh)}
							style={{ width: "100%" }}
						// options={categories.map(i => { return { value: i, label: i } })}
						/>
					</Form.Item>
				</Col>

				<Col span={12}>
					<Form.Item name="chains">
						<Select
							mode="tags"
							placeholder="Chains"
							// disabled={isOppLoading}
							// defaultValue={showFresh ? "fresh" : "all"}
							// onChange={() => setshowFresh(!showFresh)}
							style={{ width: "100%" }}
						// options={categories.map(i => { return { value: i, label: i } })}
						/>
					</Form.Item>
				</Col>

				<Col span={24}>
					<Form.Item name="icon">
						<Input placeholder="SVG" />
					</Form.Item>
				</Col>

				<Col span={20}>
					<Form.Item>
						<Form.List name="links">
							{(subFields, subOpt) => (
								<Flex vertical={true}>
									{subFields.map((subField) => (
										<Flex key={subField.key} gap={8}>
											<Form.Item name={[subField.name, "link"]}>
												<Input placeholder="https://app.aave.com/" style={{ width: "100%" }} />
											</Form.Item>
											<CloseOutlined onClick={() => subOpt.remove(subField.name)} />
										</Flex>
									))}
									<Button type="dashed" onClick={() => subOpt.add()}>Add link</Button>
								</Flex>
							)}
						</Form.List>
					</Form.Item>
				</Col>

				<Col span={4}>
					<Form.Item>
						<Flex gap={8} justify="end">
							<Button icon={<CloseOutlined />} onClick={closeForm} />

							<SubmitButton icon={<CheckOutlined />} form={form} loading={isAddToolLoading} />
						</Flex>
					</Form.Item>
				</Col>
			</Row>
		</Form >
	);
}
