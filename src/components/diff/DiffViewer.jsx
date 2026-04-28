import { Box, Typography, Paper } from "@mui/material";
import { computeCharDiff } from "../../utils/diffAlgorithm";

const DiffViewer = ({ diffs }) => {
  if (!diffs || diffs.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3, bgcolor: "#f8fafc" }}>
        <Typography color="text.secondary">No differences</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{
      borderRadius: 3, border: "1px solid #e5e7eb", overflow: "hidden",
      fontFamily: '"Fira Code", "Cascadia Code", monospace',
      fontSize: "13px", lineHeight: 1.8,
    }}>
      {/* Header */}
      <Box sx={{
        display: "grid", gridTemplateColumns: "40px 1fr 40px 1fr",
        borderBottom: "1px solid #e5e7eb", bgcolor: "#f8fafc",
        fontWeight: 700, fontSize: 11, color: "text.secondary",
      }}>
        <Box sx={{ p: 1, textAlign: "center", borderRight: "1px solid #e5e7eb" }}>Old</Box>
        <Box sx={{ p: 1, pl: 2, borderRight: "1px solid #e5e7eb" }}>Original</Box>
        <Box sx={{ p: 1, textAlign: "center", borderRight: "1px solid #e5e7eb" }}>New</Box>
        <Box sx={{ p: 1, pl: 2 }}>Modified</Box>
      </Box>

      {/* Lines */}
      <Box sx={{ maxHeight: 500, overflowY: "auto" }}>
        {diffs.map((d, idx) => {
          const bgcolor = d.type === 'add' ? '#dcfce7' : d.type === 'remove' ? '#fee2e2' : '#f9fafb';
          const bdcolor = d.type === 'add' ? '#86efac' : d.type === 'remove' ? '#fca5a5' : '#e5e7eb';
          const textcolor = d.type === 'add' ? '#15803d' : d.type === 'remove' ? '#991b1b' : '#374151';

          return (
            <Box
              key={idx}
              sx={{
                display: "grid", gridTemplateColumns: "40px 1fr 40px 1fr",
                bgcolor, borderBottom: "1px solid #e5e7eb", whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {/* Old line number */}
              <Box sx={{
                p: 1, textAlign: "center", color: "#9ca3af", fontSize: 11,
                borderRight: "1px solid " + bdcolor, bgcolor,
              }}>
                {d.oldLine || "—"}
              </Box>

              {/* Old content */}
              <Box sx={{
                p: 1, color: textcolor, borderRight: "1px solid " + bdcolor, bgcolor,
              }}>
                {d.type === 'remove' ? (
                  <span style={{ backgroundColor: "#fecaca", textDecoration: "line-through" }}>
                    {d.value}
                  </span>
                ) : d.value}
              </Box>

              {/* New line number */}
              <Box sx={{
                p: 1, textAlign: "center", color: "#9ca3af", fontSize: 11,
                borderRight: "1px solid " + bdcolor, bgcolor,
              }}>
                {d.newLine || "—"}
              </Box>

              {/* New content */}
              <Box sx={{
                p: 1, color: textcolor, bgcolor,
              }}>
                {d.type === 'add' ? (
                  <span style={{ backgroundColor: "#bbf7d0", fontWeight: 500 }}>
                    {d.value}
                  </span>
                ) : d.value}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
};

export default DiffViewer;