import { useState } from "react";
import { Paper, Button, Stack, TextField, Typography } from "@mui/material";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const WordGeneration = () => {
  const [fileName, setFileName] = useState("");
  const [content, setContent] = useState("");

  const handleGenerate = async () => {
    const res = await fetch("http://localhost:8080/word/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fileName,
        content // 🔥 HTML content
      })
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName || "document"}.docx`;
    a.click();
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6">Word Document Editor</Typography>

      <Stack spacing={3} mt={2}>
        <TextField
          label="File Name"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />

        {/* 🔥 CKEditor */}
        <CKEditor
          editor={ClassicEditor}
          data={content}
          onChange={(event, editor) => {
            const data = editor.getData();
            setContent(data);
          }}
        />

        <Button variant="contained" onClick={handleGenerate}>
          Generate Word
        </Button>
      </Stack>
    </Paper>
  );
};

export default WordGeneration;