import { CalculatorOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Button, Drawer, Flex, Select } from "antd";
import { useState } from "react";
import TokensRatio from "./forms/TokensRatio";
import Looping from "./forms/Looping";
import HF from "./forms/HF";
import IL from "./forms/IL";
import CI from "./forms/CI";
import "./style.css";

export default function Calculator() {
  const [showDrawer, setShowDrawer] = useState(false);
  const [form, setForm] = useState("TokensRatio");
  // показать/скрыть описание калькуляторов
  const [showDesc, setShowDesc] = useState(false);

  const forms = {
    "TokensRatio": <TokensRatio showDesc={showDesc} />,
    "Looping": <Looping showDesc={showDesc} />,
    "HealthFactor": <HF showDesc={showDesc} />,
    "ImpermanentLoss": <IL showDesc={showDesc} />,
    "CompoundInterest": <CI showDesc={showDesc} />,
  }

  const options = [
    { value: "TokensRatio", label: "Соотношение токенов в пуле" },
    { value: "Looping", label: "Looping" },
    { value: "HealthFactor", label: "Health Factor" },
    { value: "ImpermanentLoss", label: "Impermanent Loss" },
    { value: "CompoundInterest", label: "Сложный процент" },
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
        <Flex vertical gap={26}>
          <Flex gap={8}>
            <Select defaultValue={form} onChange={setForm} style={{ width: "100%" }} options={options} />
            <Button
              type={showDesc ? "primary" : "default"}
              icon={<InfoCircleOutlined />}
              onClick={() => setShowDesc(!showDesc)}
              style={{ width: 36 }}
            />
          </Flex>

          {forms[form]}
        </Flex>
      </Drawer >
    </>
  );
}
