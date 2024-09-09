import { AppstoreAddOutlined } from "@ant-design/icons";
import { FloatButton, Drawer, Flex, Row, Col, Empty } from "antd";
import { loadStorage } from '@/utils/storage';
import { useState } from "react";
import Filter from './Filter';
import ToolCard from './ToolCard';
import tools from './tools.json';
import "./style.css";

export default function Tools() {
  const [showDrawer, setShowDrawer] = useState(false);
  const [filterTools, setFilterTools] = useState(tools.sort((a, b) => a.name.localeCompare(b.name)));
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
    <>
      <FloatButton
        onClick={() => setShowDrawer(true)}
        style={{ insetInlineStart: 24, insetBlockEnd: 110 }}
        icon={<AppstoreAddOutlined />}
      />

      <Drawer
        title={false}
        open={showDrawer}
        className="tools"
        placement={"left"}
        width={600}
        onClose={() => setShowDrawer(false)}
      >
        <Flex vertical gap={20}>
          <Filter tools={tools} favorites={favorites} setFilterTools={setFilterTools} />
          {filterTools.length
            ? <Row gutter={[8, 8]}>{cardList}</Row>
            : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          }
        </Flex>
      </Drawer >
    </>
  );
}
