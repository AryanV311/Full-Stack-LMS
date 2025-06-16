import { createContext, useEffect, useState } from "react";
import humanizeDuration from "humanize-duration";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const currency = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userData, setUserData] = useState(null);

  const { getToken } = useAuth();
  const { user } = useUser();

  const fetchCourse = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/course/all`);
      if (data.success) {
        setAllCourses(data.courses);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchUserData = async () => {
    if (user.publicMetadata.role === "educator") {
      setIsEducator(true);
    }

    try {
      const token = await getToken();

      const { data } = await axios.get(`${backendUrl}/api/user/data`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

     

      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const calculateRating = (course) => {
    if (course.courseRatings.length === 0) {
      return 0;
    }

    let totalRating = 0;

    course.courseRatings.forEach((rating) => {
      totalRating += rating.rating;
    });

    return Math.floor(totalRating / course.courseRatings.length);
  };

  // function tocalculate chapter duration

  const calculateChapterTime = (course) => {
    let time = 0;

    course.chapterContent.map((lecture) => (time += lecture.lectureDuration));
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  const calculateCourseDuration = (course) => {
    let time = 0;
    course.courseContent.map((chapter) =>
      chapter.chapterContent.map((lecture) => (time += lecture.lectureDuration))
    );
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  // function to calculate total no of lecture in the course
  const calculateNoOfLectures = (course) => {
    let totalLecture = 0;

    course.courseContent.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        totalLecture += chapter.chapterContent.length;
      }
    });

    return totalLecture;
  };

  const fetchEnrolledCourses = async () => {
      
      try {
        const token  = await getToken();

      const { data } = await axios.get(
        `${backendUrl}/api/user/enrolled-courses`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("enrolleee::", data);

      if (data.success) {
        setEnrolledCourses(data.enrolledCourses.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, []);

  const logToken = async () => {
    console.log(await getToken());
  };

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchEnrolledCourses();
      logToken();
    }
  }, [user]);

  const value = {
    currency,
    allCourses,
    calculateRating,
    isEducator,
    setIsEducator,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    humanizeDuration,
    enrolledCourses,
    fetchEnrolledCourses,
    userData,
    setUserData,
    backendUrl,
    fetchCourse,
    getToken,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
