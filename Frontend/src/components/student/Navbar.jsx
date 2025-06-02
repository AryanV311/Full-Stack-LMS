/* eslint-disable no-unused-vars */
import React, { useContext } from "react";

import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { useUser, useClerk, UserButton } from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext";

export const Navbar = () => {
  const isCourseList = location.pathname.includes("/course-list");

  const navigate = useNavigate();

  const { openSignIn } = useClerk();
  const { user } = useUser();

  const { isEducator, setIsEducator} = useContext(AppContext);

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
             <button className="cursor-pointer" onClick={() => navigate('/educator')}>{isEducator ?"Educator Dashboard": "Become Educator"}</button>|{" "}
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
              <button className="cursor-pointer" onClick={() => navigate('/educator')}>{isEducator ?"Educator Dashboard": "Become Educator"}</button>|{" "}
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
