import {
  Drawer, List, ListItemButton, ListItemIcon,
  ListItemText, Toolbar, IconButton, Collapse,
  Box, Divider, Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

export const expandedWidth  = 280;
export const collapsedWidth = 70;

// ── Icons ───────────────────────────────────────────────────────────────────
const DashboardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
  </svg>
);

const TransformIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 14c-1.66 0-3 1.34-3 3 0 1.31.84 2.41 2 2.83V20c0 .55.45 1 1 1s1-.45 1-1v-.17c1.16-.42 2-1.52 2-2.83 0-1.66-1.34-3-3-3zm13.71-9.71L12 2.41 2.29 12.12c-.39.39-.39 1.02 0 1.41l9.71 9.71c.39.39 1.02.39 1.41 0l9.71-9.71c.39-.39.39-1.02 0-1.41zM13 5.83L18.17 11H13V5.83z"/>
  </svg>
);

const DocumentIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-8-6z"/>
  </svg>
);

const ComparisonIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h4v14zm10-14h-4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16h-4V5h4v14z"/>
  </svg>
);

// Sub-icons
const ExcelIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3l4 4-4 4-1.4-1.4L13.2 10l-2.6-2.6L12 6zm-5 9h10v2H7v-2z"/>
  </svg>
);

const JsonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M5 3h2v2H5v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5h2v2H5c-1.07-.27-2-.9-2-2v-4a2 2 0 0 0-2-2H0v-2h1a2 2 0 0 0 2-2V5a2 2 0 0 1 2-2m14 0a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h1v2h-1a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-2v-2h2v-5a2 2 0 0 1 2-2 2 2 0 0 1-2-2V5h-2V3h2M12 15a1 1 0 0 1 1 1 1 1 0 0 1-1 1 1 1 0 0 1-1-1 1 1 0 0 1 1-1m-4 0a1 1 0 0 1 1 1 1 1 0 0 1-1 1 1 1 0 0 1-1-1 1 1 0 0 1 1-1m8 0a1 1 0 0 1 1 1 1 1 0 0 1-1 1 1 1 0 0 1-1-1 1 1 0 0 1 1-1z"/>
  </svg>
);

const XmlIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
  </svg>
);

const DiffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6zm6 0l-1.41 1.41L18.17 12l-4.58 4.59L16 18l6-6-6-6z"/>
  </svg>
);

const FormIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 2H8c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V6l-4-4zm0 18H8V4h9v3h3v13zM10 9h7v2h-7V9zm0 4h7v2h-7v-2zm0 4h5v2h-5v-2z"/>
  </svg>
);

const ConvertIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 17v-3H9v-2h7V9l4 4-4 4zm-8 1l-4-4 4-4v3h7v2H8v3z"/>
  </svg>
);

// ── Menu structure with master categories ──────────────────────────────────
const menuStructure = [
  {
    id: "dashboard",
    label: "Dashboard",
    Icon: DashboardIcon,
    path: "/",
    exact: true,
    isParent: false,
  },
  {
    id: "transform",
    label: "Data Transformation & Formatting",
    Icon: TransformIcon,
    isParent: true,
    children: [
      { label: "Excel", Icon: ExcelIcon, path: "/excel" },
      { label: "JSON Beautifier", Icon: JsonIcon, path: "/json" },
      { label: "XML Builder", Icon: XmlIcon, path: "/xml" },
    ],
  },
  {
    id: "comparison",
    label: "Comparison & Analysis",
    Icon: ComparisonIcon,
    isParent: true,
    children: [
      { label: "Text Difference", Icon: DiffIcon, path: "/diff" },
    ],
  },
  {
    id: "documents",
    label: "Document Generation",
    Icon: DocumentIcon,
    isParent: true,
    children: [
      { label: "Forms Builder", Icon: FormIcon, path: "/forms" },
      { label: "Text to Document", Icon: ConvertIcon, path: "/convert" },
    ],
  },
];

