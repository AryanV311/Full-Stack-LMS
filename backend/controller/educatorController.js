import { clerkClient } from "@clerk/express"
import {v2 as cloudinary} from "cloudinary"
import courseModel from "../models/courseModel.js"
import purchaseModel from "../models/purchaseModel.js"
import userModel from "../models/userModel.js"


export const updateRoleToEducator = async(req, res) => {
    try {
        const userId = req.auth.userId

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata:{
                role:'educator'
            }
        })

        res.json({success:true, message:"You can publish a course now"})

    } catch (error) {
        res.json({success:false, message:error.message})
    }
}

//* Add New course

export const addCourse = async(req,res) => {
    try {
        const { courseData } = req.body;
        const imageFile = req.file;
        const educatorId = req.auth.userId;

        if(!imageFile){
            return res.json({success:false, message:"Thumbnai Not Attched"});
        }

        const parsedCourseData = await JSON.parse(courseData);
        parsedCourseData.educator = educatorId;

        const newCourse = await courseModel.create(parsedCourseData);

        const imageUpload = await cloudinary.uploader.upload(imageFile.path)
        newCourse.courseThumbnail= imageUpload.secure_url;

        await newCourse.save();

        res.json({success:true, message: "Course Added"})


    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

//* Educator course

export const getEducatorCourse = async(req,res) => {
    try {
        const educator = req.auth.userId;
        const courses = await courseModel.find({educator})

        res.json({success:true, courses})

    } catch (error) {
        res.json({success:false, message:error.message})
    }
}


//* get educator dashboard total earning, student enrolled, total courses

export const educatorDashboardData = async(req, res) => {
    try {
        const educator = req.auth.userId;
        const courses = await courseModel.find({educator});
        const totalCourses = courses.length;

        const courseIds = courses.map(course => course._id);

        const purchases = await purchaseModel.find({
            courseId: {$in: courseIds},
            status:'completed'
        });

        const totalEarning = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

        //collect uniqid enrolled student IDs with thier courses titles

        const enrolledStudentsData = [];

        for(const course of courses){
            const student = await userModel.find({
                _id:{$in: course.enrolledStudents}
            }, 'name imageUrl');

            student.forEach(student => {
                enrolledStudentsData.push({
                    courseTitle:course.courseTitle,
                    student
                })
            })
        } 

        res.json({success:true, dashboardData:{ totalEarning, enrolledStudentsData, totalCourses}})

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


//* get enrolled student data with purchase data

export const getEnrolledStudentsData = async() => {
    try {
        const educator = req.auth.userId;
        const courses = await courseModel.find({educator});

        const courseIds = courses.map(course => course._id);

        const purchases = await purchaseModel.find({
            courseId: {$in: courseIds},
            status:'completed',
        }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle')

        const enrolledStudents = purchases.map((purchase) => ({
            student: purchase.userId,
            courseTitle:purchase.courseId.courseTitle,
            purchaseDate: purchase.createdAt,
        }));

        res.json({success:true, enrolledStudents})

    } catch (error) {
        res.json({success:false, message:error.message})
    }
}