import {
  Box, Chip, Collapse, IconButton, Paper,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Tooltip, Typography
} from "@mui/material";
import DeleteIcon       from "@mui/icons-material/Delete";
import ExpandMoreIcon   from "@mui/icons-material/ExpandMore";
import ExpandLessIcon   from "@mui/icons-material/ExpandLess";
import { useState }     from "react";

const countElements = (elements) => {
  if (!elements) return 0;
  return elements.reduce((acc, el) => acc + 1 + countElements(el.children), 0);
};

const StructureRow = ({ el, depth = 0 }) => {
  const [open, setOpen] = useState(true);
  const hasChildren     = el.children && el.children.length > 0;
  const attrCount       = el.attributes ? Object.keys(el.attributes).length : 0;

  return (
    <>
      <TableRow hover sx={{ "& td": { py: 0.75 } }}>
        <TableCell sx={{ pl: 2 + depth * 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {hasChildren ? (
              <IconButton size="small" onClick={() => setOpen(!open)} sx={{ p: 0.25 }}>
                {open ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
              </IconButton>
            ) : (
              <Box sx={{ width: 24 }} />
            )}
            <Typography
              variant="body2" fontFamily="monospace" fontWeight={depth === 0 ? 700 : 400}
              sx={{ color: depth === 0 ? "#4f46e5" : "#374151" }}
            >
              &lt;{el.tag}&gt;
            </Typography>
          </Box>
        </TableCell>
        <TableCell>
          {el.value
            ? <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>{el.value}</Typography>
            : hasChildren
            ? <Chip label={`${el.children.length} children`} size="small" sx={{ bgcolor: "#ede9fe", color: "#4f46e5" }} />
            : <Typography variant="caption" color="text.disabled">—</Typography>
          }
        </TableCell>
        <TableCell>
          {attrCount > 0
            ? Object.entries(el.attributes).slice(0, 2).map(([k, v]) => (
                <Chip key={k} label={`${k}="${v}"`} size="small" sx={{ mr: 0.5, mb: 0.25, fontFamily: "monospace", fontSize: 11 }} />
              ))
            : <Typography variant="caption" color="text.disabled">—</Typography>
          }
          {attrCount > 2 && <Chip label={`+${attrCount - 2} more`} size="small" />}
        </TableCell>
      </TableRow>

      {hasChildren && (
        <TableRow sx={{ "& td": { p: 0, border: 0 } }}>
          <TableCell colSpan={3}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              {el.children.map((child, idx) => (
                <StructureRow key={idx} el={child} depth={depth + 1} />
              ))}
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

const XmlStructureTable = ({ groups, onDeleteGroup }) => {
  if (!groups || groups.length === 0) return null;

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} mb={2}>XML Structure</Typography>
      {groups.map((group, gi) => (
        <Paper key={gi} sx={{ mb: 2, borderRadius: 3, border: "1px solid #e5e7eb", overflow: "hidden" }}>
          <Box sx={{
            display: "flex", alignItems: "center", px: 2, py: 1.5,
            background: "#f8fafc", borderBottom: "1px solid #e5e7eb",
          }}>
            <Typography variant="subtitle2" fontWeight={700} fontFamily="monospace" color="#4f46e5">
              Group {gi + 1}
            </Typography>
            <Chip
              label={`${countElements(group)} element${countElements(group) !== 1 ? "s" : ""}`}
              size="small" sx={{ ml: 1.5, bgcolor: "#ede9fe", color: "#4f46e5" }}
            />
            <Tooltip title="Remove group">
              <IconButton size="small" color="error" sx={{ ml: "auto" }} onClick={() => onDeleteGroup(gi)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <TableContainer>
            <Table size="small">
              <TableHead sx={{ bgcolor: "#f1f5f9" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, width: "35%" }}>Element</TableCell>
                  <TableCell sx={{ fontWeight: 700, width: "30%" }}>Value</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Attributes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {group.map((el, idx) => (
                  <StructureRow key={idx} el={el} depth={0} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ))}
    </Box>
  );
};

export default XmlStructureTable;