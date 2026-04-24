import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TableChartIcon from "@mui/icons-material/TableChart";
import { useNavigate, useLocation } from "react-router-dom";

export const sidebarWidth = 240;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { label: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { label: "Excel", icon: <TableChartIcon />, path: "/excel" }
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: sidebarWidth,
        [`& .MuiDrawer-paper`]: {
          width: sidebarWidth,
          backgroundColor: "#111827",
          color: "#fff"
        }
      }}
    >
      <Toolbar />

      <List>
        {menu.map((item) => (
          <ListItemButton
            key={item.label}
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
            sx={{
              "&.Mui-selected": {
                backgroundColor: "#1f2937"
              }
            }}
          >
            <ListItemIcon sx={{ color: "#fff" }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;