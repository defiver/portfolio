import { Flex, Row, Col, Empty } from "antd";
import { loadStorage } from '@/utils/storage';
import { useState } from "react";
import Filter from './Filter';
import ToolCard from './ToolCard';
import tools from './tools.json';

export default function List() {
	const [filterTools, setFilterTools] = useState(tools.sort((a, b) => a.name.localeCompare(b.name)));
	// фавориты подтягиваются с localStorage
	const [favorites, setFavorites] = useState(loadStorage("favorite_tools"));

	const cardList = filterTools.map(o =>
		<Col key={o.name} span={8}>
			<ToolCard
				item={o}
				favorites={favorites}
				setFavorites={setFavorites}
			/>
		</Col>
	);

	return (
		<Flex vertical gap={20}>
			<Filter tools={tools} favorites={favorites} setFilterTools={setFilterTools} />
			{filterTools.length
				? <Row gutter={[8, 8]}>{cardList}</Row>
				: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
			}
		</Flex>
	);
}
