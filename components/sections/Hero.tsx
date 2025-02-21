'use client';

import Image from 'next/image';
import { SectionHeader } from './SectionHeader';

const Hero = () => {
  return (
    <section className="relative w-[100vw] h-[90vh]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/starlink.png"
          alt="Hero Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center h-full container">
        <div className="text-white">
          <SectionHeader
            cardClass="w-full"
            title="STARLINK"
            titleClass="text-4xl md:text-7xl text-left"
            subTitle="Unstoppable Connectivity, Anywhere You Need It"
            subTitleClass="text-left text-4xl font-space text-white/60  max-w-xl"
            description="Authorized Reseller"
            descriptionClass="uppercase text-xs font-bold text-white"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
