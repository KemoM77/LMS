import React from 'react';
// zustand
import { create } from 'zustand';

import { Button } from '@material-tailwind/react';
import { Close } from '@mui/icons-material';
// material ui
import {
    Alert, Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, makeStyles
} from '@mui/material';

export type ConfirmDialogStore = {
  message: string;
  onSubmit?: () => void;
  close: () => void;
};

export const useConfirmDialogStore = create<ConfirmDialogStore>((set) => ({
  message: '',
  onSubmit: undefined,
  close: () => set({ onSubmit: undefined }),
}));

export const confirmDialog = (message: string, onSubmit: () => void) => {
  useConfirmDialogStore.setState({
    message,
    onSubmit: onSubmit || (() => {})  });
};

// const useStyles = makeStyles((theme) => {
//   return {
//     actions: {
//       padding: theme.spacing(2),
//     },
//   };
// });

const ConfirmDialog = () => {
  //const c = useStyles();
  const { message, onSubmit, close } = useConfirmDialogStore();
  return (
    <Dialog open={Boolean(onSubmit)} onClose={close} maxWidth="sm" fullWidth>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <DialogTitle>Confirm the action</DialogTitle>
        <IconButton onClick={close}>
          <Close />
        </IconButton>
      </Box>
      <DialogContent data-testid="DialogContent">
        <Alert severity="error">{message}</Alert>
      </DialogContent>
      <DialogActions data-testid="DialogActions" className='m-2 mr-4'>
        <Button className='bg-zinc-500 scale-110 p-3 bg-gray-600  hover:bg-gray-400 text-white rounded-xl mr-3'  onClick={close}>
          Cancel
        </Button>
        <Button data-testid="confirm"
          className='bg-blue-500 scale-110 p-3 hover:bg-blue-700 text-white rounded-xl' 
          onClick={() => {
            if (onSubmit) {
              onSubmit();
            }
            close();
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
