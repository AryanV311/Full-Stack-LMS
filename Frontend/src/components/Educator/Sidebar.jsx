import React, { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets';
import { NavLink } from 'react-router-dom';

export const Sidebar = () => {

  const isEducator = useContext(AppContext);

  const menuItems = [
    {name:'Dashboard', path:'/educator', icon:assets.home_icon},
    {name:'Add course', path:'/educator/add-course', icon:assets.add_icon},
    {name:'My course', path:'/educator/my-course', icon:assets.my_course_icon},
    {name:'Student Enrolled', path:'/educator/student-enrolled', icon:assets.person_tick_icon},
  ];

  return isEducator && (
    <div className='w-6 md:w-64 border-r min-h-screen py-2 text-base border-gray-500 flex flex-col'> 
        {
          menuItems.map((item) => (
            <NavLink
             to={item.path}
             key={item.name}
             end={item.path ===  '/educator'}
             className={({isActive}) => `flex itemc md:flex-row flex-col md:justify-start justify-center py-3.5 md:px-10 gap-3 ${isActive ? 'bg-indigo-50 border-r-[6px] border-indigo-500/90 ':'hover:bg-gray-100/90 border-r-[6px] border-white hover:border-gray-100/90'}`}
            >
              <img src={item.icon} alt="" className='w-6 h-6' />
              <p className='md:block hidden text-center'>{item.name}</p>
            </NavLink>
          ))
        }
    </div>
  )
}
