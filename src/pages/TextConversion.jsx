import { useState } from "react";
import {
  Paper, Stack, TextField, Typography, Button,
  ButtonGroup, Alert, Snackbar, CircularProgress,
} from "@mui/material";
import SectionForm from "../components/textconvert/SectionForm";
import SectionTable from "../components/textconvert/SectionTable";
import {convertToWord, convertToPdf} from "../api/convertApi";  
// import { convertToWord, convertToPdf } from "../api/convertApi";

const WordIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z"/>
  </svg>
);

const PdfIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z"/>
  </svg>
);

const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

const TextConversion = () => {
  const [fileName, setFileName] = useState("");
  const [title, setTitle] = useState("");
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  const addSection = (section) => setSections([...sections, section]);
  const deleteSection = (index) => setSections(sections.filter((_, i) => i !== index));

  const buildPayload = () => ({
    fileName: fileName || "document",
    title,
    sections,
  });

  const handleConvert = async (type) => {
    if (!sections.length) {
      setSnack({ open: true, message: "Add at least one section before converting.", severity: "warning" });
      return;
    }
    setLoading(true);
    try {
      const payload = buildPayload();
      let response, ext;
      if (type === "word") {
        response = await convertToWord(payload);
        ext = "docx";
      } else {
        response = await convertToPdf(payload);
        ext = "pdf";
      }
      downloadBlob(response.data, `${payload.fileName}.${ext}`);
      setSnack({ open: true, message: `${ext.toUpperCase()} downloaded successfully!`, severity: "success" });
    } catch (err) {
      setSnack({ open: true, message: "Conversion failed. Please try again.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Text to Document Converter
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="File Name"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="e.g. my-report"
            fullWidth
          />
          <TextField
            label="Document Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Quarterly Summary"
            fullWidth
          />
        </Stack>
      </Paper>

      <SectionForm onAddSection={addSection} />
      <SectionTable sections={sections} onDelete={deleteSection} />

      <Paper sx={{ p: 2, borderRadius: 3 }}>
        <ButtonGroup variant="contained" size="large" disabled={loading} fullWidth>
          <Button
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <WordIcon />}
            onClick={() => handleConvert("word")}
            sx={{ py: 1.5 }}
          >
            Export as Word
          </Button>
          <Button
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <PdfIcon />}
            onClick={() => handleConvert("pdf")}
            color="secondary"
            sx={{ py: 1.5 }}
          >
            Export as PDF
          </Button>
        </ButtonGroup>
      </Paper>

      <Snackbar
        open={snack.open}
        autoHideDuration={3500}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snack.severity} variant="filled" onClose={() => setSnack({ ...snack, open: false })}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default TextConversion;