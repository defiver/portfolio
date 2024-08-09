import ErrorBoundary from "@/components/ErrorBoundary";
import Home from "@/pages/Home";
import { ConfigProvider, theme } from "antd";
import { useEffect } from "react";
import "./App.css";

export default function App() {
  useEffect(() => {
    const loaderElement = document.querySelector(".app-loader");
    loaderElement && loaderElement.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div className="layout">
        <ErrorBoundary>
          <Home />
        </ErrorBoundary>
      </div>
    </ConfigProvider>
  );
}
