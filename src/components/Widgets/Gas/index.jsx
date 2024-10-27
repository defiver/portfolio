import { Drawer } from "antd";
import { useState } from "react";
import Market from "./Market";
import GasIcon from "./GasIcon";

export default function Gas({ autostart = true }) {
  const [showDrawer, setShowDrawer] = useState(false);

  return (
    <>
      <GasIcon
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
        <Market />
      </Drawer >
    </>
  );
}
