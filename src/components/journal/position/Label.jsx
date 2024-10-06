import { stringToColour } from "@/utils/colour";
import { Col, Row, Typography, Tag } from "antd";
import { localeNumber } from "@/utils/number";
import { useLiveQuery } from "dexie-react-hooks";

// левый и центральные блоки в заголоке позиции
export default function Label({ db, position }) {
  const chain = position?.chain && position.chain.length ? position.chain[0].toLowerCase() : "";
  const tokens = useLiveQuery(() => db.tokens.toArray(), [], []);
  var label = position.text;

  // если в позиции есть токены, то выводим их вместе с общей стоимостью
  if (position?.tokens) {
    let value = 0; // долларовая стоимость токенов в позиции
    position.tokens.forEach(t => {
      tokens.forEach(o => value += o.token === t.token ? o.quote * t.amount : 0)
    });

    label = position.tokens.map((o, i) => o && <Tag key={i}>{`${localeNumber(o.amount)} ${o.token}`}</Tag>);
    value > 0 && label.push(<Tag key="value">${`${localeNumber(value)}`}</Tag>)
  }

  return (
    <Row gutter={[8, 8]}>
      <Col span={14} className={"ant-col-grid"}>
        <Typography.Paragraph ellipsis={true} style={{ marginBottom: 0 }}>{label}</Typography.Paragraph>
      </Col>

      <Col span={10}>
        {position.tags && position.tags.slice(0, 3).map((tag) => (
          <Typography.Text code key={tag} style={stringToColour(tag)}>{tag}</Typography.Text>
        ))}

        {chain && <Typography.Text code style={stringToColour(chain)}>{chain}</Typography.Text>}
      </Col>
    </Row>
  );
}
