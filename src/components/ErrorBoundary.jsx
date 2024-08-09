import { Button, Result } from "antd";
import { Component } from "react";

class ErrorBoundary extends Component {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status={500}
          title={"Something went wrong"}
          subTitle={"Sorry, something went wrong."}
          extra={
            <Button
              onClick={() => window.location.reload(false)}
              type="primary"
            >
              Reload page
            </Button>
          }
        />
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
