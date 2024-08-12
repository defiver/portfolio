import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Flex, Popconfirm, Space, Typography } from "antd";
import { useRecoilState } from "recoil";
import { idState } from "../store";
import { useDB } from "@/hooks/useDB";
import dayjs from "dayjs";

export default function Children({ position, db }) {
  const [, setId] = useRecoilState(idState);

  const [deletePosition, isDeletePositionLoading] = useDB(async (id) => {
    await db.journal.delete(id)
  }, false);

  let date = [];
  if (position?.daterange && position.daterange[0] && dayjs(position.daterange[0].$d).isValid()) {
    date.push(dayjs(position.daterange[0].$d).format("DD.MM.YYYY"));
  }
  if (position?.daterange && position.daterange[1] && dayjs(position.daterange[1].$d).isValid()) {
    date.push(dayjs(position.daterange[1].$d).format("DD.MM.YYYY"));
  }

  return (
    <>
      <Typography.Paragraph>{position.text}</Typography.Paragraph>
      <Flex justify={"space-between"} align={"center"}>
        <Space>
          {date.length > 0 && (
            <Typography.Text code>
              {date.join(" - ")}
            </Typography.Text>
          )}
          {position.link && position.link.match(/^https?:\/\/([^/?#]+)/i) && (
            <Typography.Link code href={position.link} target="_blank">
              {position.link.match(/^https?:\/\/([^/?#]+)/i)[1]}
            </Typography.Link>
          )}
        </Space>
        <Space>
          <Popconfirm
            title="Delete the position?"
            onConfirm={() => deletePosition(position.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger loading={isDeletePositionLoading} icon={<DeleteOutlined />} />
          </Popconfirm>
          <Button
            icon={<EditOutlined />}
            onClick={() => setId(position.id)}
          />
        </Space>
      </Flex>
    </>
  );
}
