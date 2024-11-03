import { ToolOutlined } from "@ant-design/icons";
import { Button, Drawer } from "antd";
import { useState } from "react";
import List from './List';
import "./style.css";

export default function Tools() {
  const [showDrawer, setShowDrawer] = useState(false);

  return (
    <>
      <Button
        type={"text"}
        size={"large"}
        shape={"circle"}
        className={"widget-button"}
        icon={<ToolOutlined />}
        onClick={() => setShowDrawer(true)}
      />

      <Drawer
        title={false}
        open={showDrawer}
        className="tools"
        placement={"left"}
        width={600}
        onClose={() => setShowDrawer(false)}
      >
        <List />
      </Drawer>
    </>
  );
}
