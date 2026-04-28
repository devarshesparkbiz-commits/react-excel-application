import { Box, Chip, LinearProgress, Paper, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddCircleIcon    from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

const DiffStats = ({ stats }) => {
  if (!stats) return null;

  const total = stats.added + stats.removed + stats.unchanged;
  const addedPct = total > 0 ? Math.round((stats.added / total) * 100) : 0;
  const removedPct = total > 0 ? Math.round((stats.removed / total) * 100) : 0;
  const unchangedPct = total > 0 ? Math.round((stats.unchanged / total) * 100) : 0;

  return (
    <Paper sx={{ p: 2.5, borderRadius: 3, border: "1px solid #e5e7eb" }}>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", justifyContent: "space-between", mb: 2, flexWrap: "wrap" }}>
        <Typography variant="h6" fontWeight={700}>Statistics</Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Chip
            icon={<CheckCircleIcon />}
            label={`${stats.similarity}% Similar`}
            color={stats.similarity > 80 ? "success" : stats.similarity > 50 ? "warning" : "error"}
            variant="outlined"
          />
        </Box>
      </Box>

      {/* Progress bars */}
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }}>
        {[
          { label: "Added", count: stats.added, pct: addedPct, color: "#22c55e", icon: AddCircleIcon },
          { label: "Removed", count: stats.removed, pct: removedPct, color: "#ef4444", icon: RemoveCircleIcon },
          { label: "Unchanged", count: stats.unchanged, pct: unchangedPct, color: "#94a3b8", icon: CheckCircleIcon },
        ].map(({ label, count, pct, color, icon: Icon }) => (
          <Box key={label}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.75 }}>
              <Icon sx={{ color, fontSize: 18 }} />
              <Typography variant="subtitle2" fontWeight={700}>{label}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ ml: "auto" }}>
                {count}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate" value={pct}
              sx={{
                height: 6, borderRadius: 1,
                backgroundColor: "#e5e7eb",
                "& .MuiLinearProgress-bar": { backgroundColor: color },
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
              {pct}%
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Summary */}
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: "italic" }}>
        {stats.added > 0 && `${stats.added} line${stats.added !== 1 ? 's' : ''} added`}
        {stats.removed > 0 && ` • ${stats.removed} line${stats.removed !== 1 ? 's' : ''} removed`}
        {stats.unchanged > 0 && ` • ${stats.unchanged} line${stats.unchanged !== 1 ? 's' : ''} unchanged`}
      </Typography>
    </Paper>
  );
};

export default DiffStats;