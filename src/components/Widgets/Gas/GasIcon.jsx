import { LoadingOutlined } from "@ant-design/icons";
import { Progress } from "antd";
import { useState } from "react";
import { useInterval } from "@/hooks/useInterval";
import { useLoading } from "@/hooks/useLoading";
import { localeNumber } from "@/utils/number";
import { fetchGas } from "./fetching";

const INTERVAL = 300; // интервал таймера для авто обновления

export default function Icon({ autostart = true, setShowDrawer }) {
	const [gas, setGas] = useState(0);
	const [timer, setTimer] = useState(autostart ? INTERVAL : 0);

	const [getGas, isGetGasLoading] = useLoading(async () => setGas(await fetchGas()), false);

	// цвет контура - чем выше газ, тем краснее цвет
	const color = gas === 0 ? "#dcdcdc" : gas < 10 ? "green" : gas < 20 ? "orange" : "#a52a2a";

	// хук, отвечающий за автообновление по таймеру
	useInterval(async () => {
		if (timer === INTERVAL) {
			await getGas();
			setTimer(1);
		} else {
			setTimer(timer + 1);
		}
	}, timer > 0 && !isGetGasLoading ? 1000 : null);

	return (
		<Progress
			type="circle"
			percent={100}
			status={"normal"}
			format={() => isGetGasLoading ? <LoadingOutlined /> : gas > 0 ? localeNumber(gas) : "N/A"}
			size={40}
			strokeWidth={2}
			strokeColor={color}
			onClick={() => gas > 0 ? setShowDrawer(true) : getGas()}
			style={{ cursor: "pointer", color: "#dcdcdc !important" }}
		/>
	);
}
