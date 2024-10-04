import { ReloadOutlined } from "@ant-design/icons";
import { Row, Col, Select, Button, Input } from "antd";
import { useState, useEffect, useDeferredValue } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { filterState, allChainsState, allProjectsState } from "./store";

export default function Filter({ fetchPools, isPoolsLoading }) {
	const [filter, setFilterState] = useRecoilState(filterState);
	const chains = useRecoilValue(allChainsState);
	const projects = useRecoilValue(allProjectsState);

	const [query, setQuery] = useState("");
	const deferredQuery = useDeferredValue(query);

	useEffect(() => {
		setFilterState({ ...filter, query: deferredQuery });
	}, [deferredQuery]); // eslint-disable-line react-hooks/exhaustive-deps

	const attributes = {
		"noil": "Без IL",
		"stable": "Стейблкоины",
		"multi": "Мульти пулы",
		"single": "Одиночные пулы",
		"nooutlier": "Без всплесков в APY",
	};

	const sorting = {
		"tvl": "TVL",
		"apy": "APY",
		"apy30d": "Средняя APY за месяц",
	};

	return (
		<Row gutter={[8, 8]} align={"middle"}>
			<Col span={8}>
				<Select
					allowClear
					placeholder="Сеть"
					value={filter.chain}
					onChange={(value) => setFilterState({ ...filter, chain: value })}
					options={chains.map(i => { return { value: i, label: i } })}
					showSearch
					filterSort={(a, b) => (a.label).toLowerCase().localeCompare((b.label).toLowerCase())}
				/>
			</Col>

			<Col span={8}>
				<Select
					allowClear
					placeholder="Протокол"
					value={filter.project}
					onChange={(value) => setFilterState({ ...filter, project: value })}
					options={projects.map(i => new Object({
						value: i,
						label: i.charAt(0).toUpperCase() + i.slice(1).replaceAll("-", " ")
					}))}
					showSearch
					filterSort={(a, b) => (a.label).toLowerCase().localeCompare((b.label).toLowerCase())}
				/>
			</Col>

			<Col span={8}>
				<Select
					placeholder="Сортировка"
					value={filter.sort}
					onChange={(value) => setFilterState({ ...filter, sort: value })}
					options={Object.entries(sorting).map(([k, v]) => { return { value: k, label: v } })}
				/>
			</Col>

			<Col span={8}>
				<Input
					allowClear
					placeholder="Поиск по токенам"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
				/>
			</Col>

			<Col span={14}>
				<Select
					allowClear
					mode="multiple"
					placeholder="Тип"
					value={filter.attribute}
					onChange={(value) => setFilterState({ ...filter, attribute: value })}
					options={Object.entries(attributes).map(([k, v]) => { return { value: k, label: v } })}
				/>
			</Col>

			<Col span={2} style={{ textAlign: "right" }}>
				<Button
					icon={<ReloadOutlined />}
					onClick={fetchPools}
					loading={isPoolsLoading}
					title="Загрузить пулы"
				/>
			</Col>
		</Row>
	);
}
