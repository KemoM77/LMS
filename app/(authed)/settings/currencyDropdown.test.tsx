import '@testing-library/jest-dom/extend-expect';

import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import CurrencyCodesDropdown from './currencyDropdown';

describe('CurrencyCodesDropdown', () => {
  test('renders CurrencyCodesDropdown component', () => {
    render(<CurrencyCodesDropdown onChange={() => {}} />);
    const selectElement = screen.getByTestId('CurrencyCodesDropdown');
    expect(selectElement).toBeInTheDocument();
  });

  

  
  test('selected value changes correctly', () => {
    const onChange = jest.fn();
    render(<CurrencyCodesDropdown onChange={onChange} />);
    const selectElement = screen.getByTestId('CurrencyCodesDropdown');
    fireEvent.change(selectElement, { target: { value: 'CAD' } });
    expect(selectElement.value).toBe('CAD');
  });
});
