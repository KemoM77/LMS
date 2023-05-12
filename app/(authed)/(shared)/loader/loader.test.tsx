import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Loader from './loader';

describe('Loader', () => {
  test('renders the Loader component with the default size', () => {
    render(<Loader />);

    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toBeInTheDocument();

    const spinnerSvg = screen.getByRole('img', { hidden: true });
    expect(spinnerSvg).toHaveAttribute('viewBox', '0 0 100 101');

    const srOnlySpan = screen.getByText('Loading...');
    expect(srOnlySpan).toHaveClass('sr-only');
  });

  test('renders the Loader component with a custom size', () => {
    const customSize = 20;
    render(<Loader size={customSize} />);

    const spinnerSvg = screen.getByRole('img', { hidden: true });
    expect(spinnerSvg).toHaveClass(`h-[${customSize}px]`);
    expect(spinnerSvg).toHaveClass(`w-[${customSize}px]`);
  });
});
