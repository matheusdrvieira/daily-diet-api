import { randomUUID } from "crypto";
import { knex } from "../database";

export class UsersRepository {
    async findByEmail(email: string) {
        const userEmail = await knex("users").where({ email }).first();

        return userEmail;
    }

    async create(email: string, name: string, password: string) {
        const [userResponse] = await knex("users").insert({
            id: randomUUID(),
            email,
            name,
            password
        }).returning("id")

        return userResponse.id
    }
}