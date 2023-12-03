import { app } from "./app";
import { env } from "./env";

app.listen({
    port: env.PORT
}).then(() => {
    return console.log("HTTP server is Running!");
}).catch(() => {
    return console.log("HTTP server is Failed!");
});
