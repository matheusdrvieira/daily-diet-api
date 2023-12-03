import { hash } from "bcryptjs";
import { FastifyReply, FastifyRequest } from "fastify";
import { UsersRepository } from "../repositories/users.repository";
import { createUserBodySchema } from "../schemas/users.schema";

export class UsersController {
    async create(request: FastifyRequest, response: FastifyReply) {
        try {
            const { email, name, password } = createUserBodySchema.parse(request.body)

            const usersRepository = new UsersRepository();
            const checkEmailExists = await usersRepository.findByEmail(email);

            if (checkEmailExists) {
                return response.status(500).send({ message: "Esse email já existe!" });
            }

            const hashedPassword = await hash(password, 12)

            const userId = await usersRepository.create(email, name, hashedPassword);

            response.cookie("user_id", userId, {
                path: "/",
                maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
            });

            return response.status(201).send({ message: "Usuário cadastrado com sucesso!" });
        } catch {

            return response.status(500).send({ message: "Não foi possível cadastrar esse Usuário!" });
        }
    }
}