import {createContext, useEffect, useState} from "react"
import { dummyCourses } from "../assets/assets";
import humanizeDuration from "humanize-duration";


export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const currency = "$";
    const [allCourses, setAllCourses] = useState([]);
    const [isEducator, setIsEducator] = useState(true);
    const [enrolledCourses, setEnrolledCourses] = useState([]);

    const fetchCourse = async() => {
        setAllCourses(dummyCourses)
    }

    const calculateRating = (course) => {
        if(course.courseRatings.length === 0){
            return 0;
        }

        let totalRating = 0;

        course.courseRatings.forEach(rating => {
            totalRating += rating.rating
        })

        return totalRating / course.courseRatings.length
    }

    // function tocalculate chapter duration

    const calculateChapterTime = (course) => {
        let time = 0;

        course.chapterContent.map(( lecture ) => time += lecture.lectureDuration)
        return humanizeDuration(time * 60 * 1000, {units:["h", "m"]})
    }

    const calculateCourseDuration = (course) => {
        let time = 0;
        course.courseContent.map((chapter) => chapter.chapterContent.map((lecture) => time += lecture.lectureDuration))
        return humanizeDuration(time *60 * 1000, {units:["h","m"]})
    }

    // function to calculate total no of lecture in the course
    const calculateNoOfLectures = ((course) => {
        let totalLecture = 0;

        
        course.courseContent.forEach((chapter) => {
            if(Array.isArray(chapter.chapterContent)){
                totalLecture += chapter.chapterContent.length
            }
        });

        return totalLecture;
    })

    const fetchEnrolledCourses = () => {
        setEnrolledCourses(dummyCourses);
    }

    useEffect(() => {
        fetchCourse();
        fetchEnrolledCourses();
    },[])


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
    };


    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}