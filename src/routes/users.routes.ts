import { FastifyInstance } from "fastify";
import { UsersController } from "../controller/users.controller";

const usersController = new UsersController()

export async function usersRoutes(app: FastifyInstance) {
    app.post("/", usersController.create);
}