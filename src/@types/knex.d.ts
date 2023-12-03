import { Knex } from "knex";

declare module "knex/types/tables" {
    export interface Tables {
        users: {
            id: string;
            email: string;
            name: string;
            password: string;
            updated_at: string;
            created_at: string;
        },
        meals: {
            id: string;
            name: string;
            description: string;
            is_diet: boolean | number;
            user_id: string;
            updated_at: string;
            created_at: string;
        }
    }
}