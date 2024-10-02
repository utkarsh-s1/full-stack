import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"
import UserModel from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";

export const authOptions: NextAuthOptions = {
    providers: [
      CredentialsProvider({
        id: 'credentials',
        name: 'Credentials',
        credentials: {
          email: { label: 'Email', type: 'text' },
          password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials:any):Promise<any>{
            await dbConnect()
            try {
                const user = await UserModel.findOne({
                    $or:[{email:credentials.identifier.email},{username:credentials.identifier.email} ]
                })
                if(!user){
                    throw new Error('No user exist')
                }
                if(!user.isVerfified){
                    throw new Error('verify account')
                }

                if(await bcrypt.compare(credentials.password, user.password)){
                    return user

                }
                else{
                    throw new Error('wrong password')
                }
                
            } catch (error:any) {
                throw new Error(error)
                
            }
        }

        })
    ],
    callbacks:{
       
        async jwt({token, user}){
            if(user){
                token._id = user?._id?.toString()
                token.username = user?.username
                token.isVerfified = user?.isVerfified
                token.isAcceptingMessage = user?.isAcceptingMessage

            }
            return token
        },
        async session({session, token}) {
            if(token){
                session.user._id = token._id
                session.user.isVerfified = token.isVerfified
                session.user.isAcceptingMessage = token.isAcceptingMessage
                session.user.username = token.username
            }
            return session
            
        },
    },
    pages:{
        signIn:'/sign-in'
    },
    session:{
        strategy:"jwt"
    },
    secret:process.env.NEXT_AUTHSECRET
}
