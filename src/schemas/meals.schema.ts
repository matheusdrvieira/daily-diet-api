import { z } from "zod";

export const createMealsBodySchema = z.object({
    name: z.string(),
    description: z.string(),
    is_diet: z.boolean()
})

export const findMealsByIdSchema = z.object({
    id: z.string(),
})
