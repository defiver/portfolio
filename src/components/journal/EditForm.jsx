import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import { Form, Button, DatePicker, Row, Col, Flex, Input, Space, Segmented, Select, InputNumber } from "antd";
import { useDB } from "@/hooks/useDB";
import { useLiveQuery } from "dexie-react-hooks";
import { useRecoilState, useRecoilValue } from "recoil";
import { idState, allTagsState, allChainsState } from "./store";
import SubmitButton from "@/components/SubmitButton";
import locale from "antd/es/date-picker/locale/ru_RU";
import dayjs from "dayjs";

export default function EditForm({ db, position = { id: 0, status: "active" } }) {
  const [form] = Form.useForm();
  const tokens = useLiveQuery(() => db.tokens.toArray(), [], []);
  const [, setId] = useRecoilState(idState);
  const tags = useRecoilValue(allTagsState);
  const chains = useRecoilValue(allChainsState);

  const closeForm = () => {
    form.resetFields();
    setId(null);
  };

  const [editPosition, isEditPositionLoading] = useDB(async () => {
    let values = form.getFieldValue();
    let { id } = values;

    if (id > 0) {
      await db.journal.put(values);
    } else {
      delete values.id;
      await db.journal.add(values);
    }

    closeForm();
  }, false);

  const tokensSelector = (name) => (
    <Form.Item name={[name, "token"]} noStyle rules={[{ required: true, message: '' }]}>
      <Select style={{ width: 100 }}>
        {tokens.map(o => <Select.Option key={o.token} value={o.token}>{o.token}</Select.Option>)}
      </Select>
    </Form.Item>
  );

  return (
    <Form
      form={form}
      onFinish={editPosition}
      className="edit-form"
      initialValues={position}
      autoComplete="off"
    >
      <Flex vertical={true} gap={4}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="text">
          <Input.TextArea autoSize={{ minRows: 3, maxRows: 10 }} />
        </Form.Item>
        <Row gutter={[8, 8]}>
          <Col span={10}>
            <Form.Item
              name="daterange"
              getValueProps={(value) => ({
                value: [value && value[0] && dayjs(value[0].$d), value && value[1] && dayjs(value[1].$d)]
              })}
            >
              <DatePicker.RangePicker
                allowClear
                locale={locale}
                style={{ width: "100%" }}
                allowEmpty={[true, true]}
                needConfirm={false}
                showNow
              />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item name="transaction">
              <Input placeholder="Transaction link" />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item name="link">
              <Input placeholder="Position link" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[8, 8]}>
          <Col span={10}>
            <Form.Item name="tags">
              <Select
                mode="tags"
                style={{ width: "100%" }}
                placeholder="Tags"
                options={tags.map((i) => new Object({ label: i, value: i }))}
              />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item name="chain">
              <Select
                mode="tags"
                style={{ width: "100%" }}
                placeholder="Chain"
                options={chains.map((i) => new Object({ label: i, value: i }))}
              />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item name="income">
              <InputNumber placeholder="Income ($)" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[8, 8]}>
          <Col span={10}>
            <Form.Item>
              <Form.List name="tokens" rules={[{ required: true, message: '' }]}>
                {(subFields, subOpt) => (
                  <Flex vertical={true} gap={8}>
                    {subFields.map((subField) => (
                      <Space key={subField.key}>
                        <Form.Item
                          name={[subField.name, "amount"]}
                          rules={[{ required: true, message: '' }]}
                        >
                          <InputNumber
                            placeholder={"1000"}
                            addonAfter={tokensSelector(subField.name)}
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                        <CloseOutlined
                          style={{ verticalAlign: 0 }}
                          onClick={() => subOpt.remove(subField.name)}
                        />
                      </Space>
                    ))}
                    <Button type="dashed" onClick={() => subOpt.add()}>Add token</Button>
                  </Flex>
                )}
              </Form.List>
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item name="status">
              <Segmented options={["active", "completed"]} block />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item>
              <Flex gap={8} justify="end">
                <Button ghost danger type="primary" icon={<CloseOutlined />} onClick={closeForm} />

                <SubmitButton ghost icon={<CheckOutlined />} form={form} loading={isEditPositionLoading} />
              </Flex>
            </Form.Item>
          </Col>
        </Row>
      </Flex>
    </Form >
  );
}
