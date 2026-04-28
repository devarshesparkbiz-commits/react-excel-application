import { Paper, Typography, Grid, Box, Button, Stack, Divider } from "@mui/material";
import { useAuth } from "../theme/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  RocketLaunch as RocketLaunchIcon, 
  Shield as ShieldIcon, 
  Star as StarIcon 
} from '@mui/icons-material';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getPlanIcon = () => {
    switch(user?.planName) {
      case 'Enterprise': return <ShieldIcon sx={{ fontSize: 40, color: '#10b981' }} />;
      case 'Pro': return <StarIcon sx={{ fontSize: 40, color: '#f59e0b' }} />;
      default: return <RocketLaunchIcon sx={{ fontSize: 40, color: '#4f46e5' }} />;
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4, borderRadius: 4, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              {getPlanIcon()}
              <Box>
                <Typography variant="h4" fontWeight={800}>Hello, {user?.username}!</Typography>
                <Typography color="text.secondary">You are currently on the <b>{user?.planName}</b> plan.</Typography>
              </Box>
            </Box>
            <Typography variant="body1" sx={{ mb: 4 }}>
              Your subscription gives you access to <b>{user?.accessibleModules?.length}</b> powerful data tools. 
              Explore your available modules in the sidebar to get started.
            </Typography>
            <Button variant="contained" size="large" onClick={() => navigate('/excel')}>Launch Excel Tool</Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, borderRadius: 4, height: '100%', bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>Plan Status</Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Current Plan</Typography>
                <Typography variant="body2" fontWeight={700}>{user?.planName}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Renewal Date</Typography>
                <Typography variant="body2" fontWeight={700}>May 28, 2026</Typography>
              </Box>
              <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
              <Button variant="contained" sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: '#f3f4f6' } }}>
                Manage Subscription
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;