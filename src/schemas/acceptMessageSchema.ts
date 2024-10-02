import {z} from "zod"


export const acceptMessagesSchema = z.object(
    {
        content:z.boolean()
    }
)