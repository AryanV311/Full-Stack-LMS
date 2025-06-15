/* eslint-disable no-unused-vars */
import React, { useContext } from "react";

import { assets } from "../../assets/assets";
import { data, Link, useNavigate } from "react-router-dom";
import { useUser, useClerk, UserButton } from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

export const Navbar = () => {
  const isCourseList = location.pathname.includes("/course-list");

  const navigate = useNavigate();

  const { openSignIn } = useClerk();
  const { user } = useUser();

  const { isEducator, setIsEducator,getToken, backendUrl} = useContext(AppContext);
  console.log(isEducator);

  const becomeEducator = async() => {
    try {
      if(isEducator){
        navigate('/educator')
        return
      }

      const token = await getToken();
      const{data} = await axios.get(`${backendUrl}/api/educator/update-role`,{ headers: {
        Authorization:`Bearer ${token}`
      }})

      console.log("educatorDatata",data);

      if(data.success){
        // setIsEducator(true);
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div
      className={`flex items-center justify-between py-4 px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 ${
        isCourseList ? "bg-white" : "bg-cyan-100/70"
      } `}
    >
      <img onClick={() => navigate('/')} className="cursor-pointer" src={assets.logo} alt="" />
      <div className="hidden md:flex items-center gap-5 text-gray-500">
        <div className="flex items-center gap-5">
          {user && (
            <>
             <button className="cursor-pointer" onClick={becomeEducator}>{isEducator ? "Educator Dashboard": "Become Educator"}</button>|{" "}
              <Link to="/my-enrollments">My Enrollments</Link>
            </>
          )}
        </div>
        {user ? (
          <UserButton />
        ) : (
          <button
            onClick={() => openSignIn()}
            className="bg-blue-600 px-5 py-2 text-white rounded-full cursor-pointer"
          >
            Create Account
          </button>
        )}
      </div>
      <div className="md:hidden flex items-center gap-5 sm:gap-5 text-gray-500">
        <div className="flex items-center gap-1 sm:gap-2 max-sm:text-xs">
          {user && (
            <>
              <button className="cursor-pointer" onClick={becomeEducator}>{isEducator ?"Educator Dashboard": "Become Educator"}</button>|{" "}
              <Link to="/my-enrollments">My Enrollments</Link>
            </>
          )}
        </div>
        {user ? (
          <UserButton />
        ) : (
          <button className="cursor-pointer" onClick={() => openSignIn()}>
            <img src={assets.user_icon} alt="" />
          </button>
        )}
      </div>
    </div>
  );
};
