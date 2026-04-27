import { Paper, TextField, Typography, Box, Chip } from "@mui/material";
import DataObjectIcon from "@mui/icons-material/DataObject";

const XmlFileConfig = ({ fileName, setFileName, rootTag, setRootTag }) => (
  <Paper sx={{ p: 3, borderRadius: 3, border: "1px solid #e5e7eb" }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
      <DataObjectIcon sx={{ color: "#4f46e5" }} />
      <Typography variant="h6" fontWeight={700}>File Configuration</Typography>
      <Chip label="XML" size="small" sx={{ ml: "auto", bgcolor: "#ede9fe", color: "#4f46e5", fontWeight: 700 }} />
    </Box>

    <Box sx={{ display: "flex", gap: 2 }}>
      <TextField
        fullWidth
        label="File Name"
        placeholder="e.g. data-export"
        helperText=".xml will be appended automatically"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
      />
      <TextField
        fullWidth
        label="Root Tag"
        placeholder="e.g. root, data, catalog"
        helperText="The outermost XML element"
        value={rootTag}
        onChange={(e) => setRootTag(e.target.value)}
      />
    </Box>
  </Paper>
);

export default XmlFileConfig;