import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { hash }  from "argon2";
import { db as PrismaClient } from "../config/connection.ts";
import z from "zod";

const prisma = PrismaClient;

export const registerRoute: FastifyPluginCallbackZod = (app) => {

    app.post("/auth/register", {
    schema: {
        tags: ['auth'],
        summary: 'User registration',
        description: 'This endpoint registers a unique new user',
        body: z.object({
            email: z.email('Invalid email address'),
            name: z.string().min(4, 'Name must be at least 4 characters long'),
            password: z.string().min(6, 'Password must be at least 6 characters long').max(128),
        }),
        response: {
            201: z.object({ id: z.uuid() }),
            400: z.object({ message: z.string('Bad Request') }),
            409: z.object({ message: z.string('Email already in use') })
        },
    },
}, async (request, reply) => {
        
        const { email, name, password } = request.body;

        const getExistingUserByEmail = await prisma.users.findUnique({
            select: { id: true, email: true },
            where:  { email: email }
        });

        if (getExistingUserByEmail) {
            return reply.status(409).send();
        }
        
        const hashedPassword = await hash(password);

        const user = await prisma.users.create({
            data: { email, name, password: hashedPassword}
        });

        reply.header('origin', `http://${process.env.HOST}:${process.env.PORT}/auth/register/${user.id}`);
        return reply.status(201).send({ id: user.id });
    });
    
}
