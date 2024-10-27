import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

// функция для преобразования чисел в читаемый вид
export const localeNumber = (number, fixed = -1) => {
	number = number ? number : 0;
	number = parseFloat(number);
	const positive = Math.abs(number);
	const fraction = fixed > 0 ? fixed : 4;

	if (fixed > -1) {
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

// функция для преобразования отношений чисел в проценты
export const formatPercent = (n1, n2, fixed = 1) => {
	n1 = parseFloat(n1 || 0);
	n2 = parseFloat(n2 || 0);

	const percent = n2 !== 0 ? (100 * (n1 - n2) / n2).toFixed(fixed) : 0.0;
	const icon = percent > 0
		? <ArrowUpOutlined className="good" />
		: percent < 0
			? <ArrowDownOutlined className="warning" />
			: <></>

	return <>{icon}{(Math.abs(percent)).toLocaleString(undefined, { minimumFractionDigits: 1 }) + "%"}</>;
}

// функция для преобразования больших чисел в читаемый вид
export const bigNumber = (number) => {
	number = number ? number : 0;
	number = parseFloat(number);
	const positive = Math.abs(number);
	var suffix = "";

	if (positive >= 1_000_000_000_000) {
		suffix = " трлн.";
		number /= 1_000_000_000_000;
	} else if (positive >= 1_000_000_000) {
		suffix = " млрд.";
		number /= 1_000_000_000;
	} else if (positive >= 1_000_000) {
		suffix = " млн.";
		number /= 1_000_000;
	}

	return localeNumber(number) + suffix;
}