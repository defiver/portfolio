import { Button, Drawer } from "antd";
import { useState } from "react";
import Pools from './Pools';
import icon from './icon.svg';
import "./style.css";

export default function Llama({ db }) {
  const [showDrawer, setShowDrawer] = useState(false);

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
        <Pools db={db} />
      </Drawer >
    </>
  );
}
