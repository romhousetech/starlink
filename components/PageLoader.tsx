'use client';
import React from 'react';
import { ClipLoader } from 'react-spinners'; // You can also use other spinners like BeatLoader, PulseLoader, etc.

const PageLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80">
      <ClipLoader
        color="white" // Tailwind blue-500
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default PageLoader;
