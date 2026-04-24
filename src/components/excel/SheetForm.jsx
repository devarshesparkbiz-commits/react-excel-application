import { useState } from "react";
import {
  Paper,
  Typography,
  Button,
  TextField,
  Stack,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Tooltip
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";

const SheetForm = ({ addSheet }) => {
  const [sheetName, setSheetName] = useState("");
  const [columns, setColumns] = useState(["Column 1"]);
  const [rows, setRows] = useState([[""]]);
  const [lockedCells, setLockedCells] = useState([]);

  // Toggle Lock
  const toggleLock = (row, col) => {
    const exists = lockedCells.find(
      (c) => c.row === row && c.col === col
    );

    if (exists) {
      setLockedCells(
        lockedCells.filter(
          (c) => !(c.row === row && c.col === col)
        )
      );
    } else {
      setLockedCells([...lockedCells, { row, col }]);
    }
  };

  const isLocked = (row, col) =>
    lockedCells.some((c) => c.row === row && c.col === col);

  // Add Column
  const addColumn = () => {
    const newCol = `Column ${columns.length + 1}`;
    setColumns([...columns, newCol]);
    setRows(rows.map((r) => [...r, ""]));
  };

  // Add Row
  const addRow = () => {
    setRows([...rows, new Array(columns.length).fill("")]);
  };

  // Delete Row
  const deleteRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));

    // remove locks of deleted row
    setLockedCells(
      lockedCells.filter((c) => c.row !== index)
    );
  };

  // Update Cell
  const handleCellChange = (r, c, val) => {
    const updated = [...rows];
    updated[r][c] = val;
    setRows(updated);
  };

  // Update Column Name
  const handleColumnChange = (i, val) => {
    const updated = [...columns];
    updated[i] = val;
    setColumns(updated);
  };

  // Submit
  const handleSubmit = () => {
    addSheet({
      sheetName,
      columns,
      values: rows,
      lockedCells, // ✅ IMPORTANT
    });

    // reset
    setSheetName("");
    setColumns(["Column 1"]);
    setRows([[""]]);
    setLockedCells([]);
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
      <Typography variant="h6" mb={2}>
        Create Sheet
      </Typography>

      <Stack spacing={3}>

        {/* Sheet Name */}
        <TextField
          label="Sheet Name"
          placeholder="e.g. Users, Orders"
          value={sheetName}
          onChange={(e) => setSheetName(e.target.value)}
        />

        {/* Table */}
        <Box
          sx={{
            overflowX: "auto",
            borderRadius: 2,
            border: "1px solid #e5e7eb",
          }}
        >
          <Table size="small">

            {/* HEADER */}
            <TableHead sx={{ backgroundColor: "#f3f4f6" }}>
              <TableRow>
                {columns.map((col, i) => (
                  <TableCell key={i}>
                    <TextField
                      variant="standard"
                      value={col}
                      onChange={(e) =>
                        handleColumnChange(i, e.target.value)
                      }
                      InputProps={{
                        disableUnderline: true,
                        style: { fontWeight: 600 },
                      }}
                    />
                  </TableCell>
                ))}

                <TableCell align="center">
                  <Tooltip title="Add Column">
                    <IconButton onClick={addColumn}>
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            </TableHead>

            {/* BODY */}
            <TableBody>
              {rows.map((row, rIndex) => (
                <TableRow key={rIndex} hover>
                  {row.map((cell, cIndex) => {
                    const locked = isLocked(rIndex, cIndex);

                    return (
                      <TableCell
                        key={cIndex}
                        sx={{
                          backgroundColor: locked
                            ? "#fff5f5"
                            : "inherit",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            value={cell}
                            onChange={(e) =>
                              handleCellChange(
                                rIndex,
                                cIndex,
                                e.target.value
                              )
                            }
                            placeholder="Enter value"
                            disabled={locked} // 👈 optional UX
                          />

                          <Tooltip
                            title={
                              locked
                                ? "Unlock Cell"
                                : "Lock Cell"
                            }
                          >
                            <IconButton
                              onClick={() =>
                                toggleLock(rIndex, cIndex)
                              }
                              size="small"
                            >
                              {locked ? (
                                <LockIcon color="error" />
                              ) : (
                                <LockOpenIcon />
                              )}
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    );
                  })}

                  <TableCell align="center">
                    <Tooltip title="Delete Row">
                      <IconButton
                        onClick={() => deleteRow(rIndex)}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        {/* Actions */}
        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-between"
        >
          <Button
            variant="outlined"
            onClick={addRow}
            startIcon={<AddIcon />}
          >
            Add Row
          </Button>

          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
          >
            Add Sheet
          </Button>
        </Stack>

      </Stack>
    </Paper>
  );
};

export default SheetForm;