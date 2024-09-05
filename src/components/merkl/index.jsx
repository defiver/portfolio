import { MediumOutlined } from "@ant-design/icons";
import { FloatButton, Drawer } from "antd";
import { useState } from "react";
import { fetchingGet } from "@/utils/fetching";
import { useFetching } from "@/hooks/useFetching";
import { useLiveQuery } from "dexie-react-hooks";
import OppList from './OppList';
import chainIds from './chainIds.json';

const LINK = "https://api.merkl.xyz/v3/opportunity?campaigns=false&testTokens=false";

export default function Merkl({ db }) {
  const [swowDrawer, setSwowDrawer] = useState(false);
  const allOpp = useLiveQuery(() => db.merkl.toArray(), [], []);

  const [fetchOpp, isOppLoading] = useFetching(async () => {
    const opportunities = await fetchingGet(LINK);
    if (Object.keys(opportunities).length > 0) {
      const live = Object.values(opportunities)
        .filter(o => o.status === "live")
        .map(o => {
          let fresh = !allOpp.some(m => o.id === m.id);
          let chainId = chainIds[o.chainId] !== undefined ? o.chainId : "0";
          let chainName = chainIds[chainId].name;
          let url = `https://merkl.angle.money/${chainName}/${o.action}/${o.id.replace("_", "/")}`;
          return { id: o.id, name: o.name, url, apr: o.apr, fresh, chain: chainId };
        });
      db.transaction('rw', db.merkl, function () {
        db.merkl.clear();
        db.merkl.bulkPut(live);
      });
    }
  }, false);

  return (
    <>
      <FloatButton
        onClick={() => setSwowDrawer(true)}
        style={{ insetInlineStart: 24, insetBlockEnd: 110 }}
        icon={<MediumOutlined />}
      />

      <Drawer
        title={false}
        open={swowDrawer}
        className="merkl"
        placement={"left"}
        width={500}
        onClose={() => setSwowDrawer(false)}
      >
        <OppList allOpp={allOpp} fetchOpp={fetchOpp} isOppLoading={isOppLoading} />
      </Drawer >
    </>
  );
}
