import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import {z} from 'zod'
import { userNameValidation } from "@/schemas/signUpSchema";

const usernameSchema = z.object({
    username:userNameValidation
}
)

export  async function GET(request:Request){
    await dbConnect()
    try {
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username:searchParams.get('username') 
        }
        console.log(queryParam)
        const result = usernameSchema.safeParse(queryParam)
        console.log(result)
        if(!result.success){
        const usernameErrors = result.error.format().username?._errors || [];
        return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(', ')
              : 'Invalid query parameters',
        },
        { status: 400 })
    }
    console.log(result.data.username)
    const us = await UserModel.findOne({username:result.data.username})
    if(us){
        return Response.json(
            {
              success: false,
              message:"User already exiats with this username"
            },
            { status: 400 })
    }
    else{
        return Response.json(
            {
              success: true,
              message:"ok"
            },
            { status: 200 })
    }

        
    } catch (error) {
        console.log(error)
        return Response.json({
            success:false,
            message:"errror while username validation"
        }, {
            status:500
        })
        
    }
}

