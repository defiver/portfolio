import { fetchingGet } from "@/utils/fetching";
import { useLoading } from "@/hooks/useLoading";
import { useLiveQuery } from "dexie-react-hooks";
import OppList from './OppList';
import chainIds from './chainIds.json';

const LINK = "https://api.merkl.xyz/v4/opportunities/?items=5000&status=LIVE&test=false";

export default function Opportunity({ db }) {
  const allOpp = useLiveQuery(() => db.merkl.toArray(), [], []);

  // получаем новые пулы, удаляем все старые, записываем новые по нужным полям
  const [fetchOpp, isOppLoading] = useLoading(async () => {
    const opportunities = await fetchingGet(LINK);
    if (Object.keys(opportunities).length > 0) {
      const live = Object.values(opportunities)
        .filter(o => o.status === "LIVE")
        .map(o => {
          let fresh = !allOpp.some(m => o.identifier === m.id);
          let chainId = chainIds[o.chainId] !== undefined ? o.chainId : "0";
          let chainName = chainIds[chainId].name;
          let url = `https://app.merkl.xyz/opportunities/${chainName}/${o.type}/${o.identifier}`;
          return { id: o.identifier, name: o.name, url, apr: o.aprRecord.cumulated, fresh, chain: chainId };
        });
      await db.transaction('rw', db.merkl, async function () {
        await db.merkl.clear();
        await db.merkl.bulkPut(live);
      });
    }
  }, false);

  return <OppList allOpp={allOpp} fetchOpp={fetchOpp} isOppLoading={isOppLoading} />

}
