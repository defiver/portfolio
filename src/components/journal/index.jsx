import { Card } from "antd";
import { useRecoilState, useRecoilValue } from "recoil";
import { journalState, idState } from "./store";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect } from "react";
import Header from "./Header";
import EditForm from './EditForm';
import PositionList from './PositionList';

export default function Journal({ db }) {
  const journal = useLiveQuery(() => db.journal.toArray(), [], [])
  const [, setJournal] = useRecoilState(journalState);
  const id = useRecoilValue(idState);

  useEffect(() => {
    setJournal(journal);
  }, [journal]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Card
      size="small"
      className="journal-card"
      title={false}
      extra={<Header />}
    >
      {id === 0 && <EditForm />}

      <PositionList db={db} />
    </Card>
  );
}
