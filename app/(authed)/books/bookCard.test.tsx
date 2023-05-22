import { AppRouterContext } from 'next/dist/shared/lib/app-router-context';
import React from 'react';

import { createMockRouter } from '@/app/test-utils/createMockRouter';
import { fireEvent, render, screen } from '@testing-library/react';

import { getLanguageLabel } from './[id]/getLangLabel';
import { BookInfo } from './book';
import BookCard from './bookCard';

// jest.mock('next/link', () => {
//   return ({ children }) => {
//     return children;
//   };
// });

const testBook: BookInfo = {
  id: '1',
  title: 'Test Book',
  published: 2023,
  authors: ['Author1', 'Author2'],
  isbn: 1234567890,
  isbn13: 1234567890123,
  categories: ['Category1', 'Category2'],
  borrowable: true,
  sellable: true,
  language: 'en',
  location: 'Test Location',
  pages: 100,
  cover_img: 'https://test.com/test.jpg',
  description: 'Test description',
  in_stock: 10,
  price: 19.99,
  searchableTerms: ['test', 'book'],
  addedAT: new Date(),
};

describe('BookCard component', () => {
  it('renders correctly', () => {
    render(
      <AppRouterContext.Provider value={createMockRouter({})}>
        <BookCard BookDetails={testBook} />
      </AppRouterContext.Provider>
    );

    expect(screen.getByText(testBook.title)).toBeInTheDocument();
    expect(screen.getByText(`Authors: ${testBook.authors.toString()}`)).toBeInTheDocument();
    expect(screen.getByText(`Categories: ${testBook.categories.toString()}`)).toBeInTheDocument();
    expect(screen.getByText(`Language: ${getLanguageLabel(testBook.language)}`)).toBeInTheDocument();
    expect(screen.getByText(`In Stock: ${testBook.in_stock}`)).toBeInTheDocument();
    expect(screen.getByAltText('img')).toHaveAttribute('src', testBook.cover_img);
  });

  it('handles click event', () => {
    const mockRouter = createMockRouter({})
    render(
      <AppRouterContext.Provider value={mockRouter}>
        <BookCard BookDetails={testBook} />
      </AppRouterContext.Provider>
    );
    const linkElement = screen.getByTestId('link');
    expect(linkElement).toHaveAttribute('href', `/books/${testBook.id}`);

    fireEvent.click(linkElement);
    // Assuming you have a useRouter mock
    expect(mockRouter.push).toHaveBeenCalledWith(`/books/${testBook.id}`, {"forceOptimisticNavigation": false});  });
});
