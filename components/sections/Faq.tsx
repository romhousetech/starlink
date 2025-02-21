'use client';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import Tag from '../Tag';
import { AnimatePresence, motion } from 'framer-motion';
const contents = [
  {
    question: 'What is Starlink?',
    answer:
      'Starlink is a satellite internet service developed by SpaceX. It provides high-speed, low-latency broadband internet using a network of low Earth orbit (LEO) satellites. This service is designed to offer internet access to remote and underserved areas worldwide.',
  },
  {
    question: 'How fast is the Starlink internet?',
    answer:
      'Starlink speeds typically range between 50 Mbps to 250 Mbps for residential users, with latency as low as 20–40 ms. Business users can experience speeds up to 500 Mbps, making it a reliable choice for both personal and commercial applications.',
  },
  {
    question: 'How much does Starlink cost?',
    answer: `
      <ul>
        <li>Starlink Residential: Approximately $110/month with a one-time hardware cost of $599.</li>
        <li>Starlink Business: Around $500/month with a $2,500 hardware cost.</li>
        <li>Starlink Roaming & Maritime Plans: Prices vary based on region and mobility needs.</li>
      </ul>
    `,
  },
  {
    question: 'How do I set up Starlink?',
    answer: `
      <ul>
        <li>Place the dish in an open area with a clear view of the sky.</li>
        <li>Connect it to the router using the provided cables.</li>
        <li>Use the Starlink app to configure and finalize the setup.</li>
      </ul>
    `,
  },
  {
    question: 'Can I use Starlink for gaming and streaming?',
    answer:
      "Yes! Starlink's low-latency connection (20-40 ms) is suitable for online gaming, video calls, and 4K streaming. However, performance may vary depending on network congestion and location.",
  },
  {
    question: "Does weather affect Starlink's performance?",
    answer:
      'Starlink is designed to work in various weather conditions, including rain and snow. However, extreme weather (heavy storms or thick cloud cover) may temporarily reduce performance.',
  },
  {
    question: 'Can I move my Starlink to a different location?',
    answer:
      'Yes, Starlink offers a Portability feature, allowing you to use the service in different locations for an additional fee. However, service quality may depend on regional satellite coverage.',
  },
  {
    question: 'What is the warranty and return policy?',
    answer:
      "Starlink hardware comes with a 30-day return policy if you're unsatisfied. The kit also includes a limited warranty for defects. Check Starlink's official site for full warranty details.",
  },
];

const Faq = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <section>
      <div className="container py-24">
        <div className="flex justify-center">
          <Tag>FAQS</Tag>
        </div>
        <h2 className="text-6xl font-medium mt-6 text-center font-space max-w-xl mx-auto">
          Questions? We've got <span className="text-primary">answers</span>
        </h2>
        <div className="mt-12 flex flex-col gap-6 max-w-xl mx-auto">
          {contents.map((faq, faqIndex) => (
            <div
              key={faq.question}
              className="bg-gray-800 rounded-md border border-write/10 p-6"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setSelectedIndex(faqIndex)}
              >
                <h3 className="font-medium">{faq.question}</h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={twMerge(
                    'feather feather-plus text-primary flex-shrink-0 transition duration-300',
                    selectedIndex === faqIndex && 'rotate-45'
                  )}
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </div>
              <AnimatePresence>
                {selectedIndex === faqIndex && (
                  <motion.div
                    initial={{ height: 0, marginTop: 0 }}
                    animate={{ height: 'auto', marginTop: 23 }}
                    exit={{ height: 0, marginTop: 0 }}
                    className={twMerge('overflow-hidden')}
                  >
                    <p
                      className="text-white/50"
                      dangerouslySetInnerHTML={{ __html: faq.answer }}
                    ></p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
