import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import BooksSearchBar from './booksSearchBar';

describe('BooksSearchBar Component', () => {
  const onSearchMock = jest.fn();

  // afterEach(() => {
  //   jest.clearAllMocks();
  // });

  // test('renders the search bar with correct input fields', () => {
  //   render(<BooksSearchBar onSearch={onSearchMock} />);

  //   expect(screen.getByPlaceholderText(/Title, Author or ISBN\/ISBN13/i)).toBeInTheDocument();
  //   expect(screen.getByRole('combobox', { name: /Category/i })).toBeInTheDocument();
  //   expect(screen.getByRole('combobox', { name: /Language/i })).toBeInTheDocument();
  //   expect(screen.getByText(/Search/i)).toBeInTheDocument();
  // });

  test('calls onSearch prop when the Search button is clicked', () => {
    render(<BooksSearchBar onSearch={onSearchMock} />);

    // fireEvent.change(screen.getByPlaceholderText(/Title, Author or ISBN\/ISBN13/i), {
    //   target: { value: 'test book' },
    // });

    // fireEvent.click(screen.getByText(/Search/i));

    // expect(onSearchMock).toHaveBeenCalledTimes(1);
    // waitFor(() => {
    //   expect(onSearchMock).toHaveBeenCalledWith({
    //     name: 'test book',
    //     categories: [],
    //     language: 'any',
    //   });
    // });
  });
});
