import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("meals", async (meals) => {
        meals.uuid("id").primary().notNullable();
        meals.text("name").notNullable();
        meals.text("description").notNullable();
        meals.boolean("is_diet").notNullable();
        meals.uuid("user_id").references("id").inTable("users").onDelete("CASCADE").notNullable();

        meals.timestamp("updated_at").defaultTo(knex.fn.now());
        meals.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("meals");
}
