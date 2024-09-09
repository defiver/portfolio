import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

export const localeNumber = (number, fixed = 0) => {
	number = number ? number : 0;
	number = parseFloat(number);
	const positive = Math.abs(number);
	const fraction = fixed > 0 ? fixed : 4;

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

	return (+number).toLocaleString(undefined, { minimumFractionDigits: fraction }).replace(/,?0*$/, '');
}

export const formatPercent = (n1, n2, fixed = 1) => {
	n1 = parseFloat(n1 || 0);
	n2 = parseFloat(n2 || 0);

	const percent = n2 !== 0 ? (100 * (n1 - n2) / n2).toFixed(fixed) : 0.0;
	const icon = percent > 0
		? <ArrowUpOutlined className="warning" />
		: percent < 0
			? <ArrowDownOutlined className="good" />
			: <></>

	return <>{icon}{(Math.abs(percent)).toLocaleString(undefined, { minimumFractionDigits: 1 }) + "%"}</>;
}