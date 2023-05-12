'use client';
import { Box, CircularProgress } from '@mui/material';
import React from 'react'

export default function Loading() {
    return (
        <div className='h-screen flex justify-center items-center'>
        <Box sx={{ display: 'flex' }}>
          <CircularProgress size={100} />
        </Box>
        </div>
      );
}
