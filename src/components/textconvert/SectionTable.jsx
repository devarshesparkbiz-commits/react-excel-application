import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography, Chip, Stack, IconButton, Tooltip,
} from "@mui/material";

const DeleteIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
  </svg>
);

const SectionTable = ({ sections, onDelete }) => {
  if (!sections.length) return null;

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
      <Table size="small">
        <TableHead sx={{ backgroundColor: "#f3f4f6" }}>
          <TableRow>
            <TableCell><strong>#</strong></TableCell>
            <TableCell><strong>Heading</strong></TableCell>
            <TableCell><strong>Paragraphs</strong></TableCell>
            <TableCell><strong>Bullet Points</strong></TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {sections.map((s, i) => (
            <TableRow key={i} hover>
              <TableCell>{i + 1}</TableCell>
              <TableCell>
                <Typography fontWeight={600}>{s.heading || "—"}</Typography>
              </TableCell>
              <TableCell>
                <Stack spacing={0.5}>
                  {s.paragraphs.length
                    ? s.paragraphs.map((p, j) => (
                        <Typography key={j} variant="body2" color="text.secondary">
                          {p.length > 50 ? p.slice(0, 50) + "…" : p}
                        </Typography>
                      ))
                    : <Typography variant="body2" color="text.disabled">—</Typography>}
                </Stack>
              </TableCell>
              <TableCell>
                <Stack direction="row" flexWrap="wrap" gap={0.5}>
                  {s.bulletPoints.length
                    ? s.bulletPoints.map((b, j) => (
                        <Chip key={j} label={b} size="small" color="secondary" variant="outlined" />
                      ))
                    : <Typography variant="body2" color="text.disabled">—</Typography>}
                </Stack>
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Remove section">
                  <IconButton size="small" onClick={() => onDelete(i)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SectionTable;