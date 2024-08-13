import { ReloadOutlined } from "@ant-design/icons";
import { Button, List, Typography, Input, Flex, Select } from "antd";
import { useFilterList } from '@/hooks/useFilterList';
import { useState, useDeferredValue } from "react";

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
						placeholder="Search..." allowClear
					/>
					<Select
						disabled={isOppLoading}
						defaultValue={swowFresh ? "fresh" : "all"}
						onChange={() => setSwowFresh(!swowFresh)}
						style={{ minWidth: 100 }}
						options={[{ value: "all", label: "All" }, { value: "fresh", label: "Fresh" }]}
					/>
					<Button
						style={{ minWidth: 32 }}
						icon={<ReloadOutlined />}
						onClick={fetchOpp}
						loading={isOppLoading} />
				</Flex>
			}
			renderItem={(item) => (
				<List.Item>
					<Typography.Text ellipsis><a href={item.url}>{item.name}</a></Typography.Text>
					<Typography.Text>{parseInt(item.apr)}%</Typography.Text>
				</List.Item>
			)}
		/>
	)
}