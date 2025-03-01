'use client';
import React from 'react';
import Usage from '@/components/sections/Usage';
import Hero from '@/components/sections/Hero';
import Introduction from '@/components/sections/Introduction';
import Faq from '@/components/sections/Faq';
import CTA from '@/components/sections/CTA';
import ContactForm from '@/components/ContactForm';
import Features from '@/components/sections/Features';
import dynamic from 'next/dynamic';
import WhatsAppChat from '@/components/WhatsApp';

const NavBar = dynamic(() => import('@/components/sections/NavBar'), {
  ssr: false,
});
const DistributionMap = dynamic(
  () => import('@/components/sections/DistributionMap'),
  {
    ssr: false,
  }
);

const page = () => {
  return (
    <div className="font-sans">
      <NavBar />
      <Hero />
      <Introduction />
      <DistributionMap />
      <Features />
      <Usage />
      <Faq />
      <CTA />
      <ContactForm />
      <WhatsAppChat />
    </div>
  );
};

export default page;
