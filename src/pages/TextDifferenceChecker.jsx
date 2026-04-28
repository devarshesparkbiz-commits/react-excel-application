import React from "react";
import { useState, useCallback, useRef } from "react";
import {
  Alert, Box, Button, ButtonGroup, Chip, CircularProgress,
  Divider, Fade, IconButton, Paper, Snackbar,
  Stack, Tab, Tabs, TextField, Tooltip, Typography,
} from "@mui/material";
import ContentCopyIcon      from "@mui/icons-material/ContentCopy";
import DownloadIcon         from "@mui/icons-material/Download";
import DeleteSweepIcon      from "@mui/icons-material/DeleteSweep";
import UploadFileIcon       from "@mui/icons-material/UploadFile";
import SwapHorizIcon        from "@mui/icons-material/SwapHoriz";
import CompareArrowsIcon    from "@mui/icons-material/CompareArrows";
import ViewWeekIcon         from "@mui/icons-material/ViewWeek";
import ViewSidebarIcon      from "@mui/icons-material/ViewSidebar";

import DiffViewer           from "../components/diff/DiffViewer";
import SideBySideViewer     from "../components/diff/SideBySideViewer";
import DiffStats            from "../components/diff/DiffStats";
import { computeDiff, getStats } from "../utils/diffAlgorithm";

