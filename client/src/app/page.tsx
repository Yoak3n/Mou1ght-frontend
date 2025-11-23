import Image from 'next/image'


export default function Home() {
  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        Cover
      </div>
      <div className="flex items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        Main
      </div>
      <footer className="flex items-center justify-center p-4 bg-zinc-50 dark:bg-black">
        <div className="text-zinc-900 dark:text-white">
          © 2023 Mou1ght. All rights reserved.
        </div>
      </footer>
    </>
  );
}
