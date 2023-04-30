import Link from 'next/link';
import React from 'react';
import { BookInfo } from './book';
import { getLanguageLabel } from './[id]/getLangLabel';

type Props = {
  BookDetails: BookInfo;
};
export default function bookCard({ BookDetails }: Props) {
  return (
    <Link
      href={`/books/${BookDetails.id}`}
      className="animate__animated    animate__fadeIn container  m-3 flex flex-col items-center justify-between rounded-lg border
       border-gray-300 bg-white shadow duration-500 hover:scale-105 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800
        dark:hover:bg-gray-700 max-h-[300px]  md:max-h-[230px] md:max-w-lg md:flex-row "
    >
      <img
        className="h-28 w-full rounded-t-lg object-cover md:h-[227px] md:w-48 md:rounded-none md:rounded-l-lg"
        src={BookDetails.cover_img}
        alt="img"
      />
      <div className=" h-36 w-full md:max-w-[340px] flex md:h-full flex-1 flex-col justify-between p-4 leading-normal">
        <h5 className="md:my-2 truncate  md:max-w-[300px] text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {BookDetails.title}
        </h5>
        <p className="overflow-hidden text-clip font-bold text-gray-700 dark:text-gray-400">
          Authors: {BookDetails.authors?.toString()}
        </p>
        <p className="md:my-3 h-7 overflow-hidden  text-clip font-normal text-gray-700 dark:text-gray-400">
         Categories: {BookDetails.categories.toString()}
        </p>
        <p className="md:my-3  h-7  font-normal text-gray-700 dark:text-gray-400">
         Language: {getLanguageLabel(BookDetails.language)}
        </p>
        <p className="md:mt-1 mb-0 max-h-[50px] text-clip font-semibold text-gray-700 dark:text-gray-400">
          In Stock: {BookDetails.in_stock}
        </p>
      </div>
    </Link>
  );
}