import { config } from "dotenv";

config();

export default {
    mysql_settings: {
        host: process.env.HOST || "",
        database: process.env.DATABASE || "",
        user: process.env.USER || "",
        password: process.env.PASSWORD || ""
    }
};