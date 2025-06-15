import { clerkClient } from "@clerk/express";

export const protectEducator = async(req, res, next) => {
    try {
        const userId = req.auth()?.userId;
        console.log("🔐 Authenticated userId:", userId);

        const response = await clerkClient.users.getUser(userId)
         console.log("👤 Clerk user metadata:", response.publicMetadata);

        if(response.publicMetadata.role !== 'educator'){
            return res.json({success:false, message:"Unauthorized Access"})
        }

        next()
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}