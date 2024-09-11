import { DownOutlined, UpOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Card, Space, FloatButton, Drawer, Input } from "antd";
import { useLoading } from "@/hooks/useLoading";
import { useState, useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { fetchingGet } from "@/utils/fetching";
import PositionsList from './PositionsList';
import icon from './icon.svg';
import "./style.css";

const LINK = "https://cors-anywhere.herokuapp.com/https://api.revert.finance/v1/positions/uniswapv3/account/";

export default function Revert({ db }) {
  const [showDrawer, setShowDrawer] = useState(false);
  const [showTextArea, setShowTextArea] = useState(undefined);
  const [textArea, setTextArea] = useState("");
  const revert = useLiveQuery(() => db.revert.toArray(), [], []);

  const [fetchPos, isFetchPosLoading] = useLoading(async () => {
    for (const account of revert) {
      const positions = await fetchingGet(LINK + account.address);
      await db.revert.put({ address: account.address, positions: positions?.data || [] });
    }
  }, false);

  useEffect(() => {
    if (showTextArea === false) {
      let newAdds = textArea.toLowerCase().split("\n").filter(a => a);
      let prevAdds = revert.map(o => o.address);

      prevAdds.filter(x => !newAdds.includes(x)).forEach(a => db.revert.delete(a));
      newAdds.filter(x => !prevAdds.includes(x)).forEach(a => db.revert.add({ address: a, positions: [] }));
    }
  }, [showTextArea]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setTextArea(revert.map(o => o.address).join("\n"))
  }, [revert]);

  return (
    <>
      <FloatButton
        onClick={() => setShowDrawer(true)}
        style={{ insetInlineStart: 24, insetBlockEnd: 360 }}
        icon={<img style={{ width: 18, height: 18 }} src={icon} />}
      />

      <Drawer
        title={false}
        open={showDrawer}
        className="revert"
        placement={"left"}
        width={500}
        onClose={() => setShowDrawer(false)}
      >
        <Card
          size="small"
          title="Revert positions"
          className="revert-list"
          extra={
            <Space>
              <Button
                disabled={showTextArea}
                loading={isFetchPosLoading}
                icon={<ReloadOutlined />}
                onClick={fetchPos}
              />
              <Button
                disabled={isFetchPosLoading}
                icon={showTextArea ? <UpOutlined /> : <DownOutlined />}
                onClick={() => setShowTextArea(!showTextArea)}
              />
            </Space>
          }
        >
          {showTextArea && <Input.TextArea
            rows={3}
            className="edit-form"
            placeholder="Addresses (0x123...)"
            onChange={(e) => setTextArea(e.target.value)}
            value={textArea}
            disabled={isFetchPosLoading}
          />}

          <PositionsList revert={revert} />
        </Card>
      </Drawer >
    </>
  );
}
