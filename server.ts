import fastify from "fastify";

const app = fastify();

app.get("/health", () => {
    return { "status": "OK" };
})

app.listen({ port: 3333, });
