'use client';
import { useEffect, useRef, useState } from 'react';
import Tag from '../Tag';
import { useScroll, useTransform } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

const text =
  "goes beyond just providing internet—we deliver reliable, high-speed connectivity tailored to industries that can't afford downtime: construction, energy, maritime, rail, water, environment, government, and real estate";
const words = text.split(' ');
const Introduction = () => {
  const scrollTarget = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollTarget,
    offset: ['start end', 'end end'],
  });
  const [currentWord, setCurrentWord] = useState(0);
  const wordIndex = useTransform(scrollYProgress, [0, 1], [0, words.length]);
  useEffect(() => {
    wordIndex.on('change', (latest) => {
      setCurrentWord(latest);
    });
  }, [wordIndex]);

  return (
    <section className="py-28">
      <div className="container">
        <div className="sticky top-40">
          <div className="flex justify-center">
            <Tag>Introduction Romhouse</Tag>
          </div>
          <div className="text-4xl text-center font-medium mt-10">
            <span>
              As an authorised Starlink Reseller, Romhouse Network International{' '}
            </span>
            <span className="">
              {words.map((word, wordIndex) => (
                <span
                  key={wordIndex}
                  className={twMerge(
                    'transition duration-500 text-white/15',
                    wordIndex < currentWord && 'text-white'
                  )}
                >{`${word} `}</span>
              ))}
            </span>
            <span className="text-primary block">
              Whether in remote locations or critical operations, we keep you
              connected, productive, and ahead of the curve
            </span>
          </div>
        </div>
        <div className="h-[150vh]" ref={scrollTarget}></div>
      </div>
    </section>
  );
};

export default Introduction;
