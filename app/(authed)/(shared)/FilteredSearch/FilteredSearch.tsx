import React, { Dispatch, KeyboardEvent, useCallback, useEffect, useState } from 'react';

import { debounce } from '@mui/material';

import { SearchTerms } from '../../users/page';

type Props = {
  options: string[];
  onSearch: Dispatch<any>;
};

export default function FilteredSearch({ options = [], onSearch }: Props) {
  const [searchState, setSearchState] = useState<SearchTerms>({ searchText: '', filterOption: 'all' });
  const debouncedOnSearch = useCallback(debounce(onSearch, 500), [onSearch]);
  const handleChange = (e) => {
    setSearchState({ ...searchState, [e.target.name]: e.target.value });
    debouncedOnSearch({ ...searchState, [e.target.name]: e.target.value });
    // onSearch({ ...searchState, [e.target.name]: e.target.value })
  };

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      onSearch(searchState);
    }
  };

  return (
    <div className="box flex justify-center pt-6 ">
      <div className="box-wrapper w-[calc(100%_-_73px)]">
        <div className=" flex  items-center rounded border border-gray-200 bg-white p-3 shadow-sm">
          <button className="outline-none focus:outline-none " onClick={() => onSearch(searchState)}>
            <svg
              className=" h-5 w-5 cursor-pointer text-gray-600"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </button>
          <input
            type="search"
            name="searchText"
            id="searchText"
            placeholder="search for users"
            x-model="q"
            className="w-full bg-transparent pl-4 text-sm outline-none focus:outline-none"
            onKeyUp={handleKeyUp}
            value={searchState.searchText}
            onChange={handleChange}
          />
          <div className="select">
            <select
              name="filterOption"
              defaultValue={searchState.filterOption}
              id="filterOption"
              onChange={handleChange}
              className="bg-transparent text-sm outline-none focus:outline-none"
              data-testid="typeDrop"
            >
              <option value="all">All</option>
              {options.map((option) => (
                <option
                  key={option.toLowerCase()}
                  selected={option.toLowerCase() === searchState.filterOption}
                  value={option.toLowerCase()}
                >
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
