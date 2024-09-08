import { FloatButton, Drawer } from "antd";
import { useState } from "react";
import icon from './icon.svg';
import PoolsList from './PoolsList';
import "./style.css";

export default function Sushi({ db }) {
  const [swowDrawer, setSwowDrawer] = useState(false);

  return (
    <>
      <FloatButton
        onClick={() => setSwowDrawer(true)}
        style={{ insetInlineStart: 24, insetBlockEnd: 310 }}
        icon={<img style={{ width: 18, height: 18 }} src={icon} />}
      />

      <Drawer
        title={false}
        open={swowDrawer}
        className="sushi"
        placement={"left"}
        width={500}
        onClose={() => setSwowDrawer(false)}
      >
        <PoolsList db={db} />
      </Drawer >
    </>
  );
}
