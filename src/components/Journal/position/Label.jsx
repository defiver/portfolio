import { stringToBackground } from "@/utils/colour";
import { Col, Row, Typography, Tag } from "antd";
import { localeNumber } from "@/utils/number";
import { useLiveQuery } from "dexie-react-hooks";

// левый и центральные блоки в заголоке позиции
export default function Label({ db, position }) {
  const chain = Array.isArray(position.chain) && position.chain.length ? position.chain[0].toLowerCase() : "";
  const tokens = useLiveQuery(() => db.tokens.toArray(), [], []);
  var label = [];

  // если в позиции есть токены, то выводим их вместе с общей стоимостью
  if (Array.isArray(position.tokens)) {
    let value = 0; // долларовая стоимость токенов в позиции

    position.tokens.forEach(t => {
      tokens.forEach(o => value += o.token === t?.token ? o.quote * t.amount : 0)
    });

    label = label.concat(position.tokens.map((o, i) => o && <Tag key={i}>{`${localeNumber(o.amount)} ${o.token}`}</Tag>));

    (value > 0 & position.status === "active") && label.push(<Tag title="Стоимость позиции в долларах" key="value">${localeNumber(value)}</Tag>)
  }

  // если позиция неактивна, добавляем прибыль
  if (position.status !== "active" && position.income) {
    let income = position?.income < 0 ? `-$${Math.abs(position.income)}` : `$${position.income}`;
    label.push(<Tag title="Доход" key="income" className={position?.income < 0 ? "warning-b" : "good-b"}>{income}</Tag>);
  }

  // добавляем сеть
  chain && label.push(<Typography.Text key="chain" code style={stringToBackground(chain)}>{chain}</Typography.Text>);

  // добавляем теги
  if (Array.isArray(position.tags)) {
    label = label.concat(position.tags.slice(0, Math.max(0, 4 - label.length)).map((tag) => <Typography.Text code key={tag} style={stringToBackground(tag)}>{tag}</Typography.Text>));
  }

  return (
    <Row gutter={[48, 8]}>
      <Col span={12} className={"ant-col-grid"}>
        <Typography.Paragraph ellipsis={true} style={{ marginBottom: 0 }}>{position.text}</Typography.Paragraph>
      </Col>

      <Col span={12} style={{ textAlign: "end", overflow: "hidden", height: 24 }}>
        <Typography.Paragraph ellipsis={true} style={{ marginBottom: 0 }}>{label}</Typography.Paragraph>
      </Col>
    </Row>
  );
}
