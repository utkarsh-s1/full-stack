import {z} from "zod"

export const userNameValidation = z
                                .string()
                                .min(5, "Username atleast 5 char")
                                .max(100 , "Username below 100 char")
                                

export const signUpSchema = z.object({
    username: userNameValidation,
    email:z
        .string({message: "Not valid email"}),
    password:z
            .string()
            .min(7)
            .max(15)
    
    
})