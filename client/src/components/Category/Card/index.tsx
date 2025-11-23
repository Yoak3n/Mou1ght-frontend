import Image from 'next/image'

export default function CategoryCard({
  name,
  image,
}: {
  name: string
  image: string
}) {
  return (
    <div className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-md shadow-md dark:bg-black">
      <Image src={image} alt={name} width={100} height={100} />
      <div className="text-zinc-900 dark:text-white">{name}</div>
    </div>
  );
}