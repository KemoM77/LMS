import addData from "@/app/firebase/firestore/addData";
import { BookInfo } from "./book";
import { getSubstrings } from "@/app/firebase/auth/signup";

export async function addBook(bookInfo:BookInfo)
{
    bookInfo.searchableTerms = getSubstrings(bookInfo.title);
    bookInfo.authors.forEach((author)=>{
        bookInfo.searchableTerms.push(...getSubstrings(author));
    })    
    bookInfo.searchableTerms.push(...[''+bookInfo.isbn,''+bookInfo.isbn13])
    bookInfo.categories.forEach((cat)=>{
        bookInfo.searchableTerms.push(`cat#${cat.toLowerCase()}`);
    })    
    console.log(bookInfo);
    
    const {result , error} = await addData('books',bookInfo.id,bookInfo);

    return {result ,error}
}