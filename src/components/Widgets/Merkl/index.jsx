import { Button, Drawer } from "antd";
import { useState } from "react";
import Opportunity from './Opportunity';
import icon from './icon.svg';
import "./style.css";

export default function Merkl({ db }) {
  const [showDrawer, setShowDrawer] = useState(false);

  return (
    <>
      <Button
        type={"text"}
        size={"large"}
        shape={"circle"}
        className={"widget-button"}
        icon={<img style={{ width: 19, height: 19 }} src={icon} />}
        onClick={() => setShowDrawer(true)}
      />

      <Drawer
        title={false}
        open={showDrawer}
        className="merkl"
        placement={"left"}
        width={500}
        onClose={() => setShowDrawer(false)}
      >
        <Opportunity db={db} />
      </Drawer >
    </>
  );
}
