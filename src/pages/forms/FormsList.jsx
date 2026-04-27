import React, { useEffect, useState } from "react";
import {
  Box, Button, Chip, CircularProgress, IconButton,
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Tooltip, Typography, Alert, Snackbar
} from "@mui/material";
import DeleteIcon   from "@mui/icons-material/Delete";
import EditIcon     from "@mui/icons-material/Edit";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon    from "@mui/icons-material/Print";
import AddIcon      from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { deleteForm, downloadFormPdf, getForms, printFormPdf } from "../../components/api/formsApi";

const FormsList = () => {
  const [forms, setForms]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [toast, setToast]       = useState({ open: false, msg: "", severity: "success" });
  const navigate = useNavigate();

  useEffect(() => { fetchForms(); }, []);

  const fetchForms = async () => {
    setLoading(true);
    try {
      const { data } = await getForms();
      setForms(Array.isArray(data) ? data : []);
    } catch {
      showToast("Failed to load forms", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this form?")) return;
    try {
      await deleteForm(id);
      setForms((prev) => prev.filter((f) => f.id !== id));
      showToast("Form deleted");
    } catch {
      showToast("Delete failed", "error");
    }
  };

  const handleDownload = async (id, title) => {
    try {
      const { data } = await downloadFormPdf(id);
      const url  = URL.createObjectURL(new Blob([data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `${title || "form"}-${id}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      showToast("Download failed", "error");
    }
  };

  const handlePrint = async (id) => {
    try {
      const { data } = await printFormPdf(id);
      const url = URL.createObjectURL(new Blob([data], { type: "application/pdf" }));
      window.open(url, "_blank");
    } catch {
      showToast("Print failed", "error");
    }
  };

  const showToast = (msg, severity = "success") =>
    setToast({ open: true, msg, severity });

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}><CircularProgress /></Box>;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Forms</Typography>
          <Typography variant="body2" color="text.secondary">
            {forms.length} form{forms.length !== 1 ? "s" : ""} total
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/forms/create")}
          sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
        >
          New Form
        </Button>
      </Box>

      {/* Table */}
      {forms.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: "center", borderRadius: 3 }}>
          <Typography color="text.secondary">No forms yet. Create your first one!</Typography>
          <Button variant="outlined" sx={{ mt: 2 }} onClick={() => navigate("/forms/create")}>
            Create Form
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: "0 1px 4px rgba(0,0,0,.08)" }}>
          <Table>
            <TableHead sx={{ background: "#f1f5f9" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Sections</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Updated</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {forms.map((form, idx) => (
                <TableRow key={form.id} hover>
                  <TableCell sx={{ color: "text.secondary" }}>{idx + 1}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{form.title}</TableCell>
                  <TableCell sx={{ color: "text.secondary", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {form.description || "—"}
                  </TableCell>
                  <TableCell>
                    <Chip label={`${form.sections?.length ?? 0} sections`} size="small" />
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary", fontSize: 13 }}>
                    {form.updatedAt ? new Date(form.updatedAt).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton size="small" color="primary" onClick={() => navigate(`/forms/edit/${form.id}`)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download PDF">
                      <IconButton size="small" color="success" onClick={() => handleDownload(form.id, form.title)}>
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Print / Preview">
                      <IconButton size="small" color="info" onClick={() => handlePrint(form.id)}>
                        <PrintIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" onClick={() => handleDelete(form.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast({ ...toast, open: false })}>
        <Alert severity={toast.severity} onClose={() => setToast({ ...toast, open: false })}>
          {toast.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FormsList;