import addData from '@/app/firebase/firestore/addData';
import { BookInfo } from './book';
import { getSubstrings } from '@/app/firebase/auth/signup';
import { serverTimestamp } from 'firebase/firestore';

export async function addBook(bookInfo: BookInfo) {
  bookInfo.searchableTerms = getSubstrings(bookInfo.title);
  bookInfo.authors.forEach((author) => {
    bookInfo.searchableTerms.push(...getSubstrings(author));
  });
  bookInfo.searchableTerms.push(...['' + bookInfo.isbn, '' + bookInfo.isbn13]);
  bookInfo.searchableTerms = [...new Set(bookInfo.searchableTerms)];
  bookInfo.categories.forEach((cat) => {
    bookInfo.searchableTerms.push(`cat#${cat.toLowerCase()}`);
  });
  bookInfo.addedAT = serverTimestamp();
  if (!bookInfo.cover_img || bookInfo.cover_img.trim() === '') {
    bookInfo.cover_img = 'https://edit.org/images/cat/book-covers-big-2019101610.jpg';
  }

  const { result, error } = await addData('books', bookInfo.id, bookInfo);

  return { result, error };
}
