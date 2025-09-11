import type { FastifyPluginCallback } from "fastify";
import type { RegisterRequestBody } from "../models/register-input.js";
import { hash }  from "argon2";
import { db as PrismaClient } from "../config/connection.ts";

const prisma = PrismaClient;

export const registerRoute : FastifyPluginCallback = (app) => {

    app.post("/auth/register", async (request, reply) => {
        
        const { 
            email,
            name,
            password
        } : RegisterRequestBody = request.body as RegisterRequestBody;

        const getExistingUserByEmail = await prisma.users.findUnique({
            where: { email }
        });

        if (getExistingUserByEmail) {
            return reply.status(409).send({ message: 'Email already in use' });
        }
        
        const hashedPassword = await hash(password);

        const user = await prisma.users.create({
            data: {
                email,
                name,
                password: hashedPassword,
            }
        });

        reply.header('origin', `http://${process.env.HOST}:${process.env.PORT}/auth/register/${user.id}`);
        return reply.status(201).send();
    });
    
}
