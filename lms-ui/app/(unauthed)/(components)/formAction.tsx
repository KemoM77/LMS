import classNames from 'classnames';

export default function FormAction({ handleSubmit, type = 'Button', action = 'submit', disable = true, text }) {
  return (
    <>
      {type === 'Button' ? (
        <button
          // type={action}
          className={classNames({
            'group relative mt-10 flex w-full justify-center rounded-md border border-transparent': true,
            'bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700': true,
            'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2': true,
            'bg-purple-200   cursor-default' : true
          })}
          //onSubmit={handleSubmit}
          onClick={handleSubmit}
          disabled={disable}
         // type='submit'
        >
          {text}
        </button>
      ) : (
        <></>
      )}
    </>
  );
}
