import { LinkOutlined } from "@ant-design/icons";
import { List, Typography, Input, Flex, Select, Collapse, Row, Col } from "antd";
import { useState, useDeferredValue } from "react";
import { useFilterList } from './helper';
import tokens from './tokens.json';

export default function OppList() {
	const [type, setType] = useState(null);
	const [query, setQuery] = useState("");

	const options = [...new Set(tokens.map(o => o.type))].map(t => { return { value: t, label: t } });

	const deferredQuery = useDeferredValue(query);
	const filterTokens = useFilterList(tokens, type, deferredQuery);

	return (
		<List
			bordered
			className="wrappers-list"
			size="small"
			dataSource={filterTokens}
			pagination={{ defaultPageSize: 20, hideOnSinglePage: 1, showLessItems: 1 }}
			header={
				<Flex gap={8} justify={"space-between"}>
					<Input
						allowClear
						value={query}
						onChange={e => setQuery(e.target.value)}
						placeholder="Поиск"
					/>
					<Select
						placeholder="Категория"
						allowClear
						value={type}
						onChange={setType}
						style={{ minWidth: 150 }}
						options={options}
					/>
				</Flex>
			}
			renderItem={(item) => (
				<Collapse
					size={"small"}
					items={[
						{
							showArrow: false,
							label: (
								<Flex justify={"space-between"}>
									<span>
										<span>{item?.ticker}</span>
										{item.name && <span className="small-text"> ({item.name})</span>}
									</span>
									{item?.link && <a onClick={e => e.stopPropagation()} href={item?.link}><LinkOutlined /></a>}
								</Flex>
							),
							children: (
								<>
									<Typography.Paragraph style={{ marginBottom: 24 }}>{item.description}</Typography.Paragraph>

									{item.contracts.map(o => {
										return (
											<Row gutter={[8, 8]} key={o.chain + o.address}>
												<Col span={10}><Typography.Text code>{o.chain}</Typography.Text></Col>
												<Col span={13}>
													<Typography.Paragraph copyable={{ text: o.address }}>
														{o.address.slice(0, 12) + '...' + o.address.slice(-12)}
													</Typography.Paragraph>
												</Col>
												<Col span={1}><a href={o.explorer}><LinkOutlined /></a></Col>
											</Row>
										)
									})}
								</>
							),
						},
					]}
				/>
			)}
		/>
	)
}
