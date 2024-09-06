import { fetchingGet } from "@/utils/fetching";
import { localeNumber } from "@/utils/number";
import { useFetching } from "@/hooks/useFetching";
import { DownOutlined, UpOutlined, ReloadOutlined } from "@ant-design/icons";
import { Card, Space, Button, InputNumber } from "antd";
import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { useDB } from "@/hooks/useDB";
import AddForm from './AddForm';
import TokensList from './TokensList';

const LINK = "https://cryptorates.ai/files/standard.json";

export default function Tokens({ db }) {
  const [add, setAdd] = useState(false);
  const [inputAmount, setInputAmount] = useState(null);
  const tokens = useLiveQuery(() => db.tokens.toArray(), [], [])
  const journal = useLiveQuery(() => db.journal.toArray(), [], []);

  const [editTonen] = useDB(async (data) => {
    await db.tokens.put(data);
  }, false);

  const [fetchQuotes, isQuotesLoading] = useFetching(async () => {
    let quotes = await fetchingGet(LINK);
    for (const t of tokens) {
      for (const q of quotes) {
        if (q.symbol === t.token) {
          editTonen({ ...t, previous: t?.quote ?? 0, quote: q.rateUsd ?? 0 });
          break;
        }
      }
    }
  }, false);

  const sum = tokens.map(o => o.amount * (o.quote ?? 0)).reduce((a, b) => a + b, 0)
  const earned = journal.filter(o => o.income).map(o => o.income).reduce((a, b) => a + b, 0)

  return (
    <Card
      size="small"
      className="tokens-list"
      title={<>
        <span>${localeNumber(sum)}</span>
        <span style={{ fontSize: 12 }}> (${localeNumber(earned)})</span>
      </>}
      extra={
        <Space>
          <InputNumber
            style={{ maxWidth: 120 }}
            placeholder={"Amount"}
            value={inputAmount}
            onChange={setInputAmount}
            min={0}
          />
          <Button
            loading={isQuotesLoading}
            icon={<ReloadOutlined />}
            onClick={fetchQuotes}
          />
          <Button
            icon={add ? <UpOutlined /> : <DownOutlined />}
            onClick={() => setAdd(!add)}
          />
        </Space>
      }
    >
      {add && <AddForm position={{ id: 0, status: "active" }} setAdd={setAdd} db={db} />}

      <TokensList db={db} inputAmount={inputAmount} />
    </Card>
  );
}
