import { Collapse, Empty } from "antd";
import { useRecoilValue } from "recoil";
import { idState, filteredJournalState } from "./store";
import EditForm from "./EditForm";
import Children from "./position/Children";
import Extra from "./position/Extra";
import Label from "./position/Label";

export default function PositionList({ db }) {
  const id = useRecoilValue(idState);
  const filteredJournal = useRecoilValue(filteredJournalState);

  if (filteredJournal.length === 0) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return filteredJournal.map((o) => (
    o.id === id
      ? <EditForm key={o.id} position={o} db={db} />
      : <Collapse
        destroyInactivePanel={true}
        className={id ? "card-item blur" : "card-item"}
        size={"small"}
        key={o.id}
        items={[{
          key: o.id,
          showArrow: false,
          extra: <Extra position={o} />,
          label: <Label position={o} db={db} />,
          children: <Children position={o} db={db} />,
        }]}
      />
  ))
}
