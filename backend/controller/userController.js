import Stripe from "stripe";
import courseModel from "../models/courseModel.js";
import purchaseModel from "../models/purchaseModel.js";
import userModel from "../models/userModel.js";
import courseProgressModel from "../models/courseProgressModel.js";


export const getUserData = async(req,res) => {
    try {
        const userId = req.auth.userId;
        const user = await userModel.findById(userId);

        if(!user){
            res.json({success:false, message:'User Not found'})
        }

        res.json({success:true, user})

    } catch (error) {
        
    }
}

export const userEnrolledCourse = async(req, res) => {
    try {
        const userId = req.auth.userId;
        const userData = await userModel.findById(userId).populate('enrolledCourses')
        
        res.json({success:true, enrolledCourses:userData.enrolledCourses})
        
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}


//* Purchase Course

export const purchaseCourse = async(req, res) => {
    try {
        const { courseId } = req.body;
        const { origin } = req.headers;
        const userId = req.auth.userId;

        const userData = await userModel.findById(userId)
        const courseData = await courseModel.findById(courseId)

        if(!userData || !courseData){
            res.json({success:false, message:"Data Not Found"})
        }

        const purchaseData = {
            courseId: courseData._id,
            userId,
            amount:(courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2)
        }

        const newPurchase = await purchaseModel.create(purchaseData)

        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

        const currency = process.env.CURRENCY.toLowerCase()

        const line_items = [{
            price_data:{
                currency,
                product_data:{
                    name:courseData.courseTitle
                },
                unit_amount:Math.floor(newPurchase.amount) * 100
            },
            quantity:1,
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url:`${origin}/loading/my-enrollments`,
            cancel_url:`${origin}/`,
            line_items:line_items,
            mode:'payment',
            metadata:{
                purchaseId: newPurchase._id.toString()
            }
        })

        res.json({success:true, session_url:session.url})

    } catch (error) {
        res.json({success:false, message:error.message})
    }
}


export const updateUserCourseProgress = async(req, res) => {
    try {
        const userId = req.auth.userId;
        const {courseId, lectureId} = req.body;

        const progresssData = await courseModel.findOne({userId, courseId});

        if(progresssData){
            if(progresssData.lecureCompleted.includes(lectureId)){
                return res.json({success:true, message:'Lecure Already Completed'})
            }

            progresssData.lectureCompleted.push(lectureId);
            await progresssData.save();
        } else {
            await courseProgressModel.create({
                userId,
                courseId,
                lectureCompleted:[lectureId],
            })
        }

        res.json({success:true, message:'Progress Updated'})
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}

export const getUserCourseProgress = async(req,res) => {
    try {
        const userId = req.auth.userId;
        const {courseId} = req.body;

        const progresssData = await courseModel.findOne({userId, courseId});
         res.json({success:true, progresssData})
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}


export const addUserRating = async(req,res) => {
    try {
        const userId = req.auth.userId;
        const {courseId, rating} = req.body;

        if(!courseId || !userId || !rating || rating < 1 || rating > 5){
            return res.json({success:false, message:'Invalid Details'})
        }

        const course = await courseModel.findById(courseId);
        if(!course){
            return res.json({success:false, message:"Course not found."})
        }

        const user = await userModel.findById(userId)
        if(!user || !user.enrolledCourses.includes(courseId)){
            return res.json({success:false, message:'User has not purchase this course'})
        }

        const existingRatingIndex = course.courseRatings.findIndex(r => r.userId === userId)

        if(existingRatingIndex > -1){
            course.courseRatings[existingRatingIndex].rating = rating;
        } else {
            course.courseRatings.push({userId, rating});
        }

        await course.save();

        return res.json({success:true, message:'Rating Updated'})

    } catch (error) {
        res.json({success:false, message:error.message})
    }
}