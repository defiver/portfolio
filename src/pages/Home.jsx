import { RecoilRoot } from "recoil";
import Journal from "@/components/journal/";
import Notes from "@/components/notes";
import Tokens from "@/components/tokens";
import Help from "@/components/help";
import Settings from "@/components/settings";
import Dexie from 'dexie';


const db = new Dexie("porfolio");
db.version(1).stores({
  journal: "++id, daterange, text, tokens, income, tags, transaction, status, chain, link",
  tokens: "&token, amount, quote, previous",
  notes: "++id, text, finish, order",
});

export default function Home() {
  document.title = "Portfolio | v0.0.2";

  return (
    <div className="container">
      <Notes db={db} />

      <Help />

      <Settings db={db} />

      <div className="journal">
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
