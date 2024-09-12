import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import { Form, Button, Row, Col, Input, Flex, Select, InputNumber } from "antd";
import { useLoading } from "@/hooks/useLoading";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { formAddressState } from "./store";
import { getDecimals } from './helper';
import SubmitButton from "@/components/SubmitButton";

const chains = [
  { "name": "Arbitrum", "chain": "arb" },
  { "name": "Avalanche", "chain": "avax" },
  { "name": "Base", "chain": "base" },
  { "name": "Blast", "chain": "blast" },
  { "name": "Ethereum", "chain": "eth" },
  { "name": "Mantle", "chain": "mantle" },
  { "name": "Mode", "chain": "mode" },
  { "name": "Optimism", "chain": "opt" },
  { "name": "Scroll", "chain": "scroll" },
  { "name": "zkSync", "chain": "zksync" },
];

export default function EditForm({ db, pool }) {
  const [form] = Form.useForm();
  const [, setFormAddress] = useRecoilState(formAddressState);

  const closeForm = () => {
    form.resetFields();
    setFormAddress(null);
  };

  const [addNote, isAddNoteLoading] = useLoading(async () => {
    let values = form.getFieldValue();
    let { range1, range2 } = values;
    values.range = [range1 || 0, range2 || 10 ** 9];

    if (pool) {
      await db.pools.put(values);
    } else {
      values.inRange = true;
      values.decimals = await getDecimals(values.address, values.chain);
      await db.pools.add(values);
    }
    closeForm();
  }, false);

  useEffect(() => {
    form.setFieldsValue(pool);
  }, [pool, form]);

  return (
    <Form form={form} onFinish={addNote} className="edit-form" autoComplete="off">
      <Row gutter={[8, 8]}>
        <Col span={8}>
          <Form.Item name="address" rules={[{ required: true, message: '' }]}>
            <Input placeholder="Address (0x123...)" />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item name="range1">
            <InputNumber placeholder="Lower range (0)" />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item name="range2">
            <InputNumber placeholder="Upper range (2500)" />
          </Form.Item>
        </Col>

        <Col span={10}>
          <Form.Item name="name" rules={[{ required: true, message: '' }]}>
            <Input placeholder="Name (Uni ETH/DAI Arb)" />
          </Form.Item>
        </Col>

        <Col span={10}>
          <Form.Item name="chain" rules={[{ required: true, message: '' }]}>
            <Select
              placeholder="Chain"
              style={{ width: "100%" }}
              options={chains.map(o => { return { value: o.chain, label: o.name } })}
            />
          </Form.Item>
        </Col>

        <Col span={4}>
          <Form.Item>
            <Flex gap={8} justify="end">
              <Button icon={<CloseOutlined />} onClick={closeForm} />

              <SubmitButton icon={<CheckOutlined />} form={form} loading={isAddNoteLoading} />
            </Flex>
          </Form.Item>
        </Col>
      </Row>
    </Form >
  );
}
