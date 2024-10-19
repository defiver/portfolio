import { FileTextOutlined } from "@ant-design/icons";
import { DownOutlined, UpOutlined, } from "@ant-design/icons";
import { Button, Card, Space, Drawer } from "antd";
import { useState } from "react";
import EditForm from './EditForm';
import NotesList from './NotesList';
import "./style.css";

export default function Notes({ db }) {
  const [showDrawer, setShowDrawer] = useState(false);
  const [id, setId] = useState(null);

  return (
    <>
      <Button
        type={"text"}
        size={"large"}
        shape={"circle"}
        className={"widget-button"}
        icon={<FileTextOutlined />}
        onClick={() => setShowDrawer(true)}
      />

      <Drawer
        title={false}
        open={showDrawer}
        className="notes"
        placement={"left"}
        width={500}
        onClose={() => setShowDrawer(false)}
      >
        <Card
          size="small"
          title="Заметки"
          className="note-list"
          extra={
            <Space>
              <Button
                icon={id === 0 ? <UpOutlined /> : <DownOutlined />}
                onClick={() => setId(id === 0 ? null : 0)}
                title="Добавить заметку"
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
