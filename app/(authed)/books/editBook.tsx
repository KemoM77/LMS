import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MultiSelect } from 'react-multi-select-component';
import { toast } from 'react-toastify';

import Loader from '@/app/(authed)/(shared)/loader/loader';
import FormAction from '@/app/(unauthed)/(components)/formAction';
import Input from '@/app/(unauthed)/(components)/input';
import { addBookFields } from '@/app/(unauthed)/(constants)/feilds';
import addData from '@/app/firebase/firestore/addData';
import getCurrency from '@/app/firebase/firestore/getCurrency';
import { Label } from '@mui/icons-material';

import { addBook } from './addBooktoDB';
import { BookInfo } from './book';
import CategoriesDropdown from './categoriesDropdown';
import LanguagesDropdown from './langsDropdown';

const fields = addBookFields;
let fieldsState = {}; //:;

fields.forEach((field) => {
  fieldsState[field.name] = field.value;
});
fieldsState['borrowable'] = true;
fieldsState['sellable'] = true;
fieldsState['categories'] = undefined;
fieldsState['authors'] = undefined;
fieldsState['description'] = '';

type Props = {
  BookData: BookInfo;
  onSubmit: () => void;
};
export default function AddBook({ BookData = undefined, onSubmit = () => {} }: Props) {

  const [addBookState, SetaddBookState] = useState<BookInfo>(BookData ? BookData : (fieldsState as BookInfo));

  const [language, setLanguage] = useState<string>(BookData?.language || 'en');
  const [categories, setCategories] = useState<string[]>(BookData?.categories);
  const [bookOperations, setBookOperations] = useState(
    BookData?.borrowable && BookData?.sellable
      ? [
          { label: 'Borrowable', value: 'Borrowable' },
          { label: 'Sellable', value: 'Sellable' },
        ]
      : BookData?.borrowable && !BookData?.sellable
      ? [{ label: 'Borrowable', value: 'Borrowable' }]
      : !BookData?.borrowable && BookData?.sellable
      ? [{ label: 'Sellable', value: 'Sellable' }]
      : []
  );
  const [authors, setAuthors] = useState<string>(BookData?.authors.join(','));

  const [loading, setLoading] = useState<boolean>(false);
  const [successful, setSuccessful] = useState<boolean>(false);
  const { push, refresh } = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingCurrency, setLoadingCurrency] = useState<boolean>(false);

  const [finesCurrency, setFinesCurrency] = useState<string>('USD');
  
  const fetchCurrency = async () => {
    const { currency, error } = await getCurrency();
    if(currency){

      setFinesCurrency(currency.currency);
      setLoadingCurrency(true);
    }
    return { currency, error };
  };

  const handleChange = (e) => SetaddBookState({ ...addBookState, [e.target.name]: e.target.value });
  const handleAuthorsChange = (e) => setAuthors(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const updated: BookInfo = {
      ...addBookState,
      language: language,
      authors: authors.split(','),
      categories: categories,
      sellable: bookOperations?.map((op) => op.label).includes('Sellable'),
      borrowable: bookOperations?.map((op) => op.label).includes('Borrowable'),
      id: BookData?BookData.id:`bid${addBookState.isbn13}`,
      searchableTerms: undefined,
    };

    //////console.log(updated);
    SetaddBookState(updated as BookInfo);

    const { result, error } = await addBook(updated);

    setErrorMessage(error?.code);
   
    if (!error) onSubmit();
    setLoading(false);
    toast(BookData?'Book data was edited successfully':'New Book Added Successfully', {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
    refresh();
  };

  //handle Signup API Integration here


  useEffect(()=>{
    fetchCurrency();
  })


  return !loading && !successful &&loadingCurrency ? (
    <>
      <form className="mt-1 rounded-sm bg-gray-50 p-5" onSubmit={handleSubmit}>
        <div className="text-center text-red-600">{errorMessage}</div>
        <div className=" flex flex-col flex-wrap">
          {fields.map((field) => (
            <Input
              key={field.id}
              handleChange={field.id === 'authors' ? handleAuthorsChange : handleChange}
              value={field.id === 'authors' ? authors : addBookState[field.id]}
              labelText={field.id === 'authors' ? field.labelText + '(names seperated by , )' : field.id === 'price'? `${field.labelText}(${finesCurrency})`   : field.labelText}
              labelFor={field.labelFor}
              id={field.id}
              name={field.name}
              type={field.type}
              isRequired={field.isRequired}
              placeholder={field.placeholder}
              customClass={'mr-5'}
            />
          ))}
        </div>
        <div>
          <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
            Book Description:
          </label>
          <textarea
            id="description"
            name="description"
            onChange={handleChange}
            rows={4}
            value={addBookState.description}
            className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="Short description about the book..."
          ></textarea>
        </div>
        <div className="flex flex-col justify-between">
          <div className="flex justify-between p-1">
            <div className=" w-42 mb-2 md:mr-2">
              <label className="text-sm"> Select book language: </label>
              <LanguagesDropdown onChange={setLanguage} value={language} />
            </div>
            <div className="flex-1 ">
              <label className="text-sm"> Select book operations: </label>
              <MultiSelect
                options={[
                  { label: 'Borrowable', value: 'Borrowable' },
                  { label: 'Sellable', value: 'Sellable' },
                ]}
                value={bookOperations}
                onChange={setBookOperations}
                labelledBy="Select book operaitions"
                hasSelectAll={true}
                className="max-w-6xl"
              />
            </div>
          </div>

          <div>
            <label> Select categories: </label>
            <CategoriesDropdown
              onChange={setCategories}
              value={categories?categories.map((genre) => ({
                label: genre,
                value: genre,
              })):[]}
            />
          </div>
        </div>

        <FormAction handleSubmit={handleSubmit} text={BookData ? 'Edit Book' : 'Add Book'} disable={false} />
      </form>
    </>
  ) : !successful && loading ? (
    <div>
      <Loader size={100} />
    </div>
  ) : (
    <></>
  );
}
