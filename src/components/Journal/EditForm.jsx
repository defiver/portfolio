import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import { Form, Button, DatePicker, Row, Col, Flex, Input, Space, Segmented, Select } from "antd";
import { useLoading } from "@/hooks/useLoading";
import { useLiveQuery } from "dexie-react-hooks";
import { useRecoilState, useRecoilValue } from "recoil";
import { idState, allTagsState, allChainsState } from "./store";
import SubmitButton from "@/components/SubmitButton";
import MyInputNumber from "@/components/MyInputNumber";
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

    let { id, tokens, begindate, finishdate } = values;
    let daterange = [begindate, finishdate];
    tokens = tokens ? tokens.filter(o => o) : [];

    // проверяем, создаётся ли новая позиция или редактируется уже имеющаяся
    if (id > 0) {
      await db.journal.put({ ...values, tokens, daterange });
    } else {
      delete values.id;
      await db.journal.add({ ...values, tokens, daterange });
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
      initialValues={{
        ...position,
        begindate: position.daterange && position.daterange[0] && dayjs(position.daterange[0].$d) || null,
        finishdate: position.daterange && position.daterange[1] && dayjs(position.daterange[1].$d) || null,
      }}
      autoComplete="off"
    >
      <Flex vertical={true} gap={4}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item name="text">
          <Input.TextArea placeholder={"Описание"} autoSize={{ minRows: 1, maxRows: 10 }} />
        </Form.Item>

        <Form.Item name="transactions">
          <Input.TextArea
            placeholder={"Ссылки на транзакции"}
            autoSize={{ minRows: 1, maxRows: 10 }}
            style={{ whiteSpace: "pre", overflowX: "hidden" }}
          />
        </Form.Item>

        <Form.Item name="links">
          <Input.TextArea
            placeholder={"Ссылка на пул"}
            autoSize={{ minRows: 1, maxRows: 10 }}
            style={{ whiteSpace: "pre", overflowX: "hidden" }}
          />
        </Form.Item>

        <Row gutter={[8, 8]}>
          <Col span={7}>
            <Form.Item name="begindate">
              <DatePicker
                popupClassName="journal-datepicker"
                placeholder="Дата создания позиции"
                showNow
                allowClear
                style={{ width: "100%" }}
                locale={locale}
                showTime
                format="DD.MM.YYYY HH:mm:ss"
              />
            </Form.Item>
          </Col>

          <Col span={7}>
            <Form.Item name="finishdate">
              <DatePicker
                popupClassName="journal-datepicker"
                placeholder="Дата закрытия позиции"
                showNow
                allowClear
                style={{ width: "100%" }}
                locale={locale}
                showTime
                format="DD.MM.YYYY HH:mm:ss"
              />
            </Form.Item>
          </Col>

          <Col span={10}>
            <Form.Item name="tags">
              <Select
                mode="tags"
                placeholder="Теги"
                options={tags.map((i) => new Object({ label: i, value: i }))}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[8, 8]}>
          <Col span={12}>
            <Form.Item>
              <Form.List name="tokens">
                {(subFields, subOpt) => (
                  <Flex vertical={true} >
                    {subFields.map((subField) => (
                      <Space key={subField.key}>
                        <Form.Item name={[subField.name, "amount"]}>
                          <MyInputNumber
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
                    <Button type="dashed" onClick={() => subOpt.add()}>Добавить токен</Button>
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
                    placeholder="Сеть"
                    options={chains.map((i) => new Object({ label: i, value: i }))}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="income">
                  <MyInputNumber placeholder="Доход в долларах" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[8, 8]}>
              <Col span={18}>
                <Form.Item name="status">
                  <Segmented options={[{ value: 'active', label: "Активная" }, { value: 'completed', label: "Завершённая" }]} block />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item>
                  <Flex gap={8} justify="end">
                    <Button icon={<CloseOutlined />} onClick={closeForm} title="Отмена" />

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
