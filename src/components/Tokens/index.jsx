import { fetchingGet } from "@/utils/fetching";
import { localeNumber } from "@/utils/number";
import { DownOutlined, UpOutlined, ReloadOutlined } from "@ant-design/icons";
import { Card, Space, Button } from "antd";
import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { useLoading } from "@/hooks/useLoading";
import MyInputNumber from "@/components/MyInputNumber";
import AddForm from './AddForm';
import TokensList from './TokensList';
import "./style.css";

const LINK = "https://api.cryptorank.io/v0/coins/v2?lifeCycle=traded&limit=3000"; // ресурс с котировками

export default function Tokens({ db }) {
  const [add, setAdd] = useState(false);
  const [inputAmount, setInputAmount] = useState(null);
  const tokens = useLiveQuery(() => db.tokens.toArray(), [], [])
  const journal = useLiveQuery(() => db.journal.toArray(), [], []);

  const [editTonen] = useLoading(async (data) => {
    await db.tokens.put(data);
  }, false);

  const [fetchQuotes, isQuotesLoading] = useLoading(async () => {
    let quotes = await fetchingGet(LINK);
    let prices = quotes?.data || [];
    // обновляем цены тех токенов, которые есть в общем списке с котировками
    for (const t of tokens) {
      for (const q of prices) {
        if (q.symbol.toLowerCase() === t.token.toLowerCase()) {
          editTonen({ ...t, previous: t?.quote ?? 0, quote: q.price.USD ?? 0 });
          break;
        }
      }
    }
  }, false);

  // сумма всех ативов в $
  const sum = tokens.map(o => o.amount * (o.quote ?? 0)).reduce((a, b) => a + b, 0);
  // доход со всех позиций в $
  const earned = journal.filter(o => o.income).map(o => o.income).reduce((a, b) => a + b, 0);

  return (
    <Card
      size="small"
      className="tokens"
      title={<>
        <span title="Стоимость всех токенов в долларах">${localeNumber(sum)}</span>
        <span title="Сколько долларов заработано" style={{ fontSize: 12 }}> (${localeNumber(earned)})</span>
      </>}
      extra={
        <Space>
          <MyInputNumber
            style={{ maxWidth: 120 }}
            placeholder={"Кол-во (0.45)"}
            value={inputAmount}
            onChange={setInputAmount}
            min={0}
          />
          <Button
            loading={isQuotesLoading}
            icon={<ReloadOutlined />}
            onClick={fetchQuotes}
            title="Обновить цены"
          />
          <Button
            icon={add ? <UpOutlined /> : <DownOutlined />}
            onClick={() => setAdd(!add)}
            title="Добавить токен"
          />
        </Space>
      }
    >
      {add && <AddForm position={{ id: 0, status: "active" }} setAdd={setAdd} db={db} />}

      <TokensList db={db} inputAmount={inputAmount} />
    </Card>
  );
}
