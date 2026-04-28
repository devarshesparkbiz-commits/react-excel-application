import { Box, Toolbar } from "@mui/material";
import Sidebar, { expandedWidth, collapsedWidth } from "./Sidebar";
import Topbar from "./Topbar";
import { useState } from "react";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const width = collapsed ? collapsedWidth : expandedWidth;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: 'background.default' }}>
      <Sidebar onToggle={(val) => setCollapsed(val)} />
      <Topbar collapsed={collapsed} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${width}px)`,
          transition: "margin 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          p: 3,
          bgcolor: 'background.default'
        }}
      >
        <Toolbar />
        <Box sx={{ maxWidth: "1400px", margin: "0 auto" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;