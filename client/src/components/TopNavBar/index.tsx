import Link from 'next/link'
export default function TopNavBar() {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:bg-black">
      <div className="text-2xl font-bold text-zinc-900 dark:text-white">
        Mou1ght
      </div>
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-zinc-900 dark:text-white">
          Home
        </Link>
        <Link href="/categories" className="text-zinc-900 dark:text-white">
          Category
        </Link>
      </div>
    </div>
  );
}