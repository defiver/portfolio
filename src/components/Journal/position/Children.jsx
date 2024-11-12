import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Flex, Popconfirm, Space, Typography, Row } from "antd";
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
  let soon = false;
  let dates = "";
  let datesTitle = "";
  // расчёт возраста позиции из объекта dayjs
  if (position?.daterange && position.daterange[0] && dayjs(position.daterange[0].$d).isValid()) {
    age = dayjs().diff(position.daterange[0].$d, 'day', true).toFixed(2);
    dates = dayjs(position.daterange[0].$d).format('DD.MM.YY');
    datesTitle = dayjs(position.daterange[0].$d).format('DD.MM.YYYY HH:mm');
    if (position.daterange[1] && dayjs(position.daterange[1].$d).isValid()) {
      dates += " - " + dayjs(position.daterange[1].$d).format('DD.MM.YY');
      datesTitle += " - " + dayjs(position.daterange[1].$d).format('DD.MM.YYYY HH:mm');
      // если до окончания срока позиции остаётся менее 3 суток, то выделяем даты
      soon = dayjs(position.daterange[1].$d).diff(dayjs()) < 86400 * 3 * 1000;
    }
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
        <Row>
          <Typography.Text code title={datesTitle} className={soon ? "warning" : ""}>{dates}</Typography.Text>
          <Typography.Text code title={`${age * 24} ч`}>Возраст: {age} д</Typography.Text>
          {checkFirstLink(position.transactions) && getFirstLink(position.transactions)}
          {checkFirstLink(position.links) && getFirstLink(position.links)}
        </Row>
        <Space>
          <Popconfirm
            title="Удалить запись?"
            onConfirm={() => deletePosition(position.id)}
            okText="Да"
            cancelText="Нет"
          >
            <Button loading={isDeletePositionLoading} icon={<DeleteOutlined />} className="warning" />
          </Popconfirm>
          <Button
            icon={<EditOutlined />}
            onClick={() => setId(position.id)}
            title="Редактировать запись"
          />
        </Space>
      </Flex>
    </>
  );
}
