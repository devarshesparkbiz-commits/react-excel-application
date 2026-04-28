import React, { useState, useEffect } from 'react';
import { Box, Paper, TextField, Button, Typography, Stack, Alert, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [plans, setPlans] = useState([]);
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    planId: location.state?.planId || ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8080/api/auth/plans')
      .then(res => {
        setPlans(res.data);
        if (!formData.planId && res.data.length > 0) {
          setFormData(prev => ({ ...prev, planId: res.data[0].id }));
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data || 'Failed to register');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#0f172a', p: 2 }}>
      <Paper sx={{ p: 5, maxWidth: 450, width: '100%', borderRadius: 4, bgcolor: '#1e293b', color: 'white' }}>
        <Typography variant="h4" fontWeight={800} gutterBottom textAlign="center" color="primary.main">Create Account</Typography>
        <Typography variant="body2" color="#94a3b8" textAlign="center" sx={{ mb: 4 }}>Join thousands of users today</Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField 
              fullWidth label="Username" 
              value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} 
              sx={{ input: { color: 'white' }, label: { color: '#94a3b8' } }}
            />
            <TextField 
              fullWidth label="Email" type="email"
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} 
              sx={{ input: { color: 'white' }, label: { color: '#94a3b8' } }}
            />
            <TextField 
              fullWidth label="Password" type="password" 
              value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} 
              sx={{ input: { color: 'white' }, label: { color: '#94a3b8' } }}
            />
            
            <FormControl fullWidth>
              <InputLabel sx={{ color: '#94a3b8' }}>Subscription Plan</InputLabel>
              <Select
                value={formData.planId}
                label="Subscription Plan"
                onChange={(e) => setFormData({...formData, planId: e.target.value})}
                sx={{ color: 'white', '.MuiOutlinedInput-notchedOutline': { borderColor: '#334155' } }}
              >
                {plans.map(plan => (
                  <MenuItem key={plan.id} value={plan.id}>{plan.name} - ${plan.price}/mo</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button variant="contained" size="large" fullWidth type="submit" sx={{ py: 1.5, borderRadius: 2 }}>
              Get Started
            </Button>
          </Stack>
        </form>

        <Typography variant="body2" textAlign="center" sx={{ mt: 3, color: '#94a3b8' }}>
          Already have an account? <Link to="/login" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 600 }}>Login here</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Register;
