import fastify from "fastify";
import { loginRoute } from "../controllers/login-route.ts";
import { registerRoute } from "../controllers/register-route.ts";

const app = fastify();

app.get("/health", () => {
    return { "status": "OK" };
});


app.register(loginRoute);
app.register(registerRoute);

app.listen({ port: process.env.PORT || 3333, host: process.env.HOST });
