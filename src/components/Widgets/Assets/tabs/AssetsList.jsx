import { useState } from "react";
import { Flex, Select, Row, Col } from "antd";
import { calcROE, calcAVG, calcAPY, calcMWR } from "../helper";
import CustomStatistic from "../components/CustomStatistic";
import TransTable from "../components/TransTable";

export default function AssetsList({ db, transactions, tokens }) {
	// дефолтный токен в select
	const [token, setToken] = useState();

	let uniqueObjects = {}; // уникальные токены
	transactions.forEach(obj => { uniqueObjects[obj.token] = obj });
	const filterTrans = transactions.filter(o => o.token === token); // фильтр по выбранному токену
	const options = Object.values(uniqueObjects).map(o => { return { value: o.token, label: o.token } })
	const [filterOptions, setFilterOptions] = useState(options);

	const amount = filterTrans.reduce((a, b) => a + b.amount, 0); // текущее кол-во токенов
	const purchase = filterTrans.reduce((a, b) => a + b.amount * b.price, 0); // сколько потрачено
	const value = amount * (tokens[token]?.price || 0); // текущая стоимость
	const income = value - purchase; // доход

	// доходности
	const AVG = calcAVG(filterTrans, tokens);
	const MWR = calcMWR(filterTrans, tokens);
	const ROE = calcROE(filterTrans, tokens);
	const APY = calcAPY(filterTrans, tokens);

	const handleSearch = (value) => {
		if (value) {
			value = value.toLowerCase()
			let search = Object.values(options).filter(o => o.value && (o.value.toLowerCase().includes(value) || o.label.toLowerCase().includes(value)));
			setFilterOptions(search);
		} else {
			setFilterOptions(options);
		}
	};

	return (
		<Flex vertical gap={16}>
			<Select
				options={filterOptions}
				defaultValue={token}
				onChange={setToken}
				allowClear
				onClear={() => {
					setToken(null)
					setFilterOptions(options)
				}}
				showSearch
				onSearch={handleSearch} />

			<Row gutter={[8, 8]}>
				<Col span={6}><CustomStatistic value={amount} title={"Кол-во токенов"} /></Col>
				<Col span={6}><CustomStatistic value={purchase < 0 ? 0 : purchase} title={"Вложено"} suffix={"$"} /></Col>
				<Col span={6}><CustomStatistic value={value} title={"Текущая стоимость"} suffix={"$"} /></Col>
				<Col span={6}><CustomStatistic value={income} title={"Доход"} suffix={"$"} painted /></Col>
				<Col span={6}><CustomStatistic value={AVG} title={"AVG"} suffix={"%"} painted /></Col>
				<Col span={6}><CustomStatistic value={MWR} title={"MWR"} suffix={"%"} painted /></Col>
				<Col span={6}><CustomStatistic value={ROE} title={"ROE"} suffix={"%"} painted /></Col>
				<Col span={6}><CustomStatistic value={APY} title={"APY"} suffix={"%"} painted /></Col>
			</Row>

			<TransTable db={db} transactions={filterTrans} />
		</Flex>
	)
}
