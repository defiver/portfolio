import { QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Modal, Tabs } from "antd";
import { useState } from "react";
import "./style.css";
import Faq from "./Faq";
import Updates from "./Updates";

export default function Help() {
  const [swowModal, setSwowModal] = useState(false);

  return (
    <>
      <Button
        type={"text"}
        size={"large"}
        shape={"circle"}
        className={"widget-button"}
        icon={<QuestionCircleOutlined />}
        onClick={() => setSwowModal(true)}
      />

      <Modal
        title={false}
        footer={null}
        className="help"
        open={swowModal}
        onOk={() => setSwowModal(false)}
        onCancel={() => setSwowModal(false)}
        width={800}
        style={{ top: 20 }}
      >
        <Tabs
          defaultActiveKey="1"
          type="card"
          size={"small"}
          items={[
            {
              label: "FAQ",
              key: "faq",
              children: <Faq />,
            },
            {
              label: "Обновления",
              key: "update",
              children: <Updates />,
            },
          ]}
        />
      </Modal>
    </>
  );
}
