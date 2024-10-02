import {z} from "zod"


export const SignInSchema = z.object(
    {
        identifier:z.string(),
        password: z.string().min(7).max(15)
    }
)