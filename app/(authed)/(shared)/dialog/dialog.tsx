'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const ActionDialog = ({ title, content, isOpen, onClose }) => {
  const router = useRouter();
  const handleClose = () => {
    onClose();
    router.refresh();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};


export default ActionDialog;
