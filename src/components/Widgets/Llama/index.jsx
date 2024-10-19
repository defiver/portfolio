import { Button, Drawer } from "antd";
import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { poolsState } from "./store";
import icon from './icon.svg';
import PoolsList from './PoolsList';
import "./style.css";

export default function Llama({ db }) {
  const [showDrawer, setShowDrawer] = useState(false);
  const pools = useLiveQuery(() => db.llama.toArray(), [], []);
  const [, setPools] = useRecoilState(poolsState);

  useEffect(() => {
    setPools(pools);
  }, [pools]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Button
        type={"text"}
        size={"large"}
        shape={"circle"}
        className={"widget-button"}
        icon={<img style={{ width: 16, height: 16 }} src={icon} />}
        onClick={() => setShowDrawer(true)}
      />

      <Drawer
        title={false}
        open={showDrawer}
        className="llama"
        placement={"left"}
        width={600}
        onClose={() => setShowDrawer(false)}
      >
        <PoolsList db={db} />
      </Drawer >
    </>
  );
}
