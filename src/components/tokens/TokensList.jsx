import { Row, Empty, Col, Tag, Flex } from "antd";
import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { localeNumber, formatPercent } from "@/utils/number";
import EditForm from "./EditForm";

export default function TokensList({ db, inputAmount }) {
  const tokens = useLiveQuery(() => db.tokens.toArray(), [], []);
  const journal = useLiveQuery(() => db.journal.where({ status: "active" }).toArray(), [], []);
  const [token, setToken] = useState(null);

  if (tokens.length === 0) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  const used = {} // массив с тем, какая часть актива используется в активных позициях
  journal.map(j => j.tokens && j.tokens.forEach(o => {
    used[o.token] = (used[o.token] ?? 0) + o.amount;
  }));

  return (
    <Flex vertical gap={16}>
      {tokens.map((o) => (
        o.token === token?.token
          ? <EditForm key={o.token} token={token} setToken={setToken} db={db} />
          : <Row key={o.token} gutter={[16, 16]} className={token?.token ? "blur" : ""}>
            <Col span={4} style={{ cursor: "pointer" }} onClick={() => setToken(o)}>
              <Tag>{o.token}</Tag>
            </Col>

            <Col span={8}>
              <span>{localeNumber(o.amount)}</span>
              <span style={{ fontSize: 10 }}>
                /{localeNumber(o.amount - (used[o.token] ?? 0))}
              </span>
            </Col>

            <Col span={4}>
              <span>{localeNumber((inputAmount > 0 ? inputAmount : o.amount) * o.quote)} </span>
            </Col>

            <Col span={4} style={{ textAlign: "right" }}>
              <span>{localeNumber(o.quote)}</span>
            </Col>

            <Col span={4} style={{ fontSize: 12, textAlign: "right", alignSelf: "center" }}>
              <span>{formatPercent(o.quote, o.previous)}</span>
            </Col>
          </Row>
      ))}
    </Flex>
  )
}
