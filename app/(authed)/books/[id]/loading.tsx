'use client';
import React from 'react';

import { Box, CircularProgress } from '@mui/material';

export default function Loading() {
    return (
        <div className='h-screen flex justify-center items-center'>
        <Box sx={{ display: 'flex' }}>
          <CircularProgress size={100} />
        </Box>
        </div>
      );
}
