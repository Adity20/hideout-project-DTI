import React, { useState } from 'react'
import { data } from '../data/data.js';

const Shared = () => {

    const [place] = useState(data);

  return (
    
    <>
    <div className='max-w-[1640px] m-auto px-4 py-12'>
      <h1 className='text-primary font-bold text-4xl text-center'>
        Top Shared Places/Stories
      </h1>
        <div className='grid  lg:grid-cols-3 gap-10 pt-10'>
            {place.map((item, index) => (
            <div
                key={index}
                className='border shadow-lg rounded-lg hover:scale-105 duration-300'
            >
                <img
                src={item.image}
                alt={item.name}
                className='w-full h-[300px] object-cover rounded-t-lg'
                />
                <div className='flex justify-between px-2 py-4'>
                <p className='font-bold'>{item.name}</p>
                <p>
                    <span className='bg-primary text-white p-1 rounded-full'>
                    {item.price}
                    </span>
                </p>
                </div>
                <div className='flex justify-between px-4 py-4'>
                <p className='font'>{item.description}</p>
                </div>
            </div>
            ))}
        </div>
        {/* <button className='border-white bg-white text-black mx-2 absolute bottom-4'>Explore</button> */}
    </div>
    </>
  )
}

export default Shared