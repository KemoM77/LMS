import CountriesDropdown from '../(constants)/countriesDropdown';

const fixedInputClass =
  //'rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm';
'block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
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
}) {
  return (
    <div className="relative z-0 w-full mb-6 group">
      {id !== 'country' ? (
        <input
          onChange={handleChange}
          value={value}
          id={id}
          name={name}
          type={type}
          required={isRequired}
          className={type !== 'checkbox' && type !== 'radio' ?fixedInputClass + customClass +'mx-4':'mx-4'}
          placeholder={placeholder}
          pattern={id === 'email-address' ? '[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$' : '.*'}
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
      <label htmlFor={labelFor} className={'peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'}>
        {labelText}{isRequired?'*':''}:
      </label>
    </div>
  );
}
