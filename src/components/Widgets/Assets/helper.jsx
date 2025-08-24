import dayjs from "dayjs";

// функция для расчёта текущей стоимости активов
const calcAssetsValue = (assets, tokens) => {
	var value = 0;

	for (const [token, amount] of Object.entries(assets)) {
		value += amount * (tokens[token]?.price || 0);
	}

	return value;
};

// функция для расчёта XIRR 0.1
const calcXIRR = (values, dates, guess = 0.1) => {
	// Calculates the resulting amount
	var irrResult = function (values, dates, rate) {
		var r = rate + 1;
		var result = values[0];
		for (var i = 1; i < values.length; i++) {
			result += values[i] / Math.pow(r, dayjs(dates[i]).diff(dayjs(dates[0]), 'days') / 365);
		}
		return result;
	}

	// Calculates the first derivation
	var irrResultDeriv = function (values, dates, rate) {
		var r = rate + 1;
		var result = 0;
		for (var i = 1; i < values.length; i++) {
			var frac = dayjs(dates[i]).diff(dayjs(dates[0]), 'days') / 365;
			result -= frac * values[i] / Math.pow(r, frac + 1);
		}
		return result;
	}

	// Check that values contains at least one positive value and one negative value
	var positive = false;
	var negative = false;
	for (var i = 0; i < values.length; i++) {
		if (values[i] > 0) positive = true;
		if (values[i] < 0) negative = true;
	}

	// Return error if values does not contain at least one positive value and one negative value
	if (!positive || !negative) {
		return 0;
	}

	var resultRate = guess;

	// Set maximum epsilon for end of iteration
	var epsMax = 1e-10;

	// Set maximum number of iterations
	var iterMax = 50;

	// Implement Newton's method
	var newRate, epsRate, resultValue;
	var iteration = 0;
	var contLoop = true;
	do {
		resultValue = irrResult(values, dates, resultRate);
		newRate = resultRate - resultValue / irrResultDeriv(values, dates, resultRate);
		epsRate = Math.abs(newRate - resultRate);
		resultRate = newRate;
		contLoop = (epsRate > epsMax) && (Math.abs(resultValue) > epsMax);
	} while (contLoop && (++iteration < iterMax));

	// Return internal rate of return
	return contLoop || !resultRate ? 0 : resultRate;
}

// мод. метод Дитца
const calcModDietz = (mimo, begin, end) => {
	// Total cashflows
	var flows = mimo.reduce(function (sum, current) {
		return sum + (-1 * current.cashflow);
	}, 0);

	// Calculate the date difference
	var firstDate = mimo[0].date;
	var lastDate = new Date();
	var days = 1 + Math.floor((lastDate - firstDate) / (1000 * 60 * 60 * 24));

	// Total weighted cashflows
	var weightedFlows = mimo.reduce(function (acc, t) {
		if (t.cashflow == 0) {
			return acc + 0;
		}
		var cashflow = -1 * t.cashflow;
		var diff = 1 + Math.floor((t.date - firstDate) / (1000 * 60 * 60 * 24));
		var weight = 1 - (diff / days);
		var weightedFlow = weight * cashflow;
		return acc + weightedFlow;
	}, 0);

	// Modified Dietz
	var nonAnnualized = (end - begin - flows) / (begin + weightedFlows);
	// var annualized = Math.pow((1 + nonAnnualized), (365 / (days - 1))) - 1;
	return nonAnnualized;
}

// функция для расчёта рентабельности капитала
export const calcROE = (transactions, tokens) => {
	var begin = 0;
	var assets = {};

	for (const o of transactions) {
		begin += o.amount * o.price;
		assets[o.token] = assets[o.token] ? assets[o.token] + o.amount : o.amount;
	}

	var now = calcAssetsValue(assets, tokens);
	return begin > 0 ? 100 * (now - begin) / begin : 0;
};

// функция для расчёта доходности актива методом средней цены покупки
export const calcAVG = (transactions, tokens) => {
	var prices = [];

	for (const o of transactions) {
		if (o.amount > 0) {
			prices = [...prices, ...Array(Math.ceil(o.amount)).fill(o.price)];
		}
	}

	var curr_price = prices.length ? prices.length * calcAssetsValue({ [transactions[0].token]: 1 }, tokens) : 0;
	var avg_price = prices.reduce((a, b) => a + b, 0)
	return avg_price > 0 ? 100 * (curr_price - avg_price) / avg_price : 0
}

// функция для расчёта среднегодовой доходности активов по методу IRR
export const calcAPY = (transactions, tokens) => {
	var values = [];
	var dates = [];
	var assets = {};

	// формируем массив покупок и продаж
	for (const o of transactions) {
		dates.push(o.date);
		values.push(-1 * (o.amount * o.price));
		assets[o.token] = assets[o.token] ? assets[o.token] + o.amount : o.amount;
	}

	dates.push(new Date());
	values.push(calcAssetsValue(assets, tokens));
	return calcXIRR(values, dates) * 100;
}

// функция для расчёта доходности взвешенной по деньгам мод. методом Дитца
export const calcMWR = (transactions, tokens) => {
	var mimo = []
	var assets = {};

	for (const o of transactions) {
		assets[o.token] = assets[o.token] ? assets[o.token] + o.amount : o.amount;
		mimo.push({ date: o.date, cashflow: -(o.amount * o.price) })
	}

	var now = calcAssetsValue(assets, tokens);
	return mimo.length ? 100 * calcModDietz(mimo, 0, now) : 0;
}

// функция для расчёта средней цены покупки
export const calcAPP = (assets) => {
	var value = 0;
	var count = 0;

	for (const o of assets) {
		if (o.amount > 0) {
			value += o.amount * o.price;
			count += o.amount;
		}
	}

	return count > 0 ? value / count : 0;
};

// функция для расчёта средней цены продажи
export const calcAPS = (assets) => {
	var value = 0;
	var count = 0;

	for (const o of assets) {
		if (o.amount < 0) {
			value += o.amount * o.price * -1;
			count += o.amount * -1;
		}
	}

	return count > 0 ? value / count : 0;
};
