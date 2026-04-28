import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { expandedWidth, collapsedWidth } from "./Sidebar";
import { useAuth } from "../../theme/AuthContext";
import { useLocation } from "react-router-dom";

const Topbar = ({ collapsed }) => {
  const { user } = useAuth();
  const location = useLocation();
  const width = collapsed ? collapsedWidth : expandedWidth;

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path.includes('excel')) return 'Excel Generation';
    if (path.includes('json')) return 'JSON Beautifier';
    if (path.includes('xml')) return 'XML Builder';
    if (path.includes('diff')) return 'Text Difference';
    if (path.includes('forms')) return 'Forms List';
    if (path.includes('convert')) return 'Text to Document';
    if (path.includes('datetime')) return 'Date & Time';
    if (path.includes('units')) return 'Unit Converter';
    if (path.includes('calculator')) return 'Calculator';
    if (path.includes('color')) return 'Color Picker';
    if (path.includes('admin')) return 'Admin Panel';
    return 'DataTools';
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${width}px)`,
        ml: `${width}px`,
        bgcolor: 'background.paper',
        color: 'text.primary',
        boxShadow: 'none',
        borderBottom: '1px solid',
        borderColor: 'divider',
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1), margin 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" fontWeight={700}>
          {getPageTitle()}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Welcome, <b>{user?.username}</b>
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;