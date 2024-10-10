import { useRef, useEffect } from 'react'
import { Collapse, Empty } from "antd";
import { useRecoilValue } from "recoil";
import { idState, filteredJournalState } from "./store";
import { usePagination } from "@/hooks/usePagination";
import { useScroll } from "@/hooks/useScroll";
import EditForm from "./EditForm";
import Children from "./position/Children";
import Extra from "./position/Extra";
import Label from "./position/Label";

export default function PositionList({ db }) {
  const id = useRecoilValue(idState);
  const filteredJournal = useRecoilValue(filteredJournalState);

  // infinite scrolling для длинного списка
  const pagination = usePagination(filteredJournal, 20);
  const observerRef = useRef();

  useEffect(() => {
    pagination.start()
  }, [filteredJournal]) // eslint-disable-line react-hooks/exhaustive-deps

  useScroll(observerRef, pagination.isMore, () => pagination.next());

  if (filteredJournal.length === 0) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return (
    <>
      {
        pagination.displayData.map((o) => (
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
      <div ref={observerRef} />
    </>
  )
}
