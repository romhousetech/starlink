'use client';
import { useState, useEffect } from 'react';
import RequestBtn from '../RequestBtn';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface LinkProps {
  href?: string;
}

const NavBar: React.FC<LinkProps> = ({ href }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // Only add listeners if we're in the browser
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Provide a non-transparent header during SSR
  if (!isMounted) {
    return (
      <header className="fixed md:top-0 md:shadow-none w-full z-50 transition-colors duration-300 bg-transparent">
        <div className="py-4">
          <div className="container flex items-center justify-between">
            {/* Same content as your main return, just without scroll effects */}
            {/* ... */}
            <Link href="/">
              <strong className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-space">
                ROM HOUSE
              </strong>
              <p>Technologies</p>
            </Link>
            <div className="flex items-center">
              <a className="hidden md:block ml-6" href="tel:+09162030077">
                +234 9162 030077
              </a>
              <div className="hidden md:block">
                <RequestBtn text="Ask the Expert" path="#contact" />
              </div>
              <motion.a
                whileTap={{ scale: 0.9 }}
                className="block md:hidden border border-primary py-6 px-3"
                href="#contact"
              >
                Ask the Expert
              </motion.a>
            </div>
          </div>
        </div>
      </header>
    );
  }
  return (
    <header
      className={`fixed md:top-0 md:shadow-none  w-full z-50 transition-colors duration-300  ${
        isScrolled ? 'bg-gray-900/60 backdrop-blur' : 'bg-transparent'
      }`}
    >
      <div className="animate-in fade-in zoom-in py-4">
        <div className="container flex items-center justify-between">
          <Link href="/">
            <strong className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-space">
              ROM HOUSE
            </strong>
            <p>Technologies</p>
          </Link>
          <div className="flex items-center">
            <a className="hidden md:block ml-6" href="tel:+09162030077">
              +234 9162 030077
            </a>
            <div className="hidden md:block">
              <RequestBtn text="Ask the Expert" path="#contact" />
            </div>
            <motion.a
              whileTap={{ scale: 0.9 }}
              className="block md:hidden border border-primary py-6 px-3"
              href="#contact"
            >
              Ask the Expert
            </motion.a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
