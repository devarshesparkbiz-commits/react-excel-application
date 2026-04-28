import React, { useState } from 'react';
import { Box, Paper, TextField, Button, Typography, Stack, Alert } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../theme/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      bgcolor: '#0f172a',
      p: 2
    }}>
      <Paper sx={{ p: 5, maxWidth: 400, width: '100%', borderRadius: 4, bgcolor: '#1e293b', color: 'white' }}>
        <Typography variant="h4" fontWeight={800} gutterBottom textAlign="center" color="primary.main">Welcome Back</Typography>
        <Typography variant="body2" color="#94a3b8" textAlign="center" sx={{ mb: 4 }}>Login to access your data tools</Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField 
              fullWidth label="Username" 
              value={username} onChange={(e) => setUsername(e.target.value)} 
              variant="outlined" 
              sx={{ input: { color: 'white' }, label: { color: '#94a3b8' } }}
            />
            <TextField 
              fullWidth label="Password" type="password" 
              value={password} onChange={(e) => setPassword(e.target.value)} 
              variant="outlined"
              sx={{ input: { color: 'white' }, label: { color: '#94a3b8' } }}
            />
            <Button variant="contained" size="large" fullWidth type="submit" sx={{ py: 1.5, borderRadius: 2 }}>
              Sign In
            </Button>
          </Stack>
        </form>

        <Typography variant="body2" textAlign="center" sx={{ mt: 3, color: '#94a3b8' }}>
          Don't have an account? <Link to="/register" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 600 }}>Create one</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
