import {
  Card,
  TextField,
  Select,
  MenuItem,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import OptionField from "./OptionField";

const types = ["TEXT", "TEXTAREA", "SINGLE_SELECT", "MULTI_SELECT"];

const QuestionCard = ({ q, sIndex, qIndex, form, setForm }) => {
  const removeQuestion = () => {
    const updated = [...form.sections];
    updated[sIndex].questions.splice(qIndex, 1);
    setForm({ ...form, sections: updated });
  };
return (
  <Card
    sx={{
      mt: 2,
      p: 2,
      borderRadius: 2,
      bgcolor: "background.paper",
      border: "1px solid",
      borderColor: "divider",
      position: "relative", // 🔥 REQUIRED
    }}
  >
    {/* DELETE BUTTON - ALWAYS TOP RIGHT */}
    <IconButton
      size="small"
      onClick={removeQuestion}
      sx={{
        position: "absolute",
        top: 8,
        right: 8,
      }}
    >
      <DeleteIcon fontSize="small" />
    </IconButton>

    {/* HEADER WITH LEFT ACCENT */}
    <Box
      sx={{
        borderLeft: "4px solid",
        borderColor: "primary.main",
        pl: 2,
        mb: 1,
      }}
    >
      <Typography variant="subtitle1" fontWeight={500}>
        Question {qIndex + 1}
      </Typography>
    </Box>

    {/* QUESTION INPUT */}
    <TextField
      fullWidth
      size="small"
      margin="normal"
      label="Question"
      value={q.label}
      onChange={(e) => {
        const updated = [...form.sections];
        updated[sIndex].questions[qIndex].label = e.target.value;
        setForm({ ...form, sections: updated });
      }}
    />

    {/* TYPE SELECT */}
    <Select
      fullWidth
      size="small"
      value={q.type}
      onChange={(e) => {
        const updated = [...form.sections];
        updated[sIndex].questions[qIndex].type = e.target.value;
        setForm({ ...form, sections: updated });
      }}
    >
      {types.map((t) => (
        <MenuItem key={t} value={t}>
          {t}
        </MenuItem>
      ))}
    </Select>

    {/* OPTIONS */}
    {(q.type === "SINGLE_SELECT" || q.type === "MULTI_SELECT") && (
      <OptionField
        q={q}
        sIndex={sIndex}
        qIndex={qIndex}
        form={form}
        setForm={setForm}
      />
    )}
  </Card>
);
};

export default QuestionCard;