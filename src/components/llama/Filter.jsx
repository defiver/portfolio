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
		"noil": "No IL",
		"stable": "Stablecoins",
		"multi": "Multi Exposure",
		"single": "Single Exposure",
		"nooutlier": "No Outlier",
	};

	const sorting = {
		"tvl": "TVL",
		"apy": "APY",
		"apy30d": "Apy 30d",
	};

	return (
		<Row gutter={[8, 8]} align={"middle"}>
			<Col span={8}>
				<Select
					allowClear
					placeholder="Chain"
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
					placeholder="Project"
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
					placeholder="Sorting"
					value={filter.sort}
					onChange={(value) => setFilterState({ ...filter, sort: value })}
					options={Object.entries(sorting).map(([k, v]) => { return { value: k, label: v } })}
				/>
			</Col>

			<Col span={8}>
				<Input
					allowClear
					placeholder="Token"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
				/>
			</Col>

			<Col span={14}>
				<Select
					allowClear
					mode="multiple"
					placeholder="Attribute"
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
					title="Upload pools"
				/>
			</Col>
		</Row>
	);
}
