import { fireEvent, render, screen } from '@testing-library/react';

import FormAction from './formAction';

describe('FormAction Component', () => {
  const handleSubmit = jest.fn();
  test('renders FormAction component with default props', () => {
    render(<FormAction handleSubmit={handleSubmit} text="Submit" />);

    const button = screen.getByRole('button', { name: 'Submit' });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  test('renders FormAction component with custom props', () => {
    render(<FormAction handleSubmit={handleSubmit} type="Button" action="submit" disable={false} text="Submit" />);

    const button = screen.getByRole('button', { name: 'Submit' });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  test('calls handleSubmit function when button is clicked', () => {
    const handleSubmit = jest.fn();
    render(<FormAction handleSubmit={handleSubmit} disable={false} text="Submit" />);

    const button = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(button);
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  test('button is disabled when disable prop is set to true', () => {
    render(<FormAction handleSubmit={handleSubmit} disable={true} text="Submit" />);

    const button = screen.getByRole('button', { name: 'Submit' });
    expect(button).toBeDisabled();
  });
  /////////

  test('renders empty component for non-button type', () => {
    render(<FormAction handleSubmit={handleSubmit} type="Other" text="Submit" />);

    const button = screen.queryByRole('button');
    expect(button).not.toBeInTheDocument();
  });
});
