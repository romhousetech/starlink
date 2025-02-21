'use client';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export const SectionHeader = ({
  cardClass,
  subTitle,
  titleClass,
  subTitleClass,
  descriptionClass,
  title,
  description,
}: {
  cardClass?: string;
  subTitle?: string;
  titleClass?: string;
  subTitleClass?: string;
  descriptionClass?: string;
  title?: string;
  description?: string;
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <div className={cn('flex', cardClass)} ref={ref}>
        <motion.h1
          variants={textVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          transition={{ duration: 0.4, delay: 0.8 }}
          className={cn(
            'uppercase font-space font-bold tracking-widest bg-gradient-to-r from-emerald-300 to-sky-400 text-transparent bg-clip-text',
            titleClass
          )}
        >
          {title}
        </motion.h1>
      </div>
      <motion.h2
        variants={textVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        transition={{ duration: 0.6, delay: 1 }}
        className={cn('text-[18px] mt-6', subTitleClass)}
      >
        {subTitle}
      </motion.h2>
      <motion.p
        variants={textVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        transition={{ duration: 0.8, delay: 2 }}
        className={cn(
          'text-white/60 mt-4 max-w-xl text-base',
          descriptionClass
        )}
      >
        {description}
      </motion.p>
    </>
  );
};
