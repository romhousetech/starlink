import React from 'react';
import Tag from './Tag';

const HeaderText = ({
  text,
  subText1,
  subText2,
}: {
  text?: string;
  subText1?: string;
  subText2?: string;
}) => {
  return (
    <div>
      <div className="flex justify-center">
        <Tag>{text}</Tag>
      </div>
      <h2 className="text-6xl font-medium mt-6 text-center font-space max-w-xl mx-auto">
        {subText1} <span className="text-primary">{subText2}</span>
      </h2>
    </div>
  );
};

export default HeaderText;
