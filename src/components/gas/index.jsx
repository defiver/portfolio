import { LoadingOutlined, ReloadOutlined } from "@ant-design/icons";
import { Progress } from "antd";
import { useState, useEffect } from "react";
import { localeNumber } from "@/utils/number";
import { useInterval } from "@/hooks/useInterval";
import { fetchingGet } from "@/utils/fetching";
import { useLoading } from "@/hooks/useLoading";

const LINK = "https://api.blocknative.com/gasprices/blockprices";
const INTERVAL = 600; // интервал таймера для авто обновления

export default function Gas() {
  const [gas, setGas] = useState(0);
  const [timer, setTimer] = useState(0);

  const [fetchGas, isGasLoading] = useLoading(async () => {
    const data = await fetchingGet(LINK);
    const baseFeePerGas = (data?.blockPrices instanceof Array) ? data.blockPrices[0].baseFeePerGas : 0;
    setGas(baseFeePerGas);
  }, false);

  const color = gas === 0 ? "#dcdcdc" : gas < 10 ? "green" : gas < 30 ? "orange" : "#a52a2a";

  // хук, отвечающий за автообновление по таймеру
  useInterval(async () => {
    setTimer(timer + 1);
    if (timer === INTERVAL) {
      await fetchGas();
      setTimer(1);
    }
  }, timer > 0 && !isGasLoading ? 1000 : null);

  useEffect(() => {
    fetchGas();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Progress
      title={`Gas: ${localeNumber(gas)} Gwei`}
      type="circle"
      percent={100}
      status={"normal"}
      format={() => isGasLoading ? <LoadingOutlined /> : gas > 0 ? localeNumber(gas) : <ReloadOutlined />}
      size={40}
      strokeWidth={2}
      strokeColor={color}
      onClick={() => !isGasLoading && fetchGas()}
      style={{ cursor: "pointer", color: "#dcdcdc !important" }}
    />
  );
}
