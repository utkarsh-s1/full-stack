import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendEmail(email:string, otp:string, username:string):Promise<ApiResponse>{
    try {

        await resend.emails.send({
            from: 'onboarding@resend.dev',
    to: email,
    subject: 'verification email',
    react: VerificationEmail({username, otp})

        })
        return ({
            success:true,
            message:"sending message success"
        })
        
    } catch (error) {
        console.log("error in sending email", error)
        return ({
            success:false,
            message:"sending message failed"
        })
       
        
    }
}