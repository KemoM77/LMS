import Link from 'next/link';
import MenuBookIcon from '@mui/icons-material/MenuBook';
export default function Header({ heading, paragraph, linkName, linkUrl = '#' }) {
  return (
    <div className="mb-4">
      <div className='flex justify-center '>
      <MenuBookIcon data-testid="MenuBookIcon"  className='text-7xl' />
        </div>
      <h4 className="mt-6 text-center text-xl font-extrabold text-gray-900">{heading}</h4>
      <p className="mt-5 text-center text-sm text-gray-600">
        {paragraph}
        <Link href={linkUrl} className="font-medium text-blue-600 hover:text-blue-500">
          {linkName}
        </Link>
      </p>
    </div>
  );
}
