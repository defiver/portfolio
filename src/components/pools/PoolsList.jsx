import { Empty, Flex } from "antd";
import { useLiveQuery } from "dexie-react-hooks";
import PoolRow from './PoolRow';

export default function PoolsList({ db, setPool }) {
  const pools = useLiveQuery(() => db.pools.toArray(), [], []);

  if (pools.length === 0) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return (
    <Flex vertical gap={16}>
      {pools.map(o => <PoolRow key={o.address} db={db} pool={o} setPool={setPool} />)}
    </Flex>
  )
}