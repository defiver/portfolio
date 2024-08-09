import { stringToColour } from "@/utils/colour";
import { Col, Row, Typography, Tag } from "antd";

export default function Label({ position }) {
  return (
    <Row gutter={[8, 8]}>
      <Col span={14} className={"ant-col-grid"}>
        <Typography.Paragraph ellipsis={true} style={{ marginBottom: 0 }}>
          {position.tokens
            ? position.tokens.map((o, i) => o && <Tag key={i}>{`${o.amount} ${o.token}`}</Tag>)
            : position.text
          }
        </Typography.Paragraph>
      </Col>
      <Col span={10}>
        {position.tags && position.tags.slice(0, 2).map((tag) => (
          <Typography.Text code key={tag} style={stringToColour(tag)}>
            {tag}
          </Typography.Text>
        ))}
      </Col>
    </Row>
  );
}
