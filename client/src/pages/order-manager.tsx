import { Box, useTheme } from "@mui/joy";
import React from "react";
import OrderTable from "../components/order-table";

const OrderManager = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateRows: "1fr 54px",
        backgroundColor: theme.palette.background.body,
        position: "relative",
      }}
    >
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 800px" }}>
        <Box
          sx={{
            backgroundColor: theme.palette.background.surface,
            display: "grid",
            gridTemplateRows: "200px 1fr",
            borderRight: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box sx={{ backgroundColor: theme.palette.background.body }}>Header</Box>
          <Box
            sx={{
              backgroundColor: theme.palette.background.surface,
              borderTop: "1px solid",
              borderColor: "divider",
              px: 2,
            }}
          >
            <OrderTable />
          </Box>
        </Box>
        <Box sx={{ backgroundColor: theme.palette.background.body }}>Order</Box>
      </Box>
      <Box
        sx={{
          backgroundColor: theme.palette.background.body,
          borderTop: "1px solid",
          borderColor: "divider",
          position: "sticky",
          bot: 0,
          left: 0,
        }}
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam, commodi?
      </Box>
    </Box>
  );
};

export default OrderManager;
