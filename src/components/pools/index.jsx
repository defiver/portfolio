import { DownOutlined, UpOutlined, LineChartOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Card, Space, FloatButton, Drawer } from "antd";
import { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { formAddressState, poolsListState, sortPoolsListState } from "./store";
import { useLiveQuery } from "dexie-react-hooks";
import { usePrices } from './helper';
import EditForm from './EditForm';
import PoolsList from './PoolsList';
import "./style.css";

export default function Pools({ db }) {
  const [swowDrawer, setSwowDrawer] = useState(false);
  const [formAddress, setFormAddress] = useRecoilState(formAddressState);
  const pools = useLiveQuery(() => db.pools.toArray(), [], []);

  const [, setPoolsList] = useRecoilState(poolsListState);
  const sortPools = useRecoilValue(sortPoolsListState);

  const [updatePrices, isUpdatePricesLoading] = usePrices(sortPools, db);

  useEffect(() => {
    setPoolsList(pools);
  }, [pools]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <FloatButton
        onClick={() => setSwowDrawer(true)}
        style={{ insetInlineStart: 24, insetBlockEnd: 260 }}
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
          className="pools-list"
          extra={
            <Space>
              <Button loading={isUpdatePricesLoading} icon={<ReloadOutlined />} onClick={updatePrices} />
              <Button
                icon={formAddress === 0 ? <UpOutlined /> : <DownOutlined />}
                onClick={() => setFormAddress(formAddress === 0 ? null : 0)}
              />
            </Space>
          }
        >
          {formAddress === 0 && <EditForm db={db} pool={null} />}

          <PoolsList db={db} />
        </Card>
      </Drawer >
    </>
  );
}
