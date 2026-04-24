import { AppBar, Toolbar, Typography } from "@mui/material";
import { sidebarWidth } from "./Sidebar";

const Topbar = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        ml: `${sidebarWidth}px`,
        width: `calc(100% - ${sidebarWidth}px)`,
        backgroundColor: "#fff",
        color: "#111",
        boxShadow: "0 1px 4px rgba(0,0,0,0.1)"
      }}
    >
      <Toolbar>
        <Typography variant="h6" fontWeight={600}>
          Excel Application
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;