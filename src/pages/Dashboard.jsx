import { Paper, Typography } from "@mui/material";

const Dashboard = () => {
  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h5" fontWeight={600}>
        Dashboard
      </Typography>

      <Typography mt={2}>
        Welcome to your enterprise dashboard 🚀
      </Typography>
    </Paper>
  );
};

export default Dashboard;