import mongoose from "mongoose";
import { connected } from "process";

type connectionObject = {
    isConnected?:number
}

const connection:connectionObject = {}

async function dbConnect():Promise<void>{
    if(connection.isConnected){
        console.log("already connected")
        return
    }
    else{
        try {
            const db = await mongoose.connect(process.env.MONGO_URI||"")
            connection.isConnected = db.connections[0].readyState
            console.log("connections are connected")
            
        } catch (error) {
            console.log(error)
            process.exit(1)
            
        }

    }
}

export default dbConnect