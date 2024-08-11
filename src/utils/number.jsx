import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

export const localeNumber = (number, suffix = "", fixed = 0) => {
	number = number ? number : 0;
	number = parseFloat(number);
	suffix = suffix ? ` ${suffix}` : "";
	const positive = Math.abs(number);

	if (fixed > 0) {
		number = number.toFixed(fixed);
	} else if (positive >= 1000) {
		number = parseInt(number);
	} else if (positive >= 100) {
		number = number.toFixed(1);
	} else if (positive >= 10) {
		number = number.toFixed(2);
	} else if (positive >= .1) {
		number = number.toFixed(3);
	} else if (positive > 0) {
		number = number.toFixed(4);
	}

	return (+number).toLocaleString(undefined, { minimumFractionDigits: 4 }).replace(/,?0*$/, '') + suffix;
}

export const formatPercent = (n1, n2) => {
	n1 = parseFloat(n1 ?? 0);
	n2 = parseFloat(n2 ?? 0);

	const percent = n2 !== 0 ? (100 * (n1 - n2) / n2).toFixed(1) : 0.0;
	const icon = percent > 0
		? <ArrowUpOutlined style={{ color: "green" }} />
		: percent < 0
			? <ArrowDownOutlined style={{ color: "red" }} />
			: <></>

	return <>{icon}{(Math.abs(percent)).toLocaleString(undefined, { minimumFractionDigits: 1 }) + "%"}</>;
}