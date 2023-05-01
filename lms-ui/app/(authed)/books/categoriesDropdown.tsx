import getCategories from "@/app/firebase/firestore/getCategories";
import React, { useState } from "react";
import {MultiSelect} from "react-multi-select-component";



const CategoriesDropdown = ({ onChange , value =[] }) => {
  const [initCategories, setInitCategories] = useState<string[]>([]);

    const [selected, setSelected] = React.useState(value);
    
    const getCates = async () => {
      const { categories, error } = await getCategories();
      setInitCategories(categories.categories.sort());
    };
    
    const options = initCategories.map((genre) => ({
      label: genre,
      value: genre
    }));
  React.useEffect(() => {
    getCates()
    if(initCategories.length)
    if (typeof onChange === "function") {
      onChange([...selected.map(cat => cat.label)]);
      //_//console.log(selected);
      
    }
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
