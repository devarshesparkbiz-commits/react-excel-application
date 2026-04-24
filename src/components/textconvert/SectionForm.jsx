import { useState } from "react";
import {
  Paper, TextField, Button, Stack, Typography,
  IconButton, Chip, Box, Divider,
} from "@mui/material";

const AddIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
  </svg>
);

const SectionForm = ({ onAddSection }) => {
  const [heading, setHeading] = useState("");
  const [paraInput, setParaInput] = useState("");
  const [paragraphs, setParagraphs] = useState([]);
  const [bulletInput, setBulletInput] = useState("");
  const [bulletPoints, setBulletPoints] = useState([]);

  const addParagraph = () => {
    if (!paraInput.trim()) return;
    setParagraphs([...paragraphs, paraInput.trim()]);
    setParaInput("");
  };

  const addBullet = () => {
    if (!bulletInput.trim()) return;
    setBulletPoints([...bulletPoints, bulletInput.trim()]);
    setBulletInput("");
  };

  const handleSubmit = () => {
    if (!heading.trim() && paragraphs.length === 0 && bulletPoints.length === 0) return;
    onAddSection({ heading, paragraphs, bulletPoints });
    setHeading("");
    setParagraphs([]);
    setBulletPoints([]);
  };

  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="subtitle1" fontWeight={600} mb={2}>
        Add Section
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="Section Heading"
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          fullWidth
        />

        {/* Paragraphs */}
        <Box>
          <Typography variant="body2" color="text.secondary" mb={1}>Paragraphs</Typography>
          <Stack direction="row" spacing={1}>
            <TextField
              label="Add paragraph"
              value={paraInput}
              onChange={(e) => setParaInput(e.target.value)}
              fullWidth
              multiline
              minRows={2}
              onKeyDown={(e) => e.key === "Enter" && e.shiftKey && addParagraph()}
            />
            <IconButton onClick={addParagraph} color="primary" sx={{ alignSelf: "flex-start", mt: 1 }}>
              <AddIcon />
            </IconButton>
          </Stack>
          <Stack direction="row" flexWrap="wrap" gap={1} mt={1}>
            {paragraphs.map((p, i) => (
              <Chip
                key={i}
                label={p.length > 40 ? p.slice(0, 40) + "…" : p}
                onDelete={() => setParagraphs(paragraphs.filter((_, idx) => idx !== i))}
                variant="outlined"
              />
            ))}
          </Stack>
        </Box>

        <Divider />

        {/* Bullet points */}
        <Box>
          <Typography variant="body2" color="text.secondary" mb={1}>Bullet Points</Typography>
          <Stack direction="row" spacing={1}>
            <TextField
              label="Add bullet point"
              value={bulletInput}
              onChange={(e) => setBulletInput(e.target.value)}
              fullWidth
              onKeyDown={(e) => e.key === "Enter" && addBullet()}
            />
            <IconButton onClick={addBullet} color="primary" sx={{ alignSelf: "center" }}>
              <AddIcon />
            </IconButton>
          </Stack>
          <Stack direction="row" flexWrap="wrap" gap={1} mt={1}>
            {bulletPoints.map((b, i) => (
              <Chip
                key={i}
                label={b}
                onDelete={() => setBulletPoints(bulletPoints.filter((_, idx) => idx !== i))}
                color="secondary"
                variant="outlined"
              />
            ))}
          </Stack>
        </Box>

        <Button variant="outlined" onClick={handleSubmit} startIcon={<AddIcon />}>
          Add Section
        </Button>
      </Stack>
    </Paper>
  );
};

export default SectionForm;