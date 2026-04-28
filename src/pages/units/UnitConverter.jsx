import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';

const units = {
  length: {
    m: 1,
    km: 1000,
    cm: 0.01,
    mm: 0.001,
    inch: 0.0254,
    ft: 0.3048,
    yard: 0.9144,
    mile: 1609.34,
  },
  weight: {
    kg: 1,
    g: 0.001,
    mg: 0.000001,
    lb: 0.453592,
    oz: 0.0283495,
  },
  data: {
    B: 1,
    KB: 1024,
    MB: 1024 ** 2,
    GB: 1024 ** 3,
    TB: 1024 ** 4,
  },
  temperature: {
    C: 'C',
    F: 'F',
    K: 'K',
  }
};

const UnitConverter = () => {
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('km');
  const [fromValue, setFromValue] = useState('1');
  const [toValue, setToValue] = useState('');

  useEffect(() => {
    // Reset units when category changes
    const defaultUnits = Object.keys(units[category]);
    setFromUnit(defaultUnits[0]);
    setToUnit(defaultUnits[1] || defaultUnits[0]);
  }, [category]);

  useEffect(() => {
    convert();
  }, [fromValue, fromUnit, toUnit, category]);

  const convert = () => {
    const val = parseFloat(fromValue);
    if (isNaN(val)) {
      setToValue('');
      return;
    }

    if (category === 'temperature') {
      let celsius;
      if (fromUnit === 'C') celsius = val;
      if (fromUnit === 'F') celsius = (val - 32) * 5 / 9;
      if (fromUnit === 'K') celsius = val - 273.15;

      let result;
      if (toUnit === 'C') result = celsius;
      if (toUnit === 'F') result = (celsius * 9 / 5) + 32;
      if (toUnit === 'K') result = celsius + 273.15;
      
      setToValue(result.toFixed(4).replace(/\.?0+$/, ''));
    } else {
      const fromBase = units[category][fromUnit];
      const toBase = units[category][toUnit];
      const result = (val * fromBase) / toBase;
      setToValue(result.toFixed(8).replace(/\.?0+$/, ''));
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 4 }}>
        Unit Converter
      </Typography>

      <Paper sx={{ p: 4, borderRadius: 2, maxWidth: 800, mx: 'auto' }}>
        <Stack spacing={4}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <ToggleButtonGroup
              value={category}
              exclusive
              onChange={(e, next) => next && setCategory(next)}
            >
              <ToggleButton value="length">Length</ToggleButton>
              <ToggleButton value="weight">Weight</ToggleButton>
              <ToggleButton value="temperature">Temp</ToggleButton>
              <ToggleButton value="data">Data</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={5}>
              <Stack spacing={2}>
                <FormControl fullWidth>
                  <InputLabel>From</InputLabel>
                  <Select
                    value={fromUnit}
                    label="From"
                    onChange={(e) => setFromUnit(e.target.value)}
                  >
                    {Object.keys(units[category]).map(u => <MenuItem key={u} value={u}>{u}</MenuItem>)}
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  type="number"
                  value={fromValue}
                  onChange={(e) => setFromValue(e.target.value)}
                  sx={{ input: { fontSize: '1.2rem' } }}
                />
              </Stack>
            </Grid>

            <Grid item xs={12} sm={2} sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ color: 'primary.main' }}>=</Typography>
            </Grid>

            <Grid item xs={12} sm={5}>
              <Stack spacing={2}>
                <FormControl fullWidth>
                  <InputLabel>To</InputLabel>
                  <Select
                    value={toUnit}
                    label="To"
                    onChange={(e) => setToUnit(e.target.value)}
                  >
                    {Object.keys(units[category]).map(u => <MenuItem key={u} value={u}>{u}</MenuItem>)}
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  value={toValue}
                  InputProps={{ readOnly: true }}
                  sx={{ input: { color: 'primary.main', fontSize: '1.2rem', fontWeight: 'bold' } }}
                />
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Paper>
    </Box>
  );
};

export default UnitConverter;
