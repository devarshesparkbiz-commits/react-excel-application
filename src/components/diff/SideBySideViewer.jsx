import { Box, Paper, Tooltip } from "@mui/material";

const SideBySideViewer = ({ diffs }) => {
  if (!diffs || diffs.length === 0) return null;

  return (
    <Paper sx={{
      borderRadius: 3, border: "1px solid #e5e7eb", overflow: "hidden",
      display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 400,
    }}>
      {/* LEFT: Original */}
      <Box sx={{
        borderRight: "1px solid #e5e7eb", fontFamily: '"Fira Code", monospace',
        fontSize: "13px", lineHeight: 1.8, overflow: "auto", maxHeight: 500,
      }}>
        <Box sx={{
          bgcolor: "#f8fafc", p: 1.5, fontWeight: 700, fontSize: 12,
          color: "text.secondary", borderBottom: "1px solid #e5e7eb",
        }}>
          Original
        </Box>
        <Box>
          {diffs.map((d, idx) => (
            d.type !== 'add' && (
              <Tooltip key={idx} title={d.type === 'remove' ? 'Removed' : 'Unchanged'} placement="left">
                <Box sx={{
                  display: "flex", borderBottom: "1px solid #f1f5f9",
                  bgcolor: d.type === 'remove' ? '#fee2e2' : d.type === 'keep' ? '#fff' : 'transparent',
                }}>
                  <Box sx={{
                    width: 40, p: 1, textAlign: "center", color: "#9ca3af",
                    fontSize: 11, borderRight: "1px solid #e5e7eb", flex: 0,
                  }}>
                    {d.oldLine || ""}
                  </Box>
                  <Box sx={{
                    flex: 1, p: 1, whiteSpace: "pre-wrap", wordBreak: "break-word",
                    color: d.type === 'remove' ? '#991b1b' : '#374151',
                    textDecoration: d.type === 'remove' ? 'line-through' : 'none',
                  }}>
                    {d.value}
                  </Box>
                </Box>
              </Tooltip>
            )
          ))}
        </Box>
      </Box>

      {/* RIGHT: Modified */}
      <Box sx={{
        fontFamily: '"Fira Code", monospace',
        fontSize: "13px", lineHeight: 1.8, overflow: "auto", maxHeight: 500,
      }}>
        <Box sx={{
          bgcolor: "#f8fafc", p: 1.5, fontWeight: 700, fontSize: 12,
          color: "text.secondary", borderBottom: "1px solid #e5e7eb",
        }}>
          Modified
        </Box>
        <Box>
          {diffs.map((d, idx) => (
            d.type !== 'remove' && (
              <Tooltip key={idx} title={d.type === 'add' ? 'Added' : 'Unchanged'} placement="right">
                <Box sx={{
                  display: "flex", borderBottom: "1px solid #f1f5f9",
                  bgcolor: d.type === 'add' ? '#dcfce7' : d.type === 'keep' ? '#fff' : 'transparent',
                }}>
                  <Box sx={{
                    width: 40, p: 1, textAlign: "center", color: "#9ca3af",
                    fontSize: 11, borderRight: "1px solid #e5e7eb", flex: 0,
                  }}>
                    {d.newLine || ""}
                  </Box>
                  <Box sx={{
                    flex: 1, p: 1, whiteSpace: "pre-wrap", wordBreak: "break-word",
                    color: d.type === 'add' ? '#15803d' : '#374151',
                    fontWeight: d.type === 'add' ? 500 : 'normal',
                    backgroundColor: d.type === 'add' ? '#bbf7d0' : 'transparent',
                  }}>
                    {d.value}
                  </Box>
                </Box>
              </Tooltip>
            )
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default SideBySideViewer;