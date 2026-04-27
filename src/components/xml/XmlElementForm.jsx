import { useState } from "react";
import {
  Box, Button, Divider, IconButton, Paper,
  TextField, Tooltip, Typography, Collapse
} from "@mui/material";
import AddIcon          from "@mui/icons-material/Add";
import DeleteIcon       from "@mui/icons-material/Delete";
import ExpandMoreIcon   from "@mui/icons-material/ExpandMore";
import ExpandLessIcon   from "@mui/icons-material/ExpandLess";
import AccountTreeIcon  from "@mui/icons-material/AccountTree";
import XmlAttributeEditor from "./XmlAttributeEditor";

/** Converts [{key,value}] array → {key: value} plain object */
const attrsToMap = (arr) =>
  arr.reduce((acc, { key, value }) => {
    if (key.trim()) acc[key.trim()] = value;
    return acc;
  }, {});

/** Recursively prepares an element for submission */
const prepareElement = (el) => ({
  tag:        el.tag,
  value:      el.children.length > 0 ? undefined : el.value,
  attributes: attrsToMap(el.attrs),
  children:   el.children.map(prepareElement),
});

const emptyElement = () => ({
  id:       crypto.randomUUID(),
  tag:      "",
  value:    "",
  attrs:    [],
  children: [],
  open:     true,
});

/** Single recursive element node */
const ElementNode = ({ el, depth = 0, onChange, onDelete }) => {
  const update = (field, val) => onChange({ ...el, [field]: val });

  const addChild = () =>
    update("children", [...el.children, emptyElement()]);

  const updateChild = (idx, updated) => {
    const next = el.children.map((c, i) => (i === idx ? updated : c));
    update("children", next);
  };

  const deleteChild = (idx) =>
    update("children", el.children.filter((_, i) => i !== idx));

  const isLeaf = el.children.length === 0;

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2, mb: 1.5, borderRadius: 2,
        ml: depth > 0 ? 3 : 0,
        borderLeft: depth > 0 ? "3px solid #c7d2fe" : "3px solid #4f46e5",
        background: depth % 2 === 0 ? "#fafafa" : "#f5f7ff",
      }}
    >
      {/* Row 1: tag + controls */}
      <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1.5 }}>
        <AccountTreeIcon sx={{ color: depth === 0 ? "#4f46e5" : "#818cf8", fontSize: 18 }} />
        <TextField
          size="small" label="Tag name" placeholder="e.g. item, user, price"
          value={el.tag} sx={{ flex: 1 }}
          onChange={(e) => update("tag", e.target.value)}
        />
        {isLeaf && (
          <TextField
            size="small" label="Value" placeholder="text content"
            value={el.value} sx={{ flex: 2 }}
            onChange={(e) => update("value", e.target.value)}
          />
        )}
        <Tooltip title={el.open ? "Collapse" : "Expand"}>
          <IconButton size="small" onClick={() => update("open", !el.open)}>
            {el.open ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete element">
          <IconButton size="small" color="error" onClick={onDelete}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Collapse in={el.open}>
        {/* Attributes */}
        <Box sx={{ mb: 1.5 }}>
          <XmlAttributeEditor
            attrs={el.attrs}
            onChange={(next) => update("attrs", next)}
            label="Element Attributes"
          />
        </Box>

        {/* Children */}
        {el.children.length > 0 && (
          <>
            <Divider sx={{ mb: 1.5 }}>
              <Typography variant="caption" color="text.secondary">Children</Typography>
            </Divider>
            {el.children.map((child, idx) => (
              <ElementNode
                key={child.id}
                el={child}
                depth={depth + 1}
                onChange={(updated) => updateChild(idx, updated)}
                onDelete={() => deleteChild(idx)}
              />
            ))}
          </>
        )}

        <Button
          size="small" variant="outlined" startIcon={<AddIcon />}
          onClick={addChild}
          sx={{ textTransform: "none", borderStyle: "dashed", borderRadius: 2, mt: 0.5 }}
        >
          Add child element
        </Button>
      </Collapse>
    </Paper>
  );
};

/** Top-level element builder — manages list of root-level children */
const XmlElementForm = ({ onAdd }) => {
  const [elements, setElements] = useState([emptyElement()]);

  const update = (idx, updated) =>
    setElements((prev) => prev.map((e, i) => (i === idx ? updated : e)));

  const remove = (idx) =>
    setElements((prev) => prev.filter((_, i) => i !== idx));

  const addTopLevel = () =>
    setElements((prev) => [...prev, emptyElement()]);

  const handleAdd = () => {
    const prepared = elements
      .filter((e) => e.tag.trim())
      .map(prepareElement);
    if (prepared.length === 0) return;
    onAdd(prepared);
    setElements([emptyElement()]);
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3, border: "1px solid #e5e7eb" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
        <AccountTreeIcon sx={{ color: "#4f46e5" }} />
        <Typography variant="h6" fontWeight={700}>Element Builder</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ ml: "auto" }}>
          {elements.length} top-level element{elements.length !== 1 ? "s" : ""}
        </Typography>
      </Box>

      {elements.map((el, idx) => (
        <ElementNode
          key={el.id}
          el={el}
          depth={0}
          onChange={(updated) => update(idx, updated)}
          onDelete={() => remove(idx)}
        />
      ))}

      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <Button
          variant="outlined" startIcon={<AddIcon />} onClick={addTopLevel}
          sx={{ textTransform: "none", borderStyle: "dashed", borderRadius: 2 }}
        >
          Add element
        </Button>
        <Button
          variant="contained" onClick={handleAdd}
          sx={{ textTransform: "none", borderRadius: 2, ml: "auto" }}
        >
          Add to Structure
        </Button>
      </Box>
    </Paper>
  );
};

export { prepareElement };
export default XmlElementForm;