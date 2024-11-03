import { useState } from "react";
import { Flex, Select, Row, Col } from "antd";
import { calcROE, calcAVG, calcAPY, calcMWR } from "../helper";
import CustomStatistic from "../components/CustomStatistic";
import TransTable from "../components/TransTable";

export default function AssetsList({ db, transactions, tokens }) {
	// дефолтный токен в select
	const [token, setToken] = useState(transactions.length ? transactions[0].token : null);

	let uniqueObjects = {}; // уникальные токены
	transactions.forEach(obj => { uniqueObjects[obj.token] = obj });
	let options = Object.values(uniqueObjects).map(o => { return { value: o.token, label: o.token } });
	const filterTrans = transactions.filter(o => o.token === token); // фильтр по выбранному токену

	const amount = filterTrans.reduce((a, b) => a + b.amount, 0); // текущее кол-во токенов
	const purchase = filterTrans.reduce((a, b) => a + b.amount * b.price, 0); // сколько потрачено
	const value = amount * (tokens[token]?.price || 0); // текущая стоимость
	const income = value - purchase; // доход

	// доходности
	const AVG = calcAVG(filterTrans, tokens);
	const MWR = calcMWR(filterTrans, tokens);
	const ROE = calcROE(filterTrans, tokens);
	const APY = calcAPY(filterTrans, tokens);

	return (
		<Flex vertical gap={16}>
			<Select options={options} defaultValue={token} onChange={setToken} />

			<Row gutter={[8, 8]}>
				<Col span={6}><CustomStatistic value={amount} title={"Кол-во токенов"} /></Col>
				<Col span={6}><CustomStatistic value={purchase < 0 ? 0 : purchase} title={"Вложено"} prefix={"$"} /></Col>
				<Col span={6}><CustomStatistic value={value} title={"Текущая стоимость"} prefix={"$"} /></Col>
				<Col span={6}><CustomStatistic value={income} title={"Доход"} prefix={"$"} painted /></Col>
				<Col span={6}><CustomStatistic value={AVG} title={"AVG"} suffix={"%"} painted /></Col>
				<Col span={6}><CustomStatistic value={MWR} title={"MWR"} suffix={"%"} painted /></Col>
				<Col span={6}><CustomStatistic value={ROE} title={"ROE"} suffix={"%"} painted /></Col>
				<Col span={6}><CustomStatistic value={APY} title={"APY"} suffix={"%"} painted /></Col>
			</Row>

			<TransTable db={db} transactions={filterTrans} />
		</Flex>
	)
}
