'use client';
import Image from 'next/image';
import UsageCard from '../UsageCard';
import Tag from '../Tag';

const cardContents = [
  {
    emoji: `🚢`,
    title: `MARITIME`,
    text: 'Stay connected at sea with reliable, high-speed internet, boosting operational efficiency and communication.',
    image: '/images/oil.webp',
  },
  {
    emoji: `⛽`,
    title: 'OIL & GAS',
    text: 'Power your remote drilling sites and offshore platforms with seamless internet access and real-time data exchange.',
    image: '/images/ship.webp',
  },
  {
    emoji: `⛏`,
    title: 'MINING',
    text: 'Maintain critical communications in challenging, isolated locations without disruption.',
    image: '/images/mining.jpg',
  },
  {
    emoji: `👩‍❤️‍👩`,
    title: `NON-GOVERNMENTAL (NGOs)`,
    text: `Enable humanitarian aid, coordination, and crisis response with Starlink's borderless connectivity.`,
    image: '/images/ngo.jpg',
  },
  {
    emoji: `🏛`,
    title: 'GOVERNMENT AGENCIES',
    text: `Enhance efficiency and communication across departments with fast, secure, and reliable connectivity.`,
    image: '/images/government.jpg',
  },
  {
    emoji: `🏢`,
    title: 'REAL ESTATE',
    text: `Transform properties into smart, connected spaces with seamless internet access for residents and businesses.`,
    image: '/images/resident.jpg',
  },
  {
    emoji: `🏨`,
    title: 'HOSPITALITY',
    text: `Deliver a world-class guest experience with high-speed Wi-Fi, uninterrupted streaming, and real-time connectivity`,
    image: '/images/hospital.jpg',
  },
];
const Usage = () => {
  return (
    <section className="py-24">
      <div className="flex justify-center">
        <Tag>Usage</Tag>
      </div>
      <h2 className="text-6xl font-medium mt-6 text-center font-space max-w-xl mx-auto">
        Who Needs <span className="text-primary">Starlink?</span>
      </h2>
      <div className="container relative">
        <div className="flex flex-col md:mt-20 mt-10 gap-20">
          {cardContents.map((content, index) => (
            <UsageCard
              key={content.title}
              className="px-8 pt-8 md:pt-12 md:px-10 lg:pt-16 lg:px-20 pb-0 sticky h-[300px]"
              style={{
                top: `calc(150px + ${index * 25}px)`,
              }}
            >
              <div className="grid md:grid-cols-2 grid-col-1 lg:gap-16">
                <div className="pb-16 col-span-1">
                  <div className="flex gap-2">
                    <span className="text-2xl">{content.emoji}</span>
                    <p className="text-2xl mb-4 capitalize font-space font-semibold tracking-widest bg-gradient-to-r from-emerald-300 to-sky-400 text-transparent bg-clip-text">
                      {content.title}
                    </p>
                  </div>
                  <p className="font-space text-xl">{content.text}</p>
                </div>
                <Image
                  src={content.image}
                  alt={content.title}
                  className="col-span-1 hidden md:block"
                  width={350}
                  height={200}
                />
              </div>
            </UsageCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Usage;
