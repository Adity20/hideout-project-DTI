// eslint-disable-next-line no-unused-vars
import React from 'react'

const Hero = () => {
  return ( 
    <div className='max-w-[1640px] mx-auto px-4 py-8 '>
        <div className='max-h-[500px]  relative'>
            {/* Overlay */}
            <div className='absolute rounded-xl w-full h-full text-gray-200 max-h-[500px] bg-black/40 flex flex-col justify-center'>
                <h1 className='px-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold'>Explore the  <span className='text-primary'>World</span></h1>
                <h1 className='px-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold'> <span className='text-primary'>Without</span> Limits</h1>
            </div>
            <img className='w-full rounded-xl max-h-[500px] object-cover' src="https://images.pexels.com/photos/534164/pexels-photo-534164.jpeg" alt="/" />
        </div>
    </div>
  )
}

export default Hero

// #25A1DA