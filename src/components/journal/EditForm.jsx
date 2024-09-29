import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import { Form, Button, DatePicker, Row, Col, Flex, Input, Space, Segmented, Select, InputNumber } from "antd";
import { useLoading } from "@/hooks/useLoading";
import { useLiveQuery } from "dexie-react-hooks";
import { useRecoilState, useRecoilValue } from "recoil";
import { idState, allTagsState, allChainsState } from "./store";
import SubmitButton from "@/components/SubmitButton";
import locale from "antd/es/date-picker/locale/ru_RU";
import dayjs from "dayjs";

export default function EditForm({ db, position = { id: 0, status: "active", daterange: [dayjs()] } }) {
  const [form] = Form.useForm();
  // сортируем токены по их $ стоимости
  const tokens = [...useLiveQuery(() => db.tokens.toArray(), [], [])].sort((a, b) =>
    (a.amount * a.quote) > (b.amount * b.quote)
  ).reverse();

  const [, setId] = useRecoilState(idState); // устанавливает position id в форму редактирования
  const tags = useRecoilValue(allTagsState);
  const chains = useRecoilValue(allChainsState);

  const closeForm = () => {
    form.resetFields();
    setId(null);
  };

  const [editPosition, isEditPositionLoading] = useLoading(async () => {
    let values = form.getFieldValue();
    let { id } = values;

    // проверяем, создаётся ли новая позиция или редактируется уже имеющаяся
    if (id > 0) {
      await db.journal.put(values);
    } else {
      delete values.id;
      await db.journal.add(values);
    }

    closeForm();
  }, false);

  // для выбора нескольких токенов в позицию
  const tokensSelector = (name) => (
    <Form.Item name={[name, "token"]} noStyle>
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
          <Input.TextArea placeholder={"Note"} autoSize={{ minRows: 1, maxRows: 10 }} />
        </Form.Item>

        <Form.Item name="transactions">
          <Input.TextArea
            placeholder={"Transactions"}
            autoSize={{ minRows: 1, maxRows: 10 }}
            style={{ whiteSpace: "pre", overflowX: "hidden" }}
          />
        </Form.Item>

        <Form.Item name="links">
          <Input.TextArea
            placeholder={"Links"}
            autoSize={{ minRows: 1, maxRows: 10 }}
            style={{ whiteSpace: "pre", overflowX: "hidden" }}
          />
        </Form.Item>

        <Flex gap={8}>
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
              showTime
              format="DD.MM.YYYY HH:mm:ss"
            />
          </Form.Item>

          <Form.Item name="tags">
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Tags"
              options={tags.map((i) => new Object({ label: i, value: i }))}
            />
          </Form.Item>
        </Flex>

        <Row gutter={[8, 8]}>
          <Col span={12}>
            <Form.Item>
              <Form.List name="tokens">
                {(subFields, subOpt) => (
                  <Flex vertical={true} >
                    {subFields.map((subField) => (
                      <Space key={subField.key}>
                        <Form.Item name={[subField.name, "amount"]}>
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

          <Col span={12}>
            <Row gutter={[8, 8]}>
              <Col span={12}>
                <Form.Item name="chain">
                  <Select
                    mode="tags"
                    style={{ width: "100%" }}
                    placeholder="Chain"
                    options={chains.map((i) => new Object({ label: i, value: i }))}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="income">
                  <InputNumber placeholder="Income ($)" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[8, 8]}>
              <Col span={18}>
                <Form.Item name="status">
                  <Segmented options={["active", "completed"]} block />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item>
                  <Flex gap={8} justify="end">
                    <Button icon={<CloseOutlined />} onClick={closeForm} />

                    <SubmitButton icon={<CheckOutlined />} form={form} loading={isEditPositionLoading} />
                  </Flex>
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
      </Flex>
    </Form >
  );
}
