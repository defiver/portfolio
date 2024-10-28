import { Drawer } from "antd";
import { useState } from "react";
import Stats from "./Stats";
import Gas from "./Gas";

export default function Market({ autostart = true }) {
  const [showDrawer, setShowDrawer] = useState(false);

  return (
    <>
      <Gas
        autostart={autostart}
        setShowDrawer={setShowDrawer}
      />

      <Drawer
        destroyOnClose={true}
        title={false}
        open={showDrawer}
        className="gas"
        placement={"left"}
        width={500}
        onClose={() => setShowDrawer(false)}
      >
        <Stats />
      </Drawer >
    </>
  );
}
