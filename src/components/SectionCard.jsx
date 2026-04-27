import {
  Card,
  CardContent,
  TextField,
  Typography,
  IconButton,
  Box,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import QuestionCard from "./QuestionCard";

const SectionCard = ({ section, sIndex, form, setForm }) => {
  const addQuestion = () => {
    const updated = [...form.sections];
    updated[sIndex].questions.push({
      label: "",
      type: "TEXT",
      options: [],
    });
    setForm({ ...form, sections: updated });
  };

  const removeSection = () => {
    const updated = [...form.sections];
    updated.splice(sIndex, 1);
    setForm({ ...form, sections: updated });
  };

  return (
    <Card
    sx={{
        mb: 3,
        borderRadius: 3,
        boxShadow: 2,
    }}
    >
      <CardContent>
        {/* HEADER WITH DELETE */}
        <Box
        sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
        }}
        >
        <Typography variant="h6">
            Section {sIndex + 1}
        </Typography>

        <IconButton size="small" onClick={removeSection}>
            <DeleteIcon />
        </IconButton>
        </Box>

        <TextField
          fullWidth
          label="Section Title"
          margin="normal"
          value={section.title}
          onChange={(e) => {
            const updated = [...form.sections];
            updated[sIndex].title = e.target.value;
            setForm({ ...form, sections: updated });
          }}
        />

        {section.questions.map((q, qIndex) => (
          <QuestionCard
            key={qIndex}
            q={q}
            sIndex={sIndex}
            qIndex={qIndex}
            form={form}
            setForm={setForm}
          />
        ))}

        <Button onClick={addQuestion}>+ Add Question</Button>
      </CardContent>
    </Card>
  );
};

export default SectionCard;