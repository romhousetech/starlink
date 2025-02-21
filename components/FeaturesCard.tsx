import { ReactNode } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
  durationP: number;
  delayP: number;
  durationD: number;
  delayD: number;
}

interface FeaturesCardProps {
  imageSrc: string;
  altText: string;
  title: string;
  features: Feature[];
  containerClass?: string;
  imageClass?: string;
  contentClass?: string;
}

const FeaturesCard: React.FC<FeaturesCardProps> = ({
  imageSrc,
  altText,
  title,
  features,
  containerClass = '',
  imageClass = '',
  contentClass = '',
}) => {
  // Parent container animation trigger
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div
      ref={ref}
      className={`flex flex-col md:flex-row items-center gap-6 ${containerClass}`}
    >
      {/* Image Section */}
      <div
        className={`w-full md:w-1/2 bg-gray-800 rounded-3xl relative overflow-hidden z-0 after:z-10 after:content-[''] after:absolute after:inset-0 after:outline-2 after:outline after:-outline-offset-2 after:rounded-3xl after:outline-white/20 after:pointer-events-none   ${imageClass}`}
      >
        <Image
          src={imageSrc}
          alt={altText}
          width={500}
          height={300}
          className="rounded-lg w-full h-auto"
        />
      </div>

      <div className={`w-full md:w-1/2 ${contentClass}`}>
        <motion.h2
          variants={textVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          transition={{ duration: 0.4, delay: 0.8 }}
          className="text-2xl mb-4 capitalize font-space font-semibold tracking-widest bg-gradient-to-r from-emerald-300 to-sky-400 text-transparent bg-clip-text"
        >
          {title}
        </motion.h2>

        <div className="space-y-4">
          {features.map((feature, index) => {
            const [featureRef, featureInView] = useInView({
              triggerOnce: true,
              threshold: 0.2,
            });

            return (
              <div key={index} ref={featureRef}>
                <motion.p
                  variants={textVariants}
                  initial="hidden"
                  animate={featureInView ? 'visible' : 'hidden'}
                  transition={{
                    duration: feature.durationP,
                    delay: feature.delayP,
                  }}
                  className="flex items-center"
                >
                  {feature.icon}
                  <strong className="ml-2 text-white">{feature.title}</strong>
                </motion.p>
                <motion.p
                  variants={textVariants}
                  initial="hidden"
                  animate={featureInView ? 'visible' : 'hidden'}
                  transition={{
                    duration: feature.durationD,
                    delay: feature.delayD,
                  }}
                >
                  {feature.description}
                </motion.p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeaturesCard;
