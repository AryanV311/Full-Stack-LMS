import Stripe from "stripe";
import courseModel from "../models/courseModel.js";
import purchaseModel from "../models/purchaseModel.js";
import userModel from "../models/userModel.js";


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
    
}