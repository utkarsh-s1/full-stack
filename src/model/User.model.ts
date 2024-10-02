import mongoose, {Schema, Document, Mongoose} from "mongoose";

export interface Message extends Document{
    content:string;
    createdAt:Date
}

const MessageSchema :Schema<Message> =  new Schema({
    content:{
        type: String,
        required:true
    },
    createdAt:{
        type: Date,
        required:true,
        default:Date.now()

    }
})



export interface User extends Document{
    username:string;
    email:string;
    password:string;
    verifyCodeID:string;
    isVerfified:boolean;
    isAcceptingMessage:boolean;
    verifyCodeExpiry:Date;
    message:Message[]

}

const UserSchema :Schema<User> =  new Schema({
    
        username:{type:String, required:true},
        email:{type:String, required:true, unique:true},
        password:{type:String, required:true},
        verifyCodeID:{type:String, required:true},
        isAcceptingMessage:{type:Boolean, required:true},
        verifyCodeExpiry:{type:Date, required:true},
        message:[MessageSchema],
        isVerfified:{
            type:Boolean,
            required:true,
            default:false
        }
    
    
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel