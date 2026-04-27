import { useState, useCallback, useRef } from "react";
import {
  Alert, Box, Button, ButtonGroup, Chip,
  CircularProgress, Divider, Fade, IconButton,
  Paper, Slide, Snackbar, Stack, Tab, Tabs,
  TextField, ToggleButton, ToggleButtonGroup,
  Tooltip, Typography,
} from "@mui/material";
import ContentCopyIcon      from "@mui/icons-material/ContentCopy";
import DownloadIcon         from "@mui/icons-material/Download";
import DeleteSweepIcon      from "@mui/icons-material/DeleteSweep";
import CompressIcon         from "@mui/icons-material/Compress";
import AutoFixHighIcon      from "@mui/icons-material/AutoFixHigh";
import CheckCircleIcon      from "@mui/icons-material/CheckCircle";
import ErrorIcon            from "@mui/icons-material/Error";
import UploadFileIcon       from "@mui/icons-material/UploadFile";
import FormatIndentIncreaseIcon from "@mui/icons-material/FormatIndentIncrease";
import SwapHorizIcon        from "@mui/icons-material/SwapHoriz";
import DataObjectIcon       from "@mui/icons-material/DataObject";

// ── Syntax highlighter — pure regex, zero dependencies ─────────────────────
const tokenize = (json) => {
  if (!json) return "";
  return json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = "json-number";
        if (/^"/.test(match)) {
          cls = /:$/.test(match) ? "json-key" : "json-string";
        } else if (/true|false/.test(match)) {
          cls = "json-bool";
        } else if (/null/.test(match)) {
          cls = "json-null";
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
};

// ── JSON stats ──────────────────────────────────────────────────────────────
const getStats = (parsed) => {
  let keys = 0, arrays = 0, depth = 0, maxDepth = 0;
  const walk = (node, d) => {
    maxDepth = Math.max(maxDepth, d);
    if (Array.isArray(node)) {
      arrays++;
      node.forEach((v) => walk(v, d + 1));
    } else if (node && typeof node === "object") {
      Object.entries(node).forEach(([, v]) => { keys++; walk(v, d + 1); });
    }
  };
  walk(parsed, 0);
  return { keys, arrays, maxDepth };
};

// ── Indent options ──────────────────────────────────────────────────────────
const INDENT_OPTIONS = [
  { label: "2 spaces", value: 2 },
  { label: "4 spaces", value: 4 },
  { label: "Tab",      value: "\t" },
];

const JsonBeautifier = () => {
  const [input,    setInput]    = useState("");
  const [output,   setOutput]   = useState("");
  const [error,    setError]    = useState("");
  const [parsed,   setParsed]   = useState(null);
  const [indent,   setIndent]   = useState(2);
  const [tab,      setTab]      = useState(0);   // 0=beautify, 1=minify
  const [copied,   setCopied]   = useState(false);
  const [toast,    setToast]    = useState({ open: false, msg: "", severity: "success" });
  const fileRef = useRef();

  // ── Core operations ───────────────────────────────────────────────────────
  const process = useCallback((raw, mode, spaces) => {
    const src = raw !== undefined ? raw : input;
    if (!src.trim()) { setOutput(""); setError(""); setParsed(null); return; }
    try {
      const obj = JSON.parse(src);
      setParsed(obj);
      setError("");
      if (mode === "minify" || tab === 1) {
        setOutput(JSON.stringify(obj));
      } else {
        setOutput(JSON.stringify(obj, null, spaces ?? indent));
      }
    } catch (e) {
      setError(e.message);
      setOutput("");
      setParsed(null);
    }
  }, [input, indent, tab]);

  const handleBeautify = () => { setTab(0); process(input, "beautify", indent); };
  const handleMinify   = () => { setTab(1); process(input, "minify"); };

  const handleIndentChange = (_, val) => {
    if (!val) return;
    setIndent(val);
    if (parsed) setOutput(JSON.stringify(parsed, null, val));
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInput(val);
    if (!val.trim()) { setOutput(""); setError(""); setParsed(null); }
    else process(val, tab === 1 ? "minify" : "beautify", indent);
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = tab === 1 ? "minified.json" : "beautified.json";
    a.click();
    URL.revokeObjectURL(url);
    showToast("JSON downloaded!");
  };

  const handleClear = () => {
    setInput(""); setOutput(""); setError(""); setParsed(null);
  };

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      setInput(text);
      process(text, "beautify", indent);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
      process(text, "beautify", indent);
    } catch {
      showToast("Clipboard access denied", "error");
    }
  };

  const handleSwap = () => {
    if (!output) return;
    setInput(output);
    process(output, tab === 1 ? "minify" : "beautify", indent);
  };

  const showToast = (msg, severity = "success") =>
    setToast({ open: true, msg, severity });

  const stats = parsed ? getStats(parsed) : null;
  const isValid = parsed !== null;
  const hasInput = input.trim().length > 0;

  return (
    <Box>
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{
            width: 42, height: 42, borderRadius: 2,
            background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <DataObjectIcon sx={{ color: "#fff", fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={800} letterSpacing={-0.5}>
              JSON Beautifier
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Format, validate, minify and download JSON instantly
            </Typography>
          </Box>
        </Box>

        {/* Status badge */}
        <Fade in={hasInput}>
          <Chip
            icon={isValid
              ? <CheckCircleIcon sx={{ fontSize: "16px !important" }} />
              : <ErrorIcon sx={{ fontSize: "16px !important" }} />}
            label={isValid ? "Valid JSON" : error ? "Invalid JSON" : "—"}
            color={isValid ? "success" : "error"}
            variant="outlined"
            sx={{ fontWeight: 700, px: 1 }}
          />
        </Fade>
      </Box>

      {/* ── Stats strip ─────────────────────────────────────────────────── */}
      <Fade in={isValid}>
        <Paper sx={{
          mb: 2.5, px: 3, py: 1.5, borderRadius: 3,
          border: "1px solid #e0e7ff", background: "#f5f3ff",
          display: "flex", gap: 4, flexWrap: "wrap",
        }}>
          {[
            { label: "Keys",       value: stats?.keys },
            { label: "Arrays",     value: stats?.arrays },
            { label: "Max Depth",  value: stats?.maxDepth },
            { label: "Characters", value: output.length || 0 },
            { label: "Lines",      value: output.split("\n").length || 0 },
          ].map(({ label, value }) => (
            <Box key={label}>
              <Typography variant="h6" fontWeight={800} color="#4f46e5" lineHeight={1.2}>
                {value ?? "—"}
              </Typography>
              <Typography variant="caption" color="text.secondary">{label}</Typography>
            </Box>
          ))}
        </Paper>
      </Fade>

      {/* ── Main editor area ─────────────────────────────────────────────── */}
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2,
                 "@media (max-width: 900px)": { gridTemplateColumns: "1fr" } }}>

        {/* INPUT panel */}
        <Paper sx={{ borderRadius: 3, border: "1px solid #e5e7eb", overflow: "hidden" }}>
          {/* Panel toolbar */}
          <Box sx={{
            display: "flex", alignItems: "center", px: 2, py: 1,
            borderBottom: "1px solid #f1f5f9", background: "#f8fafc", gap: 1,
          }}>
            <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
              Input
            </Typography>
            <Box sx={{ ml: "auto", display: "flex", gap: 0.5 }}>
              <Tooltip title="Paste from clipboard">
                <IconButton size="small" onClick={handlePaste}>
                  <ContentCopyIcon fontSize="small" sx={{ transform: "scaleX(-1)" }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Upload JSON file">
                <IconButton size="small" onClick={() => fileRef.current?.click()}>
                  <UploadFileIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Clear">
                <IconButton size="small" onClick={handleClear} color="error">
                  <DeleteSweepIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <input ref={fileRef} type="file" accept=".json,application/json" hidden onChange={handleUpload} />
          <TextField
            multiline fullWidth
            minRows={18} maxRows={28}
            value={input}
            onChange={handleInputChange}
            placeholder={'{\n  "paste": "your JSON here",\n  "or": "upload a file"\n}'}
            variant="standard"
            InputProps={{
              disableUnderline: true,
              sx: {
                fontFamily: '"Fira Code", "Cascadia Code", "Courier New", monospace',
                fontSize: "13px", lineHeight: 1.7,
                p: 2, alignItems: "flex-start",
                "& textarea": { resize: "none" },
              },
            }}
            sx={{ "& .MuiInputBase-root": { borderRadius: 0 } }}
          />
          {/* Error bar */}
          {error && hasInput && (
            <Box sx={{
              px: 2, py: 1, background: "#fef2f2",
              borderTop: "1px solid #fecaca",
              display: "flex", alignItems: "center", gap: 1,
            }}>
              <ErrorIcon sx={{ color: "#ef4444", fontSize: 16 }} />
              <Typography variant="caption" color="error" fontFamily="monospace">
                {error}
              </Typography>
            </Box>
          )}
        </Paper>

        {/* OUTPUT panel */}
        <Paper sx={{ borderRadius: 3, border: "1px solid #e5e7eb", overflow: "hidden" }}>
          {/* Panel toolbar */}
          <Box sx={{
            display: "flex", alignItems: "center", px: 2, py: 1,
            borderBottom: "1px solid #f1f5f9", background: "#f8fafc", gap: 1,
          }}>
            <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
              Output
            </Typography>
            <Chip
              label={tab === 0 ? "Beautified" : "Minified"}
              size="small"
              sx={{ ml: 1, bgcolor: tab === 0 ? "#ede9fe" : "#fef3c7", color: tab === 0 ? "#4f46e5" : "#92400e", fontWeight: 700, fontSize: 11 }}
            />
            <Box sx={{ ml: "auto", display: "flex", gap: 0.5 }}>
              <Tooltip title="Use output as input">
                <span>
                  <IconButton size="small" onClick={handleSwap} disabled={!output}>
                    <SwapHorizIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
                <span>
                  <IconButton size="small" onClick={handleCopy} disabled={!output} color={copied ? "success" : "default"}>
                    {copied ? <CheckCircleIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Download JSON">
                <span>
                  <IconButton size="small" onClick={handleDownload} disabled={!output} color="primary">
                    <DownloadIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          </Box>

          {/* Syntax-highlighted output */}
          <Box
            sx={{
              minHeight: 320, maxHeight: 470, overflowY: "auto", p: 2,
              fontFamily: '"Fira Code", "Cascadia Code", "Courier New", monospace',
              fontSize: "13px", lineHeight: 1.7, whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              "& .json-key":    { color: "#7c3aed", fontWeight: 600 },
              "& .json-string": { color: "#059669" },
              "& .json-number": { color: "#0369a1" },
              "& .json-bool":   { color: "#b45309", fontWeight: 600 },
              "& .json-null":   { color: "#9ca3af", fontStyle: "italic" },
            }}
            dangerouslySetInnerHTML={{ __html: output ? tokenize(output) : "" }}
          />

          {/* Empty state */}
          {!output && (
            <Box sx={{
              position: "absolute", inset: 0, display: "flex",
              flexDirection: "column", alignItems: "center", justifyContent: "center",
              pointerEvents: "none", opacity: 0.35, mt: 8,
            }}>
              <DataObjectIcon sx={{ fontSize: 48, color: "#94a3b8" }} />
              <Typography variant="caption" color="text.secondary" mt={1}>
                Output appears here
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>

      {/* ── Controls bar ─────────────────────────────────────────────────── */}
      <Paper sx={{ p: 2, borderRadius: 3, border: "1px solid #e5e7eb" }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>

          {/* Mode buttons */}
          <ButtonGroup variant="contained" size="medium" disableElevation>
            <Button
              startIcon={<AutoFixHighIcon />}
              onClick={handleBeautify}
              sx={{
                textTransform: "none", fontWeight: 700,
                background: tab === 0 ? "#4f46e5" : "#e0e7ff",
                color: tab === 0 ? "#fff" : "#4f46e5",
                "&:hover": { background: tab === 0 ? "#4338ca" : "#c7d2fe" },
              }}
            >
              Beautify
            </Button>
            <Button
              startIcon={<CompressIcon />}
              onClick={handleMinify}
              sx={{
                textTransform: "none", fontWeight: 700,
                background: tab === 1 ? "#7c3aed" : "#ede9fe",
                color: tab === 1 ? "#fff" : "#7c3aed",
                "&:hover": { background: tab === 1 ? "#6d28d9" : "#ddd6fe" },
              }}
            >
              Minify
            </Button>
          </ButtonGroup>

          <Divider orientation="vertical" flexItem />

          {/* Indent selector */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FormatIndentIncreaseIcon sx={{ color: "text.secondary", fontSize: 20 }} />
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              INDENT
            </Typography>
            <ToggleButtonGroup
              size="small" exclusive
              value={indent}
              onChange={handleIndentChange}
            >
              {INDENT_OPTIONS.map((opt) => (
                <ToggleButton
                  key={opt.label} value={opt.value}
                  sx={{ textTransform: "none", fontWeight: 600, px: 1.5, fontSize: 12 }}
                >
                  {opt.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>

          <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
            <Button
              variant="outlined" startIcon={<ContentCopyIcon />}
              onClick={handleCopy} disabled={!output}
              sx={{ textTransform: "none", borderRadius: 2 }}
            >
              {copied ? "Copied!" : "Copy"}
            </Button>
            <Button
              variant="contained" startIcon={<DownloadIcon />}
              onClick={handleDownload} disabled={!output}
              sx={{ textTransform: "none", borderRadius: 2 }}
            >
              Download
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* ── Toast ───────────────────────────────────────────────────────── */}
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

export default JsonBeautifier;