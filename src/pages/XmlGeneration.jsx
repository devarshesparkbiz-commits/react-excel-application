import { useState }        from "react";
import {
  Alert, Box, Button, CircularProgress,
  Divider, Snackbar, Stack, Typography
} from "@mui/material";
import DownloadIcon        from "@mui/icons-material/Download";
import VisibilityIcon      from "@mui/icons-material/Visibility";
import DataObjectIcon      from "@mui/icons-material/DataObject";

import XmlFileConfig       from "../components/xml/XmlFileConfig";
import XmlElementForm      from "../components/xml/XmlElementForm";
import XmlStructureTable   from "../components/xml/XmlStructureTable";
import XmlPreview          from "../components/xml/XmlPreview";
import { generateXml, previewXml } from "../components/api/xmlApi";

const XmlGeneration = () => {
  const [fileName,    setFileName]    = useState("");
  const [rootTag,     setRootTag]     = useState("root");
  const [groups,      setGroups]      = useState([]);  // list of element arrays
  const [previewXmlStr, setPreviewXmlStr] = useState("");
  const [loading,     setLoading]     = useState({ generate: false, preview: false });
  const [toast,       setToast]       = useState({ open: false, msg: "", severity: "success" });

  // Add a group of top-level elements from the builder
  const handleAddGroup = (elements) => {
    setGroups((prev) => [...prev, elements]);
    setPreviewXmlStr("");  // clear stale preview
  };

  const handleDeleteGroup = (idx) => {
    setGroups((prev) => prev.filter((_, i) => i !== idx));
    setPreviewXmlStr("");
  };

  // Flatten all groups into a single elements list for the request
  const buildPayload = () => ({
    fileName: fileName || "output",
    rootTag:  rootTag  || "root",
    elements: groups.flat(),
  });

  const handleGenerate = async () => {
    if (groups.length === 0) { showToast("Add at least one element first", "warning"); return; }
    setLoading((l) => ({ ...l, generate: true }));
    try {
      const blob = await generateXml(buildPayload());
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `${fileName || "output"}.xml`;
      a.click();
      URL.revokeObjectURL(url);
      showToast("XML downloaded successfully!");
    } catch (e) {
      showToast("Download failed: " + e.message, "error");
    } finally {
      setLoading((l) => ({ ...l, generate: false }));
    }
  };

  const handlePreview = async () => {
    if (groups.length === 0) { showToast("Add at least one element first", "warning"); return; }
    setLoading((l) => ({ ...l, preview: true }));
    try {
      const text = await previewXml(buildPayload());
      setPreviewXmlStr(text);
    } catch (e) {
      showToast("Preview failed: " + e.message, "error");
    } finally {
      setLoading((l) => ({ ...l, preview: false }));
    }
  };

  const showToast = (msg, severity = "success") =>
    setToast({ open: true, msg, severity });

  const totalElements = groups.flat().length;

  return (
    <Stack spacing={3}>
      {/* Page header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <DataObjectIcon sx={{ color: "#4f46e5", fontSize: 28 }} />
        <Box>
          <Typography variant="h5" fontWeight={700}>XML Generation</Typography>
          <Typography variant="body2" color="text.secondary">
            Build structured XML files with nested elements and attributes
          </Typography>
        </Box>
        {totalElements > 0 && (
          <Box sx={{ ml: "auto", textAlign: "right" }}>
            <Typography variant="h4" fontWeight={800} color="#4f46e5" lineHeight={1}>{totalElements}</Typography>
            <Typography variant="caption" color="text.secondary">element{totalElements !== 1 ? "s" : ""}</Typography>
          </Box>
        )}
      </Box>

      {/* File config */}
      <XmlFileConfig
        fileName={fileName}   setFileName={setFileName}
        rootTag={rootTag}     setRootTag={setRootTag}
      />

      {/* Element builder */}
      <XmlElementForm onAdd={handleAddGroup} />

      {/* Structure table */}
      {groups.length > 0 && (
        <XmlStructureTable groups={groups} onDeleteGroup={handleDeleteGroup} />
      )}

      {/* Preview */}
      {previewXmlStr && (
        <>
          <Divider />
          <Typography variant="h6" fontWeight={700}>Live Preview</Typography>
          <XmlPreview xml={previewXmlStr} />
        </>
      )}

      {/* Actions */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Button
          variant="outlined" size="large"
          startIcon={loading.preview ? <CircularProgress size={18} /> : <VisibilityIcon />}
          onClick={handlePreview} disabled={loading.preview || loading.generate}
          sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, flex: 1, minWidth: 160 }}
        >
          {loading.preview ? "Generating…" : "Preview XML"}
        </Button>
        <Button
          variant="contained" size="large"
          startIcon={loading.generate ? <CircularProgress size={18} color="inherit" /> : <DownloadIcon />}
          onClick={handleGenerate} disabled={loading.generate || loading.preview}
          sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, flex: 2, minWidth: 200 }}
        >
          {loading.generate ? "Downloading…" : "Download XML"}
        </Button>
      </Box>

      <Snackbar open={toast.open} autoHideDuration={3500} onClose={() => setToast({ ...toast, open: false })}>
        <Alert severity={toast.severity} onClose={() => setToast({ ...toast, open: false })}>
          {toast.msg}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default XmlGeneration;