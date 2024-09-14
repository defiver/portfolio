import { FloatButton, Drawer } from "antd";
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
      <FloatButton
        onClick={() => setShowDrawer(true)}
        style={{ insetInlineStart: 24, insetBlockEnd: 310 }}
        icon={<img style={{ width: 16, height: 16 }} src={icon} />}
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
