import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import { Form, Button, Row, Col, Input, Flex, Select } from "antd";
import { useLoading } from "@/hooks/useLoading";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { formAddressState } from "./store";
import { getDecimals } from './helper';
import SubmitButton from "@/components/SubmitButton";
import MyInputNumber from "@/components/MyInputNumber";

const chains = [
  { "name": "Arbitrum", "chain": "arb" },
  { "name": "Base", "chain": "base" },
  { "name": "Blast", "chain": "blast" },
  { "name": "Ethereum", "chain": "eth" },
  { "name": "Mantle", "chain": "mantle" },
  { "name": "Mode", "chain": "mode" },
  { "name": "Optimism", "chain": "opt" },
  { "name": "Polygon", "chain": "polygon" },
//  { "name": "Scroll", "chain": "scroll" },
//  { "name": "zkSync", "chain": "zksync" },
//  { "name": "Avalanche", "chain": "avax" },
];

export default function EditForm({ db, pool }) {
  const [form] = Form.useForm();
  const [, setFormAddress] = useRecoilState(formAddressState);

  const closeForm = () => {
    form.resetFields();
    setFormAddress(null);
  };

  const [addPool, isAddPoolLoading] = useLoading(async () => {
    let values = form.getFieldValue();
    let { range1, range2 } = values;
    // если границы диапазона не указаны, то он будет максимально широким
    values.range = [range1 || 0, range2 || 10 ** 9];
    values.address = values.address.toLowerCase();

    if (pool) {
      await db.pools.put(values);
    } else {
      values.notify = true;
      values.inRange = true;
      // если пул новый, то узнаём отношение разрядностей токенов в пуле
      values.decimals = await getDecimals(values.address, values.chain);
      await db.pools.add(values);
    }
    closeForm();
  }, false);

  useEffect(() => {
    form.setFieldsValue(pool);
  }, [pool, form]);

  return (
    <Form form={form} onFinish={addPool} className="edit-form" autoComplete="off">
      <Row gutter={[8, 8]}>
        <Col span={8}>
          <Form.Item name="address" rules={[{ required: true, message: '' }]}>
            <Input placeholder="Адрес пула (0x123...)" disabled={pool} />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item name="range1">
            <MyInputNumber placeholder="Нижняя граница (2200)" />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item name="range2">
            <MyInputNumber placeholder="Верхняя граница (2500)" />
          </Form.Item>
        </Col>

        <Col span={10}>
          <Form.Item name="name" rules={[{ required: true, message: '' }]}>
            <Input placeholder="Название (Uni ETH/DAI Arb)" />
          </Form.Item>
        </Col>

        <Col span={10}>
          <Form.Item name="chain" rules={[{ required: true, message: '' }]}>
            <Select
              placeholder="Сеть"
              style={{ width: "100%" }}
              options={chains.map(o => { return { value: o.chain, label: o.name } })}
            />
          </Form.Item>
        </Col>

        <Col span={4}>
          <Form.Item>
            <Flex gap={8} justify="end">
              <Button icon={<CloseOutlined />} onClick={closeForm} title="Отмена" />

              <SubmitButton icon={<CheckOutlined />} form={form} loading={isAddPoolLoading} />
            </Flex>
          </Form.Item>
        </Col>
      </Row>
    </Form >
  );
}
