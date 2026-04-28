import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Stack,
} from '@mui/material';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [shouldReset, setShouldReset] = useState(false);

  const handleNumber = (num) => {
    if (display === '0' || shouldReset) {
      setDisplay(num);
      setShouldReset(false);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperator = (op) => {
    setEquation(display + ' ' + op + ' ');
    setShouldReset(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
  };

  const handleCalculate = () => {
    try {
      const fullEq = equation + display;
      // Note: In real app, use a safer math parser, but for simple calculator eval is common
      // or we can implement a basic parser. For simplicity and since it's client side:
      const result = eval(fullEq.replace('×', '*').replace('÷', '/'));
      setDisplay(String(result));
      setEquation('');
      setShouldReset(true);
    } catch (e) {
      setDisplay('Error');
    }
  };

  const btnStyle = {
    height: 64,
    fontSize: '1.25rem',
    borderRadius: 2,
    textTransform: 'none',
  };

  const CalcButton = ({ char, color, onClick, xs = 3 }) => (
    <Grid item xs={xs}>
      <Button
        fullWidth
        variant="contained"
        color={color || "inherit"}
        onClick={onClick}
        sx={{
          ...btnStyle,
          bgcolor: !color ? 'action.selected' : undefined,
          color: !color ? 'text.primary' : undefined,
        }}
      >
        {char}
      </Button>
    </Grid>
  );

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 4, width: '100%', textAlign: 'left' }}>
        Calculator
      </Typography>

      <Paper 
        sx={{ 
          p: 3, 
          borderRadius: 4, 
          width: '100%', 
          maxWidth: 360,
          boxShadow: 3
        }}
      >
        <Box sx={{ mb: 3, p: 2, bgcolor: 'action.hover', borderRadius: 2, textAlign: 'right' }}>
          <Typography variant="caption" color="text.secondary" sx={{ minHeight: 20, display: 'block' }}>
            {equation}
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 'bold', overflow: 'hidden' }}>
            {display}
          </Typography>
        </Box>

        <Grid container spacing={1.5}>
          <CalcButton char="AC" color="error" onClick={handleClear} />
          <CalcButton char="+/-" onClick={() => setDisplay(String(parseFloat(display) * -1))} />
          <CalcButton char="%" onClick={() => setDisplay(String(parseFloat(display) / 100))} />
          <CalcButton char="÷" color="primary" onClick={() => handleOperator('÷')} />

          <CalcButton char="7" onClick={() => handleNumber('7')} />
          <CalcButton char="8" onClick={() => handleNumber('8')} />
          <CalcButton char="9" onClick={() => handleNumber('9')} />
          <CalcButton char="×" color="primary" onClick={() => handleOperator('×')} />

          <CalcButton char="4" onClick={() => handleNumber('4')} />
          <CalcButton char="5" onClick={() => handleNumber('5')} />
          <CalcButton char="6" onClick={() => handleNumber('6')} />
          <CalcButton char="-" color="primary" onClick={() => handleOperator('-')} />

          <CalcButton char="1" onClick={() => handleNumber('1')} />
          <CalcButton char="2" onClick={() => handleNumber('2')} />
          <CalcButton char="3" onClick={() => handleNumber('3')} />
          <CalcButton char="+" color="primary" onClick={() => handleOperator('+')} />

          <CalcButton char="0" xs={6} onClick={() => handleNumber('0')} />
          <CalcButton char="." onClick={() => handleNumber('.')} />
          <CalcButton char="=" color="success" onClick={handleCalculate} />
        </Grid>
      </Paper>
    </Box>
  );
};

export default Calculator;
