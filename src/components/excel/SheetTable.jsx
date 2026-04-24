import { DataGrid } from "@mui/x-data-grid";
import { Paper, Typography } from "@mui/material";

const SheetTable = ({ sheets }) => {
  return (
    <>
      {sheets.map((sheet, idx) => {
        const columns = sheet.columns.map((col, i) => ({
          field: col,
          headerName: col,
          flex: 1,
        }));

        const rows = sheet.values.map((row, i) => {
          const obj = { id: i };
          row.forEach((val, index) => {
            obj[sheet.columns[index]] = val;
          });
          return obj;
        });

        return (
          <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }} key={idx}>
            <Typography variant="h6" mb={2}>
              {sheet.sheetName}
            </Typography>

            <div style={{ height: 300 }}>
              <DataGrid rows={rows} columns={columns} />
            </div>
          </Paper>
        );
      })}
    </>
  );
};

export default SheetTable;