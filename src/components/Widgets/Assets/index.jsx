import { WalletOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import { Tabs, Skeleton } from "antd";
import { useState, useEffect, useRef } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { useLoading } from "@/hooks/useLoading";
import { fetchingGet } from "@/utils/fetching";
import Stats from "./tabs/Stats";
import Charts from "./tabs/Charts";
import AssetsList from "./tabs/AssetsList";
import Transactions from "./tabs/Transactions";
import "./style.css";

// const LINK = "https://api.cryptorank.io/v0/coins/v2?lifeCycle=traded&limit=1500";
const LINK = "https://http-api.livecoinwatch.com/coins?offset=0&limit=1000&sort=cap&order=descending&currency=USD";

export default function Assets({ db }) {
  const [showModal, setshowModal] = useState(false);
  const [tokens, setTokens] = useState({});
  const transactions = useLiveQuery(() => db.assets.toArray(), [], []).sort((a, b) => b.date - a.date);

  // цены будут загружаться не чаще, чем в пять минут и только при открытии окна
  const timeCache = useRef(0);

  const [fetchTokens, isTokensLoading] = useLoading(async () => {
    const now = Date.now();
    if (Object.keys(tokens).length === 0 || now - timeCache.current > 1000 * 300) {
      let data = await fetchingGet(LINK);
      let tkns = {}; // заносим данные в объект
      (data?.data || []).forEach(o => {
        // в списке есть повторяющтеся тикеры, поэтому оставляем те, которые выше в рейтинге
        if (!(o.code in tkns)) {
          tkns[o.code] = { name: o.name, symbol: o.code, price: o.price }
        }
      });
      Object.keys(tkns).length > 0 && setTokens(tkns);
      timeCache.current = now;
    }
  }, true);

  useEffect(() => {
    showModal && fetchTokens();
  }, [showModal]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Button
        type={"text"}
        size={"large"}
        shape={"circle"}
        className={"widget-button"}
        icon={<WalletOutlined />}
        onClick={() => setshowModal(true)}
      />

      <Modal
        title={false}
        footer={null}
        className="assets"
        open={showModal}
        onOk={() => setshowModal(false)}
        onCancel={() => setshowModal(false)}
        afterClose={() => setshowModal(false)}
        width={980}
        style={{ top: 20 }}
      >
        <Tabs
          defaultActiveKey="1"
          type="card"
          size={"small"}
          items={[
            {
              disabled: isTokensLoading,
              label: "Статистика",
              key: "stats",
              children: isTokensLoading
                ? <Skeleton loading active paragraph={{ rows: 5 }} title={false} />
                : <Stats transactions={transactions} tokens={tokens} />
            },
            {
              disabled: isTokensLoading,
              label: "Графики",
              key: "charts",
              children: isTokensLoading
                ? <Skeleton loading active paragraph={{ rows: 5 }} title={false} />
                : <Charts transactions={transactions} tokens={tokens} />
            },
            {
              disabled: isTokensLoading,
              label: "Активы",
              key: "assets",
              children: isTokensLoading
                ? <Skeleton loading active paragraph={{ rows: 5 }} title={false} />
                : <AssetsList db={db} transactions={transactions} tokens={tokens} />
            },
            {
              disabled: isTokensLoading,
              label: "Транзакции",
              key: "transactions",
              children: isTokensLoading
                ? <Skeleton loading active paragraph={{ rows: 5 }} title={false} />
                : <Transactions db={db} transactions={transactions} tokens={tokens} />
            },
          ]}
        />
      </Modal>
    </>
  );
}
