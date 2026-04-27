import React, { useCallback, useEffect, useState } from "react";
import {
  Alert, Box, Button, Card, CardContent, Checkbox, Chip,
  CircularProgress, Divider, FormControlLabel, Grid, IconButton,
  MenuItem, Paper, Select, Snackbar, TextField, Tooltip, Typography
} from "@mui/material";
import AddIcon        from "@mui/icons-material/Add";
import DeleteIcon     from "@mui/icons-material/Delete";
import SaveIcon       from "@mui/icons-material/Save";
import ArrowBackIcon  from "@mui/icons-material/ArrowBack";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { useNavigate, useParams } from "react-router-dom";
import { createForm, getFormById, updateForm } from "../../components/api/formsApi";

const QUESTION_TYPES = [
  { value: "TEXT",     label: "Short Text" },
  { value: "TEXTAREA", label: "Long Text" },
  { value: "NUMBER",   label: "Number" },
  { value: "DATE",     label: "Date" },
  { value: "DROPDOWN", label: "Dropdown" },
  { value: "RADIO",    label: "Radio" },
  { value: "CHECKBOX", label: "Checkbox" },
];

const OPTION_TYPES = ["DROPDOWN", "RADIO", "CHECKBOX"];

const emptyQuestion = (orderIndex) => ({
  label: "", type: "TEXT", required: false,
  placeholder: "", defaultValue: "", options: [], orderIndex,
});

const emptySection = (orderIndex) => ({
  title: "", orderIndex, questions: [],
});

