import CountriesDropdown from '../(constants)/countriesDropdown';

const fixedInputClass =
  //'rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm';
  'block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer';
export default function Input({
  handleChange,
  value = '',
  labelText,
  labelFor,
  id,
  name,
  type,
  isRequired = false,
  placeholder,
  customClass = '',
  disabled = false,
}) {
  return (
    <div className="group relative z-0 mb-6 w-full">
      <label
        htmlFor={labelFor}
        className={
          'top-3  -z-10 w-full  text-sm text-gray-500'
        }
      >
        {labelText}
        {isRequired ? '*' : ''}:
      </label>
      {id !== 'country' ? (
        <input
          onChange={handleChange}
          value={value}
          id={id}
          name={name}
          type={type}
          required={isRequired?true:false}
          className={
            type !== 'checkbox' && type !== 'radio' ? fixedInputClass + ' ' + customClass + ' mx-4 ' : ' mx-4 '
          }
          placeholder={placeholder}
          pattern={
            id === 'email-address'
              ? '[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$'
              : id === 'isbn'
              ? '[0-9]{10}'
              : id === 'isbn13'
              ? '[0-9]{13}'
              : '.*'
          }
          disabled={disabled}
        />
      ) : (
        <CountriesDropdown
          handleChange={handleChange}
          value={value}
          id={id}
          name={name}
          isRequired={isRequired}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
