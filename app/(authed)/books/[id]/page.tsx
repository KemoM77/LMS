
import React from 'react';

import getData from '@/app/firebase/firestore/getData';

import BookDetails from './bookDetails';

export default async function BookDetailsPage({params}) {
    const { docData, error } = await getData('books', params.id);
    //////console.log(docData,error);
    return !error ? <BookDetails bookInfo={docData} /> : <h1>Book not found</h1>;
}
