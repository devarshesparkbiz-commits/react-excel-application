import {
  Drawer, List, ListItemButton, ListItemIcon,
  ListItemText, Toolbar, IconButton, Collapse,
  Box, Divider, Typography, Button,
} from "@mui/material";
import { 
  Menu as MenuIcon, 
  ExpandLess as ExpandLessIcon, 
  ExpandMore as ExpandMoreIcon, 
  Logout as LogoutIcon, 
  AdminPanelSettings as AdminPanelSettingsIcon 
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../theme/AuthContext";

export const expandedWidth  = 280;
export const collapsedWidth = 70;

// ── Icons (Condensed) ───────────────────────────────────────────────────────
const DashboardIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>;
const TransformIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M7 14c-1.66 0-3 1.34-3 3 0 1.31.84 2.41 2 2.83V20c0 .55.45 1 1 1s1-.45 1-1v-.17c1.16-.42 2-1.52 2-2.83 0-1.66-1.34-3-3-3zm13.71-9.71L12 2.41 2.29 12.12c-.39.39-.39 1.02 0 1.41l9.71 9.71c.39.39 1.02.39 1.41 0l9.71-9.71c.39-.39.39-1.02 0-1.41zM13 5.83L18.17 11H13V5.83z"/></svg>;
const DocumentIcon  = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-8-6z"/></svg>;
const ComparisonIcon= () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M9 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h4v14zm10-14h-4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16h-4V5h4v14z"/></svg>;
const ExcelIcon     = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3l4 4-4 4-1.4-1.4L13.2 10l-2.6-2.6L12 6zm-5 9h10v2H7v-2z"/></svg>;
const JsonIcon      = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3h2v2H5v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5h2v2H5c-1.07-.27-2-.9-2-2v-4a2 2 0 0 0-2-2H0v-2h1a2 2 0 0 0 2-2V5a2 2 0 0 1 2-2m14 0a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h1v2h-1a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-2v-2h2v-5a2 2 0 0 1 2-2 2 2 0 0 1-2-2V5h-2V3h2"/></svg>;
const XmlIcon       = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>;
const DiffIcon      = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6zm6 0l-1.41 1.41L18.17 12l-4.58 4.59L16 18l6-6-6-6z"/></svg>;
const FormIcon      = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 2H8c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V6l-4-4zm0 18H8V4h9v3h3v13zM10 9h7v2h-7V9zm0 4h7v2h-7v-2zm0 4h5v2h-5v-2z"/></svg>;
const ConvertIcon   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16 17v-3H9v-2h7V9l4 4-4 4zm-8 1l-4-4 4-4v3h7v2H8v3z"/></svg>;
const UtilityIcon   = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.5 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.4-.4.4-1.1.1-1.4z"/></svg>;
const DateTimeIcon  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>;
const CalculatorIcon= () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 13h-4v-2h4v2zm0-4h-4v-2h4v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2zm-8-4H6V6h2v2zm0 4H6v-2h2v2zm0 4H6v-2h2v2zm10-8h-2V6h2v2zm0 4h-2v-2h2v2zm0 4h-2v-2h2v2z"/></svg>;
const UnitsIcon     = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M13 10V4c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2v-6h7v-2h-7zm-2 10H5V4h6v16zm10-9h-2v2h2v-2z"/></svg>;
const ColorIcon     = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9s1.5.67 1.5 1.5S7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5S18.33 12 17.5 12z"/></svg>;

// ── Menu structure ─────────────────────────────────────────────────────────
const menuStructure = [
  { id: "dashboard", label: "Dashboard", Icon: DashboardIcon, path: "/", exact: true, isParent: false },
  {
    id: "transform",
    label: "Data Transformation",
    Icon: TransformIcon,
    isParent: true,
    children: [
      { id: "excel", label: "Excel", Icon: ExcelIcon, path: "/excel" },
      { id: "json", label: "JSON Beautifier", Icon: JsonIcon, path: "/json" },
      { id: "xml", label: "XML Builder", Icon: XmlIcon, path: "/xml" },
    ],
  },
  {
    id: "comparison",
    label: "Analysis",
    Icon: ComparisonIcon,
    isParent: true,
    children: [
      { id: "diff", label: "Text Difference", Icon: DiffIcon, path: "/diff" },
    ],
  },
  {
    id: "documents",
    label: "Documents",
    Icon: DocumentIcon,
    isParent: true,
    children: [
      { id: "forms", label: "Forms Builder", Icon: FormIcon, path: "/forms" },
      { id: "convert", label: "Word Generator", Icon: ConvertIcon, path: "/convert" },
    ],
  },
  {
    id: "utilities",
    label: "Utility Tools",
    Icon: UtilityIcon,
    isParent: true,
    children: [
      { id: "datetime", label: "Date & Time", Icon: DateTimeIcon, path: "/datetime" },
      { id: "units", label: "Unit Converter", Icon: UnitsIcon, path: "/units" },
      { id: "calculator", label: "Calculator", Icon: CalculatorIcon, path: "/calculator" },
      { id: "color", label: "Color Picker", Icon: ColorIcon, path: "/color" },
    ],
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, hasAccess } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [expanded, setExpanded] = useState({ transform: true, comparison: false, documents: false, utilities: false });

  const width = collapsed ? collapsedWidth : expandedWidth;

  const isActive = ({ path, exact }) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  const handleToggle = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter menu based on access
  const filteredMenu = menuStructure.filter(item => {
    if (!item.isParent) return hasAccess(item.id);
    const visibleChildren = item.children?.filter(child => hasAccess(child.id));
    return visibleChildren && visibleChildren.length > 0;
  }).map(item => {
    if (item.isParent) {
      return { ...item, children: item.children.filter(child => hasAccess(child.id)) };
    }
    return item;
  });

  return (
    <Drawer
      variant="permanent"
      sx={{
        width,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width,
          transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          overflowX: "hidden",
          backgroundColor: "#111827",
          color: "#fff",
          borderRight: "1px solid #1e293b",
        },
      }}
    >
      <Toolbar sx={{ display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between", px: 2, py: 1.5, borderBottom: "1px solid #1e293b" }}>
        {!collapsed && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ width: 32, height: 32, borderRadius: 2, background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#fff", fontSize: 16 }}>DA</Box>
            <Typography variant="subtitle2" fontWeight={800} sx={{ color: "#fff" }}>DataTools</Typography>
          </Box>
        )}
        <IconButton onClick={() => setCollapsed(!collapsed)} sx={{ color: "#94a3b8" }} size="small"><MenuIcon /></IconButton>
      </Toolbar>

      <List sx={{ flex: 1, overflow: "auto", py: 1 }}>
        {filteredMenu.map((item, idx) => (
          <Box key={item.id}>
            {item.isParent ? (
              <>
                <ListItemButton onClick={() => handleToggle(item.id)} selected={!collapsed && expanded[item.id]} sx={{ "&.Mui-selected": { backgroundColor: "#1f2937" }, justifyContent: collapsed ? "center" : "flex-start", px: 2, py: 1.2 }}>
                  <ListItemIcon sx={{ color: "#fff", minWidth: 0, mr: collapsed ? 0 : 2, justifyContent: "center", display: "flex" }}><item.Icon /></ListItemIcon>
                  {!collapsed && (
                    <>
                      <Typography variant="body2" sx={{ fontSize: "13px", fontWeight: 500, flex: 1 }}>
                        {item.label}
                      </Typography>
                      {expanded[item.id] ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                    </>
                  )}
                </ListItemButton>
                {!collapsed && (
                  <Collapse in={expanded[item.id]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ bgcolor: "#0f172a" }}>
                      {item.children?.map((child) => (
                        <ListItemButton key={child.path} onClick={() => navigate(child.path)} selected={location.pathname === child.path} sx={{ pl: 4, py: 0.75, "&.Mui-selected": { backgroundColor: "#1e293b", borderLeft: "3px solid #4f46e5", pl: "calc(16px - 3px)" }, "&:hover": { backgroundColor: "#1e293b" } }}>
                          <ListItemIcon sx={{ color: location.pathname === child.path ? "#4f46e5" : "#94a3b8", minWidth: 32, display: "flex", justifyContent: "center" }}><child.Icon /></ListItemIcon>
                          <Typography variant="body2" sx={{ fontSize: "12px", fontWeight: location.pathname === child.path ? 600 : 400, color: location.pathname === child.path ? "#4f46e5" : "#cbd5e1" }}>
                            {child.label}
                          </Typography>
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                )}
              </>
            ) : (
              <ListItemButton onClick={() => navigate(item.path)} selected={isActive(item)} sx={{ "&.Mui-selected": { backgroundColor: "#1f2937" }, justifyContent: collapsed ? "center" : "flex-start", px: 2, py: 1.2 }}>
                <ListItemIcon sx={{ color: "#fff", minWidth: 0, mr: collapsed ? 0 : 2, justifyContent: "center" }}><item.Icon /></ListItemIcon>
                {!collapsed && <Typography variant="body2">{item.label}</Typography>}
              </ListItemButton>
            )}
          </Box>
        ))}

        {user?.role === 'ROLE_ADMIN' && (
          <>
            <Divider sx={{ my: 1, borderColor: "#1e293b" }} />
            <ListItemButton onClick={() => navigate('/admin/plans')} selected={location.pathname === '/admin/plans'} sx={{ px: 2, py: 1.2 }}>
              <ListItemIcon sx={{ color: "#10b981", minWidth: 0, mr: collapsed ? 0 : 2, justifyContent: "center" }}><AdminPanelSettingsIcon /></ListItemIcon>
              {!collapsed && <Typography variant="body2" sx={{ color: "#10b981", fontWeight: 600 }}>Admin Context</Typography>}
            </ListItemButton>
          </>
        )}
      </List>

      <Box sx={{ p: 2, borderTop: "1px solid #1e293b", bgcolor: "#0f172a" }}>
        {!collapsed && (
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '11px' }}>Plan: <span style={{ color: '#4f46e5', fontWeight: 600 }}>{user?.planName}</span></Typography>
          </Box>
        )}
        <Button 
          fullWidth 
          variant="text" 
          startIcon={<LogoutIcon />} 
          onClick={() => { logout(); navigate('/landing'); }}
          sx={{ color: '#ef4444', textTransform: 'none', justifyContent: collapsed ? 'center' : 'flex-start', px: collapsed ? 0 : 2 }}
        >
          {!collapsed && "Logout"}
        </Button>
      </Box>
    </Drawer>
  );
};

export default Sidebar;