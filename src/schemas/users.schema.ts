import { z } from "zod";

export const createUserBodySchema = z.object({
    email: z.string().email(),
    name: z.string(),
    password: z.string()
})

export const findEmailBodySchema = z.object({
    email: z.string().email(),
})

export const findUserByIdCookieSchema = z.object({
    user_id: z.string(),
})
