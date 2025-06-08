import React from 'react'
import { assets } from '../../assets/assets';
import { dummyCourses } from '../../assets/assets';
import {UserButton, useUser} from "@clerk/clerk-react";
import { Link } from 'react-router-dom';

export const Navbar = () => {
  const educatorData = dummyCourses;

  const {user} = useUser();

  return (
    <div className='flex justify-between items-center px-4 md:px-8 border-b border-b-gray-800 py-3'>
      <Link to='/'>
        <img src={assets.logo} alt="" className='w-28 lg:w-32' />
      </Link>
      <div className='flex items-center gap-5 text-gray-500 relative'>
        <p>Hi! {user ? user.fullName : 'developer'}</p>
        {
          user ? <UserButton /> : <img src={assets.profile_img} alt="" className='max-w-10' />
        }
      </div>
    </div>
  )
}
