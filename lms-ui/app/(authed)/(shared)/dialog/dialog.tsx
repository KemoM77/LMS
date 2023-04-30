'use client';
import { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import { useRouter } from 'next/navigation';

const ActionDialog = ({ title, content, isOpen, onClose }) => {
 //const [open, setOpen] = useState(isOpen)
  const router = useRouter()
  const handleClose = (event, reason) => {
    if(reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
        // Set 'open' to false, however you would do that with your particular code.
        onClose()
        router.refresh()
    }
}

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>
        <Button variant='outlined' onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ActionDialog
