'use client';
import React from 'react';
import NavBar from '@/components/sections/NavBar';
import Usage from '@/components/sections/Usage';
import Hero from '@/components/sections/Hero';
import Introduction from '@/components/sections/Introduction';
import Faq from '@/components/sections/Faq';
import DistributionMap from '@/components/sections/DistributionMap';
import CTA from '@/components/sections/CTA';
import ContactForm from '@/components/ContactForm';
import Features from '@/components/sections/Features';

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
    </div>
  );
};

export default page;
