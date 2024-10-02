import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from "bcryptjs"

import { sendEmail } from "@/helpers/sendEmail";

export async function POST(request: Request){
    await dbConnect()

    try {
        const {username, email, password}=await request.json() 
        const us = await UserModel.findOne({username:username, isVerfified:true})
        if(us){
            return Response.json({
                success:false,
                message:"user already exist"
            }, {status:400})
        }
        else{
            const usEMail = await UserModel.findOne({email:email})
            const code:string = String(Math.floor((Math.random()*900000)+100000))
            if(usEMail){
                if(usEMail.isVerfified){
                    return Response.json({
                        success:false,
                        message:"user ALready Exists"
                    }, {status:400})
                }
                else{
                    const hasdefPassword = await bcrypt.hash(password, 10)
                    usEMail.password = hasdefPassword
                    usEMail.verifyCodeID = code
                    const expiry = new Date()
                expiry.setHours(expiry.getHours()+1)
                usEMail.verifyCodeExpiry = expiry
                await usEMail.save()

                }

            }
            else{
                const hasdefPassword = await bcrypt.hash(password, 10)
                const expiry = new Date()
                expiry.setHours(expiry.getHours()+1)
                const newUser = new UserModel({
                    username:username,
                    email:email,
                    password:hasdefPassword,
                    verifyCodeID:code,
                    isVerfified:false,
                    isAcceptingMessage:true,
                    verifyCodeExpiry:expiry,
                    message:[]
                })

                await newUser.save()
            }
           const emailResp =  await sendEmail(email, code, username)
           console.log(emailResp)
           if(!emailResp.success){
            return Response.json({
                success:false,
                message:emailResp.message 
            }, {status:500})
           }
           return Response.json({
            success:true,
            message:"user success"
        }, {status:200})
        }

    } catch (error) {
        console.log(error)
        return Response.json({
            success:false,
            message:"error"
        }, {status:500})
        
    }
}