import { z } from "zod"

export const loginFormSchema = z.object({
    email:z.string()
    .min(1,{message:'Email required'})
    .email(),
    password: z.string()
    .min(1,{message:'Password required'})
})

export type TLoginFormSchema = z.infer<typeof loginFormSchema>