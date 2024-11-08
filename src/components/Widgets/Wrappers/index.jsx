import { CompassOutlined } from "@ant-design/icons";
import { Button, Drawer } from "antd";
import { useState } from "react";
import List from './List';
import "./style.css";

export default function Wrappers() {
  const [showDrawer, setShowDrawer] = useState(false);

  return (
    <>
      <Button
        type={"text"}
        size={"large"}
        shape={"circle"}
        className={"widget-button"}
        icon={<CompassOutlined />}
        onClick={() => setShowDrawer(true)}
      />

      <Drawer
        title={false}
        open={showDrawer}
        className="wrappers"
        placement={"left"}
        width={500}
        onClose={() => setShowDrawer(false)}
      >
        <List />
      </Drawer >
    </>
  );
}
