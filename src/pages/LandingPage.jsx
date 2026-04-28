import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Paper, Container, Stack, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';

const LandingPage = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/auth/plans')
      .then(res => setPlans(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a', color: 'white' }}>
      {/* Navbar */}
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b' }}>
        <Typography variant="h6" fontWeight={800} color="primary.main">DataTools</Typography>
        <Stack direction="row" spacing={2}>
          <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
          <Button variant="contained" onClick={() => navigate('/register')}>Sign Up</Button>
        </Stack>
      </Box>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ pt: 10, pb: 10, textAlign: 'center' }}>
        <Typography variant="h1" fontWeight={900} sx={{ 
          fontSize: { xs: '3rem', md: '5rem' },
          background: 'linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 2
        }}>
          Everything you need for data.
        </Typography>
        <Typography variant="h5" sx={{ color: '#94a3b8', mb: 6, maxWidth: 800, mx: 'auto' }}>
          From Excel generation to JSON beautifying, comparison tools, and powerful utility gadgets. Secure, fast, and built for professionals.
        </Typography>
        <Button variant="contained" size="large" sx={{ py: 2, px: 6, borderRadius: 3, fontSize: '1.2rem', fontWeight: 600 }} onClick={() => navigate('/register')}>
          Get Started for Free
        </Button>
      </Container>

      {/* Pricing Section */}
      <Container maxWidth="lg" sx={{ pb: 15 }}>
        <Typography variant="h3" fontWeight={800} textAlign="center" gutterBottom>Flexible Plans</Typography>
        <Typography variant="body1" color="#94a3b8" textAlign="center" sx={{ mb: 8 }}>Choose the plan that fits your workflow.</Typography>
        <Grid container spacing={4} justifyContent="center">
          {plans.map((plan) => (
            <Grid item xs={12} md={4} key={plan.id}>
              <Paper sx={{ 
                p: 4, 
                bgcolor: '#1e293b', 
                color: 'white', 
                height: '100%', 
                borderRadius: 4,
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'translateY(-10px)', border: '1px solid #4f46e5' }
              }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>{plan.name}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                  <Typography variant="h3" fontWeight={800}>${plan.price}</Typography>
                  <Typography variant="subtitle1" color="#94a3b8">/month</Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#94a3b8', mb: 4, flex: 1 }}>{plan.description}</Typography>
                
                <Stack spacing={1.5} sx={{ mb: 4 }}>
                  {plan.accessibleModules.map(module => (
                    <Box key={module} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon color="primary" fontSize="small" />
                      <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                        {module.replace('_', ' ')}
                      </Typography>
                    </Box>
                  ))}
                </Stack>

                <Button variant="contained" fullWidth size="large" sx={{ borderRadius: 2 }} onClick={() => navigate('/register', { state: { planId: plan.id } })}>
                  Select Plan
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingPage;
