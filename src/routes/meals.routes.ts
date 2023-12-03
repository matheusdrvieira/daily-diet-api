import { FastifyInstance } from "fastify";
import { MealsController } from "../controller/meals.controller";

const mealsController = new MealsController();

export async function mealsRoutes(app: FastifyInstance) {
    app.post("/", mealsController.create);

    app.get("/", mealsController.index);

    app.get("/:id", mealsController.show);

    app.get("/metrics", mealsController.indexMetrics);

    app.delete("/:id", mealsController.delete);

    app.put("/:id", mealsController.update);
}