import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Flex, Popconfirm, Space, Typography } from "antd";
import { useRecoilState } from "recoil";
import { idState } from "../store";
import { useLoading } from "@/hooks/useLoading";
import dayjs from "dayjs";

export default function Children({ position, db }) {
  const [, setId] = useRecoilState(idState);

  const [deletePosition, isDeletePositionLoading] = useLoading(async (id) => {
    await db.journal.delete(id)
  }, false);

  let age = 0;
  if (position?.daterange && position.daterange[0] && dayjs(position.daterange[0].$d).isValid()) {
    age = dayjs().diff(position.daterange[0].$d, 'day', true).toFixed(2);
  }

  return (
    <>
      <Typography.Paragraph>{position.text}</Typography.Paragraph>
      <Flex justify={"space-between"} align={"center"}>
        <Space>
          <Typography.Text code>Age: {age} days</Typography.Text>
          {position.transactions && position.transactions.match(/^https?:\/\/([^/?#\s]+)/i) && (
            <Typography.Link code href={position.transactions.match(/^([^\s]+)/i)[1]} target="_blank">
              {position.transactions.match(/^https?:\/\/([^/?#\s]+)/i)[1]}
            </Typography.Link>
          )}
          {position.links && position.links.match(/^https?:\/\/([^/?#\s]+)/i) && (
            <Typography.Link code href={position.links.match(/^([^\s]+)/i)[1]} target="_blank">
              {position.links.match(/^https?:\/\/([^/?#\s]+)/i)[1]}
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
            <Button loading={isDeletePositionLoading} icon={<DeleteOutlined />} style={{ color: "red" }} />
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
