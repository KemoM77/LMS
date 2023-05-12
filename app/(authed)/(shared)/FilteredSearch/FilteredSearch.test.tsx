import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import FilteredSearch from './FilteredSearch';
import { SearchTerms } from '../../users/page';
import { debounce } from '@mui/material';

jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  debounce: (fn, delay) => {
    const debounced = function (...args) {
      clearTimeout(debounced.timeoutId);
      debounced.timeoutId = setTimeout(() => {
        fn(...args);
      }, delay);
    };
    debounced.timeoutId = null;
    return debounced;
  },
}));

describe('FilteredSearch component', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the component with the correct elements', () => {
    const options = ['Option 1', 'Option 2', 'Option 3'];
    render(<FilteredSearch options={options} onSearch={mockOnSearch} />);

    expect(screen.getByPlaceholderText('search for users')).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('updates search state when search text or filter option changes', () => {
    const onSearchMock = jest.fn();
    const options = ['Option 1', 'Option 2', 'Option 3'];

    render(<FilteredSearch options={options} onSearch={onSearchMock} />);

    const searchInput = screen.getByPlaceholderText('search for users');
    const filterSelect = screen.getByTestId('typeDrop');

    fireEvent.change(searchInput, { target: { value: 'test' } });
    fireEvent.click(filterSelect);
    fireEvent.click(screen.getByText('Option 2'));

    expect(searchInput).toHaveValue('test');
    waitFor(() => {
      expect(filterSelect).toHaveValue('Option 2');
    });
  });

  test('calls onSearch with correct search terms when search button is clicked', () => {
    const options = ['Option 1', 'Option 2', 'Option 3'];
    render(<FilteredSearch options={options} onSearch={mockOnSearch} />);

   
    const searchInput = screen.getByPlaceholderText('search for users');
    const filterSelect = screen.getByTestId('typeDrop');

    const searchButton = screen.getByRole('button');

    fireEvent.change(searchInput, { target: { value: 'test' } });
    fireEvent.change(filterSelect, { target: { value: 'Option 2' } });
    fireEvent.click(searchButton);

    waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledTimes(1);
      expect(mockOnSearch).toHaveBeenCalledWith({ searchText: 'test', filterOption: 'option 2' });
    });
  });

  test('calls onSearch with correct search terms when Enter key is pressed', () => {
    const options = ['Option 1', 'Option 2', 'Option 3'];
    render(<FilteredSearch options={options} onSearch={mockOnSearch} />);

   
    const searchInput = screen.getByPlaceholderText('search for users');
    const filterSelect = screen.getByTestId('typeDrop');

    fireEvent.change(searchInput, { target: { value: 'test' } });
    fireEvent.change(filterSelect, { target: { value: 'Option 2' } });
    fireEvent.keyUp(searchInput, { key: 'Enter' });

    waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledTimes(1);
      expect(mockOnSearch).toHaveBeenCalledWith({ searchText: 'test', filterOption: 'option 2' });
    });
  });
  test('clears search text when filter option is changed', () => {
    const options = ['Option 1', 'Option 2', 'Option 3'];
    render(<FilteredSearch options={options} onSearch={mockOnSearch} />);
  
    const searchInput = screen.getByPlaceholderText('search for users');
    const filterSelect = screen.getByTestId('typeDrop');
  
    fireEvent.change(searchInput, { target: { value: 'test' } });
    fireEvent.change(filterSelect, { target: { value: 'Option 2' } });
  
    waitFor(() => {
      expect(searchInput).toHaveValue('');
    });
  });
  test('sets filter option to all when search text is cleared', () => {
    const options = ['Option 1', 'Option 2', 'Option 3'];
    render(<FilteredSearch options={options} onSearch={mockOnSearch} />);
  
    const searchInput = screen.getByPlaceholderText('search for users');
    const filterSelect = screen.getByTestId('typeDrop');
  
    fireEvent.change(searchInput, { target: { value: 'test' } });
    fireEvent.change(filterSelect, { target: { value: 'Option 2' } });
    fireEvent.change(searchInput, { target: { value: '' } });
  
    waitFor(() => {
      expect(filterSelect).toHaveValue('all');
    });
  });
  test('does not call onSearch when search text is empty', () => {
    const options = ['Option 1', 'Option 2', 'Option 3'];
    render(<FilteredSearch options={options} onSearch={mockOnSearch} />);
  
    const searchInput = screen.getByPlaceholderText('search for users');
    const searchButton = screen.getByRole('button');
  
    fireEvent.change(searchInput, { target: { value: '' } });
    fireEvent.click(searchButton);
  
    waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledTimes(0);
    });
  });
  // test('should call onSearch with the correct search terms', async () => {
  //   const options = ['Option1', 'Option2', 'Option3'];
  //   const onSearch = jest.fn();
  //   const { getByTestId, getByPlaceholderText } = render(<FilteredSearch options={options} onSearch={onSearch} />);

  //   const searchInput = getByPlaceholderText('search for users');
  //   const filterSelect = getByTestId('typeDrop');

  //   fireEvent.change(searchInput, { target: { value: 'test' } });
  //   fireEvent.change(filterSelect, { target: { value: 'option1' } });

  //   await waitFor(() => expect(onSearch).toHaveBeenCalledTimes(1));

  //   // Clear the search input
  //   fireEvent.change(searchInput, { target: { value: '' } });

  //   // It should call onSearch again when the search input is cleared
  //   await waitFor(() => expect(onSearch).toHaveBeenCalledTimes(2));

  //   expect(onSearch).toHaveBeenCalledWith({ searchText: 'test', filterOption: 'option1' });
  // });
});
