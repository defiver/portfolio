import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Flex, Popconfirm, Space, Typography } from "antd";
import { useRecoilState } from "recoil";
import { idState } from "../store";
import { useLoading } from "@/hooks/useLoading";
import dayjs from "dayjs";

// дополнительная информация позиции
export default function Children({ position, db }) {
  // устанавливает position id в форму редактирования
  const [, setId] = useRecoilState(idState);

  const [deletePosition, isDeletePositionLoading] = useLoading(async (id) => {
    await db.journal.delete(id)
  }, false);

  let age = 0;
  // расчёт возраста позиции из объекта dayjs
  if (position?.daterange && position.daterange[0] && dayjs(position.daterange[0].$d).isValid()) {
    age = dayjs().diff(position.daterange[0].$d, 'day', true).toFixed(2);
  }

  // проверка, если ли в ссылки в тексте из textarea
  const checkFirstLink = (links) => links && links.match(/^https?:\/\/([^/?#\s]+)/i);

  // отисовка домена первой ссылки
  const getFirstLink = (links) => {
    return <Typography.Link code href={links.match(/^([^\s]+)/i)[1]} target="_blank" >
      {links.match(/^https?:\/\/([^/?#\s]+)/i)[1]}
    </Typography.Link>
  }

  return (
    <>
      <Typography.Paragraph>{position.text}</Typography.Paragraph>
      <Flex justify={"space-between"} align={"center"}>
        <Space>
          <Typography.Text code>Age: {age} days</Typography.Text>
          {checkFirstLink(position.transactions) && getFirstLink(position.transactions)}
          {checkFirstLink(position.links) && getFirstLink(position.links)}
        </Space>
        <Space>
          <Popconfirm
            title="Delete the position?"
            onConfirm={() => deletePosition(position.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button loading={isDeletePositionLoading} icon={<DeleteOutlined />} className="warning" />
          </Popconfirm>
          <Button
            icon={<EditOutlined />}
            onClick={() => setId(position.id)}
            title="Edit position"
          />
        </Space>
      </Flex>
    </>
  );
}
