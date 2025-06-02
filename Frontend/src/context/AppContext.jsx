import {createContext, useEffect, useState} from "react"
import { dummyCourses } from "../assets/assets";


export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const currency = "$";
    const [allCourses, setAllCourses] = useState([]);
    const [isEducator, setIsEducator] = useState(true);

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

    useEffect(() => {
        fetchCourse();
    },[])


    const value = {
        currency,
        allCourses,
        calculateRating,
        isEducator,
        setIsEducator
    };


    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}