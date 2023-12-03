import { randomUUID } from "crypto";
import { knex } from "../database";

export class MealsRepository {
    async create(name: string, description: string, is_diet: boolean, user_id: string) {
        const [mealsResponse] = await knex("meals").insert({
            id: randomUUID(),
            name,
            description,
            is_diet,
            user_id
        }).returning("id")

        return mealsResponse.id
    }

    async index(user_id: string) {
        const mealsResponse = await knex("meals").where("user_id", user_id).select("*")

        return mealsResponse
    }

    async show(user_id: string, mealsId: string) {
        const mealsResponse = await knex("meals").where({ user_id, id: mealsId }).select("*")

        return mealsResponse
    }

    async delete(user_id: string, mealsId: string) {
        const mealsResponse = await knex("meals").where({ user_id, id: mealsId }).delete()

        return mealsResponse
    }

    async update(name: string, description: string, is_diet: boolean, user_id: string, mealsId: string) {
        const mealsResponse = await knex("meals").where({ user_id, id: mealsId }).update({
            name,
            description,
            is_diet
        })

        return mealsResponse
    }

    async indexMetrics(user_id: string) {
        const mealsInDiet = await knex("meals")
            .where({ user_id: user_id, is_diet: true })
            .count("is_diet", { as: "mealsInDiet" })
            .first();

        const mealsOutOfDiet = await knex("meals")
            .where({ user_id: user_id, is_diet: false })
            .count("is_diet", { as: "mealsOutOfDiet" })
            .first();

        const totalMeals = await knex("meals")
            .where("user_id", user_id)
            .select("*")
            .orderBy('created_at');

        let currentSequence = 0;
        let bestSequence = 0;

        for (const meal of totalMeals) {
            if (meal.is_diet === 1) {
                currentSequence++;
            } else {
                bestSequence = Math.max(bestSequence, currentSequence);
                currentSequence = 0;
            }
        }

        bestSequence = Math.max(bestSequence, currentSequence);

        return { ...mealsInDiet, ...mealsOutOfDiet, bestSequence }
    }
}