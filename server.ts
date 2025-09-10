import fastify from "fastify";
import { logIn } from "./services/auth.js";

const app = fastify();

app.get("/health", () => {
    return { "status": "OK" };
})

app.register(logIn)

app.listen({ port: 3333, });
