import { CalculatorOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Button, Drawer, Flex, Select } from "antd";
import { useState } from "react";
import TR from "./forms/TR";
import RO from "./forms/RO";
import Lo from "./forms/Lo";
import HF from "./forms/HF";
import IL3 from "./forms/IL3";
import IL2 from "./forms/IL2";
import CI from "./forms/CI";
import CR from "./forms/CR";
import AV from "./forms/AV";
import "./style.css";

export default function Calculator() {
  const [showDrawer, setShowDrawer] = useState(false);
  const [form, setForm] = useState("TokensRatio");
  // показать/скрыть описание калькуляторов
  const [showDesc, setShowDesc] = useState(false);

  const forms = {
    "TokensRatio": <TR showDesc={showDesc} />,
    "RangeOut": <RO showDesc={showDesc} />,
    "Looping": <Lo showDesc={showDesc} />,
    "HealthFactor": <HF showDesc={showDesc} />,
    "ImpermanentLossV3": <IL3 showDesc={showDesc} />,
    "ImpermanentLossV2": <IL2 showDesc={showDesc} />,
    "CompoundInterest": <CI showDesc={showDesc} />,
    "CAGR": <CR showDesc={showDesc} />,
    "AveragingPrices": <AV showDesc={showDesc} />,
  }

  const options = [
    { value: "TokensRatio", label: "Соотношение токенов в пуле" },
    { value: "RangeOut", label: "Средняя цена покупки/продажи" },
    { value: "Looping", label: "Looping" },
    { value: "HealthFactor", label: "Health Factor" },
    { value: "ImpermanentLossV3", label: "Impermanent Loss V3" },
    { value: "ImpermanentLossV2", label: "Impermanent Loss V2" },
    { value: "CompoundInterest", label: "Сложный процент" },
    { value: "CAGR", label: "Среднегодовой темп роста (CAGR)" },
    { value: "AveragingPrices", label: "Усреднениe цены" },
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
