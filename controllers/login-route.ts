import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import type { LoginRequestBody } from "../models/login-input.ts";
import { decodePassword } from "../services/password-hash-service.ts";
import { authService } from "../services/create-authorization-service.ts";
import { db as PrismaClient } from "../config/connection.ts";
import z from "zod";

const prisma = PrismaClient;

export const loginRoute: FastifyPluginAsyncZod = async (app) => {

    app.post("/auth/login", {
        schema: {
            tags: ['auth'],
            summary: 'User login',
            description: 'This endpoint authenticates a user and return its JWT token',
            body: z.object({
                email: z.email('Invalid email address'),
                password: z.string().min(6, 'Password must be at least 6 characters long').max(128)
            }),
            response: {
                200: z.object({
                    token: z.jwt(),
                }),
                400: z.object({ message: z.string('Bad Request') }),
                401: z.object({ message: z.string('Invalid email or password') }),
            },
        }
    }, async (request, reply) => {

        const { email, password } = request.body;

        const existingUser = await prisma.users.findUnique({
            where: { email }
        });

        if (!existingUser || !await decodePassword(existingUser.password, password)) {
            return reply.status(401).send();
        }
        
        const token = await authService(existingUser.id, existingUser.email);
        
        return reply.status(200).send({ token });
    });
    
}
