import express from "express"
import { getUserData, purchaseCourse, userEnrolledCourse } from "../controller/userController.js";

const userRouter = express.Router();

userRouter.get('/data', getUserData);
userRouter.get('/enrolled-course', userEnrolledCourse)
userRouter.post('/purchase', purchaseCourse)


export default userRouter;