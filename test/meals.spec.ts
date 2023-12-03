import { execSync } from "node:child_process";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, expect, it } from "vitest";
import { app } from "../src/app";

beforeAll(async () => {
    await app.ready();
})

afterAll(async () => {
    await app.close();
})

beforeEach(async () => {
    execSync("npm run knex migrate:rollback --all");
    execSync("npm run knex migrate:latest");
})

it("should be able to create a meals true", async () => {
    const responseUser = await request(app.server)
        .post("/users")
        .send({
            email: "test@gmail.com",
            name: "test",
            password: "123456"
        })

    const [cookie] = responseUser.get("Set-Cookie")

    const NAME = "salada";
    const DESCRIPTION = "salada de alface";
    const IS_DIET = true;
    const RESPONSE_MESSAGE = {
        message: "Refeição cadastrada com sucesso!",
        mealsId: expect.any(String)
    }

    const response = await request(app.server)
        .post("/meals")
        .set("Cookie", cookie)
        .send({
            name: NAME,
            description: DESCRIPTION,
            is_diet: IS_DIET
        })
        .expect(201)

    expect(response.body).toEqual(RESPONSE_MESSAGE)
})

it("should be able to create a meals false", async () => {
    const responseUser = await request(app.server)
        .post("/users")
        .send({
            email: "test@gmail.com",
            name: "test",
            password: "123456"
        })

    const [cookie] = responseUser.get("Set-Cookie")

    const NAME = "salada";
    const DESCRIPTION = "salada de alface";
    const IS_DIET = false;
    const RESPONSE_MESSAGE = {
        message: "Refeição cadastrada com sucesso!",
        mealsId: expect.any(String)
    }

    const response = await request(app.server)
        .post("/meals")
        .set("Cookie", cookie)
        .send({
            name: NAME,
            description: DESCRIPTION,
            is_diet: IS_DIET
        })
        .expect(201)

    expect(response.body).toEqual(RESPONSE_MESSAGE)
})

it("should be able to list a meals", async () => {
    const responseUser = await request(app.server)
        .post("/users")
        .send({
            email: "test@gmail.com",
            name: "test",
            password: "123456"
        })

    const [cookie] = responseUser.get("Set-Cookie")

    const NAME = "salada";
    const DESCRIPTION = "salada de alface";
    const IS_DIET = true || false;

    await request(app.server)
        .post("/meals")
        .set("Cookie", cookie)
        .send({
            name: NAME,
            description: DESCRIPTION,
            is_diet: IS_DIET
        })

    await request(app.server)
        .get("/meals")
        .set("Cookie", cookie)
        .expect(200)
})

it("should be able to list meal by id", async () => {
    const responseUser = await request(app.server)
        .post("/users")
        .send({
            email: "test@gmail.com",
            name: "test",
            password: "123456"
        })

    const [cookie] = responseUser.get("Set-Cookie")

    const NAME = "salada";
    const DESCRIPTION = "salada de alface";
    const IS_DIET = true || false;

    const responseMeals = await request(app.server)
        .post("/meals")
        .set("Cookie", cookie)
        .send({
            name: NAME,
            description: DESCRIPTION,
            is_diet: IS_DIET
        })

    await request(app.server)
        .get(`/meals/${responseMeals.body.mealsId}`)
        .set("Cookie", cookie)
        .expect(200)
})

it("should be able to delete a meal by id", async () => {
    const RESPONSE_MESSAGE = "Refeição deletada com sucesso!";

    const responseUser = await request(app.server)
        .post("/users")
        .send({
            email: "test@gmail.com",
            name: "test",
            password: "123456"
        })

    const [cookie] = responseUser.get("Set-Cookie")

    const NAME = "salada";
    const DESCRIPTION = "salada de alface";
    const IS_DIET = false || true;

    const responseMeals = await request(app.server)
        .post("/meals")
        .set("Cookie", cookie)
        .send({
            name: NAME,
            description: DESCRIPTION,
            is_diet: IS_DIET
        })

    const response = await request(app.server)
        .delete(`/meals/${responseMeals.body.id}`)
        .set("Cookie", cookie)
        .expect(200)

    expect(response.body).toEqual({ message: RESPONSE_MESSAGE })
})

it("should be able to update a meal by id", async () => {
    const RESPONSE_MESSAGE = "Refeição editada com sucesso!";

    const responseUser = await request(app.server)
        .post("/users")
        .send({
            email: "test@gmail.com",
            name: "test",
            password: "123456"
        })

    const [cookie] = responseUser.get("Set-Cookie")

    const NAME = "salada";
    const DESCRIPTION = "salada de alface";
    const IS_DIET = true;

    const responseMeals = await request(app.server)
        .post("/meals")
        .set("Cookie", cookie)
        .send({
            name: NAME,
            description: DESCRIPTION,
            is_diet: IS_DIET
        })

    const NAME_UPDATE = "xis bacon";
    const DESCRIPTION_UPDATE = "carne, bacon, frango";
    const IS_DIET_UPDATE = false;

    const response = await request(app.server)
        .put(`/meals/${responseMeals.body.mealsId}`)
        .set("Cookie", cookie)
        .send({
            name: NAME_UPDATE,
            description: DESCRIPTION_UPDATE,
            is_diet: IS_DIET_UPDATE
        })
        .expect(200)

    expect(response.body).toEqual({ message: RESPONSE_MESSAGE })
})

it("should be able to list a user's meal metrics", async () => {
    const RESPONSE_MESSAGE = {
        mealsInDiet: 4,
        mealsOutOfDiet: 1,
        bestSequence: 3
    }

    const responseUser = await request(app.server)
        .post("/users")
        .send({
            email: "test@gmail.com",
            name: "test",
            password: "123456"
        })

    const [cookie] = responseUser.get("Set-Cookie")

    await request(app.server)
        .post("/meals")
        .set("Cookie", cookie)
        .send({
            name: "tomate",
            description: "salada",
            is_diet: true
        })

    await request(app.server)
        .post("/meals")
        .set("Cookie", cookie)
        .send({
            name: "alface",
            description: "salada",
            is_diet: true
        })


    await request(app.server)
        .post("/meals")
        .set("Cookie", cookie)
        .send({
            name: "cebola",
            description: "salada",
            is_diet: true
        })

    await request(app.server)
        .post("/meals")
        .set("Cookie", cookie)
        .send({
            name: "xis",
            description: "bacon",
            is_diet: false
        })

    await request(app.server)
        .post("/meals")
        .set("Cookie", cookie)
        .send({
            name: "cenoura",
            description: "salada",
            is_diet: true
        })


    const response = await request(app.server)
        .get("/meals/metrics")
        .set("Cookie", cookie)
        .expect(200)

    expect(response.body).toEqual(RESPONSE_MESSAGE)
})
