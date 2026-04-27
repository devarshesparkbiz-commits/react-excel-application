import {
  Drawer, List, ListItemButton, ListItemIcon,
  ListItemText, Toolbar, IconButton, Box
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

export const expandedWidth  = 240;
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
const FormIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 2H8c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V6l-4-4zm0 18H8V4h9v3h3v13zM10 9h7v2h-7V9zm0 4h7v2h-7v-2zm0 4h5v2h-5v-2z"/>
  </svg>
);
const XmlIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
  </svg>
);

const menu = [
  { label: "Dashboard", Icon: DashboardIcon, path: "/",       exact: true  },
  { label: "Excel",     Icon: ExcelIcon,     path: "/excel",  exact: false },
  { label: "PDF/Word",  Icon: ConvertIcon,   path: "/convert",exact: false },
  { label: "Forms",     Icon: FormIcon,      path: "/forms",  exact: false },
  { label: "XML",       Icon: XmlIcon,       path: "/xml",    exact: false },
];

const Sidebar = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const width = collapsed ? collapsedWidth : expandedWidth;

  const isActive = ({ path, exact }) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width, flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width, transition: "width 0.3s", overflowX: "hidden",
          backgroundColor: "#111827", color: "#fff",
        },
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: collapsed ? "center" : "flex-end" }}>
        <IconButton onClick={() => setCollapsed(!collapsed)} sx={{ color: "#fff" }}>
          <MenuIcon />
        </IconButton>
      </Toolbar>
      <List>
        {menu.map(({ label, Icon, path, exact }) => (
          <ListItemButton
            key={label}
            selected={isActive({ path, exact })}
            onClick={() => navigate(path)}
            sx={{
              "&.Mui-selected": { backgroundColor: "#1f2937" },
              justifyContent: collapsed ? "center" : "flex-start",
              px: 2,
            }}
          >
            <ListItemIcon sx={{ color: "#fff", minWidth: 0, mr: collapsed ? 0 : 2, justifyContent: "center" }}>
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