import { Card, CardContent, TextField, Typography } from "@mui/material";

const FormHeaderCard = ({ form, setForm }) => {
  return (
    <Card
        sx={{
            mb: 3,
            borderRadius: 3,
            boxShadow: 2,
        }}
        >
      <CardContent>
        <Typography variant="h6">Form Details</Typography>

        <TextField
          fullWidth
          label="Title"
          margin="normal"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <TextField
          fullWidth
          multiline
          rows={3}
          label="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />
      </CardContent>
    </Card>
  );
};

export default FormHeaderCard;