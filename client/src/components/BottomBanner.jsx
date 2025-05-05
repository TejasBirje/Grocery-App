import React from 'react'
import { assets, features } from '../assets/assets'

const BottomBanner = () => {
  return (
    <div className='relative mt-10'>
        <img src={assets.bottom_banner_image} alt="banner" className='w-full hidden md:block'/>
        <img src={assets.bottom_banner_image_sm} alt="banner" className='w-full md:hidden'/>

        <div className='absolute inset-0 flex flex-col items-center md:items-end md:justify-center pt-16 md:pt-0 md:pr-24'>
            <div>
                <h1 className='text-3xl md:text-4xl font-bold text-primary mb-6'>
                    What makes us the Best?
                </h1>
                {features.map((feature, index) => {
                    return (
                        <div key={index} className='flex items-center gap-4 mt-5'>
                            <img src={feature.icon} alt={feature.title} className='md:w-12 w-9'/>
                            <div className=''>
                            <h3 className='text-lg md:text-xl font-semibold'>{feature.title}</h3>
                            <p className='text-gray-500/70 text-xs md:text-sm'> 
                                {feature.description}
                            </p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    </div>
  )
}

export default BottomBanner