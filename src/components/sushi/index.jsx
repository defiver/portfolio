import { FloatButton, Drawer } from "antd";
import { useState } from "react";
import icon from './icon.svg';
import PoolsList from './PoolsList';
import "./style.css";

export default function Sushi({ db }) {
  const [showDrawer, setShowDrawer] = useState(false);

  return (
    <>
      <FloatButton
        onClick={() => setShowDrawer(true)}
        style={{ insetInlineStart: 24, insetBlockEnd: 410 }}
        icon={<img style={{ width: 18, height: 18 }} src={icon} />}
      />

      <Drawer
        title={false}
        open={showDrawer}
        className="sushi"
        placement={"left"}
        width={600}
        onClose={() => setShowDrawer(false)}
      >
        <PoolsList db={db} />
      </Drawer >
    </>
  );
}
