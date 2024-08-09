import { useState } from "react";
import { openNotification } from "@/utils/notification";

export const useDB = (callback, loading = false) => {
  const [isLoading, setIsLoading] = useState(loading);

  const fetching = async (...args) => {
    try {
      setIsLoading(true);
      await callback(...args);
    } catch (e) {
      openNotification("error", "Fetching error", e.message);
    } finally {
      setIsLoading(false);
    }
  };
  return [fetching, isLoading];
};
