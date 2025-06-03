import React from 'react'

export const Loading = () => {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='w-16 md:w-20 aspect-square border-4 border-gray-300 border-t-blue-400 rounded-full animate-spin'></div>
    </div>
  )
}