const TextDifferenceChecker = () => {
  const [original,  setOriginal]  = useState("");
  const [modified,  setModified]  = useState("");
  const [diffs,     setDiffs]     = useState([]);
  const [stats,     setStats]     = useState(null);
  const [viewMode,  setViewMode]  = useState(0);  // 0=unified, 1=side-by-side
  const [copied,    setCopied]    = useState(false);
  const [toast,     setToast]     = useState({ open: false, msg: "", severity: "success" });
  const fileRef1 = useRef();
  const fileRef2 = useRef();

  // ── Compute diff on change ──────────────────────────────────────────────
  const handleCompare = useCallback(() => {
    if (!original.trim() && !modified.trim()) {
      setDiffs([]); setStats(null); return;
    }
    const diff = computeDiff(original, modified);
    setDiffs(diff);
    setStats(getStats(diff));
  }, [original, modified]);

  const handleOriginalChange = (e) => {
    setOriginal(e.target.value);
  };

  const handleModifiedChange = (e) => {
    setModified(e.target.value);
  };

  // Auto-compare on any change
  React.useEffect(() => {
    handleCompare();
  }, [original, modified, handleCompare]);

  // ── File upload ─────────────────────────────────────────────────────────
  const handleUploadOriginal = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setOriginal(ev.target.result);
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleUploadModified = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setModified(ev.target.result);
    reader.readAsText(file);
    e.target.value = "";
  };

  // ── Actions ────────────────────────────────────────────────────────────
  const handleSwap = () => {
    const temp = original;
    setOriginal(modified);
    setModified(temp);
  };

  const handlePaste = async (which) => {
    try {
      const text = await navigator.clipboard.readText();
      if (which === 1) setOriginal(text);
      else setModified(text);
    } catch {
      showToast("Clipboard access denied", "error");
    }
  };

  const handleCopy = async () => {
    const toCopy = viewMode === 0 ? diffs.map((d) => d.value).join("\n") : modified;
    try {
      await navigator.clipboard.writeText(toCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast("Copy failed", "error");
    }
  };

  const handleDownload = () => {
    if (!diffs.length) return;
    const content = diffs.map((d) => {
      const prefix = d.type === 'add' ? '+ ' : d.type === 'remove' ? '- ' : '  ';
      return prefix + d.value;
    }).join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "diff.txt";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Diff downloaded!");
  };

  const handleClear = () => {
    setOriginal(""); setModified(""); setDiffs([]); setStats(null);
  };

  const showToast = (msg, severity = "success") =>
    setToast({ open: true, msg, severity });

  const hasContent = original.trim() || modified.trim();
  const hasDifferences = diffs.some((d) => d.type !== 'keep');

  return (
    <Box>
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{
            width: 42, height: 42, borderRadius: 2,
            background: "linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <CompareArrowsIcon sx={{ color: "#fff", fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={800} letterSpacing={-0.5}>
              Text Difference Checker
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Compare two texts side-by-side and highlight differences
            </Typography>
          </Box>
        </Box>

        {/* Status chip */}
        <Fade in={hasContent}>
          <Chip
            label={!hasDifferences ? "Identical" : `${stats?.added || 0} added, ${stats?.removed || 0} removed`}
            color={!hasDifferences ? "success" : "warning"}
            variant="outlined"
            sx={{ fontWeight: 700, px: 1 }}
          />
        </Fade>
      </Box>

      {/* ── Input panels ────────────────────────────────────────────────── */}
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2,
                 "@media (max-width: 900px)": { gridTemplateColumns: "1fr" } }}>

        {/* ORIGINAL panel */}
        <Paper sx={{ borderRadius: 3, border: "1px solid #e5e7eb", overflow: "hidden" }}>
          <Box sx={{
            display: "flex", alignItems: "center", px: 2, py: 1,
            borderBottom: "1px solid #f1f5f9", background: "#f8fafc", gap: 1,
          }}>
            <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
              Original
            </Typography>
            <Box sx={{ ml: "auto", display: "flex", gap: 0.5 }}>
              <Tooltip title="Paste">
                <IconButton size="small" onClick={() => handlePaste(1)}>
                  <ContentCopyIcon fontSize="small" sx={{ transform: "scaleX(-1)" }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Upload file">
                <IconButton size="small" onClick={() => fileRef1.current?.click()}>
                  <UploadFileIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Clear">
                <IconButton size="small" onClick={() => setOriginal("")} color="error">
                  <DeleteSweepIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <input ref={fileRef1} type="file" accept=".txt" hidden onChange={handleUploadOriginal} />
          <TextField
            multiline fullWidth minRows={18} maxRows={28}
            value={original}
            onChange={handleOriginalChange}
            placeholder="Paste or upload original text..."
            variant="standard"
            InputProps={{
              disableUnderline: true,
              sx: {
                fontFamily: '"Fira Code", monospace',
                fontSize: "13px", lineHeight: 1.7, p: 2,
              },
            }}
          />
        </Paper>

        {/* MODIFIED panel */}
        <Paper sx={{ borderRadius: 3, border: "1px solid #e5e7eb", overflow: "hidden" }}>
          <Box sx={{
            display: "flex", alignItems: "center", px: 2, py: 1,
            borderBottom: "1px solid #f1f5f9", background: "#f8fafc", gap: 1,
          }}>
            <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
              Modified
            </Typography>
            <Box sx={{ ml: "auto", display: "flex", gap: 0.5 }}>
              <Tooltip title="Paste">
                <IconButton size="small" onClick={() => handlePaste(2)}>
                  <ContentCopyIcon fontSize="small" sx={{ transform: "scaleX(-1)" }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Upload file">
                <IconButton size="small" onClick={() => fileRef2.current?.click()}>
                  <UploadFileIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Clear">
                <IconButton size="small" onClick={() => setModified("")} color="error">
                  <DeleteSweepIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <input ref={fileRef2} type="file" accept=".txt" hidden onChange={handleUploadModified} />
          <TextField
            multiline fullWidth minRows={18} maxRows={28}
            value={modified}
            onChange={handleModifiedChange}
            placeholder="Paste or upload modified text..."
            variant="standard"
            InputProps={{
              disableUnderline: true,
              sx: {
                fontFamily: '"Fira Code", monospace',
                fontSize: "13px", lineHeight: 1.7, p: 2,
              },
            }}
          />
        </Paper>
      </Box>

      {/* ── Swap button ────────────────────────────────────────────────── */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <Tooltip title="Swap original and modified">
          <Button
            variant="outlined"
            startIcon={<SwapHorizIcon />}
            onClick={handleSwap}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
          >
            Swap
          </Button>
        </Tooltip>
      </Box>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <Fade in={hasContent && diffs.length > 0}>
        <Box sx={{ mb: 3 }}>
          <DiffStats stats={stats} />
        </Box>
      </Fade>

      {/* ── View mode tabs ────────────────────────────────────────────────── */}
      {diffs.length > 0 && (
        <Paper sx={{ borderRadius: 3, border: "1px solid #e5e7eb", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 1 }}>
            <Tabs value={viewMode} onChange={(_, val) => setViewMode(val)}>
              <Tab
                icon={<ViewWeekIcon sx={{ mr: 1 }} />}
                label="Unified View"
                iconPosition="start"
              />
              <Tab
                icon={<ViewSidebarIcon sx={{ mr: 1 }} />}
                label="Side-by-Side"
                iconPosition="start"
              />
            </Tabs>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                size="small" startIcon={<ContentCopyIcon />}
                onClick={handleCopy}
                sx={{ textTransform: "none" }}
              >
                {copied ? "Copied!" : "Copy"}
              </Button>
              <Button
                size="small" startIcon={<DownloadIcon />}
                onClick={handleDownload}
                sx={{ textTransform: "none" }}
              >
                Download
              </Button>
              <Button
                size="small" color="error" startIcon={<DeleteSweepIcon />}
                onClick={handleClear}
                sx={{ textTransform: "none" }}
              >
                Clear All
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      {/* ── Diff viewer ────────────────────────────────────────────────── */}
      <Fade in={diffs.length > 0}>
        <Box>
          {viewMode === 0
            ? <DiffViewer diffs={diffs} />
            : <SideBySideViewer diffs={diffs} />}
        </Box>
      </Fade>

      {/* ── Empty state ────────────────────────────────────────────────── */}
      {!hasContent && (
        <Paper sx={{ p: 6, textAlign: "center", borderRadius: 3, bgcolor: "#f8fafc" }}>
          <CompareArrowsIcon sx={{ fontSize: 48, color: "#cbd5e1", mb: 2 }} />
          <Typography color="text.secondary">
            Paste or upload text to compare
          </Typography>
        </Paper>
      )}

      {/* ── Toast ──────────────────────────────────────────────────────── */}
      <Snackbar
        open={toast.open} autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={toast.severity} variant="filled" onClose={() => setToast({ ...toast, open: false })}>
          {toast.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TextDifferenceChecker;