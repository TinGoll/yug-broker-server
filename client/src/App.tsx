import React, { useEffect } from "react";
import { useColorScheme } from "@mui/joy";
import OrderManager from "./pages/order-manager";

function App() {
  const { setMode } = useColorScheme();
  useEffect(() => {
    setMode("dark");
  }, [setMode]);

  return <OrderManager />;
}

export default App;
