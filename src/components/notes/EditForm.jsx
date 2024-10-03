import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import { Form, Button, DatePicker, Row, Col, Flex, Input, } from "antd";
import { useLoading } from "@/hooks/useLoading";
import SubmitButton from "@/components/SubmitButton";
import locale from "antd/es/date-picker/locale/ru_RU";
import dayjs from 'dayjs';

export default function EditForm({ setId, db, note = {} }) {
  const [form] = Form.useForm();

  const closeForm = () => {
    form.resetFields();
    setId(null);
  };

  const [editNote, isEditNoteLoading] = useLoading(async () => {
    let values = form.getFieldValue();
    let { id } = form.getFieldValue();

    // проверяем, создаётся ли новая позиция или редактируется уже имеющаяся
    if (id > 0) {
      await db.notes.put(values);
    } else {
      delete values.id;
      await db.notes.add(values);
    }

    closeForm();
  }, false);

  return (
    <Form form={form} onFinish={editNote} className="edit-form" initialValues={note} autoComplete="off">
      <Flex vertical={true} gap={8}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item name="text" rules={[{ required: true, message: '' }]}>
          <Input.TextArea autoSize={{ minRows: 3, maxRows: 10 }} />
        </Form.Item>

        <Row gutter={[8, 8]} justify="space-between">
          <Col xs={{ span: 16 }} lg={{ span: 16 }}>
            <Form.Item name="finish" getValueProps={(value) => ({ value: value && dayjs(value.$d) })}>
              <DatePicker
                showNow
                allowClear
                style={{ width: "100%" }}
                locale={locale}
                showTime
                format="DD.MM.YYYY HH:mm:ss"
              />
            </Form.Item>
          </Col>

          <Col xs={{ span: 8 }} lg={{ span: 8 }}>
            <Form.Item>
              <Flex gap={8} justify="end">
                <Button icon={<CloseOutlined />} onClick={closeForm} title="Cancel" />

                <SubmitButton icon={<CheckOutlined />} form={form} loading={isEditNoteLoading} />
              </Flex>
            </Form.Item>
          </Col>
        </Row>
      </Flex>
    </Form >
  );
}