const FormBuilder = () => {
  const { id } = useParams();
  const isEdit  = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({ formName: "", description: "", sections: [] });
  const [loading, setLoading]   = useState(isEdit);
  const [saving,  setSaving]    = useState(false);
  const [toast,   setToast]     = useState({ open: false, msg: "", severity: "success" });

  // Load for edit
  useEffect(() => {
    if (!isEdit) return;
    getFormById(id)
      .then(({ data }) => {
        setForm({
          formName:    data.title || "",
          description: data.description || "",
          sections: (data.sections || []).map((s) => ({
            id:         s.id,
            title:      s.title,
            orderIndex: s.orderIndex,
            questions: (s.questions || []).map((q) => ({
              id:           q.id,
              label:        q.label,
              type:         q.type,
              required:     q.required,
              placeholder:  q.placeholder || "",
              defaultValue: q.defaultValue || "",
              options:      q.options || [],
              orderIndex:   q.orderIndex,
            })),
          })),
        });
      })
      .catch(() => showToast("Failed to load form", "error"))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  // ── Form header ──────────────────────────────────────────────────────────
  const handleFormField = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // ── Sections ─────────────────────────────────────────────────────────────
  const addSection = () =>
    setForm((prev) => ({
      ...prev,
      sections: [...prev.sections, emptySection(prev.sections.length + 1)],
    }));

  const removeSection = (si) =>
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== si),
    }));

  const updateSection = (si, field, value) =>
    setForm((prev) => {
      const sections = [...prev.sections];
      sections[si] = { ...sections[si], [field]: value };
      return { ...prev, sections };
    });

  // ── Questions ─────────────────────────────────────────────────────────────
  const addQuestion = (si) =>
    setForm((prev) => {
      const sections = [...prev.sections];
      const qs = sections[si].questions;
      sections[si] = {
        ...sections[si],
        questions: [...qs, emptyQuestion(qs.length + 1)],
      };
      return { ...prev, sections };
    });

  const removeQuestion = (si, qi) =>
    setForm((prev) => {
      const sections = [...prev.sections];
      sections[si] = {
        ...sections[si],
        questions: sections[si].questions.filter((_, i) => i !== qi),
      };
      return { ...prev, sections };
    });

  const updateQuestion = (si, qi, field, value) =>
    setForm((prev) => {
      const sections = [...prev.sections];
      const questions = [...sections[si].questions];
      questions[qi] = { ...questions[qi], [field]: value };
      sections[si] = { ...sections[si], questions };
      return { ...prev, sections };
    });

  // ── Options (for dropdown/radio/checkbox) ─────────────────────────────────
  const addOption = (si, qi) => {
    const current = form.sections[si].questions[qi].options || [];
    updateQuestion(si, qi, "options", [...current, ""]);
  };

  const updateOption = (si, qi, oi, value) => {
    const options = [...(form.sections[si].questions[qi].options || [])];
    options[oi] = value;
    updateQuestion(si, qi, "options", options);
  };

  const removeOption = (si, qi, oi) => {
    const options = (form.sections[si].questions[qi].options || []).filter((_, i) => i !== oi);
    updateQuestion(si, qi, "options", options);
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.formName.trim()) { showToast("Form name is required", "error"); return; }

    setSaving(true);
    try {
      if (isEdit) {
        await updateForm(id, form);
        showToast("Form updated successfully");
      } else {
        await createForm(form);
        showToast("Form created successfully");
      }
      setTimeout(() => navigate("/forms"), 1200);
    } catch {
      showToast("Save failed. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  const showToast = (msg, severity = "success") =>
    setToast({ open: true, msg, severity });

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ maxWidth: 900, mx: "auto" }}>
      {/* Top Bar */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton onClick={() => navigate("/forms")}><ArrowBackIcon /></IconButton>
          <Typography variant="h5" fontWeight={700}>
            {isEdit ? "Edit Form" : "Create Form"}
          </Typography>
        </Box>
        <Button
          variant="contained" startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
          onClick={handleSave} disabled={saving}
          sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
        >
          {saving ? "Saving…" : isEdit ? "Update Form" : "Save Form"}
        </Button>
      </Box>

      {/* Form Header Card */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: "0 1px 4px rgba(0,0,0,.08)" }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600} mb={2}>Form Details</Typography>
          <TextField
            fullWidth label="Form Title" name="formName"
            value={form.formName} onChange={handleFormField}
            sx={{ mb: 2 }} required
          />
          <TextField
            fullWidth label="Description" name="description"
            value={form.description} onChange={handleFormField}
            multiline rows={2}
          />
        </CardContent>
      </Card>

      {/* Sections */}
      {form.sections.map((section, si) => (
        <Card key={si} sx={{ mb: 2, borderRadius: 3, boxShadow: "0 1px 4px rgba(0,0,0,.08)" }}>
          <CardContent>
            {/* Section Header */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <DragIndicatorIcon sx={{ color: "text.disabled" }} />
              <TextField
                label={`Section ${si + 1} Title`} size="small"
                value={section.title} sx={{ flexGrow: 1 }}
                onChange={(e) => updateSection(si, "title", e.target.value)}
              />
              <Chip label={`${section.questions.length} Q`} size="small" />
              <Tooltip title="Delete section">
                <IconButton size="small" color="error" onClick={() => removeSection(si)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Questions */}
            {section.questions.map((q, qi) => (
              <Paper
                key={qi} variant="outlined"
                sx={{ p: 2, mb: 2, borderRadius: 2, background: "#fafafa" }}
              >
                <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start", flexWrap: "wrap" }}>
                  {/* Label */}
                  <TextField
                    label="Question Label" size="small" sx={{ flexGrow: 1, minWidth: 180 }}
                    value={q.label}
                    onChange={(e) => updateQuestion(si, qi, "label", e.target.value)}
                  />
                  {/* Type */}
                  <Select
                    size="small" value={q.type} sx={{ minWidth: 150 }}
                    onChange={(e) => updateQuestion(si, qi, "type", e.target.value)}
                  >
                    {QUESTION_TYPES.map((t) => (
                      <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                    ))}
                  </Select>
                  {/* Required */}
                  <FormControlLabel
                    control={
                      <Checkbox size="small" checked={q.required}
                        onChange={(e) => updateQuestion(si, qi, "required", e.target.checked)} />
                    }
                    label="Required" sx={{ ml: 0 }}
                  />
                  {/* Delete Q */}
                  <Tooltip title="Delete question">
                    <IconButton size="small" color="error" onClick={() => removeQuestion(si, qi)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Placeholder */}
                <TextField
                  label="Placeholder" size="small" fullWidth sx={{ mt: 1.5 }}
                  value={q.placeholder}
                  onChange={(e) => updateQuestion(si, qi, "placeholder", e.target.value)}
                />

                {/* Options */}
                {OPTION_TYPES.includes(q.type) && (
                  <Box sx={{ mt: 1.5 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      OPTIONS
                    </Typography>
                    {(q.options || []).map((opt, oi) => (
                      <Box key={oi} sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                        <TextField
                          size="small" value={opt} sx={{ flexGrow: 1 }}
                          label={`Option ${oi + 1}`}
                          onChange={(e) => updateOption(si, qi, oi, e.target.value)}
                        />
                        <IconButton size="small" color="error" onClick={() => removeOption(si, qi, oi)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                    <Button size="small" onClick={() => addOption(si, qi)} sx={{ mt: 0.5 }}>
                      + Add Option
                    </Button>
                  </Box>
                )}
              </Paper>
            ))}

            <Button
              size="small" startIcon={<AddIcon />}
              onClick={() => addQuestion(si)}
              sx={{ textTransform: "none" }}
            >
              Add Question
            </Button>
          </CardContent>
        </Card>
      ))}

      {/* Add Section */}
      <Button
        fullWidth variant="outlined" startIcon={<AddIcon />}
        onClick={addSection}
        sx={{ borderRadius: 3, py: 1.5, textTransform: "none", fontWeight: 600, borderStyle: "dashed" }}
      >
        Add Section
      </Button>

      <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast({ ...toast, open: false })}>
        <Alert severity={toast.severity} onClose={() => setToast({ ...toast, open: false })}>
          {toast.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FormBuilder;