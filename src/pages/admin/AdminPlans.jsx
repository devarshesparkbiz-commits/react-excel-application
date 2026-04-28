import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Button, TextField, Grid, 
  Checkbox, FormControlLabel, Card, Stack, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Chip, Tooltip, Alert, Snackbar
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import axios from 'axios';

const AVAILABLE_MODULES = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'excel', label: 'Excel Generation' },
  { id: 'json', label: 'JSON Beautifier' },
  { id: 'xml', label: 'XML Builder' },
  { id: 'diff', label: 'Text Difference' },
  { id: 'forms', label: 'Forms Builder' },
  { id: 'convert', label: 'Text to Document' },
  { id: 'datetime', label: 'Date & Time' },
  { id: 'units', label: 'Unit Converter' },
  { id: 'calculator', label: 'Calculator' },
  { id: 'color', label: 'Color Picker' }
];

const AdminPlans = () => {
  const [plans, setPlans] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPlan, setCurrentPlan] = useState({ 
    id: null, name: '', price: 0, description: '', accessibleModules: [] 
  });
  const [msg, setMsg] = useState({ text: '', type: 'success', open: false });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/admin/plans');
      setPlans(res.data);
    } catch (err) {
      showMsg('Failed to load plans', 'error');
    }
  };

  const showMsg = (text, type = 'success') => {
    setMsg({ text, type, open: true });
  };

  const handleToggleModule = (moduleId) => {
    const list = currentPlan.accessibleModules || [];
    const updated = list.includes(moduleId) 
      ? list.filter(m => m !== moduleId) 
      : [...list, moduleId];
    setCurrentPlan({ ...currentPlan, accessibleModules: updated });
  };

  const resetForm = () => {
    setCurrentPlan({ id: null, name: '', price: 0, description: '', accessibleModules: [] });
    setIsEditing(false);
  };

  const handleEdit = (plan) => {
    setCurrentPlan({ ...plan, accessibleModules: plan.accessibleModules || [] });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = async () => {
    if (!currentPlan.name) return showMsg('Plan name is required', 'error');

    try {
      if (isEditing) {
        await axios.put(`http://localhost:8080/api/admin/plans/${currentPlan.id}`, currentPlan);
        showMsg('Plan updated successfully');
      } else {
        await axios.post('http://localhost:8080/api/admin/plans', currentPlan);
        showMsg('Plan created successfully');
      }
      fetchPlans();
      resetForm();
    } catch (err) {
      showMsg('Error saving plan', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;
    try {
      await axios.delete(`http://localhost:8080/api/admin/plans/${id}`);
      showMsg('Plan deleted');
      fetchPlans();
    } catch (err) {
      showMsg('Error deleting plan', 'error');
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" fontWeight={900} gutterBottom sx={{ mb: 4 }}>
        Subscription Management
      </Typography>

      <Grid container spacing={4}>
        {/* plan Editor */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, borderRadius: 4, position: 'sticky', top: 100, border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              {isEditing ? <EditIcon color="primary" /> : <AddIcon color="primary" />}
              <Typography variant="h6" fontWeight={700}>
                {isEditing ? 'Edit Subscription' : 'Create New Plan'}
              </Typography>
            </Box>

            <Stack spacing={2.5}>
              <TextField 
                label="Plan Name" fullWidth 
                value={currentPlan.name} 
                onChange={(e) => setCurrentPlan({...currentPlan, name: e.target.value})}
                placeholder="e.g. Pro Monthly"
              />
              <TextField 
                label="Price ($)" type="number" fullWidth 
                value={currentPlan.price} 
                onChange={(e) => setCurrentPlan({...currentPlan, price: parseFloat(e.target.value) || 0})}
              />
              <TextField 
                label="Plan Description" multiline rows={3} fullWidth 
                value={currentPlan.description} 
                onChange={(e) => setCurrentPlan({...currentPlan, description: e.target.value})}
              />
              
              <Divider sx={{ my: 1 }}>
                <Chip label="Module Permissions" size="small" />
              </Divider>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                {AVAILABLE_MODULES.map(module => (
                  <FormControlLabel
                    key={module.id}
                    control={
                      <Checkbox 
                        checked={(currentPlan.accessibleModules || []).includes(module.id)} 
                        onChange={() => handleToggleModule(module.id)}
                        size="small"
                      />
                    }
                    label={<Typography variant="caption">{module.label}</Typography>}
                  />
                ))}
              </Box>
              
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button variant="contained" fullWidth size="large" onClick={handleSave}>
                  {isEditing ? 'Update Plan' : 'Create Plan'}
                </Button>
                {isEditing && (
                  <Button variant="outlined" color="inherit" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        {/* plan List */}
        <Grid item xs={12} lg={8}>
          <TableContainer component={Paper} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
            <Table>
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Plan Name</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Modules</TableCell>
                  <TableCell sx={{ fontWeight: 800 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {plans.map((plan) => (
                  <TableRow key={plan.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>{plan.name}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{plan.description}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={`$${plan.price}/mo`} color="primary" size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Tooltip title={plan.accessibleModules?.join(', ') || 'None'}>
                        <Typography variant="body2" sx={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {plan.accessibleModules?.length || 0} Modules
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => handleEdit(plan)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(plan.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {plans.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                      No subscription plans found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Snackbar 
        open={msg.open} 
        autoHideDuration={4000} 
        onClose={() => setMsg({...msg, open: false})}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={msg.type} variant="filled" sx={{ width: '100%' }}>
          {msg.text}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminPlans;
