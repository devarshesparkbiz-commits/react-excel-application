import { TextField, Paper, Typography } from "@mui/material";

const FileConfig = ({ fileName, setFileName }) => {
  return (
    <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
      <Typography variant="h6" mb={2}>
        File Configuration
      </Typography>

      <TextField
        fullWidth
        label="File Name"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
      />
    </Paper>
  );
};

export default FileConfig;