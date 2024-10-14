import { useRef } from "react";
import { Row, Col, Splitter } from "antd";
import { RecoilRoot } from "recoil";
import { loadStorage, saveStorage } from '@/utils/storage';
import Journal from "@/components/journal/";
import Notes from "@/components/notes";
import Tokens from "@/components/tokens";
import Help from "@/components/help";
import Settings from "@/components/settings";
import Merkl from "@/components/merkl";
import Tools from "@/components/tools";
import Pools from "@/components/pools";
import Llama from "@/components/llama";
import Calculator from "@/components/calculator";
// import Sushi from "@/components/sushi";
// import Revert from "@/components/revert";
import Dexie from 'dexie';

export default function Home() {
  document.title = "Portfolio";

  // получаем размеры разделителя панелей из local storage
  const sizes = useRef(loadStorage("splitter_sizes"));
  if (sizes.current.length === 0) {
    sizes.current = ["62%", "38%"];
  }

  // const params = new URLSearchParams(window.location.search);
  // params.get("extend") !== undefined

  // поля для IndexedDB
  const stores = {
    journal: "++id, daterange, text, tokens, income, tags, transactions, status, chain, links",
    tokens: "&token, amount, quote, previous",
    notes: "++id, text, finish",
    merkl: "&id, name, url, apr, fresh",
    pools: "&address, name, chain, price, previous, range, prices, inRange, notify, sleep",
    llama: "&pool, name, project, chain, tvl, apy, stable, il, apy30d, exposure, outlier",
    // sushi: "&address, name, link, chainId, params",
    // revert: "&address, positions",
  }

  const db = new Dexie("porfolio");
  db.version(1).stores(stores);

  return (
    <Row gutter={[24, 16]}>
      <Col span={24} lg={2}>
        <div className="widgets">
          {/* <Revert db={db} /> */}
          {/* <Sushi db={db} /> */}

          <Merkl db={db} />
          <RecoilRoot>
            <Llama db={db} />
            <Pools db={db} />
          </RecoilRoot>

          <Calculator />

          <Notes db={db} />
          <Tools />
          <Settings db={db} />
          <Help />
        </div>
      </Col>

      <Col span={24} lg={21}>
        <Splitter onResizeEnd={(arr) => saveStorage("splitter_sizes", arr)}>
          <Splitter.Panel defaultSize={sizes.current[0]} min={0}>
            <RecoilRoot>
              <Journal db={db} />
            </RecoilRoot>
          </Splitter.Panel>
          <Splitter.Panel defaultSize={sizes.current[1]} min={0}>
            <Tokens db={db} />
          </Splitter.Panel>
        </Splitter>
      </Col>
    </Row>
  );
}
