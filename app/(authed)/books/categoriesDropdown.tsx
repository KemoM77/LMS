import React, { useState } from 'react';
import { MultiSelect } from 'react-multi-select-component';

import getCategories from '@/app/firebase/firestore/getCategories';

const CategoriesDropdown = ({ onChange, value = [] }) => {
  const [initCategories, setInitCategories] = useState<string[]>([]);

  const [selected, setSelected] = React.useState(value);

  const getCates = async () => {
    const { categories, error } = await getCategories();
    setInitCategories(categories?.categories.sort());
  };

  const options = initCategories.map((genre) => ({
    label: genre,
    value: genre,
  }));
  React.useEffect(() => {
    try {
      getCates();
      if (initCategories.length)
        if (typeof onChange === 'function') {
          onChange([...selected.map((cat) => cat.label)]);
          //////console.log(selected);
        }
    } catch (error) {return error}
  }, [selected]);

  return (
    <div>
      <MultiSelect
        options={options}
        value={selected}
        onChange={setSelected}
        labelledBy="Select Book Genres"
        hasSelectAll={false}
      />
    </div>
  );
};

export default CategoriesDropdown;
