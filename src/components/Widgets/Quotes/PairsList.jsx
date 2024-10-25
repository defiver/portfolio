import { localeNumber, formatPercent } from "@/utils/number";
import { DeleteOutlined } from "@ant-design/icons";
import { useLoading } from "@/hooks/useLoading";
import { Empty, Collapse, Tag, Popconfirm, Row, Col } from "antd";
import { useLiveQuery } from "dexie-react-hooks";
import PriceChart from "./PriceChart";

export default function PairsList({ db }) {
  const pairs = useLiveQuery(() => db.pairs.toArray(), [], []);

  const [deletePool, isDeletePollLoading] = useLoading(async (pair) => {
    await db.pairs.delete(pair);
  }, false);

  if (pairs.length === 0) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return pairs.map(o => <Collapse
    bordered={false}
    size={"small"}
    key={o.pair}
    destroyInactivePanel
    items={[
      {
        key: o.pair,
        showArrow: false,
        children: <PriceChart db={db} pair={o} />,
        label: <Row justify={"space-between"} align={"middle"}>
          <Col span={8}><Tag>{o.pair.replace("_", "")}</Tag></Col>
          <Col span={8} title="Цена с прошлого обновления">{localeNumber(o?.price || 0)}</Col>
          <Col span={7} style={{ fontSize: 12, alignSelf: "center" }} title="Изменение цены">
            {formatPercent(o?.price, o?.previous, 3)}
          </Col>
          <Col span={1}>
            <Popconfirm
              title="Удалить пару?"
              okText="Да"
              cancelText="Нет"
              onConfirm={(e) => { deletePool(o.pair); e.stopPropagation(); }}
              onCancel={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              <DeleteOutlined className="warning" disabled={isDeletePollLoading} />
            </Popconfirm>
          </Col>
        </Row>,
      },
    ]}
  />
  )
}