import courseModel from "../models/courseModel.js"

export const getAllCourse = async(req,res) => {
    try {
        const courses = await courseModel.find({isPublished:true}).select(['-courseContent','-enrolledCourse']).populate({path:'educator'})

        res.json({success:true, courses})
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}

//* get course by id

export const getCourseId = async(req, res) => {

    const {id} = req.params

    const courseData = await courseModel.findById(id).populate({path:'educator'})

    courseData.courseContent.forEach((course) => {
        course.chapterContent.forEach((lecture) => {
            if(!lecture.isPreviewFree){
                lecture.lectureUrl = '';
            }
        })
    })

    res.json({success:true, courseData})

    try {
        
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}


