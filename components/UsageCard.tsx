import { twMerge } from 'tailwind-merge';
import { ComponentPropsWithoutRef } from 'react';

const grainBgImg = '/images/grain.jpg';

const UsageCard = ({
  className,
  children,
  ...prop
}: ComponentPropsWithoutRef<'div'>) => {
  return (
    <div
      className={twMerge(
        "bg-gray-800 rounded-3xl relative overflow-hidden z-0 after:z-10 after:content-[''] after:absolute after:inset-0 after:outline-2 after:outline after:-outline-offset-2 after:rounded-3xl after:outline-white/20 after:pointer-events-none",
        className
      )}
      {...prop}
    >
      <div
        className="absolute inset-0 -z-10 opacity-5"
        style={{ backgroundImage: `url(${grainBgImg})` }}
      ></div>
      {children}
    </div>
  );
};

export default UsageCard;