// ── Main Sidebar component ─────────────────────────────────────────────────
const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [expanded, setExpanded] = useState({
    transform: true,
    comparison: false,
    documents: false,
  });

  const width = collapsed ? collapsedWidth : expandedWidth;

  const isActive = ({ path, exact }) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  const handleToggle = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

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
      {/* Logo/Header */}
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          px: 2,
          py: 1.5,
          borderBottom: "1px solid #1e293b",
        }}
      >
        {!collapsed && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{
              width: 32,
              height: 32,
              borderRadius: 2,
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              color: "#fff",
              fontSize: 16,
            }}>
              DA
            </Box>
            <Typography
              variant="subtitle2"
              fontWeight={800}
              letterSpacing={-0.5}
              sx={{ color: "#fff" }}
            >
              DataTools
            </Typography>
          </Box>
        )}
        <IconButton
          onClick={() => setCollapsed(!collapsed)}
          sx={{ color: "#94a3b8" }}
          size="small"
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      {/* Menu sections */}
      <List sx={{ flex: 1, overflow: "auto", py: 1 }}>
        {menuStructure.map((item, idx) => (
          <Box key={item.id}>
            {/* Parent item (Master Menu) */}
            {item.isParent ? (
              <>
                <ListItemButton
                  onClick={() => handleToggle(item.id)}
                  selected={!collapsed && expanded[item.id]}
                  sx={{
                    "&.Mui-selected": { backgroundColor: "#1f2937" },
                    justifyContent: collapsed ? "center" : "flex-start",
                    px: 2,
                    py: 1.2,
                  }}
                >
                  <ListItemIcon sx={{
                    color: "#fff",
                    minWidth: 0,
                    mr: collapsed ? 0 : 2,
                    justifyContent: "center",
                    display: "flex",
                  }}>
                    <item.Icon />
                  </ListItemIcon>
                  {!collapsed && (
                    <>
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: "13px",
                          fontWeight: 500,
                        }}
                      />
                      {expanded[item.id] ? (
                        <ExpandLessIcon fontSize="small" />
                      ) : (
                        <ExpandMoreIcon fontSize="small" />
                      )}
                    </>
                  )}
                </ListItemButton>

                {/* Child items (Sub-menus) */}
                {!collapsed && (
                  <Collapse in={expanded[item.id]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ bgcolor: "#0f172a" }}>
                      {item.children?.map((child) => (
                        <ListItemButton
                          key={child.path}
                          onClick={() => navigate(child.path)}
                          selected={location.pathname === child.path}
                          sx={{
                            pl: 4,
                            py: 0.75,
                            "&.Mui-selected": {
                              backgroundColor: "#1e293b",
                              borderLeft: "3px solid #4f46e5",
                              pl: "calc(16px - 3px)",
                            },
                            "&:hover": { backgroundColor: "#1e293b" },
                          }}
                        >
                          <ListItemIcon sx={{
                            color: location.pathname === child.path ? "#4f46e5" : "#94a3b8",
                            minWidth: 32,
                            display: "flex",
                            justifyContent: "center",
                          }}>
                            <child.Icon />
                          </ListItemIcon>
                          <ListItemText
                            primary={child.label}
                            primaryTypographyProps={{
                              fontSize: "12px",
                              fontWeight: location.pathname === child.path ? 600 : 400,
                              color: location.pathname === child.path ? "#4f46e5" : "#cbd5e1",
                            }}
                          />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                )}
              </>
            ) : (
              /* Regular single item (Dashboard) */
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={isActive(item)}
                sx={{
                  "&.Mui-selected": { backgroundColor: "#1f2937" },
                  justifyContent: collapsed ? "center" : "flex-start",
                  px: 2,
                  py: 1.2,
                }}
              >
                <ListItemIcon sx={{
                  color: "#fff",
                  minWidth: 0,
                  mr: collapsed ? 0 : 2,
                  justifyContent: "center",
                }}>
                  <item.Icon />
                </ListItemIcon>
                {!collapsed && <ListItemText primary={item.label} />}
              </ListItemButton>
            )}

            {/* Divider between sections */}
            {idx < menuStructure.length - 1 && !collapsed && (
              <Divider sx={{ my: 1, borderColor: "#1e293b" }} />
            )}
          </Box>
        ))}
      </List>

      {/* Footer */}
      {!collapsed && (
        <Box sx={{
          p: 2,
          borderTop: "1px solid #1e293b",
          bgcolor: "#0f172a",
          textAlign: "center",
        }}>
          <Typography variant="caption" color="#64748b">
            v1.0.0
          </Typography>
        </Box>
      )}
    </Drawer>
  );
};

export default Sidebar;