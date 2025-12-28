import type { FC } from 'react';
import Image from "next/image";
const ScrennPicture: FC = () => {
  return (
      <div className="screen-cover w-full h-full relative overflow-hidden group">
        <Image 
          src="/cover.png" 
          alt="cover" 
          width={1024} 
          height={512} 
          layout="responsive" 
          objectFit="cover" 
          className="blur-[2px] scale-105 group-hover:blur-0 group-hover:scale-100 transition-all duration-1000 ease-out group-hover:blur-none"
        />
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[32px_32px] pointer-events-none z-10 blur-[1px] transition-opacity duration-1000 group-hover:opacity-0"></div>
        
        {/* Subtle Gradient Overlay for depth */}
        <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-black/10 pointer-events-none z-10 transition-opacity duration-1000 group-hover:opacity-0"></div>
        
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="text-4xl font-bold text-white">
            Mou1ght
          </div>
        </div>
      </div>
  );
};

export default ScrennPicture;