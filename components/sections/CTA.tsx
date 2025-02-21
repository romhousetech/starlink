'use client';
import { motion } from 'framer-motion';

const CTA = () => {
  return (
    <section className="">
      <div className="overflow-x-clip p-4 flex">
        <motion.div
          animate={{ x: -500 }}
          transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
          className="flex flex-none gap-16 pr-16  text-7xl font-medium hover:bg-gray-900 transition duration-300"
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <a key={i} className="flex items-center gap-16" href="#contact">
              <span className="text-primary text-7xl font-space">&#10038;</span>
              <span> Ask the Experts</span>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
