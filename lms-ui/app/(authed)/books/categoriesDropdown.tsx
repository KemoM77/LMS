import React from "react";
import {MultiSelect} from "react-multi-select-component";

const genres = [
  "Adventure",
  "Biography",
  "Children's",
  "Crime",
  "Fantasy",
  "Historical Fiction",
  "Horror",
  "Mystery",
  "Non-fiction",
  "Romance",
  "Science Fiction",
  "Thriller",
  "Young Adult"
];


const CategoriesDropdown = ({ onChange , value =[] }) => {
    const [selected, setSelected] = React.useState(value);
    
    
    const options = genres.map((genre) => ({
      label: genre,
      value: genre
    }));
  React.useEffect(() => {
    if (typeof onChange === "function") {
      onChange([...selected.map(cat => cat.label)]);
      console.log(selected);
      
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
