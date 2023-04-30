import CountriesDropdown from '../(constants)/countriesDropdown';

const fixedInputClass =
  'rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm';

export default function Input({
  handleChange,
  value,
  labelText,
  labelFor,
  id,
  name,
  type,
  isRequired = false,
  placeholder,
  customClass,
}) {
  return (
    <div className="my-4">
      <label htmlFor={labelFor} className={'text-sm text-slate-500'}>
        {labelText}{isRequired?'*':''}:
      </label>
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
    </div>
  );
}
