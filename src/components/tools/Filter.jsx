import { Row, Col, Select } from "antd";
import { useEffect, useState } from "react";

export default function Filter({ tools, favorites, setFilterTools }) {
	const chains = [...new Set(tools.map(o => [...o.chains]).flat(1))];
	const categories = [...new Set(tools.map(o => [...o.categories]).flat(1))];

	// если есть фавориты, то добавляем их в начало списка категорий и при первой загрузке выводим их
	favorites.length && categories.unshift("Favorites");

	const [chain, setChain] = useState(undefined);
	const [category, setCategory] = useState(categories.length && categories[0]);

	useEffect(() => {
		setFilterTools(tools
			.filter(o => o.categories.includes(category) || (category === "Favorites" && favorites.includes(o.name)))
			.filter(o => o.chains.length === 0 || (!chain || o.chains.includes(chain)))
		);
	}, [chain, category, tools, favorites]) // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<Row gutter={[8, 8]} align={"middle"}>
			<Col span={12}>
				<Select
					defaultValue={category}
					onChange={setCategory}
					style={{ width: "100%" }}
					options={categories.map(i => { return { value: i, label: i } })}
				/>
			</Col>
			<Col span={12}>
				<Select
					allowClear
					placeholder="Сеть"
					defaultValue={chain}
					onChange={setChain}
					style={{ width: "100%" }}
					options={chains.map(i => { return { value: i, label: i } })}
				/>
			</Col>
		</Row>
	);
}
