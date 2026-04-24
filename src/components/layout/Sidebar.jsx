import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  IconButton,
  Box
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

export const expandedWidth = 240;
export const collapsedWidth = 70;

const DashboardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
  </svg>
);

const ExcelIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3l4 4-4 4-1.4-1.4L13.2 10l-2.6-2.6L12 6zm-5 9h10v2H7v-2z"/>
  </svg>
);

const ConvertIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 17v-3H9v-2h7V9l4 4-4 4zm-8 1l-4-4 4-4v3h7v2H8v3z"/>
  </svg>
);

const menu = [
  { label: "Dashboard", Icon: DashboardIcon, path: "/" },
  { label: "Excel", Icon: ExcelIcon, path: "/excel" },
  { label: "PDF/Word", Icon: ConvertIcon, path: "/convert" },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const width = collapsed ? collapsedWidth : expandedWidth;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: width,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: width,
          transition: "width 0.3s",
          overflowX: "hidden",
          backgroundColor: "#111827",
          color: "#fff",
        },
      }}
    >
      <Toolbar
        sx={{ display: "flex", justifyContent: collapsed ? "center" : "flex-end" }}
      >
        <IconButton onClick={() => setCollapsed(!collapsed)} sx={{ color: "#fff" }}>
          <MenuIcon />
        </IconButton>
      </Toolbar>

      <List>
        {menu.map(({ label, Icon, path }) => (
          <ListItemButton
            key={label}
            selected={location.pathname === path}
            onClick={() => navigate(path)}
            sx={{
              "&.Mui-selected": { backgroundColor: "#1f2937" },
              justifyContent: collapsed ? "center" : "flex-start",
              px: 2,
            }}
          >
            <ListItemIcon
              sx={{
                color: "#fff",
                minWidth: 0,
                mr: collapsed ? 0 : 2,
                justifyContent: "center",
              }}
            >
              <Icon />
            </ListItemIcon>

            {!collapsed && <ListItemText primary={label} />}
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;