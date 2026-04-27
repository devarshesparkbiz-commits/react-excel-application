import { Box, TextField, IconButton, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const OptionField = ({ q, sIndex, qIndex, form, setForm }) => {
  const addOption = () => {
    const updated = [...form.sections];
    updated[sIndex].questions[qIndex].options.push("");
    setForm({ ...form, sections: updated });
  };

  return (
    <Box mt={2}>
      {q.options.map((opt, oIndex) => (
        <Box
        key={oIndex}
        sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mt: 1,
        }}
        >
        <TextField
            fullWidth
            size="small"
            label={`Option ${oIndex + 1}`}
            value={opt}
            onChange={(e) => {
            const updated = [...form.sections];
            updated[sIndex].questions[qIndex].options[oIndex] =
                e.target.value;
            setForm({ ...form, sections: updated });
            }}
        />

        <IconButton
            size="small"
            sx={{ flexShrink: 0 }}
            onClick={() => removeOption(sIndex, qIndex, oIndex)}
        >
            <DeleteIcon fontSize="small" />
        </IconButton>
        </Box>
      ))}

      <Button onClick={addOption}>+ Add Option</Button>
    </Box>
  );
};

export default OptionField;