import { fetchingGet } from "@/utils/fetching";
import { useLoading } from "@/hooks/useLoading";
import { useLiveQuery } from "dexie-react-hooks";
import OppList from './OppList';
import chainIds from './chainIds.json';

const LINK = "https://api.merkl.xyz/v3/opportunity?campaigns=false&testTokens=false";

export default function Opportunity({ db }) {
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

  return <OppList allOpp={allOpp} fetchOpp={fetchOpp} isOppLoading={isOppLoading} />

}
