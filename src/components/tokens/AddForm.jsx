import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import { Form, Button, InputNumber, Space, Input, Flex } from "antd";
import { useDB } from "@/hooks/useDB";
import SubmitButton from "@/components/SubmitButton";

export default function EditForm({ setAdd, db }) {
  const [form] = Form.useForm();

  const closeForm = () => {
    form.resetFields();
    setAdd(false);
  };

  const [addNote, isAddNoteLoading] = useDB(async () => {
    await db.tokens.add(form.getFieldValue());
    closeForm();
  }, false);

  return (
    <Form form={form} onFinish={addNote} className="edit-form" autoComplete="off">
      <Space gap={8}>
        <Form.Item name="token" rules={[{ required: true, message: '' }]}>
          <Input placeholder="ETH" />
        </Form.Item>

        <Form.Item name="amount" rules={[{ required: true, message: '' }]}>
          <InputNumber placeholder="100" />
        </Form.Item>

        <Form.Item>
          <Flex gap={8} justify="end">
            <Button ghost danger type="primary" icon={<CloseOutlined />} onClick={closeForm} />

            <SubmitButton ghost icon={<CheckOutlined />} form={form} loading={isAddNoteLoading} />
          </Flex>
        </Form.Item>
      </Space>
    </Form >
  );
}
