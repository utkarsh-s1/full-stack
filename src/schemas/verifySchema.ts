import { z } from "zod";

export const VerifySchema = z.object(
    {
        verifyString: z.string().length(6, "versify string must be 6 length")
    }
)
