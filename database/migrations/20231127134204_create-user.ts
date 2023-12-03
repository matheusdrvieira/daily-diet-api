import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("users", (users) => {
        users.uuid("id").primary().notNullable();
        users.text("name").notNullable();
        users.text("email").notNullable();
        users.text("password").notNullable();

        users.timestamp("updated_at").defaultTo(knex.fn.now());
        users.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("users");
}
