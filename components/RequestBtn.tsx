import React from 'react';

const RequestBtn = ({ text, path }: { text: string; path?: string }) => {
  return (
    <div>
      <a className="click-btn btn-style" href={path}>
        {text}
      </a>
    </div>
  );
};

export default RequestBtn;
