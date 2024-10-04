import { ReloadOutlined } from "@ant-design/icons";
import { Button, List, Typography, Input, Flex, Select } from "antd";
import { useFilterList } from './useFilterList';
import { useState, useDeferredValue } from "react";
import chainIds from './chainIds.json';

export default function OppList({ allOpp, fetchOpp, isOppLoading }) {
	const [swowFresh, setSwowFresh] = useState(true);
	const [inputQuery, setInputQuery] = useState("");

	const deferredQuery = useDeferredValue(inputQuery);
	const filterOpp = useFilterList(allOpp, swowFresh, deferredQuery, "apr");

	return (
		<List
			bordered
			loading={isOppLoading}
			className="merkl-list"
			size="small"
			dataSource={filterOpp}
			pagination={{ defaultPageSize: 20, hideOnSinglePage: 1, showLessItems: 1 }}
			header={
				<Flex gap={8} justify={"space-between"}>
					<Input
						disabled={isOppLoading}
						onChange={e => setInputQuery(e.target.value)}
						placeholder="Поиск" allowClear
					/>
					<Select
						disabled={isOppLoading}
						defaultValue={swowFresh ? "fresh" : "all"}
						onChange={() => setSwowFresh(!swowFresh)}
						style={{ minWidth: 100 }}
						options={[{ value: "all", label: "Все" }, { value: "fresh", label: "Новые" }]}
					/>
					<Button
						style={{ minWidth: 32 }}
						icon={<ReloadOutlined />}
						onClick={fetchOpp}
						loading={isOppLoading}
						title="Загрузить пулы"
					/>
				</Flex>
			}
			renderItem={(item) => (
				<List.Item>
					<Flex gap={8} align="center">
						<img
							title={chainIds[item.chain] ? chainIds[item.chain].name : chainIds["0"].name}
							src={chainIds[item.chain] ? chainIds[item.chain].icon : chainIds["0"].icon}
						/>
						<Typography.Text ellipsis style={{ maxWidth: 350 }}>
							<a href={item.url}> {item.name}</a>
						</Typography.Text>
					</Flex>
					<Typography.Text title="APR">{parseInt(item.apr)}%</Typography.Text>
				</List.Item>
			)}
		/>
	)
}
