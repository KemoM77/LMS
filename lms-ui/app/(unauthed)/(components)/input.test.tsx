import { fireEvent, render, screen } from '@testing-library/react';
import Input from './input';



jest.mock('../(constants)/countriesDropdown.tsx', () => {
    return {
      __esModule: true,
      default: function CountriesDropdown(props) {
        const { handleChange, value, id, name, isRequired, placeholder } = props;
        return (
          <select
            onChange={handleChange}
            value={value}
            id={id}
            name={name}
            required={isRequired}
            data-testid="country-input"
          >
            <option value="">Select a country</option>
          </select>
        );
      },
    };
  });
  







describe('Input Component', () => {
  test('renders text input correctly', () => {
    render(<Input handleChange={() => {}} labelText="Username" labelFor="username" id="username" name="username" type="text" placeholder="Enter your username" />);

    const label = screen.getByText('Username:');
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'username');

    const input = screen.getByRole('textbox', { name: 'Username:' });
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'username');
    expect(input).toHaveAttribute('name', 'username');
    expect(input).toHaveAttribute('type', 'text');
  });

  test('renders email input correctly', () => {
    render(<Input handleChange={() => {}} labelText="Email" labelFor="email-address" id="email-address" name="email" type="email" placeholder="Enter your email address" />);

    const input = screen.getByRole('textbox', { name: 'Email:' });
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'email-address');
    expect(input).toHaveAttribute('name', 'email');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('pattern', '[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$');
  });

  test('renders password input correctly', () => {
    render(<Input isRequired={true} handleChange={() => {}} labelText="Password" labelFor="password" id="password" name="password" type="password" placeholder="Enter your password" />);

    const input = screen.getByLabelText('Password*:', { selector: 'input' });
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'password');
    expect(input).toHaveAttribute('name', 'password');
    expect(input).toHaveAttribute('type', 'password');
  });

  test('renders required input with asterisk (*) correctly', () => {
    render(<Input handleChange={() => {}} labelText="Password" labelFor="password" id="password" name="password" type="password" isRequired={true} placeholder="Enter your password" />);

    const label = screen.getByText('Password*:');
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'password');
  });

  test('renders disabled input correctly', () => {
    render(<Input handleChange={() => {}} labelText="Disabled Input" labelFor="disabled-input" id="disabled-input" name="disabled-input" type="text" placeholder="This input is disabled" disabled={true} />);

    const input = screen.getByRole('textbox', { name: 'Disabled Input:' });
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'disabled-input');
    expect(input).toHaveAttribute('name', 'disabled-input');
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toBeDisabled();
  });

  test('renders country input correctly', () => {
    render(<Input handleChange={() => {}} labelText="Country" labelFor="country" id="country" name="country" type="country" placeholder="Select your country" />);

    const input = screen.getByRole('combobox', { name: 'Country:' });
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'country');
    expect(input).toHaveAttribute('name', 'country');
  });
  /////////////////////////////////////////////////////////////////////////////
  test('renders country input correctly', () => {
    render(<Input handleChange={() => {}} labelText="Country" labelFor="country" id="country" name="country" type="country" placeholder="Select your country" />);

    const input = screen.getByTestId('country-input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'country');
    expect(input).toHaveAttribute('name', 'country');
  });
  /////////////////////////////////////////////////////////
  test('renders radio input correctly', () => {
    render(<Input placeholder="ee" handleChange={() => {}} labelText="Gender" labelFor="gender" id="gender" name="gender" type="radio" value="male" />);

    const input = screen.getByRole('radio', { name: 'Gender:' });
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'gender');
    expect(input).toHaveAttribute('name', 'gender');
    expect(input).toHaveAttribute('type', 'radio');
    expect(input).toHaveAttribute('value', 'male');
  });

  test('renders checkbox input correctly', () => {
    render(<Input placeholder="ee" handleChange={() => {}} labelText="Agree" labelFor="agree" id="agree" name="agree" type="checkbox" />);

    const input = screen.getByRole('checkbox', { name: 'Agree:' });
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'agree');
    expect(input).toHaveAttribute('name', 'agree');
    expect(input).toHaveAttribute('type', 'checkbox');
  });
});
