import { CalculatorOutlined } from "@ant-design/icons";
import { Button, Drawer, Flex, Select } from "antd";
import { useState } from "react";
import TokensRatio from "./forms/TokensRatio";
import Looping from "./forms/Looping";
import "./style.css";

export default function Calculator() {
  const [showDrawer, setShowDrawer] = useState(false);
  const [form, setForm] = useState("TokensRatio");

  const forms = {
    "TokensRatio": <TokensRatio />,
    "Looping": <Looping />,
  }

  const options = [
    { value: "TokensRatio", label: "Соотношение токенов в пуле" },
    { value: "Looping", label: "Лупинг" }
  ]

  return (
    <>
      <Button
        type={"text"}
        size={"large"}
        shape={"circle"}
        className={"widget-button"}
        icon={<CalculatorOutlined />}
        onClick={() => setShowDrawer(true)}
      />

      <Drawer
        title={false}
        open={showDrawer}
        className="calculator"
        placement={"left"}
        width={500}
        onClose={() => setShowDrawer(false)}
      >
        <Flex vertical gap={20}>
          <Select defaultValue={form} onChange={setForm} style={{ width: "100%" }} options={options} />

          {forms[form]}
        </Flex>
      </Drawer >
    </>
  );
}
