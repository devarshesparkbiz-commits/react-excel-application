import { Box, IconButton, TextField, Tooltip, Typography, Button } from "@mui/material";
import AddIcon    from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

/**
 * Edits a list of { key, value } pairs → converted to Map<String,String> on submit.
 * Used for both root attributes and per-element attributes.
 */
const XmlAttributeEditor = ({ attrs, onChange, label = "Attributes" }) => {
  const add = () => onChange([...attrs, { key: "", value: "" }]);

  const update = (i, field, val) => {
    const next = attrs.map((a, idx) => idx === i ? { ...a, [field]: val } : a);
    onChange(next);
  };

  const remove = (i) => onChange(attrs.filter((_, idx) => idx !== i));

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
          {label}
        </Typography>
        <Button size="small" startIcon={<AddIcon />} onClick={add} sx={{ textTransform: "none" }}>
          Add
        </Button>
      </Box>
      {attrs.map((attr, i) => (
        <Box key={i} sx={{ display: "flex", gap: 1, mb: 1, alignItems: "center" }}>
          <TextField
            size="small" placeholder="key" value={attr.key}
            sx={{ flex: 1 }}
            onChange={(e) => update(i, "key", e.target.value)}
          />
          <Typography color="text.disabled">=</Typography>
          <TextField
            size="small" placeholder="value" value={attr.value}
            sx={{ flex: 2 }}
            onChange={(e) => update(i, "value", e.target.value)}
          />
          <Tooltip title="Remove">
            <IconButton size="small" color="error" onClick={() => remove(i)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ))}
      {attrs.length === 0 && (
        <Typography variant="caption" color="text.disabled" sx={{ fontStyle: "italic" }}>
          No attributes — click Add to create one
        </Typography>
      )}
    </Box>
  );
};

export default XmlAttributeEditor;