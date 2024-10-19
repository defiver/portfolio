import { DownOutlined, UpOutlined, LineChartOutlined, ReloadOutlined, HistoryOutlined } from "@ant-design/icons";
import { Button, Card, Space, Drawer, Progress } from "antd";
import { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { formAddressState, poolsListState, sortPoolsListState } from "./store";
import { useLiveQuery } from "dexie-react-hooks";
import { useInterval } from "@/hooks/useInterval";
import { usePrices } from './helper';
import EditForm from './EditForm';
import PoolsList from './PoolsList';
import "./style.css";

// интервал таймера для авто обновления
const INTERVAL = 600;

export default function Pools({ db }) {
  const pools = useLiveQuery(() => db.pools.toArray(), [], []);
  const [, setPoolsList] = useRecoilState(poolsListState);
  const sortPools = useRecoilValue(sortPoolsListState);

  const [timer, setTimer] = useState(0);
  const [showDrawer, setShowDrawer] = useState(false);
  const [formAddress, setFormAddress] = useRecoilState(formAddressState);
  const [updatePrices, isUpdatePricesLoading] = usePrices(sortPools, db);

  // число для иконки прогресса
  const percent = 100 * timer / INTERVAL;

  useEffect(() => {
    setPoolsList(pools);
  }, [pools]); // eslint-disable-line react-hooks/exhaustive-deps

  // хук, отвечающий за автообновление по таймеру
  useInterval(async () => {
    setTimer(timer + 1);
    if (timer === INTERVAL) {
      await updatePrices();
      setTimer(1);
    }
  }, timer > 0 && !isUpdatePricesLoading ? 1000 : null);

  return (
    <>
      <Button
        type={"text"}
        size={"large"}
        shape={"circle"}
        className={"widget-button"}
        icon={<LineChartOutlined />}
        onClick={() => setShowDrawer(true)}
      />

      <Drawer
        title={false}
        open={showDrawer}
        className="pools"
        placement={"left"}
        width={600}
        onClose={() => setShowDrawer(false)}
      >
        <Card
          size="small"
          title="Цены в пулах"
          className="pools-list"
          extra={
            <Space>
              {timer > 0 && <Progress percent={percent} type="circle" showInfo={0} strokeWidth={12} />}

              <Button
                type={timer > 0 && "primary"}
                icon={<HistoryOutlined />}
                onClick={() => setTimer(timer > 0 ? 0 : 1)}
                disabled={isUpdatePricesLoading}
                title="Установить таймер (10 минут)"
              />

              <Button
                loading={isUpdatePricesLoading}
                icon={<ReloadOutlined />}
                onClick={() => {
                  updatePrices();
                  timer && setTimer(1);
                }}
                title="Обновить цену всех пулов"
              />

              <Button
                icon={formAddress === 0 ? <UpOutlined /> : <DownOutlined />}
                onClick={() => setFormAddress(formAddress === 0 ? null : 0)}
                title="Добавить пул"
              />
            </Space>
          }
        >
          {formAddress === 0 && <EditForm db={db} pool={null} />}

          <PoolsList db={db} />
        </Card>
      </Drawer>
    </>
  );
}
