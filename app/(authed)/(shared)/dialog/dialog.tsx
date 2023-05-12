'use client';
import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

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
