'use client';

import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
});
const Distribution = () => {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6 text-center">
        Subscriber Map Distribution
      </h2>
      <div className="container">
        {/* <HeaderText
          text="Distribution"
          subText1="Global Reach,"
          subText2="Local Connectivity"
        /> */}
        <Map />
      </div>
    </section>
  );
};

export default Distribution;
