import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import { Form, Button, Space, Input, Flex } from "antd";
import { useLoading } from "@/hooks/useLoading";
import SubmitButton from "@/components/SubmitButton";
import MyInputNumber from "@/components/MyInputNumber";

export default function AddForm({ setAdd, db }) {
  const [form] = Form.useForm();

  const closeForm = () => {
    form.resetFields();
    setAdd(false);
  };

  const [addToken, isAddTokenLoading] = useLoading(async () => {
    await db.tokens.add(form.getFieldValue());
    closeForm();
  }, false);

  return (
    <Form form={form} onFinish={addToken} className="edit-form" autoComplete="off">
      <Space gap={8}>
        <Form.Item name="token" rules={[{ required: true, message: '' }]}>
          <Input placeholder="Тикер (ETH)" />
        </Form.Item>

        <Form.Item name="amount" rules={[{ required: true, message: '' }]}>
          <MyInputNumber placeholder="Кол-во (1000)" />
        </Form.Item>

        <Form.Item>
          <Flex gap={8} justify="end">
            <Button icon={<CloseOutlined />} onClick={closeForm} title="Отмена" />

            <SubmitButton icon={<CheckOutlined />} form={form} loading={isAddTokenLoading} />
          </Flex>
        </Form.Item>
      </Space>
    </Form >
  );
}
