import fastify from "fastify";
import { loginRoute } from "../controllers/login-route.ts";
import { registerRoute } from "../controllers/register-route.ts";
import { requestsPostRoute } from "../controllers/requests-post-route.ts";
import { getAllRequestsRoute } from "../controllers/requests-get-route.ts";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, type ZodTypeProvider } from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import scalarAPIReference from '@scalar/fastify-api-reference';
import { getRequestById } from "../controllers/requests-get-by-id.ts";
import { patchRequestById } from "../controllers/requests-patch-by-id.ts";
import { submitRequestById } from "../controllers/requests-submit-by-id.ts";
import { approveRequestById } from "../controllers/requests-approve-by-id.ts";

const app = fastify({
    logger: {
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
            },
        },
    },
}).withTypeProvider<ZodTypeProvider>();

if (process.env.NODE_ENV !== "production") {
    app.register(fastifySwagger, {
        openapi: {
            info: {
                title: "Request Management API",
                description: "API for managing purchase requests",
                version: "1.0.0",
            },
        },
        transform: jsonSchemaTransform,
    });
    app.register(scalarAPIReference, {
        routePrefix: '/docs',
    });
    app.register(fastifySwaggerUi, {
        routePrefix: '/v2/docs',
    });
}

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.get("/health", () => {
    return { "status": "OK" };
});

app.register(loginRoute);
app.register(registerRoute);
app.register(requestsPostRoute);
app.register(getAllRequestsRoute);
app.register(getRequestById);
app.register(patchRequestById);
app.register(submitRequestById);
app.register(approveRequestById);

app.listen({ port: process.env.PORT || 3333, host: process.env.HOST }, () => {
    console.info(`Server is running at http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3333}`);
});
