import { PrismaClient } from "@prisma/client";
import { FastifyPluginCallback } from "fastify";
import { RegisterRequestBody } from "../models/register-input.js";
import fastifyJwt from "@fastify/jwt";

export const logInRoute : FastifyPluginCallback= (app) => {

    app.post("/register", async (request, reply) => {
        
        const { 
            email,
            name,
            password
        } : RegisterRequestBody = request.body;

        const existingUser = await prisma.users.findUnique({
            where: { email }
        });

        if (existingUser) {
            return reply.status(409).send({ message: 'Email already in use' });
        }
        
        const hashedPassword = await app.jwt.sign({ password });

        const user = await prisma.users.create({
            data: {
                email,
                name,
                password
            }
        });

        return reply.status(201).send(user);
    });
    
}
