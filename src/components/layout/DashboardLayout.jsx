import { Box, Toolbar } from "@mui/material";
import Sidebar, { expandedWidth } from "./Sidebar";
import Topbar from "./Topbar";

const DashboardLayout = ({ children }) => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "#f9fafb" }}>
      <Sidebar />
      <Topbar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: `${expandedWidth}px`,
          p: 3
        }}
      >
        <Toolbar />

        <Box sx={{ maxWidth: "1200px", margin: "0 auto" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;