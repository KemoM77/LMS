import { render, screen } from '@testing-library/react';
import FormExtra from './formExtra';

describe('FormExtra Component', () => {
  test('renders FormExtra component correctly', () => {
    render(<FormExtra />);

    // Check if the forgot password link is rendered with correct attributes and text
    const forgotPasswordLink = screen.getByTestId("forgotPassword");
    expect(forgotPasswordLink).toBeInTheDocument();
    expect(forgotPasswordLink).toHaveClass('cursor-pointer font-medium text-purple-600 hover:text-purple-500');
  });
});
