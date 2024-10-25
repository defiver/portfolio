import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import { Form, Button, Row, Col, Flex, Select } from "antd";
import { useLoading } from "@/hooks/useLoading";
import { useState } from "react";
import SubmitButton from "@/components/SubmitButton";
import coins from './coins.json';

export default function AddForm({ db, setShowAddForm }) {
  const [form] = Form.useForm();
  const [options, setOptions] = useState([]);

  const closeForm = () => {
    form.resetFields();
    setShowAddForm(false);
  };

  const [addPair, isAddPairLoading] = useLoading(async () => {
    let values = form.getFieldValue();
    let { coin, currency } = values;
    values.pair = `${coin}/${currency}`;
    values.period = 2592000; // котировки за последние 30 дней
    await db.pairs.add(values);
    closeForm();
  }, false);

  // токенов много, поэтому выводим только 10 подходящих
  const handleSearch = (value) => {
    value = value.toLowerCase()
    let search = coins.filter(o => o.name.toLowerCase().includes(value) || o.code.toLowerCase().includes(value));
    setOptions(search.slice(0, 10));
  };

  return (
    <Form form={form} onFinish={addPair} className="add-form" autoComplete="off">
      <Row gutter={[8, 8]}>
        <Col span={10}>
          <Form.Item name="coin" rules={[{ required: true, message: '' }]}>
            <Select
              showSearch
              allowClear
              placeholder={"BTC"}
              filterOption={false}
              onSearch={handleSearch}
              suffixIcon={null}
              notFoundContent={null}
              options={options.map(o => ({ value: o.code, label: o.name }))}
            />
          </Form.Item>
        </Col>

        <Col span={10}>
          <Form.Item name="currency" rules={[{ required: true, message: '' }]}>
            <Select
              showSearch
              allowClear
              placeholder={"ETH"}
              filterOption={false}
              onSearch={handleSearch}
              suffixIcon={null}
              notFoundContent={null}
              options={options.map(o => ({ value: o.code, label: o.name }))}
            />
          </Form.Item>
        </Col>

        <Col span={4}>
          <Form.Item>
            <Flex gap={8} justify="end">
              <Button icon={<CloseOutlined />} onClick={closeForm} title="Отмена" />

              <SubmitButton icon={<CheckOutlined />} form={form} loading={isAddPairLoading} />
            </Flex>
          </Form.Item>
        </Col>
      </Row>
    </Form >
  );
}
