import { Button, Drawer } from "antd";
import { useState } from "react";
import { fetchingGet } from "@/utils/fetching";
import { useLoading } from "@/hooks/useLoading";
import { useLiveQuery } from "dexie-react-hooks";
import OppList from './OppList';
import chainIds from './chainIds.json';
import icon from './icon.svg';
import "./style.css";

const LINK = "https://api.merkl.xyz/v3/opportunity?campaigns=false&testTokens=false";

export default function Merkl({ db }) {
  const [showDrawer, setShowDrawer] = useState(false);
  const allOpp = useLiveQuery(() => db.merkl.toArray(), [], []);

  // получаем новые пулы, удаляем все старые, записываем новые по нужным полям
  const [fetchOpp, isOppLoading] = useLoading(async () => {
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
      await db.transaction('rw', db.merkl, async function () {
        await db.merkl.clear();
        await db.merkl.bulkPut(live);
      });
    }
  }, false);

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
        <OppList allOpp={allOpp} fetchOpp={fetchOpp} isOppLoading={isOppLoading} />
      </Drawer >
    </>
  );
}
