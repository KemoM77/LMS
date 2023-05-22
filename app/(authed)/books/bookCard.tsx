import Link from 'next/link';
import React from 'react';

import { getLanguageLabel } from './[id]/getLangLabel';
import { BookInfo } from './book';

type Props = {
  BookDetails: BookInfo;
};
export default function bookCard({ BookDetails }: Props) {
  return (
    <Link
      data-testid="link"
      href={`/books/${BookDetails.id}`}
      className="animate__animated    animate__fadeIn container  m-3 flex max-h-[300px] flex-col items-center justify-between rounded-lg
       border border-gray-300 bg-white shadow duration-500 hover:scale-105 hover:bg-gray-100 dark:border-gray-700
        dark:bg-gray-800 dark:hover:bg-gray-700  md:max-h-[230px] md:max-w-lg md:flex-row "
    >
      <img
        className="h-28 w-full rounded-t-lg object-cover md:h-[227px] md:w-48 md:rounded-none md:rounded-l-lg"
        src={BookDetails.cover_img}
        alt="img"
      />
      <div className=" flex h-36 w-full flex-1 flex-col justify-between p-4 leading-normal md:h-full md:max-w-[340px]">
        <h5 className="truncate text-2xl  font-bold tracking-tight text-gray-900 dark:text-white md:my-2 md:max-w-[300px]">
          {BookDetails.title}
        </h5>
        <p className="overflow-hidden text-clip font-bold text-gray-700 dark:text-gray-400">
          Authors: {BookDetails.authors?.toString()}
        </p>
        <p className="h-7 overflow-hidden text-clip  font-normal text-gray-700 dark:text-gray-400 md:my-3">
          Categories: {BookDetails.categories.toString()}
        </p>
        <p className="h-7  font-normal  text-gray-700 dark:text-gray-400 md:my-3">
          Language: {getLanguageLabel(BookDetails.language)}
        </p>
        <p className="mb-0 max-h-[50px] text-clip font-semibold text-gray-700 dark:text-gray-400 md:mt-1">
          In Stock: {BookDetails.in_stock}
        </p>
      </div>
    </Link>
  );
}
