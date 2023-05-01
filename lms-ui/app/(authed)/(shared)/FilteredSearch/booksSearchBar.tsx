import { Select, Option } from '@material-tailwind/react/components/Select';
import { useEffect, useState } from 'react';
import { MultiSelect } from 'react-multi-select-component';
import LanguagesDropdown from '../../books/langsDropdown';
import CategoriesDropdown from '../../books/categoriesDropdown';

function BooksSearchBar({ onSearch, barSearch = '' }) {
  const [name, setName] = useState('');
  // const [author, setAuthor] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('any');

  const handleCategoryChange = (selected) => {
    // const options = event.target.options;
    // const selected = [];
    // if (options && options.length) {
    //   for (let i = 0; i < options.length; i++) {
    //     if (options[i].selected) {
    //       selected.push(options[i].value);
    //     }
    //   }
    // }
    setSelectedCategories(selected);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // //_//console.log(author);

    onSearch({ name: name, categories: selectedCategories, language: selectedLanguage });
  };

  const CategoriesHandle = (selected) => {
    //_//console.log(selected);
    setSelectedCategories(selected);
  };

  useEffect(() => {
    if (barSearch) {
      //_//console.log('changed');
      setName(barSearch);
      //onSearch({ name:name });
    }
  }, [barSearch]);

  return (
    <div className="flex   flex-col  rounded-lg bg-white  py-3 md:flex-row">
      <form className="mb-4 justify-center md:mb-0 md:ml-3 md:mr-4 md:w-auto" onSubmit={handleSubmit}>
        <div className="flex   flex-col flex-wrap md:flex-row">
          <input
            type="text"
            placeholder="Title, Author or ISBN/ISBN13"
            className="mb-2 rounded-lg border border-gray-300  px-4 py-2 md:mb-0 md:mr-2 md:w-96"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          {/* <input
            type="text"
            placeholder="Search by author"
            className="mb-2  rounded-lg border border-gray-300 px-4 py-2 md:mb-0 md:mr-2"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
          /> */}
          <div className=" mb-2 md:mr-2 md:w-96">
            <CategoriesDropdown onChange={CategoriesHandle} />
          </div>
          <div className=" w-42 mb-2 md:mr-2">
            <LanguagesDropdown onChange={setSelectedLanguage} value={'any'} />
            {/* <Select className='bg-white' value='Any' onChange={(selectedLang) => setSelectedLanguage(selectedLang)} label="Select Language">
             {languages.map((lang) => (
               <Option value={lang} >{lang}</Option>
             ))}
           </Select> */}
          </div>
          <button
            type="submit"
            className="mb-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-all hover:bg-blue-600 md:w-auto"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
}

export default BooksSearchBar;
