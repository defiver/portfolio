import { Card } from "antd";
import { useRecoilState, useRecoilValue } from "recoil";
import { journalState, idState } from "./store";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";
import Header from "./Header";
import EditForm from './EditForm';
import PositionList from './PositionList';
import Chart from './Chart';
import "./style.css";

export default function Journal({ db }) {
  const journal = useLiveQuery(() => db.journal.reverse().toArray(), [], [])
  const [, setJournal] = useRecoilState(journalState);
  const id = useRecoilValue(idState);
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    setJournal(journal);
  }, [journal]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Card
      size="small"
      className="journal"
      title={false}
      extra={<Header showChart={showChart} setShowChart={setShowChart} />}
    >
      {showChart && <Chart journal={journal} />}
      {id === 0 && <EditForm db={db} />}
      <PositionList db={db} />
    </Card>
  );
}
