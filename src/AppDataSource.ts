import { DataSource } from "typeorm";
import UserData from "./entities/UserData";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: false,
    entities: [UserData],
    migrations: [],
    subscribers: [],
})
