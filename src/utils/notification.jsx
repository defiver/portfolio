import { notification } from "antd";
import { CloseOutlined } from "@ant-design/icons";

export const openNotification = (type, title, description) => {
  notification[type]({
    duration: 0,
    // message: <span style={{ color: "#dcdcdc" }}>{title}</span>,
    message: <span style={{ color: "#dcdcdc" }}>{description}</span>,
    closeIcon: (
      <span className="close-notification">
        <CloseOutlined rotate={90} />
      </span>
    ),
    style: {
      backgroundColor: "#1f1f1f",
      borderRadius: 6,
      paddingBottom: 10,
      boxShadow: "5px 5px 5px",
    },
    placement: "bottomLeft",
    stack: { threshold: 1 },
  });
};
