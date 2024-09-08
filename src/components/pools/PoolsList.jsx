import { Empty, Collapse } from "antd";
import { useRecoilValue } from "recoil";
import { sortPoolsListState, formAddressState } from "./store";
import PriceChart from "./pool/PriceChart";
import PoolRow from './pool/PoolRow';
import EditForm from './EditForm';

export default function PoolsList({ db }) {
  const pools = useRecoilValue(sortPoolsListState);
  const formAddress = useRecoilValue(formAddressState);

  if (pools.length === 0) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return pools.map(o => formAddress === o.address
    ? <EditForm key={o.address} db={db} pool={o} />
    : <Collapse
      className={"card-item"}
      bordered={false}
      size={"small"}
      key={o.address}
      items={[
        {
          key: o.id,
          showArrow: false,
          label: <PoolRow db={db} pool={o} />,
          children: <PriceChart db={db} pool={o} />,
        },
      ]}
    />
  )
}