'use client';

import HeaderText from '../HeaderText';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('../Map'), {
  ssr: false,
});

const DistributionMap = () => {
  return (
    <section>
      <div className="container">
        <HeaderText
          text="Distribution"
          subText1="Global Reach,"
          subText2="Local Connectivity"
        />
        <Map />
      </div>
    </section>
  );
};

export default DistributionMap;
