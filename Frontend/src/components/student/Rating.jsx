import React, { useEffect, useState } from 'react'

export const Rating = ({onRate, initialRate}) => {

  const [rating, setRating] = useState(initialRate || 0);

  const handleRating  = (value) => {
    setRating(value);
    if(onRate) onRate(value)
  }

  useEffect(() => {
    if(initialRate){
      setRating(initialRate);
    }
  },[initialRate])

  return (
    <div>
        {
          Array.from({length: 5}, (_, index) => {
            const starValue = index + 1;

            return (
                <span key={index} className={`text-xl sm:text-2xl cursor-pointer transition-colors ${starValue <= rating ? 'text-yellow-500': "text-gray-400"}`} onClick={() => handleRating(starValue)}>
                  &#9733;
                </span>
            )
          })
        }
    </div>
  )
}
