import { DeleteOutlined } from "@ant-design/icons";
import { useLoading } from "@/hooks/useLoading";
import { Empty, Collapse, Tag, Popconfirm, Flex } from "antd";
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
        label: <Flex justify={"space-between"}>
          <Tag>{o.pair.replace("_", "")}</Tag>
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
        </Flex>,
      },
    ]}
  />
  )
}