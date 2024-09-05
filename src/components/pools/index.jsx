import { DownOutlined, UpOutlined, LineChartOutlined } from "@ant-design/icons";
import { Button, Card, Space, FloatButton, Drawer } from "antd";
import { useState } from "react";
import EditForm from './EditForm';
import PoolsList from './PoolsList';

export default function Pools({ db }) {
  const [swowDrawer, setSwowDrawer] = useState(false);
  const [pool, setPool] = useState(null);

  return (
    <>
      <FloatButton
        onClick={() => setSwowDrawer(true)}
        style={{ insetInlineStart: 24, insetBlockStart: 10 }}
        icon={<LineChartOutlined />}
      />

      <Drawer
        title={false}
        open={swowDrawer}
        className="pools"
        placement={"left"}
        width={500}
        onClose={() => setSwowDrawer(false)}
      >
        <Card
          size="small"
          title="Price in pools"
          className="note-list"
          extra={
            <Space>
              <Button
                icon={pool ? <UpOutlined /> : <DownOutlined />}
                onClick={() => setPool(!pool)}
              />
            </Space>
          }
        >
          {pool && <EditForm db={db} pool={pool} setPool={setPool} />}

          <PoolsList db={db} setPool={setPool} />
        </Card>
      </Drawer >
    </>
  );
}
