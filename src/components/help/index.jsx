import { QuestionCircleOutlined } from "@ant-design/icons";
import { FloatButton, Modal, Collapse } from "antd";
import { useState } from "react";

export default function Help() {
  const [swowModal, setSwowModal] = useState(false);

  const items = [
    {
      key: "1",
      label: "Что это?",
      children: <p>Это небольшое веб-приложение для учёта позиций в DeFi. Оно представляет из себя обычную html страницу, которую при желании можно сохранить и запускать локально. Исходный код выложен на <a href="https://github.com/defiver/portfolio">Github</a>. Приложение не оптимизировано для смартфонов и находится в альфа версии, поэтому может сбоить, изменяться и дополняться. По всем вопросам и предложениям можно писать в телеграм: <a href="https://t.me/norit0">@norit0</a>.</p>,
    },
    {
      key: "2",
      label: "А безопасно ли это?",
      children: <p>Все данные, которые вы загружаете и вносите в формы, хранятся в вашем браузере <i>(их можно посмотреть в меню разработчика: клавиша F12, вкладка Хранилище или Application в зависимости от браузера)</i>.</p>,
    },
    {
      key: "3",
      label: "Что на центральной панели?",
      children: <p>Это список ваших позиций. Через форму можно вносить описание, даты, транзакцию, ссылку позиции в протоколе, теги <i>(uniswap, pendle)</i>, сеть, токены <i>(только из списка ваших тикеров)</i>, доход <i>(заработанная сумма в долларах, которая будет отображаться рядом с общей стоимостью ваших ативов в правой панели)</i>, статус <i>(при его изменении позиция попадает в архив)</i>.</p>,
    },
    {
      key: "4",
      label: "Что за правая панель?",
      children: <p>Это список ваших активов <i>(тикер, сколько всего/сколько свободно, сумма в долларах, текущая цена, изменение цены)</i>. Котировки берутся с сайта cryptorates.ai <i>(обновление цен раз в полчаса)</i>. Также есть форма для расчёт цены произольного кол-ва токенов.</p>,
    },
    {
      key: "5",
      label: "Что за значок блокнота?",
      children: <p>Нажатие на него вызывает панель для ведения заметок.</p>,
    },
    {
      key: "6",
      label: "Что за значок приложений?",
      children: <p>Нажатие на него вызывает панель с основными инструментами, которые могут пригодиться новичку в DeFi.</p>,
    },
    {
      key: "7",
      label: "Что за значок М?",
      children: <p>Нажатие на него вызывает панель для проверки появления новых пулов на сервисе Merkl.</p>,
    },
    {
      key: "8",
      label: "Что за значок S?",
      children: <p>Нажатие на него вызывает панель для проверки пулов на бирже Sushi. На сайте бирже есть удобный раздел для поиска пулов, но на нём не отображается средняя APR за месяц и неделю, а эти параметры важны, чтобы искать доходные варианты <i>(загружаются только те пулы, TVL который не меньше $1000)</i>.</p>,
    },
    {
      key: "9",
      label: "Что за значок с графиком?",
      children: <p>Нажатие на него вызывает панель для отлеживания цены в пулах на биржах и проверки, не вышла ли она из диапазона. Для этого необходимо ввести адрес контракта пула, сеть и границы диапазона. Данные берутся с сайта parsec.fi.</p>,
    },
    {
      key: "10",
      label: "Что за значок загрузки?",
      children: <p>Нажатие на него вызывает окно, через которое можно экспортировать/импортировать данные.</p>,
    },
  ]

  return (
    <>
      <FloatButton
        onClick={() => setSwowModal(true)}
        style={{ insetBlockEnd: 10, insetInlineStart: 24 }}
        icon={<QuestionCircleOutlined />}
      />

      <Modal
        title="FAQ"
        footer={null}
        open={swowModal}
        onOk={() => setSwowModal(false)}
        onCancel={() => setSwowModal(false)}
        width={800}
        style={{ top: 20 }}
      >
        <Collapse size={"small"} accordion items={items} defaultActiveKey={["1"]} />
      </Modal>
    </>
  );
}
