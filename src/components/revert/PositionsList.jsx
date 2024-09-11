import { Empty, Collapse } from "antd";
import Label from './position/Label';
import Children from "./position/Children";

export default function PositionsList({ revert }) {
  let positions = revert.map(a => a.positions).flat(1);
  positions = positions.filter(p => p?.performance.hodl?.fee_apr > 0 || p?.age < 1);
  positions = positions.sort((a, b) => b?.deposits_value - a?.deposits_value)

  if (positions.length === 0) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return positions.map(p => <Collapse
    className={"card-item"}
    size={"small"}
    key={p.pool + p.nft_id}
    items={[{
      key: p.pool + p.nft_id,
      showArrow: false,
      label: <Label position={p} />,
      children: <Children position={p} />,
    }]}
  />
  )
}