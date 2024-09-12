import { RecoilRoot } from "recoil";
import Journal from "@/components/journal/";
import Notes from "@/components/notes";
import Tokens from "@/components/tokens";
import Help from "@/components/help";
import Settings from "@/components/settings";
import Merkl from "@/components/merkl";
import Tools from "@/components/tools";
import Pools from "@/components/pools";
import Sushi from "@/components/sushi";
import Revert from "@/components/revert";
import Dexie from 'dexie';

export default function Home() {
  document.title = "Portfolio";

  // const params = new URLSearchParams(window.location.search);
  // params.get("extend") !== undefined

  const stores = {
    journal: "++id, daterange, text, tokens, income, tags, transactions, status, chain, links",
    tokens: "&token, amount, quote, previous",
    notes: "++id, text, finish",
    merkl: "&id, name, url, apr, fresh",
    pools: "&address, name, chain, price, previous, range, prices, inRange",
    sushi: "&address, name, link, chainId, params",
    revert: "&address, positions",
  }

  const db = new Dexie("porfolio");
  db.version(1).stores(stores);

  return (
    <div className="container">
      <Revert db={db} />

      <Sushi db={db} />

      <RecoilRoot>
        <Pools db={db} />
      </RecoilRoot>

      <Tools />

      <Notes db={db} />

      <Merkl db={db} />

      <Settings db={db} />

      <Help />

      <div className="center">
        <RecoilRoot>
          <Journal db={db} />
        </RecoilRoot>
      </div>

      <div className="widgets">
        <Tokens db={db} />
      </div>
    </div>
  );
}
