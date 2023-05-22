import React from 'react';

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';

import ConfirmDialog, { confirmDialog } from './dialog';

describe('ConfirmDialog', () => {
  const onSubmitMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the dialog when open', () => {
    confirmDialog('Test message', onSubmitMock);

    render(<ConfirmDialog />);

    expect(screen.getByText('Confirm the action')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  test('closes the dialog when the close button is clicked', () => {
    confirmDialog('Test message', onSubmitMock);

    render(<ConfirmDialog />);
    fireEvent.click(screen.getByTestId('CloseIcon'));

    expect(onSubmitMock).not.toHaveBeenCalled();
  });

  test('calls onSubmit and closes the dialog when Confirm is clicked', () => {
    confirmDialog('Test message', onSubmitMock);

    render(<ConfirmDialog />);
    fireEvent.click(screen.getByText('Confirm'));

    expect(onSubmitMock).toHaveBeenCalledTimes(1);
  });

  test('closes the dialog when Cancel is clicked', () => {
    confirmDialog('Test message', onSubmitMock);

    render(<ConfirmDialog />);
    fireEvent.click(screen.getByText('Cancel'));

    expect(onSubmitMock).not.toHaveBeenCalled();
  });

  //   it('renders the Alert component with the correct severity', () => {
  //     confirmDialog('Test message', onSubmitMock);

  //     render(<ConfirmDialog />);

  //     expect(screen.getByRole('alert')).toHaveAttribute('severity', 'error');
  //   });
  test('renders the Confirm button with the correct classes', () => {
    confirmDialog('Test message', onSubmitMock);

    render(<ConfirmDialog />);

    expect(screen.getByText('Confirm')).toHaveClass(
      'bg-blue-500 scale-110 p-3 hover:bg-blue-700 text-white rounded-xl'
    );
  });

  test('renders the DialogTitle with the correct text', () => {
    confirmDialog('Test message', onSubmitMock);

    render(<ConfirmDialog />);

    const dialogTitle = screen.getByRole('heading');
    expect(dialogTitle).toHaveTextContent('Confirm the action');
  });

  test('renders the DialogContent with the Alert component', () => {
    confirmDialog('Test message', onSubmitMock);

    render(<ConfirmDialog />);

    const dialogContent = screen.getByTestId('DialogContent');
    const alert = screen.getByRole('alert');
    expect(dialogContent).toContainElement(alert);
  });

  test('renders the DialogActions with Confirm and Cancel buttons', () => {
    confirmDialog('Test message', onSubmitMock);

    render(<ConfirmDialog />);

    const dialogActions = screen.getByTestId('DialogActions');
    const confirmButton = screen.getByText('Confirm');
    const cancelButton = screen.getByText('Cancel');
    expect(dialogActions).toContainElement(confirmButton);
    expect(dialogActions).toContainElement(cancelButton);
  });
  it('calls onSubmit with the correct arguments when Confirm is clicked', () => {
    const exampleArgument = 'Example argument';
    const onSubmitWithArgMock = jest.fn((arg) => arg);

    confirmDialog('Test message', () => onSubmitWithArgMock(exampleArgument));

    render(<ConfirmDialog />);
    fireEvent.click(screen.getByTestId('confirm'));

    expect(onSubmitWithArgMock).toHaveBeenCalledTimes(1);
    expect(onSubmitWithArgMock).toHaveBeenCalledWith(exampleArgument);
  });
  test('calls onSubmit and closes the dialog when Confirm is clicked', () => {
    confirmDialog('Test message', onSubmitMock);

    render(<ConfirmDialog />);
    fireEvent.click(screen.getByText('Confirm'));

    expect(onSubmitMock).toHaveBeenCalledTimes(1);
  });
  it('does not call onSubmit when Confirm is clicked and onSubmit is not provided', () => {
    confirmDialog('Test message', undefined);

    render(<ConfirmDialog />);
    fireEvent.click(screen.getByTestId('confirm'));

    expect(onSubmitMock).not.toHaveBeenCalled();
  });
  ////////////////

  test('renders the IconButton with the Close icon', () => {
    confirmDialog('Test message', onSubmitMock);

    render(<ConfirmDialog />);

    expect(screen.getByTestId('CloseIcon')).toBeInTheDocument();
  });

  test('renders the Alert component with the correct message', () => {
    const testMessage = 'This is a test message';
    confirmDialog(testMessage, onSubmitMock);

    render(<ConfirmDialog />);

    expect(screen.getByText(testMessage)).toBeInTheDocument();
  });

  test('closes the dialog when the close button is clicked', () => {
    confirmDialog('Test message', onSubmitMock);

    render(<ConfirmDialog />);
    fireEvent.click(screen.getByTestId('CloseIcon'));

    expect(onSubmitMock).not.toHaveBeenCalled();
  });

  test('closes the dialog when Cancel is clicked', () => {
    confirmDialog('Test message', onSubmitMock);

    render(<ConfirmDialog />);
    fireEvent.click(screen.getByText('Cancel'));

    expect(onSubmitMock).not.toHaveBeenCalled();
  });
  test('calls onSubmit, handleClose, and sets the open state to false when Confirm is clicked', async () => {
   const  onSubmitMock = jest.fn()
    const Wrapper = () => {
     confirmDialog('moooock',onSubmitMock)

      return <ConfirmDialog />;
    };

    render(<Wrapper />);
    await act(async () => {
      fireEvent.click(screen.getByText('Confirm'));
    });

    expect(onSubmitMock).toHaveBeenCalledTimes(1);
    await waitFor(() => {
        expect(screen.queryByText('Confirm the action')).not.toBeInTheDocument();
      });  });
});
