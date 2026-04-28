import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
} from '@mui/material';
import { ContentCopy as ContentCopyIcon } from '@mui/icons-material';

const DateTimeView = () => {
  // Timestamp Converter State
  const [timestamp, setTimestamp] = useState(Math.floor(Date.now() / 1000).toString());
  const [humanDate, setHumanDate] = useState(new Date().toISOString());

  // Timezone Converter State
  const [sourceTime, setSourceTime] = useState(new Date().toISOString().slice(0, 16));
  const [targetTimezone, setTargetTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [convertedTime, setConvertedTime] = useState('');

  const timezones = Intl.supportedValuesOf('timeZone');

  useEffect(() => {
    handleTimestampToDate();
    handleTimezoneConversion();
  }, []);

  const handleTimestampToDate = () => {
    try {
      const date = new Date(parseInt(timestamp) * 1000);
      setHumanDate(date.toString());
    } catch (e) {
      setHumanDate('Invalid Timestamp');
    }
  };

  const handleDateToTimestamp = () => {
    try {
      const ts = Math.floor(new Date(humanDate).getTime() / 1000);
      if (!isNaN(ts)) {
        setTimestamp(ts.toString());
      }
    } catch (e) {
      // Ignore invalid date
    }
  };

  const handleTimezoneConversion = () => {
    try {
      const date = new Date(sourceTime);
      const options = {
        timeZone: targetTimezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      const formatter = new Intl.DateTimeFormat([], options);
      setConvertedTime(formatter.format(date));
    } catch (e) {
      setConvertedTime('Error converting');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 4 }}>
        Date & Time Tools
      </Typography>

      <Grid container spacing={3}>
        {/* Timestamp Converter */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom color="primary.main">
              Timestamp Converter
            </Typography>
            <Stack spacing={3}>
              <Box>
                <TextField
                  fullWidth
                  label="UNIX Timestamp (seconds)"
                  variant="outlined"
                  value={timestamp}
                  onChange={(e) => setTimestamp(e.target.value)}
                />
                <Button 
                  onClick={handleTimestampToDate}
                  variant="contained" 
                  sx={{ mt: 1 }}
                >
                  Convert to Human Date
                </Button>
              </Box>

              <Divider />

              <Box>
                <TextField
                  fullWidth
                  label="Human Readable Date"
                  variant="outlined"
                  value={humanDate}
                  onChange={(e) => setHumanDate(e.target.value)}
                />
                <Button 
                  onClick={handleDateToTimestamp}
                  variant="outlined" 
                  sx={{ mt: 1, mr: 1 }}
                >
                  Convert to Timestamp
                </Button>
                <Button 
                  onClick={() => setTimestamp(Math.floor(Date.now() / 1000).toString())}
                  variant="text" 
                  sx={{ mt: 1 }}
                >
                  Current Time
                </Button>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Timezone Converter */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom color="primary.main">
              Timezone Converter
            </Typography>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Source Local Time"
                type="datetime-local"
                value={sourceTime}
                onChange={(e) => setSourceTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />

              <FormControl fullWidth>
                <InputLabel>Target Timezone</InputLabel>
                <Select
                  value={targetTimezone}
                  label="Target Timezone"
                  onChange={(e) => setTargetTimezone(e.target.value)}
                >
                  {timezones.map((tz) => (
                    <MenuItem key={tz} value={tz}>{tz}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button 
                variant="contained" 
                onClick={handleTimezoneConversion}
                fullWidth
              >
                Convert
              </Button>

              <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1">
                  {convertedTime}
                </Typography>
                <Button size="small" onClick={() => copyToClipboard(convertedTime)}>
                  <ContentCopyIcon fontSize="small" />
                </Button>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DateTimeView;
