import { useRef, useState } from "react";
import { Row, Col, Splitter } from "antd";
import { RecoilRoot } from "recoil";
import { loadStorage, saveStorage } from '@/utils/storage';
import { Notes, Help, Settings, Merkl, Tools, Pools, Llama, Calculator, Market, Quotes } from '@/components/Widgets';
import { WidgetsList } from '@/components/Widgets';
import Journal from "@/components/Journal/";
import Tokens from "@/components/Tokens";
import Dexie from 'dexie';

export default function Home() {
  document.title = "Portfolio";

  // получаем размеры разделителя панелей из local storage
  const sizes = useRef(loadStorage("splitter_sizes"));
  if (sizes.current.length === 0) {
    sizes.current = ["62%", "38%"];
  }

  // поля для IndexedDB
  const stores = {
    journal: "++id, daterange, text, tokens, income, tags, transactions, status, chain, links",
    tokens: "&token, amount, quote, previous",
    notes: "++id, text, finish",
    merkl: "&id, name, url, apr, fresh",
    pools: "&address, name, chain, price, previous, range, prices, inRange, notify, sleep",
    llama: "&pool, name, project, chain, tvl, apy, stable, il, apy30d, exposure, outlier",
    pairs: "&pair, coin, currency, period, price, change",
  }

  const db = new Dexie("porfolio");
  db.version(1).stores(stores);

  // берём с localStorage виджеты, которые будут отображаться на главной странице
  const [favorites, setFavorites] = useState(loadStorage("favorite_widgets"));

  const widgets = [
    { "component": <Market />, "name": "Рынок", key: "market" },
    { "component": <Merkl db={db} />, "name": "Пулы на Merkl", key: "merkl" },
    { "component": <RecoilRoot><Llama db={db} /></RecoilRoot>, "name": "DeFiLlama", key: "llama" },
    { "component": <RecoilRoot><Pools db={db} /></RecoilRoot>, "name": "Цены в пулах", key: "pools" },
    { "component": <Quotes db={db} />, "name": "Котировки", key: "quotes" },
    { "component": <Calculator />, "name": "Калькуляторы", key: "calculator" },
    { "component": <Notes db={db} />, "name": "Заметки", key: "notes" },
    { "component": <Tools />, "name": "Инструменты", key: "tools" },
    { "component": <Settings db={db} />, "name": "База данных", key: "settings" },
    { "component": <Help />, "name": "Помощь", key: "help" },
  ];

  return (
    <Row gutter={[24, 16]}>
      <Col span={24} lg={2}>
        <div className="widgets">
          {widgets.filter(o => favorites.includes(o.key)).map(o => <span key={o.key} title={o.name}>{o.component}</span>)}
          <WidgetsList widgets={widgets} favorites={favorites} setFavorites={setFavorites} />
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
    </Row >
  );
}
