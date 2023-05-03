import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CountriesDropdown from './countriesDropdown';

describe('CountriesDropdown', () => {
  test('renders the dropdown with the correct options', () => {
    const handleChange = jest.fn();
    render(
      <CountriesDropdown
        handleChange={handleChange}
        value=""
        id="testId"
        name="testName"
        placeholder="Select a country"
      />
    );

    const dropdown = screen.getByRole('combobox');
    expect(dropdown).toBeInTheDocument();
    expect(dropdown).toHaveAttribute('id', 'testId');
    expect(dropdown).toHaveAttribute('name', 'testName');
    expect(screen.getByText('Afghanistan')).toBeInTheDocument();
    expect(screen.getByText('Åland Islands')).toBeInTheDocument();
    // Add more assertions for other countries if needed
  });

  test('calls handleChange on option selection', () => {
    const handleChange = jest.fn();
    render(
      <CountriesDropdown
        handleChange={handleChange}
        value=""
        id="testId"
        name="testName"
        placeholder="Select a country"
      />
    );

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'Afghanistan' },
    });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('renders required attribute when isRequired is true', () => {
    const handleChange = jest.fn();
    render(
      <CountriesDropdown
        handleChange={handleChange}
        value=""
        id="testId"
        name="testName"
        isRequired={true}
        placeholder="Select a country"
      />
    );

    expect(screen.getByRole('combobox')).toHaveAttribute('required');
  });

  test('does not render required attribute when isRequired is false', () => {
    const handleChange = jest.fn();
    render(
      <CountriesDropdown
        handleChange={handleChange}
        value=""
        id="testId"
        name="testName"
        isRequired={false}
        placeholder="Select a country"
      />
    );

    expect(screen.getByRole('combobox')).not.toHaveAttribute('required');
  });
});
