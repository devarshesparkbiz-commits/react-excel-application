import { useState } from "react";
import { Stack, Button } from "@mui/material";
import FileConfig from "../components/excel/FileConfig";
import SheetForm from "../components/excel/SheetForm";
import SheetTable from "../components/excel/SheetTable";

const ExcelGeneration = () => {
  const [fileName, setFileName] = useState("");
  const [sheets, setSheets] = useState([]);

  const addSheet = (sheet) => {
    setSheets([...sheets, sheet]);
  };

  const generateExcel = async () => {
    const response = await fetch("http://localhost:8080/excel/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fileName,
        sheets
      })
    });

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName || "excel"}.xlsx`;
    a.click();
  };

  return (
    <Stack spacing={3}>
      <FileConfig fileName={fileName} setFileName={setFileName} />
      <SheetForm addSheet={addSheet} />
      <SheetTable sheets={sheets} />

      <Button variant="contained" size="large" onClick={generateExcel}>
        Generate Excel
      </Button>
    </Stack>
  );
};

export default ExcelGeneration;