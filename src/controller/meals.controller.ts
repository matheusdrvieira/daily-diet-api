import { FastifyReply, FastifyRequest } from "fastify";
import { MealsRepository } from "../repositories/meals.repository";
import { createMealsBodySchema, findMealsByIdSchema } from "../schemas/meals.schema";
import { findUserByIdCookieSchema } from "../schemas/users.schema";

export class MealsController {
    async create(request: FastifyRequest, response: FastifyReply) {
        try {
            const { name, description, is_diet } = createMealsBodySchema.parse(request.body)

            const cookie = findUserByIdCookieSchema.parse(request.cookies);

            const mealsRepository = new MealsRepository();

            const mealsId = await mealsRepository.create(name, description, is_diet, cookie.user_id);

            return response.status(201).send({ message: "Refeição cadastrada com sucesso!", mealsId });
        } catch {

            return response.status(500).send({ message: "Não foi possível cadastrar essa Refeição!" });
        }
    }

    async index(request: FastifyRequest, response: FastifyReply) {
        try {
            const cookie = findUserByIdCookieSchema.parse(request.cookies);

            const mealsRepository = new MealsRepository();

            const responseMeals = await mealsRepository.index(cookie.user_id);

            return response.status(200).send(responseMeals);
        } catch {

            return response.status(500).send({ message: "Não foi listar as Refeições!" });
        }
    }

    async show(request: FastifyRequest, response: FastifyReply) {
        try {
            const mealsId = findMealsByIdSchema.parse(request.params);
            const cookie = findUserByIdCookieSchema.parse(request.cookies);

            const mealsRepository = new MealsRepository();

            const responseMeals = await mealsRepository.show(cookie.user_id, mealsId.id);

            return response.status(200).send(responseMeals);
        } catch {

            return response.status(500).send({ message: "Não foi listar essa refeição!" });
        }
    }

    async delete(request: FastifyRequest, response: FastifyReply) {
        try {
            const mealsId = findMealsByIdSchema.parse(request.params);
            const cookie = findUserByIdCookieSchema.parse(request.cookies);

            const mealsRepository = new MealsRepository();

            await mealsRepository.delete(cookie.user_id, mealsId.id);

            return response.status(200).send({ message: "Refeição deletada com sucesso!" });
        } catch {

            return response.status(500).send({ message: "Não foi deletar essa refeição!" });
        }
    }

    async update(request: FastifyRequest, response: FastifyReply) {
        try {
            const { name, description, is_diet } = createMealsBodySchema.parse(request.body)
            const mealsId = findMealsByIdSchema.parse(request.params);
            const cookie = findUserByIdCookieSchema.parse(request.cookies);

            const mealsRepository = new MealsRepository();

            await mealsRepository.update(name, description, is_diet, cookie.user_id, mealsId.id);

            return response.status(200).send({ message: "Refeição editada com sucesso!" });
        } catch {

            return response.status(500).send({ message: "Não foi editar essa refeição!" });
        }
    }

    async indexMetrics(request: FastifyRequest, response: FastifyReply) {
        try {
            const cookie = findUserByIdCookieSchema.parse(request.cookies);

            const mealsRepository = new MealsRepository();

            const responseMeals = await mealsRepository.indexMetrics(cookie.user_id);

            return response.status(200).send(responseMeals);
        } catch {

            return response.status(500).send({ message: "Não foi listar as Refeições!" });
        }
    }
}