import { AppBar, Toolbar, Typography } from "@mui/material";
import { expandedWidth } from "./Sidebar";
import { Select, MenuItem } from "@mui/material";
import { useThemeMode } from "../../theme/ThemeContext";
const Topbar = () => {

    const { mode, setMode } = useThemeMode();

  return (
    <>
    <AppBar
      position="fixed"
      sx={{
        ml: `${expandedWidth}px`,
        width: `calc(100% - ${expandedWidth}px)`,
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

        <AppBar position="fixed">
      <Toolbar sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          size="small"
          sx={{ bgcolor: "white", borderRadius: 1 }}
        >
          <MenuItem value="light">Light</MenuItem>
          <MenuItem value="dark">Dark</MenuItem>
          <MenuItem value="system">System</MenuItem>
        </Select>
      </Toolbar>
    </AppBar>
    </>
  );
};

export default Topbar;