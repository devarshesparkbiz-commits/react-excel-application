import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  Stack,
  Button,
  Divider,
} from '@mui/material';
import { ContentCopy as ContentCopyIcon } from '@mui/icons-material';

const ColorPicker = () => {
  const [hex, setHex] = useState('#6366f1');
  const [rgb, setRgb] = useState('rgb(99, 102, 241)');
  const [hsl, setHsl] = useState('hsl(239, 84%, 67%)');

  const hexToRgb = (hex) => {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
      r = parseInt(hex.substring(1, 3), 16);
      g = parseInt(hex.substring(3, 5), 16);
      b = parseInt(hex.substring(5, 7), 16);
    }
    return { r, g, b };
  };

  const rgbToHsl = (r, g, b) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { 
      h: Math.round(h * 360), 
      s: Math.round(s * 100), 
      l: Math.round(l * 100) 
    };
  };

  const handleHexChange = (e) => {
    const val = e.target.value;
    setHex(val);
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(val)) {
      const { r, g, b } = hexToRgb(val);
      const { h, s, l } = rgbToHsl(r, g, b);
      setRgb(`rgb(${r}, ${g}, ${b})`);
      setHsl(`hsl(${h}, ${s}%, ${l}%)`);
    }
  };

  const copy = (text) => navigator.clipboard.writeText(text);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 4 }}>
        Color Picker & Converter
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box 
              sx={{ 
                width: '100%', 
                height: 200, 
                bgcolor: hex, 
                borderRadius: 2, 
                mb: 3,
                border: '4px solid',
                borderColor: 'divider',
                transition: 'background-color 0.2s'
              }} 
            />
            <TextField
              fullWidth
              label="HEX Color"
              value={hex}
              onChange={handleHexChange}
              sx={{ fontWeight: 'bold' }}
            />
            <input 
              type="color" 
              value={hex} 
              onChange={handleHexChange} 
              style={{ width: '100%', height: 40, marginTop: 16, cursor: 'pointer', border: 'none', background: 'transparent' }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom color="primary.main">Conversions</Typography>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">RGB</Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <TextField fullWidth value={rgb} InputProps={{ readOnly: true }} />
                  <Button variant="outlined" onClick={() => copy(rgb)}><ContentCopyIcon /></Button>
                </Box>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">HSL</Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <TextField fullWidth value={hsl} InputProps={{ readOnly: true }} />
                  <Button variant="outlined" onClick={() => copy(hsl)}><ContentCopyIcon /></Button>
                </Box>
              </Box>
            </Stack>

            <Divider sx={{ my: 4 }} />

            <Typography variant="subtitle2" color="text.secondary" gutterBottom>Quick Palette</Typography>
            <Grid container spacing={1}>
              {['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6'].map(c => (
                <Grid item xs={2} key={c}>
                  <Box 
                    onClick={() => handleHexChange({ target: { value: c } })}
                    sx={{ height: 40, bgcolor: c, borderRadius: 1, cursor: 'pointer', '&:hover': { opacity: 0.8 } }} 
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ColorPicker;
