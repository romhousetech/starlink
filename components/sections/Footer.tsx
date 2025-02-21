import Link from 'next/link';
import React from 'react';

const contents = [{}];
const Footer = () => {
  return (
    <section>
      <div className="container">
        <div className="">
          {' '}
          <Link href="/">
            <strong className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-space">
              ROM HOUSE
            </strong>
            <p>Technologies</p>
          </Link>
          <p className="text-white/60 mt-4  text-base uppercase">
            Authorized Reseller
          </p>
        </div>
        <div className="">
          <p>CONTACT US</p>
          <div>
            <p>
              <span></span>{' '}
            </p>
          </div>
        </div>
        <div className=""></div>
        <div className=""></div>
      </div>
    </section>
  );
};

export default Footer;
