import { Box, Chip, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useState }    from "react";

/** Syntax-highlights XML using a simple token regex — no external lib needed */
const highlight = (xml) => {
  if (!xml) return "";
  return xml
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // Re-open the tags for highlighting
    .replace(/&lt;(\/?[\w:.-]+)(.*?)&gt;/g, (_, tag, rest) => {
      const attrs = rest.replace(
        /([\w:.-]+)=&quot;([^&]*)&quot;/g,
        `<span style="color:#86efac">$1</span>=<span style="color:#fcd34d">&quot;$2&quot;</span>`
      );
      const slash = tag.startsWith("/") ? `<span style="color:#f87171">/</span>` : "";
      const t = tag.startsWith("/") ? tag.slice(1) : tag;
      return `<span style="color:#94a3b8">&lt;</span>${slash}<span style="color:#818cf8;font-weight:600">${t}</span>${attrs}<span style="color:#94a3b8">&gt;</span>`;
    })
    // Processing instruction
    .replace(
      /&lt;\?(.*?)\?&gt;/g,
      `<span style="color:#64748b">&lt;?$1?&gt;</span>`
    );
};

const XmlPreview = ({ xml }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(xml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!xml) return null;

  return (
    <Paper sx={{ borderRadius: 3, overflow: "hidden", border: "1px solid #1e293b" }}>
      {/* Toolbar */}
      <Box sx={{
        display: "flex", alignItems: "center", px: 2, py: 1,
        background: "#0f172a", borderBottom: "1px solid #1e293b",
      }}>
        <Box sx={{ display: "flex", gap: 0.75 }}>
          {["#ef4444","#f59e0b","#22c55e"].map((c) => (
            <Box key={c} sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: c }} />
          ))}
        </Box>
        <Typography variant="caption" sx={{ ml: 2, color: "#64748b", fontFamily: "monospace" }}>
          preview.xml
        </Typography>
        <Chip
          label="XML"
          size="small"
          sx={{ ml: 1, bgcolor: "#1e293b", color: "#818cf8", fontSize: 10, height: 18 }}
        />
        <Tooltip title={copied ? "Copied!" : "Copy XML"}>
          <IconButton size="small" onClick={handleCopy} sx={{ ml: "auto", color: "#64748b" }}>
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Code */}
      <Box
        component="pre"
        sx={{
          m: 0, p: 2.5, overflowX: "auto", maxHeight: 420,
          background: "#0f172a", color: "#e2e8f0",
          fontFamily: '"Fira Code", "Cascadia Code", monospace',
          fontSize: "13px", lineHeight: 1.7,
        }}
        dangerouslySetInnerHTML={{ __html: highlight(xml) }}
      />
    </Paper>
  );
};

export default XmlPreview;