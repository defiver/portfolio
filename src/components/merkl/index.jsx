import { MediumOutlined, ReloadOutlined, ExportOutlined } from "@ant-design/icons";
import { Button, Flex, FloatButton, Drawer, List, Typography } from "antd";
import { useState } from "react";
import { getMerkl } from "@/utils/ferching";
import { useFetching } from "@/hooks/useFetching";
import { useLiveQuery } from "dexie-react-hooks";
import chainIds from './chainIds.json';

export default function Merkl({ db }) {
  const [swowDrawer, setSwowDrawer] = useState(false);
  const merkl = useLiveQuery(() => db.merkl.toArray(), [], []);

  const [fetchOpp, isOppLoading] = useFetching(async () => {
    const opportunities = await getMerkl();
    if (Object.keys(opportunities).length > 0) {
      const live = Object.values(opportunities)
        .filter(o => o.status === "live")
        .map(o => {
          let fresh = !merkl.some(m => o.id === m.id);
          let chain = chainIds[o.chainId];
          let url = `https://merkl.angle.money/${chain}/${o.action}/${o.id.replace("_", "/")}`;
          return { id: o.id, name: o.name, url, fresh };
        });
      db.transaction('rw', db.merkl, function () {
        db.merkl.clear();
        db.merkl.bulkPut(live);
      });
    }
  }, false);

  const fresh = merkl.filter(o => o.fresh);

  return (
    <>
      <FloatButton
        onClick={() => setSwowDrawer(true)}
        style={{ insetInlineStart: 24, insetBlockEnd: 120 }}
        icon={<MediumOutlined />}
      />

      <Drawer
        title={false}
        open={swowDrawer}
        className="merkl"
        placement={"left"}
        onClose={() => setSwowDrawer(false)}
      >
        <List
          bordered
          className="merkl-list"
          size="small"
          dataSource={fresh}
          header={
            <Flex align={"center"} justify={"space-between"}>
              <span>All: {merkl.length}, Fresh: {fresh.length}</span>
              <Button icon={<ReloadOutlined />} onClick={fetchOpp} loading={isOppLoading} />
            </Flex>

          }
          renderItem={(item) => (
            <List.Item>
              <Typography.Text ellipsis>{item.name}</Typography.Text>
              <a href={item.url}><ExportOutlined /></a>
            </List.Item>
          )}
        />
      </Drawer >
    </>
  );
}
