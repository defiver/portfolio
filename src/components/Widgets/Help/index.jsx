import { QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Modal, Tabs } from "antd";
import { useState } from "react";
import "./style.css";
import FAQ from "./FAQ";
import Updates from "./Updates";

export default function Help() {
  const [showModal, setshowModal] = useState(false);

  return (
    <>
      <Button
        type={"text"}
        size={"large"}
        shape={"circle"}
        className={"widget-button"}
        icon={<QuestionCircleOutlined />}
        onClick={() => setshowModal(true)}
      />

      <Modal
        title={false}
        footer={null}
        className="help"
        open={showModal}
        onOk={() => setshowModal(false)}
        onCancel={() => setshowModal(false)}
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
              children: <FAQ />,
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
