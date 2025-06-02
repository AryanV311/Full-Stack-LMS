import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { Loading } from "../../components/student/Loading";
import { assets } from "../../assets/assets";

export const CourseDetails = () => {
  const { id } = useParams();
  const { allCourses, calculateRating } = useContext(AppContext);
  const [courseData, setcourseData] = useState(null);

  const fetchCourseData = () => {
    const findCourseData = allCourses.find((course) => course._id === id);
    setcourseData(findCourseData);
  };

  useEffect(() => {
    fetchCourseData();
  }, []);

  return courseData ? (
    <div className="flex md:flex-row flex-col-reverse gap-10 items-start relative justify-between md:px-36 px-8 md:pt-20 text-left">
      <div className="absolute z-1 top-0 left-0 w-full h-[500px] bg-gradient-to-b from-cyan-100/70"></div>

      {/* left column */}
      <div className="max-w-xl z-10 text-gray-500">
        <h1 className=" leading-[34px] md:text-[35px] md:leading-[56px] font-semibold text-gray-800">
          {courseData.courseTitle}
        </h1>
        <p
          className="pt-4 md:text-base text-sm"
          dangerouslySetInnerHTML={{
            __html: courseData.courseDescription.slice(0, 200),
          }}
        ></p>
        {/* review rating */}
        <div className="flex items-center space-x-2 pt-3 pb-1 text-sm">
          <p>{calculateRating(courseData)}</p>
          <div className="flex">  
            {[...Array(5)].map((_, i) => (
              <img
                className="w-3.5 h-3.5"
                key={i}
                src={
                  i < Math.floor(calculateRating(courseData))
                    ? assets.star
                    : assets.star_blank
                }
                alt=""
              />
            ))}
          </div>
          <p className="text-blue-600">({courseData.courseRatings.length} {courseData.courseRatings.length > 1 ? 'ratings': 'rating'})</p>
          <p>{courseData.enrolledStudents.lenth} {courseData.enrolledStudents.lenth > 1 ? 'students': 'student'}</p>
        </div>

        <p className="text-sm">course by <span className="text-blue-600 underline">AryanStack</span></p>
      </div>

      {/* right column */}
      <div></div>
    </div>
  ) : (
    <Loading />
  );
};
