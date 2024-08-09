import { DownOutlined, UpOutlined, } from "@ant-design/icons";
import { Button, Card, Space, FloatButton, Drawer } from "antd";
import { useState } from "react";
import EditForm from './EditForm';
import NotesList from './NotesList';

export default function Notes({ db }) {
  const [swowNotes, setSwowNotes] = useState(false);
  const [id, setId] = useState(null);

  return (
    <>
      <FloatButton onClick={() => setSwowNotes(true)} style={{ insetInlineStart: 24 }} />

      <Drawer
        title={false}
        open={swowNotes}
        className="notes"
        placement={"left"}
        onClose={() => setSwowNotes(false)}
      >
        <Card
          size="small"
          title="Notes"
          className="note-list"
          extra={
            <Space>
              <Button
                icon={id === 0 ? <UpOutlined /> : <DownOutlined />}
                onClick={() => setId(id === 0 ? null : 0)}
              />
            </Space>
          }
        >
          {id === 0 && <EditForm note={{ id: 0 }} setId={setId} db={db} />}

          <NotesList db={db} />
        </Card>
      </Drawer >
    </>
  );
}
