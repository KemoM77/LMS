import Link from 'next/link';
import MenuBookIcon from '@mui/icons-material/MenuBook';
export default function Header({ heading, paragraph, linkName, linkUrl = '#' }) {
  return (
    <div className="mb-10 ">
      <div className='flex justify-center '>
      <MenuBookIcon className='text-8xl' />
        </div>
      <h4 className="mt-6 text-center text-xl font-extrabold text-gray-900">{heading}</h4>
      <p className="mt-2 mt-5 text-center text-sm text-gray-600">
        {paragraph}{' '}
        <Link href={linkUrl} className="font-medium text-blue-600 hover:text-blue-500">
          {linkName}
        </Link>
      </p>
    </div>
  );
}
