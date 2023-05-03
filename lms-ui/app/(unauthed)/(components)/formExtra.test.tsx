import { render, screen } from '@testing-library/react';
import FormExtra from './formExtra';

describe('FormExtra Component', () => {
  test('renders FormExtra component correctly', () => {
    render(<FormExtra />);

    // Check if the checkbox is rendered with correct attributes
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('id', 'remember-me');
    expect(checkbox).toHaveAttribute('name', 'remember-me');
    expect(checkbox).toHaveAttribute('type', 'checkbox');
    expect(checkbox).toHaveAttribute('aria-labelledby', 'remember-me-label');
    expect(checkbox).toHaveClass('h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded');

    // Check if the label is rendered with correct attributes and text
    const label = screen.getByText('Remember me');
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('id', 'remember-me-label');
    expect(label).toHaveClass('ml-2 block text-sm text-gray-900');

    // Check if the forgot password link is rendered with correct attributes and text
    const forgotPasswordLink = screen.getByRole('link', { name: 'Forgot your password?' });
    expect(forgotPasswordLink).toBeInTheDocument();
    expect(forgotPasswordLink).toHaveAttribute('href', '#');
    expect(forgotPasswordLink).toHaveClass('font-medium text-purple-600 hover:text-purple-500');
  });
});
