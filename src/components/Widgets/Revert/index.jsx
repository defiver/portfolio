import { Button, Drawer } from "antd";
import { useState } from "react";
import Positions from './Positions';
import icon from './icon.svg';
import "./style.css";

export default function Revert({ db }) {
  const [showDrawer, setShowDrawer] = useState(false);

  return (
    <>
      <Button
        type={"text"}
        size={"large"}
        shape={"circle"}
        className={"widget-button"}
        icon={<img style={{ width: 18, height: 18 }} src={icon} />}
        onClick={() => setShowDrawer(true)}
      />

      <Drawer
        title={false}
        open={showDrawer}
        className="revert"
        placement={"left"}
        width={500}
        onClose={() => setShowDrawer(false)}
      >
        <Positions db={db} />
      </Drawer >
    </>
  );
}
