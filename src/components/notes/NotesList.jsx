import { EditOutlined, DeleteOutlined, } from "@ant-design/icons";
import { Collapse, Empty, Flex, Typography, Space, Popconfirm, Button } from "antd";
import { useState } from "react";
import { useDB } from "@/hooks/useDB";
import { useLiveQuery } from "dexie-react-hooks";
import EditForm from "./EditForm";
import dayjs from "dayjs";

export default function NotesList({ db }) {
  const notes = useLiveQuery(() => db.notes.toArray(), [], []);
  const [id, setId] = useState(null);

  const [deleteNote, isDeleteNoteLoading] = useDB(async (id) => {
    await db.notes.delete(id)
  }, false);

  if (notes.length === 0) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return notes.map((o) => (
    o.id === id
      ? <EditForm key={o.id} note={o} setId={setId} db={db} />
      : <Collapse
        className={"ard-item"}
        bordered={false}
        size={"small"}
        key={o.id}
        items={[
          {
            key: o.id,
            showArrow: false,
            label: (
              <Flex justify={"space-between"}>
                <span>
                  {o?.text?.length > 23 ? `${o.text.match(/^.{1,20}/)}...` : o.text}
                </span>
                {o?.finish?.$d && (
                  <span className={dayjs(o.finish.$d).diff(dayjs()) < 259_200_000 ? "soon" : ""}>
                    {dayjs(o.finish.$d).format("DD.MM.YYYY")}
                  </span>
                )}
              </Flex>
            ),
            children: (
              <>
                <Typography.Paragraph>{o.text}</Typography.Paragraph>

                <Flex justify={"flex-end"}>
                  <Space>
                    <Popconfirm
                      title="Delete the note?"
                      onConfirm={() => deleteNote(o.id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button danger loading={isDeleteNoteLoading} icon={<DeleteOutlined />} />
                    </Popconfirm>

                    <Button icon={<EditOutlined />} onClick={() => setId(o.id)} />
                  </Space>
                </Flex>
              </>
            ),
          },
        ]}
      />
  ))
}