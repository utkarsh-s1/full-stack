import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import UserModel from "@/model/User.model";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";

export async function POST(request:Request) {
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user:User= session?.user
    if(!session || !user){
        return Response.json(
            {
              success: false,
              message: "No user exist or sesion error Code",
            },
            { status: 400 }
          );


    }
    const id = user._id
    const {acceptMessages}=await request.json()
    try {
        const us = await UserModel.findById(id)
        if(!us){
            return Response.json(
                {
                  success: false,
                  message: "User cant be found",
                },
                { status: 500 }
              );
        }
        us.isAcceptingMessage = acceptMessages
        await us.save()
        return Response.json(
            {
              success: true,
              message: "done",
            },
            { status: 200 }
          );

        
    } catch (error) {
        return Response.json(
            {
              success: false,
              message: "server Error",
            },
            { status: 500 }
          );
    }


    
}

export async function GET(request:Request) {
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user:User= session?.user
    if(!session || !user){
        return Response.json(
            {
              success: false,
              message: "No user exist or sesion error Code",
            },
            { status: 400 }
          );


    }
    const id = user._id
    const {acceptMessages}=await request.json()
    try {
        const us = await UserModel.findById(id)
        if(!us){
            return Response.json(
                {
                  success: false,
                  message: "User cant be found",
                },
                { status: 500 }
              );
        }
        
        return Response.json(
            {
              success: true,
              isAcceptingMessage: us.isAcceptingMessage,
            },
            { status: 200 }
          );

        
    } catch (error) {
        return Response.json(
            {
              success: false,
              message: "server Error",
            },
            { status: 500 }
          );
    }
    
}