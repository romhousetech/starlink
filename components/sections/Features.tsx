'use client';
import { FaRocket, FaBolt, FaGlobe, FaShieldAlt } from 'react-icons/fa';
import FeaturesCard from '../FeaturesCard';
import { FaSatelliteDish } from 'react-icons/fa';
import { MdSpeed } from 'react-icons/md';
import { GiWorld } from 'react-icons/gi';
import Tag from '../Tag';

const features1 = [
  {
    icon: <FaBolt className="text-primary text-xl" />,
    title: 'Blazing-Fast Speeds',
    description: `Romhouse Network International delivers high-speed internet powered by Starlink's advanced satellite technology—no more buffering, no more delays.`,
    durationP: 0.6,
    delayP: 1,
    durationD: 0.8,
    delayD: 1.2,
  },
  {
    icon: <FaRocket className="text-primary text-xl" />,
    title: 'Ultra-Low Latency',
    description: `Enjoy near-instant data transmission for seamless video calls, gaming, and real-time operations—even in remote locations.`,
    durationP: 0.8,
    delayP: 1.2,
    durationD: 1,
    delayD: 1.4,
  },
  {
    icon: <FaGlobe className="text-primary text-xl" />,
    title: 'Connectivity Without Borders',
    description:
      "From cities to off-grid sites, Starlink keeps you connected. Simply reinstall, and you're good to go—anywhere, anytime.",
    durationP: 1,
    delayP: 1.4,
    durationD: 1.2,
    delayD: 1.6,
  },
];

const features2 = [
  {
    icon: <FaSatelliteDish className="text-primary text-xl" />,
    title: 'Revolutionary Connectivity',
    description: `No more dead zones. Starlink eliminates connectivity barriers with cutting-edge satellite technology.`,
    durationP: 0.6,
    delayP: 1,
    durationD: 0.8,
    delayD: 1.2,
  },
  {
    icon: <MdSpeed className="text-primary text-xl" />,
    title: 'Reliable Performance',
    description: `Enjoy uninterrupted high-speed internet in even the most remote or underserved areas.`,
    durationP: 0.8,
    delayP: 1.2,
    durationD: 1,
    delayD: 1.4,
  },
  {
    icon: <GiWorld className="text-primary text-xl" />,
    title: 'Truly Global Coverage',
    description: `Wherever you go, Starlink goes with you—redening  internet access worldwide.`,
    durationP: 1,
    delayP: 1.4,
    durationD: 1.2,
    delayD: 1.6,
  },
];

const HomePage = () => {
  return (
    <section className="py-24">
      <div className="flex justify-center">
        <Tag>Features</Tag>
      </div>
      <h2 className="text-6xl font-medium mt-6 text-center font-space max-w-3xl mx-auto">
        Unmatched Performance,
        <span className="text-primary"> Seamless Connectivity! </span>
      </h2>
      <div className="container flex flex-col gap-12 mt-12">
        <div className="p-6">
          <FeaturesCard
            imageSrc="/images/img.jpeg"
            altText="Connectivity"
            title="High-Speed Connectivity, Low Latency, and Global Access"
            features={features1}
            containerClass="flex items-center flex-col md:flex-row"
            imageClass="order-1 md:order-2"
            contentClass="order-2 md:order-1 text-white/70"
          />
        </div>

        <div className="p-6">
          <FeaturesCard
            imageSrc="/images/image.webp"
            altText="Security & Reliability"
            title="Why Starlink?"
            features={features2}
            containerClass="flex items-center flex-col md:flex-row"
            imageClass="order-1 md:order-1"
            contentClass="order-2 md:order-2 text-white/70"
          />
        </div>
      </div>
    </section>
  );
};

export default HomePage;
