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

it("should be able to create a user", async () => {
    const EMAIL_TEST = "test@gmail.com"
    const RESPONSE_MESSAGE = "Usuário cadastrado com sucesso!"

    const response = await request(app.server)
        .post("/users")
        .send({
            email: EMAIL_TEST,
            name: "test",
            password: "123456"
        })
        .expect(201)

    expect(response.body).toEqual({ message: RESPONSE_MESSAGE })
})

it("should not allow creation of a user with a duplicate email", async () => {
    const DUPLICATED_EMAIL = "duplicated@gmail.com"
    const RESPONSE_MESSAGE = "Esse email já existe!"

    await request(app.server)
        .post("/users")
        .send({
            email: DUPLICATED_EMAIL,
            name: "test",
            password: "123456"
        })

    const response = await request(app.server)
        .post("/users")
        .send({
            email: DUPLICATED_EMAIL,
            name: "test",
            password: "123456"
        }).expect(500)

    expect(response.body).toEqual({ message: RESPONSE_MESSAGE })
});
