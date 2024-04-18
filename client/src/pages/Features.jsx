import React from 'react';
import { features } from '../data/data.js';

const Feature = () => {
  console.log(features);
  return (
    <div className='max-w-[1440px]  m-auto px-6 py-12'>
      <h1 className='text-primary py-4 font-bold text-4xl text-center'>
        Features
      </h1>
      {/* features */}
      <div className='grid h-[250px]  grid-cols-8 md:grid-cols-4 gap-6 py-6'>
        {features.map((item, index) => (
          <div
            key={index}
            className='bg-white rounded-lg drop-shadow-lg hover:drop-shadow-2xl p-4 flex justify-between items-center'
          >
            <h2 className='font-bold sm:text-xl'>{item.name}</h2>
            <img src={item.image} alt={item.name} className='w-20' />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feature;