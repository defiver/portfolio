import { EditOutlined, DeleteOutlined, } from "@ant-design/icons";
import { Collapse, Empty, Flex, Typography, Space, Popconfirm, Button } from "antd";
import { useState } from "react";
import { useLoading } from "@/hooks/useLoading";
import { useLiveQuery } from "dexie-react-hooks";
import EditForm from "./EditForm";
import dayjs from "dayjs";

export default function NotesList({ db }) {
  const notes = useLiveQuery(() => db.notes.toArray(), [], []);
  const [id, setId] = useState(null);  // устанавливает note id в форму редактирования

  const [deleteNote, isDeleteNoteLoading] = useLoading(async (id) => {
    await db.notes.delete(id)
  }, false);

  if (notes.length === 0) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return notes.map((o) => (
    o.id === id
      ? <EditForm key={o.id} note={o} setId={setId} db={db} />
      : <Collapse
        className={id ? "card-item blur" : "card-item"}
        size={"small"}
        key={o.id}
        items={[
          {
            key: o.id,
            showArrow: false,
            label: (
              <Flex justify={"space-between"}>
                <span>
                  {o?.text?.length > 58 ? `${o.text.match(/^((?:.|\n)*?){1,55}/g)}...` : o.text}
                </span>
                {o?.finish?.$d && (
                  <span className={dayjs(o.finish.$d).diff(dayjs()) < 259_200_000 ? "warning" : ""}>
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
                      title="Удалить заметку?"
                      onConfirm={() => deleteNote(o.id)}
                      okText="Да"
                      cancelText="Нет"
                    >
                      <Button
                        loading={isDeleteNoteLoading}
                        icon={<DeleteOutlined />}
                        className="warning"
                      />
                    </Popconfirm>

                    <Button icon={<EditOutlined />} onClick={() => setId(o.id)} title="Редактировать заметку" />
                  </Space>
                </Flex>
              </>
            ),
          },
        ]}
      />
  ))
}
