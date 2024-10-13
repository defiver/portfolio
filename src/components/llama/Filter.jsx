import { ReloadOutlined, UpOutlined, DownOutlined } from "@ant-design/icons";
import { Row, Col, Select, Button, Input, Space } from "antd";
import { useState, useEffect, useDeferredValue } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { filterState, allChainsState, allProjectsState } from "./store";

export default function Filter({ fetchPools, isPoolsLoading }) {
	const [filter, setFilterState] = useRecoilState(filterState);
	const chains = useRecoilValue(allChainsState);
	const projects = useRecoilValue(allProjectsState);

	const [showFilters, setShowFilters] = useState(true);
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
		<>
			<Row gutter={[8, 8]} align={"middle"} style={{ marginBottom: 8, display: showFilters ? "grid" : "none" }}>
				<Col span={24}>
					<Select
						showSearch
						allowClear
						mode="multiple"
						placeholder="Сети"
						value={filter.chains}
						onChange={(value) => setFilterState({ ...filter, chains: value })}
						options={chains.map(i => { return { value: i, label: i } })}
						filterSort={(a, b) => (a.label).toLowerCase().localeCompare((b.label).toLowerCase())}
					/>
				</Col>

				<Col span={24}>
					<Select
						allowClear
						mode="multiple"
						placeholder="Протоколы"
						value={filter.projects}
						onChange={(value) => setFilterState({ ...filter, projects: value })}
						options={projects.map(i => new Object({
							value: i,
							label: i.charAt(0).toUpperCase() + i.slice(1).replaceAll("-", " ")
						}))}
						showSearch
						filterSort={(a, b) => (a.label).toLowerCase().localeCompare((b.label).toLowerCase())}
					/>
				</Col>

				<Col span={24}>
					<Select
						allowClear
						mode="multiple"
						placeholder="Типы"
						value={filter.attribute}
						onChange={(value) => setFilterState({ ...filter, attribute: value })}
						options={Object.entries(attributes).map(([k, v]) => { return { value: k, label: v } })}
					/>
				</Col>
			</Row>

			<Row gutter={[8, 8]} align={"middle"}>
				<Col span={12}>
					<Input
						allowClear
						placeholder="Поиск по токенам (^ETH-DAI)"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
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

				<Col span={4} style={{ textAlign: "right" }}>
					<Space>
						<Button
							icon={showFilters ? <UpOutlined /> : <DownOutlined />}
							onClick={() => setShowFilters(!showFilters)}
							title="Скрыть/показать фильтры"
						/>
						<Button
							icon={<ReloadOutlined />}
							onClick={fetchPools}
							loading={isPoolsLoading}
							title="Загрузить пулы"
						/>
					</Space>
				</Col>
			</Row>
		</>
	);
}
